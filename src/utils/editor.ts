import {
  questionTypesIcons,
  questionTypes,
  answerType,
  QuestionIcon,
} from "./constants";
import { v4 as uuidv4 } from "uuid";
import { GeccoItem } from "@/store/questionnaire";
import { Answer, AnswerOption, Question, Item, QuestionType } from "@/types";

function getTypeQuestionIcon(type: QuestionType): QuestionIcon["icon"] {
  const questionTypesIcon = questionTypesIcons.find((i) => i.name === type);
  if (questionTypesIcon === undefined) {
    throw new Error(`Invalid QuestionType: ${type}`);
  }
  return questionTypesIcon.icon;
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
    text: "",
    extension: [],
  };
}

class EditorTools {
  answerType = answerType;
  questionTypes = questionTypes;

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

  getIndexItem(internalIDToBeRemove: string, arrayQuestions: Item[]): number {
    for (let i = 0; i < arrayQuestions.length; i++)
      if (arrayQuestions[i].__internalID === internalIDToBeRemove) return i;
    return 1;
  }

  getInternalIDFromEhandler(e: DragEvent): string {
    const currentTarget = e.currentTarget as HTMLInputElement;
    const splitId = currentTarget.id.split("_");
    return splitId.length > 1 ? splitId[1] : currentTarget.id;
  }

  isPreviousQuestion(e: DragEvent): boolean {
    //if with prefix _ means that id has been dragged before the item question
    const currentTarget = e.currentTarget as HTMLInputElement;
    return currentTarget.id.split("_").length == 2;
  }

  assingNewItemInternalIDs(item: Item): void {
    if (item.item) {
      let idCount = 0;
      item.item.forEach((element: Item) => {
        idCount++;
        element.__linkId = item.__linkId + "." + idCount;
        if (element.item) {
          this.assingNewItemInternalIDs(element);
        }
      });
    }
  }

  assingNewItemIDs(item: Item): Map<string, string> {
    let changedIdMap = new Map<string, string>();
    if (item.item === undefined) return changedIdMap;
    let idCount = 0;
    item.item.forEach((element) => {
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
    });
    return changedIdMap;
  }

  regenerateInternalIDs(item: Item[]): void {
    let idCount = 0;
    item.forEach((element) => {
      idCount++;
      element.__linkId = idCount.toString();
      if (element.item) {
        this.assingNewItemInternalIDs(element);
      }
    });
  }

  regenerateLinkIds(item?: Item[]): Map<string, string> {
    let changedIdMap = new Map<string, string>();
    if (item === undefined) return changedIdMap;
    let idCount = 0;
    item.forEach((element) => {
      if (element.__active) {
        idCount++;
        const oldLinkId = element.linkId;
        const newLinkId = idCount + "";
        changedIdMap.set(oldLinkId, newLinkId);
        element.linkId = newLinkId;
      } else {
        changedIdMap.set(element.linkId, "");
        element.linkId = "";
      }
      if (element.item) {
        const newIds = this.assingNewItemIDs(element);
        changedIdMap = new Map([...changedIdMap, ...(newIds || [])]);
      }
    });
    return changedIdMap;
  }

  regenerateConditionWhenIds(
    item: Item[] | undefined,
    changedIdMap: Map<string, string>,
  ): void {
    if (item === undefined) return;
    item.forEach((element) => {
      if (element.type === "group") {
        this.regenerateConditionWhenIds(element.item, changedIdMap);
      }
      if (element.enableWhen !== undefined) {
        element.enableWhen.forEach((condition) => {
          if (
            condition.question !== "" &&
            changedIdMap.has(condition.question)
          ) {
            condition.question = changedIdMap.get(condition.question) || "";
          }
        });
      }
    });
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

  disableItem(item: Item, toggleValue: boolean): void {
    if (item.item) {
      for (const element of item.item) {
        element.__active = toggleValue;
        this.disableItem(element, toggleValue);
      }
    }
    item.disabled = !toggleValue;
    item.__active = toggleValue;
  }

  getArraySource(internalID: string, rootItem: Item[]): Item[] {
    const includesId = rootItem.some(
      (item) => item.__internalID === internalID,
    );
    if (includesId) {
      return rootItem;
    }
    for (const item of rootItem) {
      if (item.item === undefined) continue;
      const result = this.getArraySource(internalID, item.item);
      if (result.length > 0) {
        return result;
      }
    }
    return [];
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
      oItemQuestionTodisabled.item.forEach((element) => {
        this.disableItem(element, oItemQuestionTodisabled.__active);
      });
    } else {
      this.disableItem(
        oItemQuestionTodisabled,
        oItemQuestionTodisabled.__active,
      );
    }
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
      __icon: this.answerType.choice.icon,
      __newAnswer: true,
      valueCoding: newAnswer,
    };
    return answerOption;
  }

  getNewAnswerValueString(
    answer: Answer,
    arrayAnswers: AnswerOption[] = [],
  ): AnswerOption {
    const id = arrayAnswers.length + 1;
    const { text, type } = answer;
    const answerOption: AnswerOption = {
      __id: id,
      __type: type,
      __icon: this.answerType.open_choice.icon,
      __newAnswer: true,
      valueString: text,
    };
    return answerOption;
  }

  getQuestionWithType(questionType: QuestionType): Item {
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
    // count root level
    let level = 1;
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

  private currentMaxLevel(items: Item[], currLevel: number): number {
    let maxLevel = currLevel;
    for (const element of items) {
      if (element.item === undefined || element.item.length === 0) continue;
      const level = this.currentMaxLevel(element.item, currLevel + 1);
      maxLevel = level > maxLevel ? level : maxLevel;
    }
    return maxLevel;
  }

  getNumbersMaxOfLevels(items: Item[]): number {
    return items.length > 0 ? this.currentMaxLevel(items, 1) : 0;
  }

  getMaxLevelOfGroup(item: Item): number {
    let maxLevel = 0;
    if (item.item === undefined) {
      return maxLevel;
    }
    for (const element of item.item) {
      if (element.type === "group") {
        const level = this.getMaxLevelOfGroup(element);
        maxLevel = level > maxLevel ? level : maxLevel;
      }
    }
    return maxLevel + 1;
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

  removeConditionDependence(item: Item[] = []): void {
    item.forEach((element) => {
      if (element.item) {
        this.removeConditionDependence(element.item);
      }
      if (element.__dependeceCondition) {
        delete element.__dependeceCondition;
      }
    });
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
