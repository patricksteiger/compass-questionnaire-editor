import { Settings } from "@/store";
import { Identifier, Item, Questionnaire } from "@/types";
import { i18n } from "../i18n";

export type QuestionnaireBundleEntry = {
  resource: Questionnaire;
};

export type QuestionnaireBundle = {
  resourceType: "Bundle";
  type: "collection";
  entry: QuestionnaireBundleEntry[];
};

function objectKeys<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

function deepCopyArray<T extends any[]>(array: T): T {
  const result: any[] = [];
  for (const element of array) {
    if (element === null || element === undefined) {
      result.push(element);
    } else if (Array.isArray(element)) {
      result.push(deepCopyArray(element));
    } else if (typeof element === "object") {
      result.push(deepCopyObject(element));
    } else {
      result.push(element);
    }
  }
  return result as T;
}

export function deepCopyObject<T extends object>(object: T): T {
  const result: Partial<T> = {};
  for (const key of objectKeys(object)) {
    const value = object[key];
    if (value === null || value === undefined) {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = deepCopyArray(value);
    } else if (typeof value === "object") {
      result[key] = deepCopyObject(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function deepCopyFilteredArray<T extends any[]>(array: T): T {
  const result: any[] = [];
  for (const element of array) {
    if (element === null || element === undefined) {
      result.push(element);
    } else if (Array.isArray(element)) {
      result.push(deepCopyFilteredArray(element));
    } else if (typeof element === "object") {
      result.push(deepCopyFilteredObject(element));
    } else {
      result.push(element);
    }
  }
  return result as T;
}

function deepCopyFilteredObject<T extends object>(object: T): T {
  const result: Partial<T> = {};
  for (const key of objectKeys(object)) {
    if (
      typeof key === "number" ||
      typeof key === "symbol" ||
      key.startsWith("__")
    ) {
      continue;
    }
    const value = object[key];
    if (value === null || value === undefined) {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = deepCopyFilteredArray(value);
    } else if (typeof value === "object") {
      result[key] = deepCopyFilteredObject(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function createQuestionnaireExportCopy(qre: Questionnaire): Questionnaire {
  return deepCopyFilteredObject(qre);
}

function forEach(items: Item[], tracer: (i: Item) => void): void {
  for (const item of items) {
    tracer(item);
    if (item.item !== undefined) {
      forEach(item.item, tracer);
    }
  }
}

// TODO: How to validate ValueSets?
function validateQREWithSettings(
  qre: Questionnaire,
  settings: Settings,
  errorMessages: string[],
): void {
  const forbidChoices = !settings.answers.choice;
  if (forbidChoices) {
    const choiceTracer = (item: Item) => {
      if (item.type === "choice") {
        const message = i18n.global.t(
          "messagesErrors.ExportValidation.deactivatedChoice",
          { linkId: item.linkId },
        );
        errorMessages.push(message);
      }
    };
    forEach(qre.item, choiceTracer);
  }
  const forbidOpenChoices = !settings.answers.openChoice;
  if (forbidOpenChoices) {
    const openChoiceTracer = (item: Item) => {
      if (item.type === "open-choice") {
        const message = i18n.global.t(
          "messagesErrors.ExportValidation.deactivatedOpenChoice",
          { linkId: item.linkId },
        );
        errorMessages.push(message);
      }
    };
    forEach(qre.item, openChoiceTracer);
  }
}

function validateQREGroups(qre: Questionnaire, errorMessages: string[]): void {
  const emptyGroupTracer = (item: Item): void => {
    if (item.type === "group") {
      if (item.item === undefined || item.item.length === 0) {
        const message = i18n.global.t(
          "messagesErrors.ExportValidation.emptyGroup",
          { linkId: item.linkId },
        );
        errorMessages.push(message);
      } else {
        for (const i of item.item) {
          if (i.__active) {
            return; // group has at least 1 active item
          }
        }
        const message = i18n.global.t(
          "messagesErrors.ExportValidation.onlyInactiveItems",
          { linkId: item.linkId },
        );
        errorMessages.push(message);
      }
    }
  };
  forEach(qre.item, emptyGroupTracer);
}

function getObjectWithoutItemsDisabled(
  jsonObject: Questionnaire,
): Questionnaire;
function getObjectWithoutItemsDisabled(jsonObject: Item): Item;
function getObjectWithoutItemsDisabled(
  jsonObject: Questionnaire | Item,
): Questionnaire | Item {
  if (jsonObject.item === undefined) {
    return jsonObject;
  }
  // To only keep items with linkId
  jsonObject.item = jsonObject.item.filter((item) => item.linkId !== "");

  // For items within item
  for (const item of jsonObject.item) {
    getObjectWithoutItemsDisabled(item);

    if (item.extension !== undefined) {
      for (let i = item.extension.length - 1; i >= 0; i--) {
        const ext = item.extension[i];
        const isNotInteger = ext.valueInteger === undefined;
        const isNotString =
          ext.valueString === undefined || ext.valueString === "";
        const isNotCoding = ext.valueCoding === undefined;
        if (isNotInteger && isNotString && isNotCoding) {
          item.extension.splice(i, 1);
        } else if (!isNotInteger) {
          ext.valueInteger = Number(ext.valueInteger);
        }
      }

      if (item.extension.length === 0) {
        delete item.extension;
      }
    }

    //convert to integer ValueInteger
    if (item.answerOption !== undefined) {
      for (const answerOpt of item.answerOption) {
        if (
          answerOpt.valueInteger !== undefined &&
          typeof answerOpt.valueInteger === "string"
        ) {
          answerOpt.valueInteger = parseInt(answerOpt.valueInteger);
        }
      }
    }

    //answerOption and Value Set
    if (item.answerValueSet !== "") {
      delete item.answerOption;
    }
    if (item.answerOption !== undefined) {
      //answerOption has data
      if (item.answerOption.length > 0) {
        delete item.answerValueSet;
      }
      //remove if is empty
      if (item.answerOption.length === 0) {
        delete item.answerOption;
      }
    }

    //remove empty answerValueSet
    if (item.answerValueSet === "") {
      delete item.answerValueSet;
    }

    if (item.enableWhen !== undefined) {
      item.enableWhen = item.enableWhen.filter(
        (enableWhen) =>
          enableWhen.operator !== "" &&
          enableWhen.question !== "" &&
          enableWhen.answer !== "",
      );
      for (const enableWhen of item.enableWhen) {
        if (enableWhen.operator === "exists") {
          enableWhen.answerBoolean = enableWhen.answer === "true";
        } else {
          if (enableWhen.type === "decimal") {
            enableWhen.answerDecimal = parseFloat(enableWhen.answer || "");
          } else if (enableWhen.type === "integer") {
            enableWhen.answerInteger = parseInt(enableWhen.answer || "");
          } else if (enableWhen.type === "date") {
            enableWhen.answerDate = enableWhen.answer;
          } else if (enableWhen.type === "boolean") {
            enableWhen.answerBoolean = enableWhen.answer === "true";
          } else if (
            enableWhen.type === "string" ||
            enableWhen.type === "text" ||
            enableWhen.type === "url"
          ) {
            enableWhen.answerString = enableWhen.answer;
          } else if (
            enableWhen.type === "choice" ||
            enableWhen.type === "open-choice" ||
            enableWhen.type === "coding"
          ) {
            enableWhen.answerCoding = {
              code: enableWhen.answer || "",
              display: enableWhen.display || "",
              system: enableWhen.system || "",
            };
          } else if (enableWhen.type === "time") {
            enableWhen.answerTime = enableWhen.answer;
          }
        }
        delete enableWhen.system;
        delete enableWhen.display;
        delete enableWhen.answer;
        delete enableWhen.type;
      }
      if (item.enableWhen.length === 0) {
        delete item.enableWhen;
      }
    } else {
      delete item.enableWhen;
    }

    // Clearing input field in GUI sets value to empty string
    if (typeof item.maxLength === "string") {
      delete item.maxLength;
    }
  }
  // Item must be deleted when empty
  if (jsonObject.item.length === 0) {
    delete jsonObject.item;
  }

  return jsonObject;
}

const exportJsonQuestionnaire = {
  // FIXME: required groups must have at least 1 required child?
  validateQuestionnaire(qre: Questionnaire, settings: Settings): string[] {
    const errorMessages: string[] = [];
    validateQREWithSettings(qre, settings, errorMessages);
    validateQREGroups(qre, errorMessages);
    return errorMessages;
  },
  getExportObject(jsonObject: Questionnaire): Questionnaire {
    const cloneObject = createQuestionnaireExportCopy(jsonObject);
    const objWithoutItemsDisabled = getObjectWithoutItemsDisabled(cloneObject);
    const finalObj = this.clearMetadataFields(objWithoutItemsDisabled);
    return finalObj;
  },
  getExportBundle(questionnaires: Questionnaire[]): QuestionnaireBundle {
    const entries = questionnaires.map((qre) => {
      const exportQuestionnaire = this.getExportObject(qre);
      return { resource: exportQuestionnaire };
    });
    const bundle: QuestionnaireBundle = {
      resourceType: "Bundle",
      type: "collection",
      entry: entries,
    };
    return bundle;
  },
  clearMetadataFields(jsonObject: Questionnaire) {
    //Version
    if (!jsonObject.version) {
      delete jsonObject.version;
    }
    //URL
    if (!jsonObject.url) {
      delete jsonObject.url;
    }
    //Name
    if (!jsonObject.name) {
      delete jsonObject.name;
    }
    //publisher
    if (!jsonObject.publisher) {
      delete jsonObject.publisher;
    }
    //title
    if (!jsonObject.title) {
      delete jsonObject.title;
    }
    //approvalDate
    if (!jsonObject.date) {
      delete jsonObject.date;
    }
    //approvalDate
    if (!jsonObject.approvalDate) {
      delete jsonObject.approvalDate;
    }
    //lastReviewDate
    if (!jsonObject.lastReviewDate) {
      delete jsonObject.lastReviewDate;
    }
    //experimental
    if (
      jsonObject.experimental === null ||
      jsonObject.experimental === undefined
    ) {
      delete jsonObject.experimental;
    }
    //Identifier
    if (jsonObject.identifier && jsonObject.identifier.length > 0) {
      const clearedId: Identifier[] = [];
      for (const identifier of jsonObject.identifier) {
        let removeUserSelected = true;
        if (identifier) {
          identifier.use === "" ? delete identifier.use : "";
          identifier.system === "" ? delete identifier.system : "";
          identifier.value === "" ? delete identifier.value : "";
          identifier.period?.start === "" ? delete identifier.period.start : "";
          identifier.period?.end === "" ? delete identifier.period.end : "";
          if (identifier.period) {
            Object.values(identifier.period).length === 0
              ? delete identifier.period
              : "";
          }
          identifier.type?.coding?.system === ""
            ? delete identifier.type.coding.system
            : (removeUserSelected = false);
          identifier.type?.coding?.version === ""
            ? delete identifier.type.coding.version
            : (removeUserSelected = false);
          identifier.type?.coding?.code === ""
            ? delete identifier.type.coding.code
            : (removeUserSelected = false);
          identifier.type?.coding?.display === ""
            ? delete identifier.type.coding.display
            : (removeUserSelected = false);
          removeUserSelected === true
            ? delete identifier.type?.coding?.userSelected
            : "";
          identifier.type?.text === "" ? delete identifier.type.text : "";
          if (identifier.type?.coding) {
            Object.values(identifier.type.coding).length === 0
              ? delete identifier.type.coding
              : "";
          }
          if (identifier.type) {
            Object.values(identifier.type).length === 0
              ? delete identifier.type
              : "";
          }
          Object.values(identifier).length > 0
            ? clearedId.push(identifier)
            : "";
        }
      }
      jsonObject.identifier = clearedId;
    }
    if (jsonObject.identifier?.length === 0) {
      delete jsonObject.identifier;
    }
    return jsonObject;
  },
  i18n: i18n,
};

export { exportJsonQuestionnaire };
