import {
  questionTypesIcons,
  questionTypes,
  answerType,
  QuestionIcon,
} from "./constants";
import { v4 as uuidv4 } from "uuid";
import { GeccoNode } from "@/store/questionnaire";

export type QuestionType =
  | "group"
  | "string"
  | "choice"
  | "boolean"
  | "date"
  | "open-choice"
  | "integer"
  | "decimal";

export type EnableWhen = {
  answer?: string;
  question: string;
  operator?: string;
  type?: string;
};

export type Answer = {
  text: string;
  type: string;
};

export type Coding = {
  __oldDisplay?: string;
  code: string;
  system: string;
  display: string;
};

export type AnswerOption = {
  __id?: number;
  __type?: string;
  __icon?: string;
  __newAnswer?: boolean;
  __oldValueInteger?: string;
  __oldValueDate?: string;
  __oldValueString?: string;
  linkId?: string;
  type?: string;
  valueCoding?: Coding;
  valueString?: string;
  valueInteger?: string;
  valueDate?: string;
};

export type Extension = {
  url: string;
  valueInteger?: number | null;
  valueString?: string;
  valueCoding?: Coding;
};

export type Question = {
  __linkId?: string;
  __text?: string;
  __question?: string;
  __answer?: string;
  __operator?: string;
  __type?: string;
};

export type Condition = {
  __icon: string;
  __questions: Question[];
  __linkId: string;
  __text: string;
};

export type Node = {
  __active: boolean;
  __icon: string;
  __internalID: string;
  __linkId: string;
  __newQuestion: boolean;
  __oldText?: string;
  __dependeceCondition?: Condition;
  disabled: boolean;
  item: Node[] | undefined;
  linkId: string;
  maxLength?: number;
  type: QuestionType;
  enableWhen: EnableWhen[] | null;
  text: string;
  definition: string;
  answerOption: AnswerOption[];
  __OldAnswerValueSet: string;
  answerValueSet: string;
  __answerValueSetCheck: boolean;
  extensions: Extension[];
};

export const defaultNode: Node = {
  __active: true,
  __icon: "",
  __internalID: "",
  __linkId: "",
  __newQuestion: true,
  disabled: true,
  item: undefined,
  linkId: "",
  type: "group",
  enableWhen: null,
  text: "",
  definition: "",
  answerOption: [],
  __OldAnswerValueSet: "",
  answerValueSet: "",
  __answerValueSetCheck: false,
  extensions: [],
};

type Base<T> = {
  __internalID: string;
  item: T[] | undefined;
};

class EditorTools {
  answerType = answerType;
  questionTypes = questionTypes;
  currentQuestionNodeByID = {
    __internalID: defaultNode.__internalID,
    item: undefined,
  };

