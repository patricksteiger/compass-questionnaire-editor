import {
  Question,
  Item,
  Questionnaire,
  Coding,
  Quantity,
  Reference,
  AnswerOption,
  Attachment,
  ContactPoint,
  SimpleQuantity,
} from "@/types";
import { getOrAddHiddenExtension } from "./extension";
import { itemTools } from "./item";

type EmptyArray = undefined | [];

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

  nonEmptyArray<T>(val: T[] | undefined): val is T[] {
    return val !== undefined && val.length > 0;
  }

  emptyArray<T>(val: T[] | undefined): val is EmptyArray {
    return !this.nonEmptyArray(val);
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

  toggleEntireItem(disableItem: Item, activateToggle: boolean): void {
    if (disableItem.__disabled) return;
    const extension = disableItem.extension!;
    const hiddenExtension = getOrAddHiddenExtension(extension);
    hiddenExtension.valueBoolean = !activateToggle;
    disableItem.__active = activateToggle;
    if (disableItem.item) {
      this.toggleChildren(disableItem.item, activateToggle);
    }
  }

  private toggleChildren(items: Item[], activate: boolean): void {
    for (const item of items) {
      item.__active = activate;
      item.__disabled = !activate;
      const extension = item.extension!;
      const hiddenExtension = getOrAddHiddenExtension(extension);
      hiddenExtension.valueBoolean = !activate;
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

  isNumber(x: string | number | null | undefined): x is string | number {
    return (
      x != null && x !== "" && (typeof x === "number" || !isNaN(Number(x)))
    );
  }

  private isNotDigitKey(code: string): boolean {
    // Number-KeyCodes: "Digit0" - "Digit9"
    return (
      code.length !== 6 ||
      !code.startsWith("Digit") ||
      code[5] < "0" ||
      code[5] > "9"
    );
  }

  private isNotIntegerKey(code: string): boolean {
    return this.isNotDigitKey(code) && code !== "Slash";
  }

  private isNotDecimalKey(code: string): boolean {
    return this.isNotIntegerKey(code) && code !== "Period" && code !== "Comma";
  }

  onlyDecimal($event: KeyboardEvent): void {
    if (this.isNotDecimalKey($event.code)) {
      $event.preventDefault();
    }
  }

  onlyInteger($event: KeyboardEvent): void {
    if (this.isNotIntegerKey($event.code)) {
      $event.preventDefault();
    }
  }

  onlyPositiveInteger($event: KeyboardEvent): void {
    if (this.isNotDigitKey($event.code)) {
      $event.preventDefault();
    }
  }

  onlyStringFalsy(
    n: number | string | undefined | null,
  ): n is "" | undefined | null {
    return n === "" || n === undefined || n === null;
  }

  setDisplayToOld(answerOption: AnswerOption): void {
    if (answerOption.valueCoding !== undefined) {
      answerOption.valueCoding = editorTools.clone(
        answerOption.__oldValueCoding,
      );
      answerOption.__formattedValueCoding =
        answerOption.__oldFormattedValueCoding;
    }
  }

  invalidNumber(
    n: undefined | null | string | number,
  ): n is undefined | null | string {
    return n === undefined || n === null || typeof n === "string";
  }

  changedQuantity(answerOption: AnswerOption): boolean {
    if (answerOption.__newAnswer) return false;
    const old = answerOption.__oldValueQuantity;
    if (old === undefined) return false;
    const current = answerOption.valueQuantity;
    if (current === undefined) return true;
    return (
      current.code !== old.code ||
      current.system !== old.system ||
      current.unit !== old.unit ||
      current.value !== old.value ||
      current.comparator !== old.comparator
    );
  }

  changedCoding(answerOption: AnswerOption): boolean {
    if (answerOption.__newAnswer) return false;
    const old = answerOption.__oldValueCoding;
    if (old === undefined) return false;
    const current = answerOption.valueCoding;
    if (current === undefined) return true;
    return (
      current.code !== old.code ||
      current.system !== old.system ||
      current.display !== old.display ||
      current.version !== old.version ||
      current.userSelected !== old.userSelected
    );
  }

  changedReference(answerOption: AnswerOption): boolean {
    if (answerOption.__newAnswer) return false;
    const old = answerOption.__oldValueReference;
    if (old === undefined) return false;
    const current = answerOption.valueReference;
    if (current === undefined) return true;
    // FIXME: Implement identifier equality
    return (
      current.type !== old.type ||
      current.display !== old.display ||
      current.reference !== old.reference
    );
  }

  formatSimpleQuantity(quantity: SimpleQuantity): string {
    let result = "";
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

  formatAttachment(attachment: Attachment): string {
    let result = attachment.title ?? "";
    if (attachment.contentType) {
      result += ` (${attachment.contentType})`;
    }
    if (attachment.size) {
      result += ` [${attachment.size} Bytes]`;
    }
    return result;
  }

  formatContactPoint(contactPoint: ContactPoint): string {
    let result = contactPoint.value ?? "";
    if (contactPoint.system) {
      result += ` (${contactPoint.system})`;
    }
    if (contactPoint.use) {
      result += ` [${contactPoint.use}]`;
    }
    if (contactPoint.rank) {
      result += ` [${contactPoint.rank}]`;
    }
    return result;
  }

  formatInternalPosition(path: string): string {
    return path
      .split(".")
      .map((p) => Number(p) + 1)
      .join(" -> ");
  }
}

export const editorTools = new EditorTools();
