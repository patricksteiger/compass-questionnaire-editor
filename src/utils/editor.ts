import { ItemType, getItemTypeIcon, allowsAnswerChoice } from "./constants";
import {
  Question,
  Item,
  Questionnaire,
  Coding,
  Quantity,
  EnableWhen,
  Reference,
} from "@/types";
import { itemTools } from "./item";

// Used for exhaustive switch-statements
export class UnreachableError extends Error {
  constructor(unreachable: never) {
    super(`Unreachable case: ${JSON.stringify(unreachable)}`);
  }
}

function createNewItem(linkId: string, type: ItemType): Item {
  return {
    type: type,
    __icon: getItemTypeIcon(type),
    __internalID: itemTools.createInternalId(),
    __active: true,
    __linkId: "",
    __newQuestion: true,
    __disabled: false,
    item: undefined,
    linkId: linkId,
    text: itemTools.getDefaultText(),
    extension: [],
    required: itemTools.getDefaultRequired(type),
    repeats: itemTools.getDefaultRepeats(type),
  };
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

  private enableWhenDependsOnHelper(
    items: Item[],
    linkIDs: Set<string>,
  ): boolean {
    for (const item of items) {
      for (const enableWhen of item.enableWhen ?? []) {
        if (linkIDs.has(enableWhen.question)) {
          return true;
        }
      }
      if (item.item) {
        const result = this.enableWhenDependsOnHelper(item.item, linkIDs);
        if (result) return true;
      }
    }
    return false;
  }

  enableWhenDependsOn(
    questionnaire: Questionnaire,
    linkIDs: Set<string>,
  ): boolean {
    return this.enableWhenDependsOnHelper(questionnaire.item, linkIDs);
  }

  private getAllLinkIDsHelper(item: Item, linkIDs: Set<string>): void {
    if (!item.__active) return;
    linkIDs.add(item.linkId);
    if (item.item === undefined) return;
    for (const element of item.item) {
      this.getAllLinkIDsHelper(element, linkIDs);
    }
  }

  getAllLinkIDs(item: Item): Set<string> {
    const linkIDs = new Set<string>();
    this.getAllLinkIDsHelper(item, linkIDs);
    return linkIDs;
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

  isEnableWhenCondition(item: Item[], linkId: string): boolean {
    for (const element of item) {
      if (element.enableWhen !== undefined) {
        for (const condition of element.enableWhen) {
          if (condition.question === linkId) {
            return true;
          }
        }
      }

      if (element.item) {
        const found = this.isEnableWhenCondition(element.item, linkId);
        if (found) {
          return true;
        }
      }
    }
    return false;
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

  getBranchContainingInternalID(
    internalID: string,
    items: Item[],
  ): [Item[], number] | undefined {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.__internalID === internalID) {
        return [items, i];
      }
      if (item.item === undefined) continue;
      const result = this.getBranchContainingInternalID(internalID, item.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getBranchContainingInternalLinkID(
    linkID: string,
    items: Item[],
  ): [Item[], number] | undefined {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.__linkId === linkID) {
        return [items, i];
      }
      if (item.item === undefined) continue;
      const result = this.getBranchContainingInternalLinkID(linkID, item.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getItemByInternalId(
    internalId: string,
    rootItem: Item[] | undefined,
  ): Item | undefined {
    if (rootItem !== undefined) {
      for (const item of rootItem) {
        if (item.__internalID === internalId) {
          return item;
        }
        const result = this.getItemByInternalId(internalId, item.item);
        if (result !== undefined) {
          return result;
        }
      }
    }
    return undefined;
  }

  getItemByLinkId(linkId: string, rootItem: Item[]): Item | undefined {
    for (const item of rootItem) {
      if (item.linkId === linkId) {
        return item;
      }
      if (item.item === undefined) continue;
      const result = this.getItemByLinkId(linkId, item.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getItemByInternalLinkId(id: string, questionnaire: Questionnaire): Item {
    const digits = id.split(".");
    // Number-constructor, since parseInt has strange behavior at times
    const indeces = digits.map(Number);
    let item = questionnaire.item[indeces[0]];
    for (let i = 1; i < indeces.length; i++) {
      const index = indeces[i];
      item = item.item![index];
    }
    return item;
  }

  getLinkIds(questionnaire: Questionnaire): string[] {
    const linkIds: string[] = [];
    this.getLinkIdsExceptHelper(questionnaire.item, linkIds);
    return linkIds;
  }

  private getLinkIdsExceptHelper(items: Item[], linkIds: string[]): void {
    for (const item of items) {
      linkIds.push(item.linkId);
      if (item.item !== undefined) {
        this.getLinkIdsExceptHelper(item.item, linkIds);
      }
    }
  }

  toggleEntireItem(
    id: string,
    questionnaire: Questionnaire,
    activateToggle: boolean,
  ): void {
    const disableItem = this.getItemByInternalLinkId(id, questionnaire);
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

  createItemWithType(linkId: string, questionType: ItemType): Item {
    const item = createNewItem(linkId, questionType);
    if (allowsAnswerChoice(item.type)) {
      item.answerOption = [];
      item.__OldAnswerValueSet = item.answerValueSet = "";
      item.__answerValueSetCheck = false;
    }
    if (item.type === "integer") {
      item.extension = [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue",
          valueInteger: undefined,
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/minValue",
          valueInteger: undefined,
        },
        {
          url: "https://num-compass.science/fhir/StructureDefinition/LowRangeLabel",
          valueString: "",
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/maxValue",
          valueInteger: undefined,
        },
        {
          url: "https://num-compass.science/fhir/StructureDefinition/HighRangeLabel",
          valueString: "",
        },
      ];
    }

    return item;
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

  // Example: 1.13.5 -> 1.13.6
  getNextLinkID(linkId: string): string {
    const numbers = linkId.split(".");
    const nextLinkId = Number(numbers.at(-1)) + 1;
    numbers.pop();
    numbers.push(nextLinkId.toString());
    return numbers.join(".");
  }

  hasNotMultipleItems(qre: Questionnaire): boolean {
    const items = qre.item;
    return (
      items.length === 0 ||
      (items.length === 1 &&
        (items[0].item === undefined || items[0].item.length === 0))
    );
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

  linkIdExistsInQuestionnaire(
    questionnaire: Questionnaire,
    linkId: string,
  ): boolean {
    const item = this.getItemByLinkId(linkId, questionnaire.item);
    return item !== undefined;
  }

  getEnableWhenWithLinkId(
    questionnaire: Questionnaire,
    linkId: string,
  ): EnableWhen[] {
    const result: EnableWhen[] = [];
    this.getEnableWhenWithLinkIdHelper(questionnaire.item, linkId, result);
    return result;
  }

  private getEnableWhenWithLinkIdHelper(
    items: Item[],
    linkId: string,
    enableWhen: EnableWhen[],
  ): void {
    for (const item of items) {
      if (item.enableWhen !== undefined) {
        for (const e of item.enableWhen) {
          if (e.question === linkId) enableWhen.push(e);
        }
      }
      if (item.item !== undefined) {
        this.getEnableWhenWithLinkIdHelper(item.item, linkId, enableWhen);
      }
    }
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

  getLastActiveItem(items: Item[]): Item | undefined {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item.__active) {
        return item;
      }
    }
    return undefined;
  }

  setConditionDependence(item: Item[] = [], rootItem: Item[] = []): void {
    for (const element of item) {
      this.setConditionDependence(element.item, rootItem);
      if (element.enableWhen === undefined) continue;
      for (const enableWhen of element.enableWhen) {
        const itemToAppendCondition = this.getItemByLinkId(
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