  getIndexItem(internalIDToBeRemove: string, arrayQuestions: Node[]): number {
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

  assingNewItemInternalIDs(item: Node): void {
    if (item.item) {
      let idCount = 0;
      item.item.forEach((element: Node) => {
        idCount++;
        element.__linkId = item.__linkId + "." + idCount;
        if (element.item) {
          this.assingNewItemInternalIDs(element);
        }
      });
    }
  }

  assingNewItemIDs(item: Node): Map<string, string> {
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
        changedIdMap = new Map([...changedIdMap, ...(newIds || [])]);
      }
    });
    return changedIdMap;
  }

  regenerateInternalIDs(item: Node[]): void {
    let idCount = 0;
    item.forEach((element) => {
      idCount++;
      element.__linkId = idCount.toString();
      if (element.item) {
        this.assingNewItemInternalIDs(element);
      }
    });
  }

  regenerateLinkIds(item?: Node[]): Map<string, string> {
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
    item: Node[] | undefined,
    changedIdMap: Map<string, string>,
  ): void {
    if (item === undefined) return;
    item.forEach((element) => {
      if (element.type === "group") {
        this.regenerateConditionWhenIds(element.item, changedIdMap);
      }
      if (element.enableWhen !== null && element.enableWhen !== undefined) {
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

  isEnableWhenCondition(item: Node[], linkId: string): boolean {
    // deactivated Questions
    if (linkId === "") {
      return false;
    }
    for (const element of item) {
      if (element.enableWhen != null) {
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

  disableItem(item: Node, toggleValue: boolean): void {
    if (item.item) {
      for (const element of item.item) {
        element.__active = toggleValue;
        this.disableItem(element, toggleValue);
      }
    }
    item.disabled = !toggleValue;
    item.__active = toggleValue;
  }

  getArraySource(internalID: string, rootItem: Node[]): Node[] {
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

  // TODO: Is LinkId always unique?
  getCurrentQuestionNodeByID<T extends Base<T>>(
    internalId: string,
    rootItem: T[] = [],
  ): T | undefined {
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
    rootItem: GeccoNode[] = [],
  ): GeccoNode | undefined {
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

  // TODO: Is LinkId always unique?
  getCurrentQuestionNodeByLinkId(
    linkId: string,
    rootItem: Node[] = [],
  ): Node | undefined {
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

  disableEntireItemQuestion(id: string, rootItem: Node[]): void {
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

  // TODO: Is there a case where QuestionType can be invalid? How to throw error?
  getTypeQuestionIcon(type: QuestionType): QuestionIcon {
    const icon = questionTypesIcons.find((item) => item.name === type);
    if (icon === undefined) {
      throw new Error(`Invalid QuestionType: ${type}`);
    }
    return icon;
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

  getTypeObjQuestion(typeQuestion: QuestionType): Node {
    const questionTypeIcon = this.getTypeQuestionIcon(typeQuestion);
    const item: Node = {
      ...defaultNode,
      text: "",
      type: typeQuestion,
      __icon: questionTypeIcon.icon,
      __active: true,
      disabled: false,
      __newQuestion: true,
      __internalID: `${uuidv4()}-${Date.now()}`,
      definition: uuidv4(),
    };
    if (
      questionTypeIcon.name === this.questionTypes.choice ||
      questionTypeIcon.name === this.questionTypes.openChoice
    ) {
      item.answerOption = [];
      item.__OldAnswerValueSet = item.answerValueSet = "";
      item.__answerValueSetCheck = false;
    }
    if (item.type === this.questionTypes.integer) {
      item.extensions = [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue",
          valueInteger: null,
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/minValue",
          valueInteger: null,
        },
        {
          url: "https://num-compass.science/fhir/StructureDefinition/LowRangeLabel",
          valueString: "",
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/maxValue",
          valueInteger: null,
        },
        {
          url: "https://num-compass.science/fhir/StructureDefinition/HighRangeLabel",
          valueString: "",
        },
      ];
    }

    return item;
  }

  getIndexAnswer(
    internalIDToBeRemoved: number,
    arrayAnswers: AnswerOption[],
  ): number {
    for (let i = arrayAnswers.length - 1; i >= 0; i--) {
      if (arrayAnswers[i].__id === internalIDToBeRemoved) {
        return i;
      }
    }
    // TODO: Is default index of 1 sensible?
    return 1;
  }

  getNextID(currentID: string): string {
    const acurrentID = currentID.split(".");
    const nextID = Number(acurrentID.at(-1)) + 1;
    acurrentID.pop();
    acurrentID.push(nextID.toString());
    return acurrentID.join(".");
  }

  private currentMaxLevel(items: Node[], currLevel: number): number {
    let maxLevel = currLevel;
    for (const element of items) {
      if (element.item === undefined || element.item.length === 0) continue;
      const level = this.currentMaxLevel(element.item, currLevel + 1);
      maxLevel = level > maxLevel ? level : maxLevel;
    }
    return maxLevel;
  }

  getNumbersMaxOfLevels(items: Node[]): number {
    return items.length > 0 ? this.currentMaxLevel(items, 1) : 0;
  }

  getNumberOfGroupLevel(item: Node): number {
    let maxLevel = 0;
    for (const element of item.item || []) {
      if (element.type === "group") {
        const level = this.getNumberOfGroupLevel(element);
        maxLevel = level > maxLevel ? level : maxLevel;
      }
    }
    return maxLevel + 1;
  }

  // FIXME: Is LinkId instead of InternalId correct here?
  getItemNodeByInternalID(
    linkId: string,
    items: Node[] = [],
  ): Node | undefined {
    for (const element of items) {
      if (element.linkId === linkId) {
        return element;
      }
      const result = this.getItemNodeByInternalID(linkId, element.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  private objectKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  setConditionDependence(item: Node[] = [], rootItem: Node[] = []): void {
    for (const element of item) {
      if (element.item !== undefined) {
        this.setConditionDependence(element.item, rootItem);
      }
      if (element.enableWhen === null || element.enableWhen === undefined) {
        continue;
      }
      for (const enableWhen of element.enableWhen) {
        const itemToAppendCondition = this.getItemNodeByInternalID(
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
        const keysEnableWhen = this.objectKeys(enableWhen);
        const condition: Question = {};
        for (const key of keysEnableWhen) {
          condition[`__${key}`] = enableWhen[key];
        }
        condition.__linkId = element.linkId;
        condition.__text = element.text;
        itemToAppendCondition.__dependeceCondition.__questions.push(condition);
      }
    }
  }

  removeConditionDependence(item: Node[] = []): void {
    item.forEach((element) => {
      if (element.item) {
        this.removeConditionDependence(element.item);
      }
      if (element.__dependeceCondition) {
        delete element.__dependeceCondition;
      }
    });
  }
}

export const editorTools = new EditorTools();

// export { editorTools };