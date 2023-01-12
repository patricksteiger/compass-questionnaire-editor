import { i18n } from "../i18n";
import {
  answerType,
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  questionType,
} from "./constants";
import { v4 as uuidv4 } from "uuid";
import { Question, Item } from "@/types";
import { Questionnaire } from "@/store";

/* Error Exceptions obj */
/*function QuestionnaireValidationException(message) {
  this.message = message;
  this.name = "QuestionnaireValidationException";
}

QuestionnaireValidationException.prototype.toString = function () {
  return `${this.name}: "${this.message}"`;
};*/

abstract class Exception {
  private name: string;
  private message: string;

  constructor(name: string, message: string) {
    this.name = name;
    this.message = message;
  }

  toString() {
    return `${this.name}: "${this.message}"`;
  }
}

class FHIRValidationException extends Exception {
  constructor(message: string) {
    super("FHIRValidationException", message);
  }
}

class GeneralJSONValidationException extends Exception {
  constructor(message: string) {
    super("GeneralJSONValidationException", message);
  }
}

/* Function Validations */
const defaultQuestionnaire = (): Questionnaire => ({
  status: "unknown",
  item: [],
  resourceType: "Questionnaire",
});

class FHIRValidation {
  errorMessages: string[] = [];
  questionnaire: Questionnaire = defaultQuestionnaire();
  i18n = i18n;
  answerType = answerType;
  questionType = questionType;

  // TODO: Refactor import/validation? File = Questionnaire?
  validateFHIRResourceItems(JSONFHIRQuestionnaire: Questionnaire) {
    this.errorMessages = [];
    this.questionnaire =
      this.getSortItems(JSONFHIRQuestionnaire) || defaultQuestionnaire();
    this.statusNode(this.questionnaire);
    this.identifier(this.questionnaire);
    this.itemsNode(this.questionnaire.item);
  }

  private objectKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  setConditionDependence(items: Item[] = []): void {
    for (const item of items) {
      this.setConditionDependence(item.item);
      if (item.enableWhen === undefined) continue;
      // FIXME: Should enableWhen === null be allowed?
      for (const enableWhen of item.enableWhen) {
        const itemToAppendCondition = this.getItemNodeByInternalID(
          enableWhen.question,
          this.questionnaire.item,
        );
        if (itemToAppendCondition !== undefined) {
          itemToAppendCondition.__dependeceCondition ??= {
            __icon: "account_tree",
            __questions: [],
            __linkId: "",
            __text: "",
          };
          const keysEnableWhen = this.objectKeys(enableWhen);
          const condition: Question = {
            __question: "",
          };
          for (const key of keysEnableWhen) {
            if (key === "answerCoding") {
              condition[`__${key}`] = enableWhen[key];
            } else if (key === "answerInteger" || key === "answerDecimal") {
              condition[`__${key}`] = enableWhen[key];
            } else if (key === "answerBoolean") {
              condition[`__${key}`] = enableWhen[key];
            } else if (key === "question") {
              condition[`__${key}`] = enableWhen[key];
            } else {
              condition[`__${key}`] = enableWhen[key];
            }
          }
          condition.__linkId = item.linkId;
          condition.__text = item.text;
          itemToAppendCondition.__dependeceCondition.__questions.push(
            condition,
          );
        }
      }
    }
  }

