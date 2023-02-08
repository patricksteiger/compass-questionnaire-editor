import { i18n, defaultLanguage } from "../i18n";
import {
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  questionType,
} from "./constants";
import { v4 as uuidv4 } from "uuid";
import {
  Question,
  Item,
  Questionnaire,
  enableBehaviors,
  EnableBehavior,
} from "@/types";
import { isSupportedLanguage, Language } from "@/store";
import { editorTools } from "./editor";
import { itemTools } from "./item";
import { QuestionnaireBundle, QuestionnaireBundleEntry } from "./exportJson";

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
  private errorMessages: string[] = [];
  questionnaire: Questionnaire = defaultQuestionnaire();

  validateQuestionnaireResource(
    JSONFHIRQuestionnaire: Questionnaire,
  ): string[] {
    this.errorMessages = [];
    this.questionnaire = JSONFHIRQuestionnaire;
    this.resourceType(this.questionnaire);
    this.supportedLanguage(this.questionnaire);
    this.statusNode(this.questionnaire);
    this.identifier(this.questionnaire);
    this.items(this.questionnaire);
    return this.errorMessages;
  }

  private items(qre: Questionnaire): void {
    qre.item ??= [];
    this.getSortItems(qre);
    this.itemsNode(qre.item);
  }

  // FIXME: method setConditionDependence is not used?
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

  // TODO: validate that qre has item-property
  private getSortItems(jsonFile: Questionnaire): void {
    this.sortItems(jsonFile.item);
  }

  private validateItem(item: Item): void {
    this.addPropertiesNeededForGUIItemNode(item);
    //Validate if missing required fields of the Item
    this.itemNodeRequiredFields(item);

    //Error if there is more than 6 levels
    const linkIdLevel = editorTools.getLevelFromLinkID(item.linkId);
    if (linkIdLevel > MAX_ALLOWED_LEVELS) {
      const message = i18n.global.t(
        "messagesErrors.FHIRValidations.moreThan5Levels",
        { linkId: item.linkId },
      );
      this.errorMessages.push(message);
    }

    if (item.type === "group" && linkIdLevel > MAX_ALLOWED_LEVELS_FOR_GROUPS) {
      const message = i18n.global.t(
        "messagesErrors.FHIRValidations.exceededGroupLevel",
        { linkId: item.linkId },
      );
      this.errorMessages.push(message);
    }

    //Error no follow the linkId logic stucture
    if (item.linkId !== item.__linkId && item.linkId !== "") {
      const message = i18n.global.t("messagesErrors.FHIRValidations.linkId", {
        text: item.text,
        linkId: item.linkId,
        internalId: item.__linkId,
      });
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
        i18n.global.t(
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
        i18n.global.t("messagesErrors.FHIRValidations.nodeMissing", {
          node: "linkId",
          item: item,
        }),
      );
    }

    if (!item.type) {
      this.errorMessages.push(
        i18n.global.t("messagesErrors.FHIRValidations.nodeMissing", {
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
        i18n.global.t("messagesErrors.FHIRValidations.typeNodeNoValAllow", {
          linkId: item.linkId,
          type: item.type,
        }),
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
        ? questionType.open_choice.icon
        : questionType[item.type].icon;
  }

  private itemsNode(items: Item[]) {
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
    item.enableBehavior ??= undefined; // filter null
    if (item.enableWhen && item.enableWhen.length > 1) {
      if (!enableBehaviors.includes(item.enableBehavior as EnableBehavior)) {
        this.errorMessages.push(
          `If item has more than 1 conditions, enableBehavior can't be '${item.enableBehavior}' and has to be one of [${enableBehaviors}].`,
        );
      }
    } else {
      if (
        item.enableBehavior !== undefined &&
        !enableBehaviors.includes(item.enableBehavior as EnableBehavior)
      ) {
        this.errorMessages.push(
          `enableBehavior can't be '${item.enableBehavior}'; Has to be undefined or one of [${enableBehaviors}].`,
        );
      }
    }
    if (item.enableWhen === undefined) return;
    for (const enableWhen of item.enableWhen) {
      if (!enableWhen.question) {
        this.errorMessages.push(
          i18n.global.t("messagesErrors.FHIRValidations.nodeMissingItem", {
            node: "enableWhen.question",
            linkId: item.linkId,
          }),
        );
      }
      if (!enableWhen.operator) {
        this.errorMessages.push(
          i18n.global.t("messagesErrors.FHIRValidations.nodeMissingItem", {
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
          i18n.global.t("messagesErrors.FHIRValidations.nodeMissingItem", {
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
        i18n.global.t("messagesErrors.FHIRValidations.nodeMissing", {
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
        i18n.global.t("messagesErrors.FHIRValidations.posiblesValues", {
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
      const message = i18n.global.t(
        "messagesErrors.FHIRValidations.languageMissing",
      );
      this.errorMessages.push(message);
    } else if (!isSupportedLanguage(qre.language)) {
      const message = i18n.global.t(
        "messagesErrors.FHIRValidations.unsupportedLanguage",
        { language: qre.language },
      );
      this.errorMessages.push(message);
    }
  }

  private resourceType(FHIRobj: Questionnaire): void {
    if (!FHIRobj.resourceType) {
      const message = i18n.global.t(
        "messagesErrors.FHIRValidations.nodeMissing",
        {
          node: "resourceType",
        },
      );
      this.errorMessages.push(message);
    } else if (FHIRobj.resourceType !== "Questionnaire") {
      const message = i18n.global.t(
        "messagesErrors.FHIRValidations.resourceImportedNoAllow",
        { resource: FHIRobj.resourceType },
      );
      this.errorMessages.push(message);
    }
  }
}

const generalValidations = {
  //Validata that is a right JSON Structure
  json(jsonFileString: string): object {
    try {
      return JSON.parse(jsonFileString);
    } catch (error: any) {
      const message = `${i18n.global.t(
        "messagesErrors.GeneralJSONValidations.NoJSONFILEStructure",
      )}
      ${error.message}`;
      throw new GeneralJSONValidationException(message);
    }
  },
  parseJson(jsonFile: string | ArrayBuffer | null): object {
    if (jsonFile === null || typeof jsonFile !== "string") {
      throw new GeneralJSONValidationException(
        i18n.global.t(
          "messagesErrors.GeneralJSONValidations.jsonFileIsNotString",
        ),
      );
    }
    return this.json(jsonFile);
  },
};

const FHIRValidations = new FHIRValidation();

export const importJsonQuestionnaire = {
  validateJson(jsonFile: string | ArrayBuffer | null): object {
    return generalValidations.parseJson(jsonFile);
  },
  validateQuestionnaire(
    jsonFile: object,
  ): [Questionnaire | undefined, string[]] {
    const errorMessages = this.validateQuestionnaireResource(jsonFile);
    return [
      errorMessages.length === 0 ? FHIRValidations.questionnaire : undefined,
      errorMessages,
    ];
  },
  validateBundle(jsonFile: object): [Questionnaire[] | undefined, string[]] {
    const errorMessages: string[] = [];
    const result = this.validateBundleResource(
      jsonFile as QuestionnaireBundle,
      errorMessages,
    );
    return [result, errorMessages];
  },
  isQuestionnaireResource(resource: object): boolean {
    return (resource as any).resourceType === "Questionnaire";
  },
  isBundleResource(resource: object): boolean {
    return (resource as any).resourceType === "Bundle";
  },
  validateQuestionnaireResource(jsonFile: object): string[] {
    const errors = FHIRValidations.validateQuestionnaireResource(
      jsonFile as Questionnaire,
    );
    return errors;
  },
  validateBundleResource(
    jsonBundle: QuestionnaireBundle,
    errorMessages: string[],
  ): Questionnaire[] | undefined {
    const initLength = errorMessages.length;
    if (jsonBundle.resourceType !== "Bundle") {
      errorMessages.push(
        `Bundle has wrong resource type: ${jsonBundle.resourceType}.`,
      );
    }
    if (jsonBundle.type !== "collection") {
      errorMessages.push(`Bundle has wrong type: ${jsonBundle.type}.`);
    }
    if (!jsonBundle.entry || !Array.isArray(jsonBundle.entry)) {
      errorMessages.push(
        `Bundle has invalid entry. Must to be non-empty array.`,
      );
    }
    return initLength === errorMessages.length
      ? validateBundleEntries(jsonBundle.entry, errorMessages)
      : undefined;
  },
};

function validateBundleEntries(
  entries: QuestionnaireBundleEntry[],
  errorMessages: string[],
): Questionnaire[] | undefined {
  if (entries.length === 0) {
    errorMessages.push("Bundle has no entries.");
    return undefined;
  }
  let noError = true;
  for (let i = 0; i < entries.length; i++) {
    const resource = entries[i].resource;
    if (!resource) {
      errorMessages.push(
        `Bundle entry at index ${i} does not have a defined resource.`,
      );
      noError = false;
    } else if (typeof resource !== "object" || Array.isArray(resource)) {
      errorMessages.push(`Bundle entry at index ${i} is not an object.`);
      noError = false;
    }
  }
  return noError
    ? validateQuestionnaireEntries(
        entries.map((e) => e.resource),
        errorMessages,
      )
    : undefined;
}

function validateQuestionnaireEntries(
  entries: Questionnaire[],
  errorMessages: string[],
): Questionnaire[] | undefined {
  const usedLanguages: Language[] = [];
  for (const entry of entries) {
    const errors = FHIRValidations.validateQuestionnaireResource(entry);
    if (usedLanguages.includes(entry.language)) {
      errors.push(
        `Languages can't be used multiple times. Duplicate: ${entry.language}.`,
      );
    } else {
      usedLanguages.push(entry.language);
    }
    if (errors.length !== 0) {
      errorMessages.push(...errors);
      return undefined;
    }
  }
  const startLength = errorMessages.length;
  for (let i = 1; i < entries.length; i++) {
    validateItemStructure(entries[i - 1].item, entries[i].item, errorMessages);
    if (startLength !== errorMessages.length) {
      return undefined;
    }
  }
  return entries;
}

function validateItemStructure(
  qre1: Item[] | undefined,
  qre2: Item[] | undefined,
  errorMessages: string[],
): void {
  if (!qre1 && !qre2) return;
  if (!qre1 || !qre2) {
    errorMessages.push("Can't have undefined items if others are defined.");
    return;
  }
  if (qre1.length !== qre2.length) {
    errorMessages.push("All Items need to have the same length");
    return;
  }
  for (let i = 0; i < qre1.length; i++) {
    validateItem(qre1[i], qre2[i], errorMessages);
  }
}

function validateItem(item1: Item, item2: Item, errorMessages: string[]): void {
  if (item1.linkId !== item2.linkId) {
    errorMessages.push(
      `LinkIDs '${item1.linkId} and ${item2.linkId}' are incompatible.`,
    );
    return;
  }
  if (item1.type !== item2.type) {
    errorMessages.push(
      `Types '${item1.type}' and '${item2.type}' are incompatible.`,
    );
    return;
  }
  validateItemStructure(item1.item, item2.item, errorMessages);
}
