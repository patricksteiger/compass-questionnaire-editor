import { i18n, defaultLanguage } from "../i18n";
import {
  answerType,
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  questionType,
} from "./constants";
import { v4 as uuidv4 } from "uuid";
import { Question, Item, Questionnaire } from "@/types";
import { isSupportedLanguage } from "@/store";
import { editorTools } from "./editor";
import { itemTools } from "./item";

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

class GeneralJSONValidationException extends Exception {
  constructor(message: string) {
    super("GeneralJSONValidationException", message);
  }
}

/* Function Validations */
const defaultQuestionnaire = (): Questionnaire => ({
  language: defaultLanguage,
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

  validateFHIRResourceItems(JSONFHIRQuestionnaire: Questionnaire) {
    this.errorMessages = [];
    this.questionnaire = this.getSortItems(JSONFHIRQuestionnaire);
    this.resourceType(this.questionnaire);
    this.supportedLanguage(this.questionnaire);
    this.statusNode(this.questionnaire);
    this.identifier(this.questionnaire);
    this.itemsNode(this.questionnaire.item);
  }

  setConditionDependence(items: Item[] = []): void {
    for (const item of items) {
      this.setConditionDependence(item.item);
      if (item.enableWhen === undefined) continue;
      if (item.enableWhen === null) {
        item.enableWhen = undefined;
        continue;
      }
      for (const enableWhen of item.enableWhen) {
        const itemToAppendCondition = this.getItemNodeByLinkID(
          enableWhen.question,
          this.questionnaire.item,
        );
        if (itemToAppendCondition === undefined) continue;
        itemToAppendCondition.__dependenceCondition ??= {
          __icon: "account_tree",
          __questions: [],
          __linkId: "",
          __text: "",
        };
        const question: Question = {
          __linkId: item.linkId,
          __text: item.text,
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

  private getItemNodeByLinkID(
    linkId: string,
    item: Item[] = [],
  ): Item | undefined {
    for (const element of item) {
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

  private sortByLinkId(i1: Item, i2: Item): number {
    const nums1 = i1.linkId.split(".");
    const nums2 = i2.linkId.split(".");
    const last1 = nums1.at(-1);
    const last2 = nums2.at(-1);
    if (last1 === undefined && last2 === undefined) return 0;
    if (last1 === undefined) return -1;
    if (last2 === undefined) return 1;
    return parseInt(last1) - parseInt(last2);
  }

  private sortItems(items: Item[]): void {
    items.sort(this.sortByLinkId);
    for (const item of items) {
      if (item.item !== undefined) {
        this.sortItems(item.item);
      }
    }
  }

  private getSortItems(jsonFile: Questionnaire): Questionnaire {
    if (jsonFile.item !== undefined) {
      this.sortItems(jsonFile.item);
    }
    return jsonFile;
  }

  private validateItem(item: Item): void {
    this.addPropertiesNeededForGUIItemNode(item);
    //Validate if missing required fields of the Item
    this.itemNodeRequiredFields(item);

    //Error if there is more than 6 levels
    const linkIdLevel = editorTools.getLevelFromLinkID(item.linkId);
    if (linkIdLevel > MAX_ALLOWED_LEVELS) {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.moreThan5Levels",
        { linkId: item.linkId },
      );
      this.errorMessages.push(message);
    }

    if (item.type === "group" && linkIdLevel > MAX_ALLOWED_LEVELS_FOR_GROUPS) {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.exceededGroupLevel",
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
      this.errorMessages.push(message);
    }

    //format Answer
    if (item.answerOption) {
      let idCountAnswer = 0;
      for (const answerOpt of item.answerOption) {
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
      }
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

  private validateItems(item: Item): void {
    if (item.item === undefined) return;
    let idCount = 0;
    for (const element of item.item) {
      idCount++;
      element.__internalID = itemTools.createInternalId();
      element.__linkId = item.linkId + "." + idCount;
      this.validateItem(element);
      //deep inside no more that 5 levels
      const level = editorTools.getLevelFromLinkID(element.__linkId);
      if (level <= MAX_ALLOWED_LEVELS) {
        this.validateItems(element);
      }
    }
  }

  private itemNodeRequiredFields(item: Item) {
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
      item.extension ??= [];
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

  private addPropertiesNeededForGUIItemNode(item: Item) {
    item.__active = true;
    item.__disabled = false;
    item.__oldText = item.text;
    item.__icon =
      item.type === "open-choice"
        ? this.questionType.open_choice.icon
        : this.questionType[item.type].icon;
  }

  private itemsNode(items: Item[] = []) {
    let idCount = 0;
    for (const item of items) {
      idCount++;
      //assign ID Item internal
      item.__internalID = itemTools.createInternalId();

      item.__linkId = idCount.toString();
      this.validateItem(item);
      this.validateItems(item);
    }
  }

  private validateEnableWhen(item: Item): void {
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

  private statusNode(FHIRobj: Questionnaire): void {
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

  private identifier(FHIRobj: Questionnaire): void {
    FHIRobj.identifier ??= [];
    for (const id of FHIRobj.identifier) {
      id.use ??= "";
      id.system ??= "";
      id.value ??= "";
      id.period ??= { start: "", end: "" };
      id.type ??= {
        coding: {
          system: "",
          version: "",
          code: "",
          display: "",
          userSelected: false,
        },
        text: "",
      };
    }
  }

  private supportedLanguage(qre: Questionnaire): void {
    if (!qre.language) {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.languageMissing",
      );
      this.errorMessages.push(message);
    } else if (!isSupportedLanguage(qre.language)) {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.unsupportedLanguage",
        { language: qre.language },
      );
      this.errorMessages.push(message);
    }
  }

  private resourceType(FHIRobj: Questionnaire): void {
    if (!FHIRobj.resourceType) {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.nodeMissing",
        {
          node: "resourceType",
        },
      );
      this.errorMessages.push(message);
    } else if (FHIRobj.resourceType !== "Questionnaire") {
      const message = this.i18n.global.t(
        "messagesErrors.FHIRValidations.resourceImportedNoAllow",
        { resource: FHIRobj.resourceType },
      );
      this.errorMessages.push(message);
    }
  }
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
  parseJson(jsonFile: string | ArrayBuffer | null): object {
    if (jsonFile === null || typeof jsonFile !== "string") {
      throw new GeneralJSONValidationException(
        this.i18n.global.t(
          "messagesErrors.GeneralJSONValidations.jsonFileIsNotString",
        ),
      );
    }
    return this.json(jsonFile);
  },
};

const FHIRValidations = new FHIRValidation();

const importJsonQuestionnaire = {
  from(
    jsonFile: string | ArrayBuffer | null,
  ): [Questionnaire | undefined, string[]] {
    FHIRValidations.errorMessages = [];
    const result = generalValidations.parseJson(jsonFile);
    const errorMessages = this.getValidateFHIRResource(result);
    return [
      errorMessages.length === 0 ? FHIRValidations.questionnaire : undefined,
      errorMessages,
    ];
  },
  getValidateFHIRResource(jsonFile: object) {
    FHIRValidations.validateFHIRResourceItems(jsonFile as Questionnaire);
    const errors = FHIRValidations.errorMessages;
    return errors;
  },
};

export { importJsonQuestionnaire };
