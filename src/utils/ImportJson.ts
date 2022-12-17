import { i18n } from "../i18n";
import {
  answerType,
  MAX_ALLOWED_LEVELS,
  questionType,
  QuestionTypeIndex,
} from "./constants";
import { v4 as uuidv4 } from "uuid";

type Coding = {
  __oldDisplay: string | undefined;
  code: string | undefined;
  display: string | undefined;
  system: string | undefined;
  version: string | undefined;
  userSelected: boolean | undefined;
};

export type AnswerType =
  | "integer"
  | "decimal"
  | "date"
  | "boolean"
  | "string"
  | "choice"
  | "coding"
  | "open-choice";

type EnableWhen = {
  question: string;
  answer: string | undefined;
  operator: string;
  type: AnswerType;
  system: string | undefined;
  display: string | undefined;
  answerDecimal: string | undefined;
  answerInteger: string | undefined;
  answerCoding: Coding | undefined;
  answerDate: string | undefined;
  answerString: string | undefined;
  answerBoolean: string | undefined;
};

type Extension = {};

type AnswerOption = {
  __id: number;
  __type: string;
  __icon: string;
  __oldValueInteger: Number | undefined;
  __oldValueString: String | undefined;
  __oldValueDate: String | undefined;
  valueCoding: Coding | undefined;
  valueInteger: Number | undefined;
  valueString: String | undefined;
  valueDate: String | undefined;
};

type Identifier = {
  use: string | undefined;
  value: string | undefined;
  system: string | undefined;
  period: { start?: string; end?: string } | undefined;
  type: {
    coding: Coding;
    text: string | undefined;
  };
};

type Item = {
  __linkId: string;
  __internalID: string;
  __active: boolean;
  __answerValueSetCheck: boolean;
  __OldAnswerValueSet: ValueSet | undefined;
  __oldText: string;
  __newDefinition: boolean;
  __icon: string;
  item?: Item[];
  type: QuestionTypeIndex;
  linkId: string;
  text: string;
  disabled: boolean;
  definition: string | undefined;
  answerOption: AnswerOption[] | undefined;
  answerValueSet: ValueSet | undefined;
  enableWhen: EnableWhen[] | undefined;
  extension: Extension[] | undefined;
};

type ValueSet = {};

type State = "draft" | "active" | "retired" | "unknown";

type File = {
  status: State | undefined;
  item?: Item[];
  identifier: Identifier[] | undefined;
};

/* Error Exceptions obj */
/*function QuestionnaireValidationException(message) {
  this.message = message;
  this.name = "QuestionnaireValidationException";
}

QuestionnaireValidationException.prototype.toString = function () {
  return `${this.name}: "${this.message}"`;
};*/

class FHIRValidationException {
  private message: string;
  private name: string;

  constructor(message: string) {
    this.message = message;
    this.name = "FHIRValidationException";
  }
  toString() {
    return `${this.name}: "${this.message}"`;
  }
}

class GeneralJSONValidationException {
  private message: string;
  private name: string;

  constructor(message: string) {
    this.message = message;
    this.name = "GeneralJSONValidationException";
  }
  toString() {
    return `${this.name}: "${this.message}"`;
  }
}

/* Function Validations */

class FHIRValidation {
  errorMessages: string[] = [];
  questionnaire: File = {
    status: undefined,
    identifier: undefined,
  };
  i18n = i18n;
  answerType = answerType;
  questionType = questionType;

  validateFHIRResourceItems(JSONFHIRQuestionnaire: File) {
    this.errorMessages = [];
    this.questionnaire = this.getSortItems(JSONFHIRQuestionnaire) || {
      status: undefined,
      identifier: undefined,
    };
    this.statusNode(this.questionnaire);
    this.identifier(this.questionnaire);
    this.itemsNode(this.questionnaire.item);
  }

