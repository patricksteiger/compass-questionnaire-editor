import { ItemType, getItemTypeIcon } from "./constants";
import { v4 as uuidv4 } from "uuid";
import {
  Answer,
  AnswerOption,
  Question,
  Item,
  Questionnaire,
  Coding,
  Quantity,
} from "@/types";
import { itemTools } from "./item";

function createNewItem(type: ItemType): Item {
  return {
    type: type,
    __icon: getItemTypeIcon(type),
    __internalID: itemTools.createInternalId(),
    definition: uuidv4(),
    __active: true,
    __linkId: "",
    __newQuestion: true,
    __newDefinition: true,
    __disabled: false,
    item: undefined,
    linkId: "",
    text: itemTools.getDefaultText(),
    extension: [],
    required: itemTools.getDefaultRequired(type),
    repeats: itemTools.getDefaultRepeats(type),
  };
}

class EditorTools {
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
    if (item.linkId === "") return;
    linkIDs.add(item.linkId);
    if (item.item !== undefined) {
      for (const element of item.item) {
        this.getAllLinkIDsHelper(element, linkIDs);
      }
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
      idCount++;
      element.__linkId = `${item.__linkId}.${idCount}`;
      this.assingNewInternalLinkIDsToChildren(element);
    }
  }

  regenerateInternalLinkIDs(items: Item[]): void {
    let idCount = 0;
    for (const item of items) {
      idCount++;
      item.__linkId = idCount.toString();
      this.assingNewInternalLinkIDsToChildren(item);
    }
  }

  private assingNewItemIDs(
    item: Item,
    changedIdMap: Map<string, string>,
  ): void {
    if (item.item === undefined) return;
    let idCount = 0;
    for (const element of item.item) {
      if (element.__active) {
        idCount++;
        const oldLinkId = element.linkId;
        const newLinkId = item.linkId + "." + idCount;
        changedIdMap.set(oldLinkId, newLinkId);
        element.linkId = newLinkId;
      } else {
        changedIdMap.set(element.linkId, "");
        element.linkId = "";
      }
      this.assingNewItemIDs(element, changedIdMap);
    }
  }

  regenerateLinkIds(items: Item[]): Map<string, string> {
    const changedIdMap = new Map<string, string>();
    let idCount = 0;
    for (const item of items) {
      if (item.__active) {
        idCount++;
        const oldLinkId = item.linkId;
        const newLinkId = idCount.toString();
        changedIdMap.set(oldLinkId, newLinkId);
        item.linkId = newLinkId;
      } else {
        changedIdMap.set(item.linkId, "");
        item.linkId = "";
      }
      this.assingNewItemIDs(item, changedIdMap);
    }
    return changedIdMap;
  }

  regenerateConditionWhenIds(
    items: Item[] | undefined,
    changedIdMap: Map<string, string>,
  ): void {
    if (items === undefined) return;
    for (const element of items) {
      if (element.type === "group") {
        this.regenerateConditionWhenIds(element.item, changedIdMap);
      }
      if (element.enableWhen === undefined) continue;
      for (const condition of element.enableWhen) {
        if (condition.question !== "" && changedIdMap.has(condition.question)) {
          condition.question = changedIdMap.get(condition.question) ?? "";
        }
      }
    }
  }

  isEnableWhenCondition(item: Item[], linkId: string): boolean {
    // deactivated Questions
    if (linkId === "") {
      return false;
    }
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

  getItemByLinkId(linkId: string, rootItem: Item[] = []): Item | undefined {
    for (const item of rootItem) {
      if (item.linkId === linkId) {
        return item;
      }
      const result = this.getItemByLinkId(linkId, item.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getItemByInternalLinkId(id: string, rootItem: Item[]): Item | undefined {
    for (const item of rootItem) {
      if (item.__linkId === id) {
        return item;
      }
      if (!item.item) continue;
      const result = this.getItemByInternalLinkId(id, item.item);
      if (result !== undefined) return result;
    }
    return undefined;
  }

  toggleEntireItem(
    id: string,
    rootItem: Item[],
    activateToggle: boolean,
  ): void {
    const disableItem = this.getItemByInternalLinkId(id, rootItem);
    if (disableItem === undefined || disableItem.__disabled) {
      return;
    }
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

  getNewAnswerValueCoding(
    answer: Answer,
    arrayAnswers: AnswerOption[],
  ): AnswerOption {
    const id = arrayAnswers.length + 1;
    const { text } = answer;
    const newAnswer: Coding = {
      code: "",
      system: "",
      display: text,
    };
    const answerOption: AnswerOption = {
      __id: id,
      __type: "coding",
      __icon: "radio_button_unchecked",
      __newAnswer: true,
      valueCoding: newAnswer,
    };
    return answerOption;
  }

  createItemWithType(questionType: ItemType): Item {
    const item = createNewItem(questionType);
    if (item.type === "choice" || item.type === "open-choice") {
      item.answerOption = [];
      item.__OldAnswerValueSet = item.answerValueSet = "";
      item.__answerValueSetCheck = false;
    } else if (item.type === "integer") {
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
    for (const element of item.item ?? []) {
      const childLevel = this.getMaxLevelOfGroupHelper(element, level + 1);
      maxGroupLevel = Math.max(maxGroupLevel, childLevel);
    }
    return maxGroupLevel;
  }

  addItemAndSetLinkIDs(newItem: Item, parent: Item): void {
    parent.item ??= [];
    const items = parent.item;
    if (items.length > 0) {
      const lastItem = items.at(-1) as Item;
      newItem.__linkId = this.getNextLinkID(lastItem.__linkId);
      if (lastItem.__active) {
        newItem.linkId = this.getNextLinkID(lastItem.linkId);
      } else {
        const lastActiveItem = this.getLastActiveItem(items);
        if (lastActiveItem !== undefined) {
          newItem.linkId = this.getNextLinkID(lastActiveItem.linkId);
        } else {
          newItem.linkId = `${parent.linkId}.1`;
        }
      }
    } else {
      newItem.__linkId = `${parent.__linkId}.1`;
      newItem.linkId = `${parent.linkId}.1`;
    }
    items.push(newItem);
  }

  addItemToRootAndSetLinkIDs(newItem: Item, rootItems: Item[]): void {
    newItem.__linkId = (rootItems.length + 1).toString();
    const lastActiveItem = this.getLastActiveItem(rootItems);
    if (lastActiveItem !== undefined) {
      newItem.linkId = this.getNextLinkID(lastActiveItem.linkId);
    } else {
      newItem.linkId = "1";
    }
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
          __answer: enableWhen.answer,
          __operator: enableWhen.operator,
          __type: enableWhen.type,
          __display: enableWhen.display,
          __system: enableWhen.system,
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

  isNotIntegerKey(code: string): boolean {
    // Number-KeyCodes: "Digit0" - "Digit9"
    return (
      code.length !== 6 ||
      !code.startsWith("Digit") ||
      code[5] < "0" ||
      code[5] > "9"
    );
  }

  isNotDecimalKey(code: string): boolean {
    return this.isNotIntegerKey(code) && code !== "Period" && code !== "Comma";
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
}

export const editorTools = new EditorTools();
