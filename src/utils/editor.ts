import { questionTypesIcons, answerType, QuestionIcon } from "./constants";
import { v4 as uuidv4 } from "uuid";
import { GeccoItem } from "@/store/questionnaire";
import { Answer, AnswerOption, Question, Item, QuestionType } from "@/types";
import { i18n } from "@/i18n";

function getTypeQuestionIcon(type: QuestionType): QuestionIcon["icon"] {
  const questionTypesIcon = questionTypesIcons.find((i) => i.name === type);
  return (questionTypesIcon as QuestionIcon).icon;
}

function createNewItem(type: QuestionType): Item {
  return {
    type: type,
    __icon: getTypeQuestionIcon(type),
    __internalID: `${uuidv4()}-${Date.now()}`,
    definition: uuidv4(),
    __active: true,
    __linkId: "",
    __newQuestion: true,
    __newDefinition: true,
    disabled: false,
    item: undefined,
    linkId: "",
    text: i18n.global.t("views.editor.newQuestion"),
    extension: [],
  };
}

class EditorTools {
  private getAllLinkIDsHelper(item: Item, linkIDs: Set<string>): void {
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

  private assingNewItemInternalLinkIDs(item: Item): void {
    if (item.item === undefined) return;
    let idCount = 0;
    for (const element of item.item) {
      idCount++;
      element.__linkId = `${item.__linkId}.${idCount}`;
      this.assingNewItemInternalLinkIDs(element);
    }
  }

  private assingNewItemIDs(item: Item): Map<string, string> {
    let changedIdMap = new Map<string, string>();
    if (item.item === undefined) return changedIdMap;
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
      if (element.item) {
        const newIds = this.assingNewItemIDs(element);
        changedIdMap = new Map([...changedIdMap, ...newIds]);
      }
    }
    return changedIdMap;
  }

  regenerateInternalLinkIDs(items: Item[]): void {
    let idCount = 0;
    for (const item of items) {
      idCount++;
      item.__linkId = idCount.toString();
      this.assingNewItemInternalLinkIDs(item);
    }
  }