  setConditionDependence(item: any[] = []) {
    item.forEach((item) => {
      if (item.item) {
        this.setConditionDependence(item.item);
      }
      if (item.enableWhen) {
        item.enableWhen.forEach((element: any) => {
          const itemToAppendCondintion = this.getItemNodeByInternalID(
            element.question,
            this.questionnaire.item,
          );
          if (itemToAppendCondintion) {
            if (!itemToAppendCondintion.__dependeceCondition) {
              itemToAppendCondintion.__dependeceCondition = {
                __icon: "account_tree",
                __questions: [],
              };
            }
            const keysEnableWhen = Object.keys(element);
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

  getItemNodeByInternalID(linkId: string, item: any[] = []) {
    let itemSearched: any;

    const searchNodebyLinkId = function (linkId: string, item: any[]) {
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

  sortByLinkId(i1: Item, i2: Item) {
    const nums1 = i1.linkId.split(".");
    const nums2 = i2.linkId.split(".");
    const last1 = nums1.at(-1);
    const last2 = nums2.at(-1);
    if (last1 === undefined && last2 === undefined) return 0;
    if (last1 === undefined) return -1;
    if (last2 === undefined) return 1;
    return parseInt(last1) - parseInt(last2);
    // return function (a: Item, b: Item) {
    //   if (
    //     parseInt(a[property].split(".")[a[property].split(".").length - 1]) >
    //     parseInt(b[property].split(".")[b[property].split(".").length - 1])
    //   )
    //     return 1;
    //   else if (
    //     parseInt(a[property].split(".")[a[property].split(".").length - 1]) <
    //     parseInt(b[property].split(".")[b[property].split(".").length - 1])
    //   )
    //     return -1;
    //
    //   return 0;
    // };
  }

  sortItems(item: Item[]) {
    item.sort(this.sortByLinkId);
    item.forEach((element) => {
      if (element.item) {
        this.sortItems(element.item);
      }
    });
  }

  getSortItems(jsonFile: File) {
    if (!jsonFile.item) return undefined;
    this.sortItems(jsonFile.item);
    return jsonFile;
  }

  validateItem(item: Item) {
    this.addPropertiesNeededtoGUIItemNode(item);
    //Validate if missing required fields of the Item
    this.itemNodeRequiredFields(item);

    //Error if there is more than 6 levels
    const linkIdLevel = item.linkId.split(".").length;
    if (linkIdLevel > MAX_ALLOWED_LEVELS) {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.moreThan5Levels",
        { linkId: item.linkId },
      );
      this.errorMessages.push(message);
    }

    //Error no follow the linkId logic stucture
    if (item.linkId !== item.__linkId && item.linkId !== "") {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.linkId",
        {
          text: item.text,
          linkId: item.linkId,
          internalId: item.__linkId,
        },
      );
      throw new FHIRValidationException(message);
      /* this.errorMessages.push(
        this.i18n.global.t("messagesErrors.FHIRValidations.linkId", {
          linkId: item.linkId,
          internalId: item.__linkId,
        })
      ); */
    }

    //format Answer
    if (item.answerOption) {
      let idCountAnswer = 0;
      item.answerOption.forEach((answerOpt) => {
        idCountAnswer++;
        answerOpt.__id = idCountAnswer;
        /*         if (answerOpt.valueString !== undefined) {
          answerOpt.__type = "open-choice";
          answerOpt.__icon = "input";
          answerOpt.__oldValueString = answerOpt.valueString;
        } */
        if (answerOpt.valueCoding) {
          answerOpt.__type = "coding";
          answerOpt.__icon = "radio_button_unchecked";
          answerOpt.valueCoding.__oldDisplay = answerOpt.valueCoding.display;
          if (answerOpt.valueCoding.code === undefined) {
            answerOpt.valueCoding.code = "";
          }
          if (answerOpt.valueCoding.display === undefined) {
            answerOpt.valueCoding.display = "";
          }
          if (answerOpt.valueCoding.system === undefined) {
            answerOpt.valueCoding.system = "";
          }
        }
        if (answerOpt.valueInteger) {
          answerOpt.__icon = "pin";
          answerOpt.__type = "integer";
          answerOpt.__oldValueInteger = answerOpt.valueInteger;
        }
        if (answerOpt.valueDate) {
          answerOpt.__icon = "event";
          answerOpt.__type = "date";
          answerOpt.__oldValueDate = answerOpt.valueDate;
        }
        if (answerOpt.valueString) {
          answerOpt.__icon = "text_fields";
          answerOpt.__type = "string";
          answerOpt.__oldValueString = answerOpt.valueString;
        }
      });
    }

    //AnswerValueSet
    if (item.answerOption && item.answerValueSet) {
      this.errorMessages.push(
        this.i18n.global.t(
          "messagesErrors.FHIRValidations.answerOptionAndValueSetNoAllow",
          {
            linkId: item.linkId,
          },
        ),
      );
    }
    if (item.answerValueSet) {
      item.__OldAnswerValueSet = item.answerValueSet;
      item.__answerValueSetCheck = true;
    } else {
      item.__OldAnswerValueSet = item.answerValueSet = "";
      item.__answerValueSetCheck = false;
    }

    //UUI
    if (!item.definition) {
      item.definition = uuidv4();
      item.__newDefinition = true;
    } else {
      item.__newDefinition = false;
    }
  }

  validateItems(item: Item) {
    if (item.item) {
      let idCount = 0;
      const that = this;
      item.item.forEach((element) => {
        idCount++;
        element.__internalID = `${uuidv4()}-${Date.now()}`;
        element.__linkId = item.linkId + "." + idCount;
        that.validateItem(element);
        //deep inside no more that 5 levels
        if (
          element.item &&
          element.__linkId.split(".").length <= MAX_ALLOWED_LEVELS
        ) {
          that.validateItems(element);
        }
      });
    }
  }

  itemNodeRequiredFields(item: Item) {
    //Error if missing required fields of the Item
    if (!item.linkId) {
      this.errorMessages.push(
        this.i18n.global.t("messagesErrors.FHIRValidations.nodeMissing", {
          node: "linkId",
          item: item,
        }),
      );
    }

    if (!item.type) {
      this.errorMessages.push(
        this.i18n.global.t("messagesErrors.FHIRValidations.nodeMissing", {
          node: "type",
          item: item,
        }),
      );
    }

    if (
      item.type !== "group" &&
      item.type !== "string" &&
      item.type !== "choice" &&
      item.type !== "boolean" &&
      item.type !== "date" &&
      item.type !== "open-choice" &&
      item.type !== "integer" &&
      item.type !== "decimal" &&
      item.type !== "display"
    ) {
      this.errorMessages.push(
        this.i18n.global.t(
          "messagesErrors.FHIRValidations.typeNodeNoValAllow",
          {
            linkId: item.linkId,
            type: item.type,
          },
        ),
      );
    }
    if (item.enableWhen) {
      this.validateEnableWhen(item);
    }

    if (item.type === "integer") {
      item.extension = item.extension || [];
      const extensionSet = [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue",
          targetIdx: 0,
          type: "Integer",
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/minValue",
          targetIdx: 1,
          type: "Integer",
        },
        {
          url: "https://num-compass.science/fhir/StructureDefinition/LowRangeLabel",
          targetIdx: 2,
          type: "String",
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/maxValue",
          targetIdx: 3,
          type: "Integer",
        },
        {
          url: "https://num-compass.science/fhir/StructureDefinition/HighRangeLabel",
          targetIdx: 4,
          type: "String",
        },
      ] as const;

      for (const { url, targetIdx, type } of extensionSet) {
        const index = item.extension.findIndex((e: any) => e.url === url);
        if (index === -1) {
          item.extension.splice(targetIdx, 0, {
            url,
            ["value" + type]: type === "String" ? "" : null,
          });
        } else {
          const element = item.extension[index];
          item.extension.splice(index, 1);
          item.extension.splice(targetIdx, 0, element);
        }
      }
    }
  }

  addPropertiesNeededtoGUIItemNode(item: Item) {
    item.__active = true;
    item.disabled = false;
    item.__oldText = item.text;
    item.__icon =
      item.type === "open-choice"
        ? this.questionType.open_choice.icon
        : this.questionType[item.type].icon;
  }

  itemsNode(item: Item[] = []) {
    let idCount = 0;
    item.forEach((element) => {
      idCount++;
      //assign ID Item internal
      element.__internalID = `${uuidv4()}-${Date.now()}`;

      element.__linkId = idCount + "";
      this.validateItem(element);
      if (element.item) {
        this.validateItems(element);
      }
    });
  }

  validateEnableWhen(item: Item) {
    const that = this;
    if (item.enableWhen) {
      item.enableWhen.forEach((element) => {
        if (!element.question) {
          that.errorMessages.push(
            that.i18n.global.t(
              "messagesErrors.FHIRValidations.nodeMissingItem",
              {
                node: "enableWhen.question",
                linkId: item.linkId,
              },
            ),
          );
        }
        if (!element.operator) {
          that.errorMessages.push(
            that.i18n.global.t(
              "messagesErrors.FHIRValidations.nodeMissingItem",
              {
                node: "enableWhen.operator",
                linkId: item.linkId,
              },
            ),
          );
        }
        //missing  answer
        if (
          element.answerDecimal === undefined &&
          element.answerInteger === undefined &&
          element.answerCoding === undefined && //openChoice || choice
          element.answerDate === undefined &&
          element.answerBoolean === undefined &&
          element.answerString === undefined
        ) {
          that.errorMessages.push(
            that.i18n.global.t(
              "messagesErrors.FHIRValidations.nodeMissingItem",
              {
                node: "enableWhen.answer[x]",
                linkId: item.linkId,
              },
            ),
          );
        }

        if (element.answerDecimal) {
          element.answer = element.answerDecimal;
          element.type = "decimal";
        }
        if (element.answerInteger) {
          element.answer = element.answerInteger;
          element.type = "integer";
        }
        if (element.answerCoding) {
          element.answer = element.answerCoding.code;
          element.type = "choice";
          element.display = element.answerCoding.display;
          element.system = element.answerCoding.system;
        }
        if (element.answerDate) {
          element.answer = element.answerDate;
          element.type = "date";
        }
        if (element.answerBoolean !== undefined) {
          element.answer = element.answerBoolean ? "true" : "false";
          element.type = "boolean";
        }
        if (element.answerString) {
          element.answer = element.answerString;
          element.type = "string";
        }
      });
    }
  }

  statusNode(FHIRobj: File) {
    if (!FHIRobj.status) {
      this.errorMessages.push(
        this.i18n.global.t("messagesErrors.FHIRValidations.nodeMissing", {
          node: "status",
        }),
      );
    }
    if (
      FHIRobj.status !== "draft" &&
      FHIRobj.status !== "active" &&
      FHIRobj.status !== "retired" &&
      FHIRobj.status !== "unknown"
    ) {
      this.errorMessages.push(
        this.i18n.global.t("messagesErrors.FHIRValidations.posiblesValues", {
          currentValue: FHIRobj.status,
          node: "status",
        }),
      );
    }
  }

  identifier(FHIRobj: File) {
    if (FHIRobj.identifier && FHIRobj.identifier.length > 0) {
      FHIRobj.identifier.forEach((id) => {
        id.use = id.use === undefined ? "" : id.use;
        id.system = id.system === undefined ? "" : id.system;
        id.value = id.value === undefined ? "" : id.value;
        id.period =
          id.period === undefined ? { start: "", end: "" } : id.period;
        id.type =
          id.type === undefined
            ? {
                coding: {
                  __oldDisplay: undefined,
                  system: "",
                  version: "",
                  code: "",
                  display: "",
                  userSelected: false,
                },
                text: "",
              }
            : id.type;
      });
    } else {
      FHIRobj.identifier = [];
    }
  }

  /*resourceType(FHIRobj: any) {
    if (!FHIRobj.resourceType) {
      return this.i18n.global.t("messagesErrors.FHIRValidations.nodeMissing", {
        node: "resourceType",
      });
    }
    if (FHIRobj.resourceType !== "Questionnaire") {
      return this.i18n.global.t(
        "messagesErrors.FHIRValidations.resourceImportedNoAllow",
        { resource: FHIRobj.resourceType },
      );
    }
  }*/
}

const generalValidations = {
  i18n: i18n,

  //Validata that is a right JSON Structure
  JSONValid(jsonFileString: string | ArrayBuffer | null = ""): object {
    if (typeof jsonFileString !== "string") {
      // TODO: i18n error message
      throw new GeneralJSONValidationException("jsonFile is not a string");
    }
    try {
      return JSON.parse(jsonFileString);
    } catch (error: any) {
      const message = `${this.i18n.global.t(
        "messagesErrors.GeneralJSONValidations.NoJSONFILEStructure",
      )}
      ${error.message}`;
      throw new GeneralJSONValidationException(message);
    }
  },
};

const questionnaireSpecific = {};

const importJsonQuestionnaire = {
  FHIRValidations: new FHIRValidation(),
  questionnaireSpecific: questionnaireSpecific,
  generalValidations: generalValidations,
  i18n: i18n,

  getValidateJSON(jsonFile: string | ArrayBuffer | null) {
    return this.generalValidations.JSONValid(jsonFile);
  },
  getValidateFHIRResource(jsonFile: object) {
    this.FHIRValidations.validateFHIRResourceItems(jsonFile as File);
    return this.FHIRValidations.errorMessages;
  },
  getQuestionnaireGUI() {
    return this.FHIRValidations.questionnaire;
  },
};

export { importJsonQuestionnaire };
