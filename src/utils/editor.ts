import { questionTypesIcons, questionTypes, answerType } from "./constants";
import { v4 as uuidv4 } from "uuid";

type QuestionType =
  | "group"
  | "string"
  | "choice"
  | "boolean"
  | "date"
  | "open-choice"
  | "integer"
  | "decimal";

type EnableWhen = {
  question: string;
};

type Answer = {
  text: string;
  type: string;
};

type Coding = {
  code: string;
  system: string;
  display: string;
};

type AnswerOption = {
  __id: number;
  __type: string;
  __icon: string;
  __newAnswer: boolean;
  valueCoding?: Coding;
  valueString?: string;
};

type Extension = {
  url: string;
  valueInteger?: number | null;
  valueString?: string;
};

type Condition = {
  __icon: string;
  __questions: string[];
  __linkId: string;
  __text: string;
};

type Node = {
  __active: boolean;
  __icon: string;
  __internalID: string;
  __linkId: string;
  __newQuestion: boolean;
  __dependeceCondition?: Condition;
  disabled: boolean;
  item: Node[] | undefined;
  linkId: string;
  type: string;
  enableWhen: EnableWhen[] | null;
  text: string;
  definition: string;
  answerOption: AnswerOption[];
  __OldAnswerValueSet: string;
  answerValueSet: string;
  __answerValueSetCheck: boolean;
  extensions: Extension[];
};

const defaultNode: Node = {
  __active: true,
  __icon: "",
  __internalID: "",
  __linkId: "",
  __newQuestion: true,
  disabled: true,
  item: undefined,
  linkId: "",
  type: "",
  enableWhen: null,
  text: "",
  definition: "",
  answerOption: [],
  __OldAnswerValueSet: "",
  answerValueSet: "",
  __answerValueSetCheck: false,
  extensions: [],
};

class EditorTools {
  answerType = answerType;
  questionTypes = questionTypes;
  questionTypesIcons = questionTypesIcons;
  currentQuestionNodeByID: Node = defaultNode;
  currentQuestionNodeByLinkId: Node = defaultNode;

  getIndexItem(internalIDToBeRemove: string, arrayQuestions: Node[]) {
    let indexOfItemtoBeRemoved = 1;
    arrayQuestions.forEach((element: Node, index: number) => {
      if (element.__internalID === internalIDToBeRemove) {
        indexOfItemtoBeRemoved = index;
      }
    });
    return indexOfItemtoBeRemoved;
  }

  // TODO: What is type of event from onDrop in cxEditorItems
  getInternalIDFromEhandler(e: any) {
    return e.currentTarget.id.split("_").length > 1
      ? e.currentTarget.id.split("_")[1]
      : e.currentTarget.id;
  }

  // TODO: What is type of event from onDrop in cxEditorItems
  isPreviousQuestion(e: any) {
    //if with prefix _ means that id has been dragged before the item question
    return e.currentTarget.id.split("_").length == 2 ? true : false;
  }

