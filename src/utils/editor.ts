import {
  Question,
  Item,
  Questionnaire,
  Coding,
  Quantity,
  Reference,
} from "@/types";
import { itemTools } from "./item";
import { questionnaireTools } from "./questionnaire";

// Used for exhaustive switch-statements
export class UnreachableError extends Error {
  constructor(unreachable: never) {
    super(`Unreachable case: ${JSON.stringify(unreachable)}`);
  }
}

class EditorTools {
  clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  objectKeys<T extends object>(object: T): (keyof T)[] {
    return Object.keys(object) as (keyof T)[];
  }

  private isEmptyArray<T>(arr: T[]): boolean {
    for (const value of arr) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (!this.isEmptyArray(value)) return false;
        } else if (typeof value === "string") {
          if (value.length > 0) return false;
        } else if (typeof value === "object") {
          if (this.isNonEmptyObject(value)) return false;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  isEmptyObject<T extends object>(obj: T | undefined | null): boolean {
    if (obj === undefined || obj === null) return true;
    for (const key of this.objectKeys(obj)) {
      const value = obj[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (!this.isEmptyArray(value)) return false;
        } else if (typeof value === "string") {
          if (value.length > 0) return false;
        } else if (typeof value === "object") {
          if (this.isNonEmptyObject(value)) return false;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  isNonEmptyObject<T extends object>(obj: T | undefined | null): boolean {
    return !this.isEmptyObject(obj);
  }

  private assingNewInternalLinkIDsToChildren(item: Item): void {
    if (item.item === undefined) return;
    let idCount = 0;
    for (const element of item.item) {
      element.__linkId = `${item.__linkId}.${idCount}`;
      idCount++;
      this.assingNewInternalLinkIDsToChildren(element);
    }
  }

  regenerateInternalLinkIDs(questionnaire: Questionnaire): void {
    let idCount = 0;
    for (const item of questionnaire.item) {
      item.__linkId = idCount.toString();
      idCount++;
      this.assingNewInternalLinkIDsToChildren(item);
    }
  }

  itemsInSameBranch(item1: Item, item2: Item): boolean {
    const id1 = item1.__linkId;
    const id2 = item2.__linkId;
    const lastDot1 = id1.lastIndexOf(".");
    const lastDot2 = id2.lastIndexOf(".");
    if (lastDot1 !== lastDot2) return false;
    for (let i = 0; i < lastDot1; i++) {
      if (id1[i] !== id2[i]) {
        return false;
      }
    }
    return true;
  }

  toggleEntireItem(
    internalLinkId: string,
    questionnaire: Questionnaire,
    activateToggle: boolean,
  ): void {
    const disableItem = questionnaireTools.getItemByInternalLinkId(
      internalLinkId,
      questionnaire,
    );
    if (disableItem.__disabled) return;
    disableItem.__active = activateToggle;
    if (disableItem.item) {
      this.toggleChildren(disableItem.item, activateToggle);
    }
  }

  private toggleChildren(items: Item[], activate: boolean): void {
    for (const item of items) {
      item.__active = activate;
      item.__disabled = !activate;
      if (item.item) {
        this.toggleChildren(item.item, activate);
      }
    }
  }

  getLevelFromLinkID(linkId: string): number {
    let level = 1; // count root level
    for (const c of linkId) {
      if (c === ".") {
        level++;
      }
    }
    return level;
  }

  getMaxLevel(item: Item): number {
    let maxChildLevel = 0;
    for (const element of item.item ?? []) {
      const childLevel = this.getMaxLevel(element);
      maxChildLevel = Math.max(maxChildLevel, childLevel);
    }
    return maxChildLevel + 1;
  }

  getMaxLevelOfGroup(item: Item): number {
    return this.getMaxLevelOfGroupHelper(item, 1);
  }

  private getMaxLevelOfGroupHelper(item: Item, level: number): number {
    let maxGroupLevel = item.type === "group" ? level : 0;
    if (item.item === undefined) return maxGroupLevel;
    for (const element of item.item) {
      const childLevel = this.getMaxLevelOfGroupHelper(element, level + 1);
      maxGroupLevel = Math.max(maxGroupLevel, childLevel);
    }
    return maxGroupLevel;
  }

  // Example: 1.13.5 -> 1.13.6
  getNextLinkID(linkId: string): string {
    const numbers = linkId.split(".");
    const nextLinkId = Number(numbers.at(-1)) + 1;
    numbers.pop();
    numbers.push(nextLinkId.toString());
    return numbers.join(".");
  }

  addItemAndSetLinkIDs(newItem: Item, parent: Item): void {
    parent.item ??= [];
    const items = parent.item;
    if (items.length > 0) {
      const lastItem = items.at(-1)!;
      newItem.__linkId = this.getNextLinkID(lastItem.__linkId);
    } else {
      newItem.__linkId = `${parent.__linkId}.0`;
    }
    items.push(newItem);
  }

  addItemToRootAndSetLinkIDs(newItem: Item, rootItems: Item[]): void {
    newItem.__linkId = rootItems.length.toString();
    rootItems.push(newItem);
  }

  setConditionDependence(item: Item[], rootItem: Item[]): void {
    for (const element of item) {
      if (element.item) {
        this.setConditionDependence(element.item, rootItem);
      }
      if (element.enableWhen === undefined) continue;
      for (const enableWhen of element.enableWhen) {
        const itemToAppendCondition = itemTools.getItemByLinkId(
          enableWhen.question,
          rootItem,
        );
        if (itemToAppendCondition === undefined) continue;
        itemToAppendCondition.__dependenceCondition ??= {
          __icon: "account_tree",
          __questions: [],
          __linkId: "",
          __text: "",
        };
        const question: Question = {
          __linkId: element.linkId,
          __text: element.text,
          __question: enableWhen.question,
          __answer: enableWhen.__answer,
          __operator: enableWhen.operator,
          __type: enableWhen.__type,
          __display: enableWhen.answerCoding?.display,
          __system: enableWhen.answerCoding?.system,
          __answerInteger: enableWhen.answerInteger,
          __answerDecimal: enableWhen.answerDecimal,
          __answerBoolean: enableWhen.answerBoolean,
          __answerCoding: enableWhen.answerCoding,
          __answerDate: enableWhen.answerDate,
          __answerString: enableWhen.answerString,
        };
        itemToAppendCondition.__dependenceCondition.__questions.push(question);
      }
    }
  }

  removeConditionDependence(items: Item[] = []): void {
    for (const item of items) {
      if (item.item) {
        this.removeConditionDependence(item.item);
      }
      if (item.__dependenceCondition) {
        delete item.__dependenceCondition;
      }
    }
  }

  // FIXME: Implement proper handling of +/- for number inputs
  isNotIntegerKey(code: string): boolean {
    // Number-KeyCodes: "Digit0" - "Digit9"
    const noNumberKeyCode =
      code.length !== 6 ||
      !code.startsWith("Digit") ||
      code[5] < "0" ||
      code[5] > "9";
    return noNumberKeyCode && code !== "Slash";
  }

  isNotDecimalKey(code: string): boolean {
    return this.isNotIntegerKey(code) && code !== "Period" && code !== "Comma";
  }

  isNumber(x: string | number | null | undefined): boolean {
    return (
      x != null && x !== "" && (typeof x === "number" || !isNaN(Number(x)))
    );
  }

  onlyStringFalsy(
    n: number | string | undefined | null,
  ): n is "" | undefined | null {
    return n === "" || n === undefined || n === null;
  }

  formatQuantity(quantity: Quantity): string {
    let result = "";
    if (quantity.comparator) {
      result += quantity.comparator;
    }
    if (quantity.value) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + quantity.value;
    }
    if (quantity.unit) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + quantity.unit;
    }
    if (quantity.code) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + `(${quantity.code})`;
    }
    return result;
  }

  formatCoding(coding: Coding): string {
    let result = "";
    if (coding.display) {
      result += coding.display;
    }
    if (coding.code) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + `(${coding.code})`;
    }
    if (coding.system) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + `[${coding.system}]`;
    }
    if (coding.version) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + `(Vers.: ${coding.version})`;
    }
    return result;
  }

  formatReference(reference: Reference): string {
    let result = "";
    if (reference.display) {
      result += reference.display;
    }
    if (reference.reference) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + `(${reference.reference})`;
    }
    if (reference.type) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + `(Type: ${reference.type})`;
    }
    if (reference.identifier) {
      const prefix = result.length > 0 ? " " : "";
      result += prefix + `[with Identifier]`;
    }
    return result;
  }
}

export const editorTools = new EditorTools();