  regenerateLinkIds(items?: Item[]): Map<string, string> {
    let changedIdMap = new Map<string, string>();
    if (items === undefined) return changedIdMap;
    let idCount = 0;
    for (const item of items) {
      if (item.__active) {
        idCount++;
        const oldLinkId = item.linkId;
        const newLinkId = idCount + "";
        changedIdMap.set(oldLinkId, newLinkId);
        item.linkId = newLinkId;
      } else {
        changedIdMap.set(item.linkId, "");
        item.linkId = "";
      }
      if (item.item) {
        const newIds = this.assingNewItemIDs(item);
        changedIdMap = new Map([...changedIdMap, ...newIds]);
      }
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

  private disableItem(item: Item, toggleValue: boolean): void {
    if (item.item) {
      for (const element of item.item) {
        element.__active = toggleValue;
        this.disableItem(element, toggleValue);
      }
    }
    item.disabled = !toggleValue;
    item.__active = toggleValue;
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

  getCurrentQuestionNodeByID(
    internalId: string,
    rootItem: Item[] = [],
  ): Item | undefined {
    for (const item of rootItem) {
      if (item.__internalID === internalId) {
        return item;
      }
      const result = this.getCurrentQuestionNodeByID(internalId, item.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getCurrentGeccoQuestionNodeByID(
    internalId: string,
    rootItem: GeccoItem[] = [],
  ): GeccoItem | undefined {
    for (const item of rootItem) {
      if (item.__internalID === internalId) {
        return item;
      }
      const result = this.getCurrentGeccoQuestionNodeByID(
        internalId,
        item.item,
      );
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getCurrentQuestionNodeByLinkId(
    linkId: string,
    rootItem: Item[] = [],
  ): Item | undefined {
    for (const item of rootItem) {
      if (item.linkId === linkId) {
        return item;
      }
      const result = this.getCurrentQuestionNodeByLinkId(linkId, item.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  disableEntireItemQuestion(id: string, rootItem: Item[]): void {
    const oItemQuestionTodisabled = this.getCurrentQuestionNodeByID(
      id,
      rootItem,
    );
    if (
      oItemQuestionTodisabled === undefined ||
      oItemQuestionTodisabled.disabled
    ) {
      return;
    }
    if (oItemQuestionTodisabled.item) {
      for (const element of oItemQuestionTodisabled.item) {
        this.disableItem(element, oItemQuestionTodisabled.__active);
      }
    } else {
      this.disableItem(
        oItemQuestionTodisabled,
        oItemQuestionTodisabled.__active,
      );
    }
    // FIXME: Is this always true?
    if (id === oItemQuestionTodisabled.__internalID) {
      oItemQuestionTodisabled.disabled = false;
    }
  }

  getNewAnswerValueCoding(
    answer: Answer,
    arrayAnswers: AnswerOption[] = [],
  ): AnswerOption {
    const id = arrayAnswers.length + 1;
    const { text } = answer;
    const newAnswer = {
      code: "",
      system: "",
      display: text,
    };
    const answerOption: AnswerOption = {
      __id: id,
      __type: "coding",
      __icon: answerType.choice.icon,
      __newAnswer: true,
      valueCoding: newAnswer,
    };
    return answerOption;
  }

  // TODO: AnswerValueSet correct method-name?
  getNewAnswerValueString(
    answer: Answer,
    arrayAnswers: AnswerOption[] = [],
  ): AnswerOption {
    const id = arrayAnswers.length + 1;
    const { text, type } = answer;
    const answerOption: AnswerOption = {
      __id: id,
      __type: type,
      __icon: answerType.open_choice.icon,
      __newAnswer: true,
      valueString: text,
    };
    return answerOption;
  }

  createQuestionWithType(questionType: QuestionType): Item {
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

  getNextID(currentID: string): string {
    const acurrentID = currentID.split(".");
    const nextID = Number(acurrentID.at(-1)) + 1;
    acurrentID.pop();
    acurrentID.push(nextID.toString());
    return acurrentID.join(".");
  }

  getMaxLevel(item: Item): number {
    let maxChildLevel = 0;
    for (const element of item.item ?? []) {
      const childLevel = this.getMaxLevelOfGroup(element);
      maxChildLevel = Math.max(maxChildLevel, childLevel);
    }
    return maxChildLevel + 1;
  }

  // Expects to be called only on items with type group
  getMaxLevelOfGroup(item: Item): number {
    let maxChildLevel = 0;
    for (const element of item.item ?? []) {
      if (element.type === "group") {
        const childLevel = this.getMaxLevelOfGroup(element);
        maxChildLevel = Math.max(maxChildLevel, childLevel);
      }
    }
    return maxChildLevel + 1;
  }

  private getItemNodeByLinkID(
    linkId: string,
    items: Item[] = [],
  ): Item | undefined {
    for (const element of items) {
      if (element.linkId === linkId) {
        return element;
      }
      const result = this.getItemNodeByLinkID(linkId, element.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  setConditionDependence(item: Item[] = [], rootItem: Item[] = []): void {
    for (const element of item) {
      this.setConditionDependence(element.item, rootItem);
      if (element.enableWhen === undefined) continue;
      for (const enableWhen of element.enableWhen) {
        const itemToAppendCondition = this.getItemNodeByLinkID(
          enableWhen.question,
          rootItem,
        );
        if (itemToAppendCondition === undefined) continue;
        itemToAppendCondition.__dependeceCondition ??= {
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
        itemToAppendCondition.__dependeceCondition.__questions.push(question);
      }
    }
  }

  removeConditionDependence(items: Item[] = []): void {
    for (const item of items) {
      if (item.item) {
        this.removeConditionDependence(item.item);
      }
      if (item.__dependeceCondition) {
        delete item.__dependeceCondition;
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
}

export const editorTools = new EditorTools();
