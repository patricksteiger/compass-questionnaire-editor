import { i18n, defaultLanguage } from "../i18n";
import {
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  getItemTypeIcon,
  isInvalidItemType,
  getAnswerOptionIcon,
} from "./constants";
import { Item, Questionnaire, enableBehaviors, EnableBehavior } from "@/types";
import { isSupportedLanguage, Language } from "@/store";
import { editorTools } from "./editor";
import { itemTools } from "./item";
import { QuestionnaireBundle, QuestionnaireBundleEntry } from "./exportJson";

class GeneralJSONValidationException {
  private readonly name = "GeneralJSONValidationException";
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  toString() {
    return `${this.name}: "${this.message}"`;
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

  private getSortItems(jsonFile: Questionnaire): void {
    this.sortItems(jsonFile.item);
  }

  private validateItem(item: Item): void {
    //Validate if missing required fields of the Item
    this.itemNodeRequiredFields(item);
    this.addPropertiesNeededForGUIItemNode(item);

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

    item.required ??= itemTools.getDefaultRequired(item.type);
    item.repeats ??= itemTools.getDefaultRepeats(item.type);
    if (item.type === "display") {
      if (item.item && item.item.length > 0) {
        const message = `Display-Item ${item.linkId} must not have children`;
        this.errorMessages.push(message);
      }
    } else {
      if (typeof item.required !== "boolean") {
        this.errorMessages.push(
          `Item ${item.linkId}: required has to be a boolean.`,
        );
      }
      if (typeof item.repeats !== "boolean") {
        this.errorMessages.push(
          `Item ${item.linkId}: repeats has to be a boolean.`,
        );
      }
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
        answerOpt.__id = idCountAnswer.toString();
        /*         if (answerOpt.valueString !== undefined) {
          answerOpt.__type = "open-choice";
          answerOpt.__icon = "input";
          answerOpt.__oldValueString = answerOpt.valueString;
        } */
        if (answerOpt.valueCoding) {
          answerOpt.__type = "coding";
          answerOpt.__icon = getAnswerOptionIcon(answerOpt.__type);
          answerOpt.valueCoding.code ??= "";
          answerOpt.valueCoding.display ??= "";
          answerOpt.valueCoding.system ??= "";
          answerOpt.__oldValueCoding = { ...answerOpt.valueCoding };
          answerOpt.__formattedValueCoding = editorTools.formatCoding(
            answerOpt.valueCoding,
          );
          answerOpt.__oldFormattedValueCoding =
            answerOpt.__formattedValueCoding;
        } else if (answerOpt.valueInteger) {
          answerOpt.__type = "integer";
          answerOpt.__icon = getAnswerOptionIcon(answerOpt.__type);
          answerOpt.__oldValueInteger = answerOpt.valueInteger;
        } else if (answerOpt.valueDate) {
          answerOpt.__type = "date";
          answerOpt.__icon = getAnswerOptionIcon(answerOpt.__type);
          answerOpt.__oldValueDate = answerOpt.valueDate;
        } else if (answerOpt.valueString) {
          answerOpt.__type = "string";
          answerOpt.__icon = getAnswerOptionIcon(answerOpt.__type);
          answerOpt.__oldValueString = answerOpt.valueString;
        } else if (answerOpt.valueTime) {
          answerOpt.__type = "time";
          answerOpt.__icon = getAnswerOptionIcon(answerOpt.__type);
          answerOpt.__oldValueTime = answerOpt.valueTime;
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
      delete item.definition;
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

    if (isInvalidItemType(item.type)) {
      this.errorMessages.push(
        i18n.global.t("messagesErrors.FHIRValidations.typeNodeNoValAllow", {
          linkId: item.linkId,
          type: item.type,
        }),
      );
    }

    this.validateEnableWhen(item);
  }

  private addPropertiesNeededForGUIItemNode(item: Item) {
    item.__active = true;
    item.__disabled = false;
    item.__oldText = item.text;
    item.__icon = getItemTypeIcon(item.type);
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
      // missing answer
      if (
        enableWhen.answerDecimal === undefined &&
        enableWhen.answerInteger === undefined &&
        enableWhen.answerCoding === undefined && // open-choice && choice
        enableWhen.answerDate === undefined &&
        enableWhen.answerBoolean === undefined &&
        enableWhen.answerString === undefined &&
        enableWhen.answerTime === undefined &&
        enableWhen.answerDateTime === undefined
      ) {
        this.errorMessages.push(
          i18n.global.t("messagesErrors.FHIRValidations.nodeMissingItem", {
            node: "enableWhen.answer[x]",
            linkId: item.linkId,
          }),
        );
      }

      // FIXME: get type from linkId. exist maps to type boolean
      if (enableWhen.answerDecimal) {
        enableWhen.__answer = enableWhen.answerDecimal.toString();
        enableWhen.__type = "decimal";
      }
      if (enableWhen.answerInteger) {
        enableWhen.__answer = enableWhen.answerInteger.toString();
        enableWhen.__type = "integer";
      }
      // FIXME: When can answerCoding be the type?
      if (enableWhen.answerCoding) {
        enableWhen.__answer = enableWhen.answerCoding.code;
        enableWhen.__type = "coding";
      }
      if (enableWhen.answerDate) {
        enableWhen.__answer = enableWhen.answerDate;
        enableWhen.__type = "date";
      }
      if (enableWhen.answerBoolean !== undefined) {
        enableWhen.__answer = enableWhen.answerBoolean ? "true" : "false";
        enableWhen.__type = "boolean";
      }
      if (enableWhen.answerString) {
        enableWhen.__answer = enableWhen.answerString;
        enableWhen.__type = "string";
      }
      if (enableWhen.answerTime) {
        enableWhen.__answer = enableWhen.answerTime;
        enableWhen.__type = "time";
      }
      if (enableWhen.answerDateTime) {
        enableWhen.__answer = enableWhen.answerDateTime;
        enableWhen.__type = "dateTime";
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
  json(jsonFileString: string): unknown {
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
  parseJson(jsonFile: string | ArrayBuffer | null): unknown {
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
  validateJson(jsonFile: string | ArrayBuffer | null): unknown {
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
  validateItemStructure(items1: Item[], items2: Item[]): string[] {
    const errorMessages: string[] = [];
    itemStructure(items1, items2, errorMessages);
    return errorMessages;
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
    itemStructure(entries[i - 1].item, entries[i].item, errorMessages);
    if (startLength !== errorMessages.length) {
      return undefined;
    }
  }
  return entries;
}

function emptyItems(items: Item[] | undefined): items is undefined {
  return items === undefined || items.length === 0;
}

function itemStructure(
  qre1: Item[] | undefined,
  qre2: Item[] | undefined,
  errorMessages: string[],
): void {
  if (emptyItems(qre1) && emptyItems(qre2)) return;
  if (emptyItems(qre1) || emptyItems(qre2)) {
    errorMessages.push("Can't have empty items if others are non-empty.");
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
  itemStructure(item1.item, item2.item, errorMessages);
}