  assingNewItemInternalIDs(item: Node) {
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

  assingNewItemIDs(item: Node) {
    if (item.item) {
      let changedIdMap = new Map();
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
  }

  regenerateInternalIDs(item: Node[]) {
    let idCount = 0;
    item.forEach((element) => {
      idCount++;
      element.__linkId = idCount + "";
      if (element.item) {
        this.assingNewItemInternalIDs(element);
      }
    });
  }

  regenerateLinkIds(item?: Node[]) {
    let idCount = 0;
    let changedIdMap = new Map<string, string>();
    if (item) {
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
    }
    return changedIdMap;
  }

  regenerateConditionWhenIds(
    item: Node[] | undefined,
    changedIdMap: Map<string, string>,
  ) {
    if (item) {
      item.forEach((element) => {
        if (element.type === "group") {
          this.regenerateConditionWhenIds(element.item, changedIdMap);
        }

        if (element.enableWhen != null) {
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
  }

  isEnableWhenCondition(item: Node[], linkId: string) {
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

  disableItem(item: Node, toggleValue: boolean) {
    if (item.item) {
      item.item.forEach((element) => {
        element.__active = toggleValue;
        this.disableItem(element, toggleValue);
      });
    }
    item.disabled = !toggleValue;
    item.__active = toggleValue;
  }

  getArraySource(internalId: string, rootItem: Node[]) {
    let parentArrayItem: Node[] = [];
    function getArray(internalId: string, currentNode: Node[]) {
      const currentItemFound = currentNode.find(
        (element: any) => element.__internalID === internalId,
      );
      if (currentItemFound) {
        parentArrayItem = currentNode;
        return;
      }
      if (parentArrayItem.length === 0) {
        //if not parent array Founded iterate
        currentNode.forEach((element: any) => {
          if (element.item) {
            getArray(internalId, element.item);
          }
        });
      }
    }
    getArray(internalId, rootItem);
    return parentArrayItem;
  }

  private getQuestionNodeByID(internalId: string, rootItem: Node[] = []) {
    rootItem.forEach((element: Node) => {
      if (element.item) {
        this.getQuestionNodeByID(internalId, element.item);
      }
      if (element.__internalID === internalId) {
        this.currentQuestionNodeByID = element;
      }
    });
  }

  getCurrentQuestionNodeByID(internalId: string, rootItem: Node[] = []) {
    this.currentQuestionNodeByID = defaultNode;
    this.getQuestionNodeByID(internalId, rootItem);
    return this.currentQuestionNodeByID;
  }

  getQuestionNodeByLinkId(linkId: string, rootItem: Node[] = []) {
    rootItem.forEach((element) => {
      if (element.item) {
        this.getQuestionNodeByLinkId(linkId, element.item);
      }
      if (element.linkId === linkId) {
        this.currentQuestionNodeByLinkId = element;
      }
    });
  }

  getCurrentQuestionNodeByLinkId(linkId: string, rootItem: Node[] = []) {
    this.currentQuestionNodeByLinkId = defaultNode;
    this.getQuestionNodeByLinkId(linkId, rootItem);
    return this.currentQuestionNodeByLinkId;
  }

  disableEntireItemQuestion(id: string, rootItem: Node[]) {
    const oItemQuestionTodisabled = this.getCurrentQuestionNodeByID(
      id,
      rootItem,
    );

    if (Object.entries(oItemQuestionTodisabled).length === 0) {
      return;
    }
    if (oItemQuestionTodisabled.disabled) {
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

  getTypeQuestionIcon(type: QuestionType) {
    const icon = this.questionTypesIcons.find((item) => {
      return item.name === type;
    });
    return icon;
  }

  getNewAnswerValueCoding(answer: Answer, arrayAnswers: AnswerOption[] = []) {
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

  getNewAnswerValueString(answer: Answer, arrayAnswers: AnswerOption[] = []) {
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

  //typeQuestion-> group /string / choice / boolean /date /open-choice
  // integer/decimal
  getTypeObjQuestion(typeQuestion: QuestionType) {
    const questionTypeIcon = this.getTypeQuestionIcon(typeQuestion);
    const item: Node = {
      ...defaultNode,
      text: "",
      type: typeQuestion,
      __icon: questionTypeIcon?.icon || "",
      __active: true,
      disabled: false,
      __newQuestion: true,
      __internalID: `${uuidv4()}-${Date.now()}`,
      definition: uuidv4(),
    };
    if (
      questionTypeIcon?.name === this.questionTypes.choice ||
      questionTypeIcon?.name === this.questionTypes.openChoice
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

  getIndexAnswer(internalIDToBeRemove: number, arrayAnswers: AnswerOption[]) {
    let indexOfItemtoBeRemoved = 1;
    arrayAnswers.forEach((element, index) => {
      if (element.__id === internalIDToBeRemove) {
        indexOfItemtoBeRemoved = index;
      }
    });
    return indexOfItemtoBeRemoved;
  }

  getNextID(currentID: string) {
    const acurrentID = currentID.split(".");
    const nextID = 1 + acurrentID.slice(-1)[0];
    acurrentID.pop();
    acurrentID.push(nextID);
    return acurrentID.join(".");
  }

  getNumbersMaxOfLevels(item: Node[]) {
    const getLevelNum = {
      level: 1,
      currentLevel: 1,
      getDeepLevel(item: Node[]) {
        item.forEach((element) => {
          if (element.item) {
            if (element.item.length > 0) {
              this.currentLevel++;
            }
            if (this.currentLevel >= this.level) {
              this.level = this.currentLevel;
            }
            this.getDeepLevel(element.item);
            this.currentLevel = 1;
          }
        });
      },
    };
    getLevelNum.getDeepLevel(item);
    return getLevelNum.level;
  }

  getItemNodeByInternalID(linkId: string, item: Node[] = []): Node | undefined {
    let itemSearched = undefined;

    const searchNodebyLinkId = (linkId: string, item: Node[]) => {
      item.forEach((element) => {
        if (element.item) {
          searchNodebyLinkId(linkId, element.item);
        }
        if (element.linkId === linkId) {
          itemSearched = element;
        }
      });
    };

    searchNodebyLinkId(linkId, item);

    return itemSearched;
  }

  setConditionDependence(item: Node[] = [], rootItem: Node[] = []) {
    const that = this;
    item.forEach((item) => {
      if (item.item) {
        this.setConditionDependence(item.item, rootItem);
      }
      if (item.enableWhen) {
        item.enableWhen.forEach((element) => {
          const itemToAppendCondintion = that.getItemNodeByInternalID(
            element.question,
            rootItem,
          );
          if (itemToAppendCondintion) {
            if (!itemToAppendCondintion.__dependeceCondition) {
              itemToAppendCondintion.__dependeceCondition = {
                __icon: "account_tree",
                __questions: [],
                __linkId: "",
                __text: "",
              };
            }
            const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
              return Object.keys(obj) as (keyof T)[];
            };
            const keysEnableWhen = objectKeys(element);
            // TODO: define type for condition
            const condition: any = {};
            for (const key in keysEnableWhen) {
              condition[`__${keysEnableWhen[key]}`] =
                element[keysEnableWhen[key]];
            }
            condition.__linkId = item.linkId;
            condition.__text = item.text;
            itemToAppendCondintion.__dependeceCondition.__questions.push(
              condition,
            );
          }
        });
      }
    });
  }

  removeCondionDependece(item: Node[] = []) {
    item.forEach((item) => {
      if (item.item) {
        this.removeCondionDependece(item.item);
      }
      if (item.__dependeceCondition) {
        delete item.__dependeceCondition;
      }
    });
  }
}

export const editorTools = new EditorTools();

// export { editorTools };