  // FIXME: Why is it called InternalId but using linkId?
  getItemNodeByInternalID(linkId: string, item: Item[] = []): Item | undefined {
    for (const element of item) {
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

  // TODO: Is new sortByLinkId accurate?
  sortByLinkId(i1: Item, i2: Item): number {
    const nums1 = i1.linkId.split(".");
    const nums2 = i2.linkId.split(".");
    const last1 = nums1.at(-1);
    const last2 = nums2.at(-1);
    if (last1 === undefined && last2 === undefined) return 0;
    if (last1 === undefined) return -1;
    if (last2 === undefined) return 1;
    return parseInt(last1) - parseInt(last2);
  }

  sortItems(items: Item[]): void {
    items.sort(this.sortByLinkId);
    for (const item of items) {
      if (item.item !== undefined) {
        this.sortItems(item.item);
      }
    }
  }

  getSortItems(jsonFile: Questionnaire): Questionnaire | undefined {
    if (jsonFile.item === undefined) return undefined;
    this.sortItems(jsonFile.item);
    return jsonFile;
  }

  validateItem(item: Item): void {
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

    if (item.type === "group" && linkIdLevel > MAX_ALLOWED_LEVELS_FOR_GROUPS) {
      const message = `LinkId ${item.linkId}: Group-level can't exceed ${MAX_ALLOWED_LEVELS_FOR_GROUPS}`;
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
      // FIXME: errorMessages or Exceptions? (unused Exception earlier)
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
          answerOpt.valueCoding.code ??= "";
          answerOpt.valueCoding.display ??= "";
          answerOpt.valueCoding.system ??= "";
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

  validateItems(item: Item): void {
    if (item.item === undefined) return;
    let idCount = 0;
    for (const element of item.item) {
      idCount++;
      element.__internalID = `${uuidv4()}-${Date.now()}`;
      element.__linkId = item.linkId + "." + idCount;
      this.validateItem(element);
      //deep inside no more that 5 levels
      if (
        element.item &&
        element.__linkId.split(".").length <= MAX_ALLOWED_LEVELS
      ) {
        this.validateItems(element);
      }
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

    this.validateEnableWhen(item);

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
        const index = item.extension.findIndex((e) => e.url === url);
        if (index === -1) {
          item.extension.splice(targetIdx, 0, {
            url,
            ["value" + type]: type === "String" ? "" : undefined,
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

      element.__linkId = idCount.toString();
      this.validateItem(element);
      if (element.item) {
        this.validateItems(element);
      }
    });
  }

  validateEnableWhen(item: Item): void {
    if (item.enableWhen === undefined) return;
    for (const enableWhen of item.enableWhen) {
      if (!enableWhen.question) {
        this.errorMessages.push(
          this.i18n.global.t("messagesErrors.FHIRValidations.nodeMissingItem", {
            node: "enableWhen.question",
            linkId: item.linkId,
          }),
        );
      }
      if (!enableWhen.operator) {
        this.errorMessages.push(
          this.i18n.global.t("messagesErrors.FHIRValidations.nodeMissingItem", {
            node: "enableWhen.operator",
            linkId: item.linkId,
          }),
        );
      }
      //missing  answer
      if (
        enableWhen.answerDecimal === undefined &&
        enableWhen.answerInteger === undefined &&
        enableWhen.answerCoding === undefined && //openChoice || choice
        enableWhen.answerDate === undefined &&
        enableWhen.answerBoolean === undefined &&
        enableWhen.answerString === undefined
      ) {
        this.errorMessages.push(
          this.i18n.global.t("messagesErrors.FHIRValidations.nodeMissingItem", {
            node: "enableWhen.answer[x]",
            linkId: item.linkId,
          }),
        );
      }

      if (enableWhen.answerDecimal) {
        enableWhen.answer = enableWhen.answerDecimal.toString();
        enableWhen.type = "decimal";
      }
      if (enableWhen.answerInteger) {
        enableWhen.answer = enableWhen.answerInteger.toString();
        enableWhen.type = "integer";
      }
      if (enableWhen.answerCoding) {
        enableWhen.answer = enableWhen.answerCoding.code;
        enableWhen.type = "choice";
        enableWhen.display = enableWhen.answerCoding.display;
        enableWhen.system = enableWhen.answerCoding.system;
      }
      if (enableWhen.answerDate) {
        enableWhen.answer = enableWhen.answerDate;
        enableWhen.type = "date";
      }
      if (enableWhen.answerBoolean !== undefined) {
        enableWhen.answer = enableWhen.answerBoolean ? "true" : "false";
        enableWhen.type = "boolean";
      }
      if (enableWhen.answerString) {
        enableWhen.answer = enableWhen.answerString;
        enableWhen.type = "string";
      }
    }
  }

  statusNode(FHIRobj: Questionnaire): void {
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

  identifier(FHIRobj: Questionnaire): void {
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
  json(jsonFileString: string): object {
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

  from(
    jsonFile: string | ArrayBuffer | null,
  ): [Questionnaire | undefined, string[]] {
    this.FHIRValidations.errorMessages = [];
    const result = this.parseJson(jsonFile);
    const errorMessages = this.getValidateFHIRResource(result);
    this.FHIRValidations.errorMessages = [];
    return [
      errorMessages.length === 0 ? this.getQuestionnaireGUI() : undefined,
      errorMessages,
    ];
  },
  parseJson(jsonFile: string | ArrayBuffer | null): object {
    if (jsonFile === null || typeof jsonFile !== "string") {
      // TODO: i18n error message
      throw new GeneralJSONValidationException("jsonFile is not a string");
    }
    return this.generalValidations.json(jsonFile);
  },
  getValidateFHIRResource(jsonFile: object) {
    this.FHIRValidations.validateFHIRResourceItems(jsonFile as Questionnaire);
    const errors = this.FHIRValidations.errorMessages;
    return errors;
  },
  getQuestionnaireGUI() {
    return this.FHIRValidations.questionnaire;
  },
};

export { importJsonQuestionnaire };
