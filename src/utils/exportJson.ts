import { Settings } from "@/store";
import { AnswerOption, Identifier, Item, Questionnaire } from "@/types";
import { i18n } from "../i18n";

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
  jsonObject.item = jsonObject.item.filter(
    (element: Item) => element.linkId !== "",
  );

  // For items within item
  jsonObject.item.forEach((questionnaire: Item) => {
    getObjectWithoutItemsDisabled(questionnaire);

    if (questionnaire.extension !== undefined) {
      for (let i = questionnaire.extension.length - 1; i >= 0; i--) {
        const ext = questionnaire.extension[i];
        const isNotInteger = ext.valueInteger === undefined;
        const isNotString =
          ext.valueString === undefined || ext.valueString === "";
        const isNotCoding = ext.valueCoding === undefined;
        if (isNotInteger && isNotString && isNotCoding) {
          questionnaire.extension.splice(i, 1);
        } else if (!isNotInteger) {
          ext.valueInteger = Number(ext.valueInteger);
        }
      }

      if (questionnaire.extension.length === 0) {
        delete questionnaire.extension;
      }
    }

    //convert to integer ValueInteger
    if (questionnaire.answerOption !== undefined) {
      questionnaire.answerOption.forEach((element: AnswerOption) => {
        if (
          element.valueInteger !== undefined &&
          typeof element.valueInteger === "string"
        ) {
          element.valueInteger = parseInt(element.valueInteger);
        }
      });
    }

    //answerOption and Value Set
    if (questionnaire.answerValueSet !== "") {
      delete questionnaire.answerOption;
    }
    if (questionnaire.answerOption !== undefined) {
      //answerOption has data
      if (questionnaire.answerOption.length > 0) {
        delete questionnaire.answerValueSet;
      }
      //remove if is empty
      if (questionnaire.answerOption.length === 0) {
        delete questionnaire.answerOption;
      }
    }

    //remove disable Item property
    delete questionnaire.disabled;

    //remove empty answerValueSet
    if (questionnaire.answerValueSet === "") {
      delete questionnaire.answerValueSet;
    }

    if (questionnaire.enableWhen !== undefined) {
      questionnaire.enableWhen = questionnaire.enableWhen.filter(
        (enableWhen) =>
          enableWhen.operator !== "" &&
          enableWhen.question !== "" &&
          enableWhen.answer !== "",
      );
      questionnaire.enableWhen.forEach((enableWhen) => {
        if (enableWhen.operator === "exists") {
          enableWhen.answerBoolean = enableWhen.answer === "true";
        } else {
          if (enableWhen.type === "decimal") {
            enableWhen.answerDecimal = parseFloat(enableWhen.answer || "");
          }
          if (enableWhen.type === "integer") {
            enableWhen.answerInteger = parseInt(enableWhen.answer || "");
          }
          if (enableWhen.type === "date") {
            enableWhen.answerDate = enableWhen.answer;
          }
          if (enableWhen.type === "boolean") {
            enableWhen.answerBoolean = enableWhen.answer === "true";
          }
          if (enableWhen.type === "string") {
            enableWhen.answerString = enableWhen.answer;
          }
          if (
            enableWhen.type === "choice" ||
            enableWhen.type === "open-choice" ||
            enableWhen.type === "coding"
          ) {
            enableWhen.answerCoding = {
              code: enableWhen.answer || "",
              display: enableWhen.display || "",
              system: enableWhen.system || "",
            };
          }
        }
        delete enableWhen.system;
        delete enableWhen.display;
        delete enableWhen.answer;
        delete enableWhen.type;
      });
      if (questionnaire.enableWhen.length === 0) {
        delete questionnaire.enableWhen;
      }
    } else {
      delete questionnaire.enableWhen;
    }
  });
  // Item must be deleted when empty
  if (jsonObject.item.length === 0) {
    delete jsonObject.item;
  }

  return jsonObject;
}

const exportJsonQuestionnaire = {
  forEach(items: Item[], tracer: (i: Item) => void): void {
    for (const item of items) {
      tracer(item);
      if (item.item !== undefined) {
        this.forEach(item.item, tracer);
      }
    }
  },
  // TODO: How to validate ValueSets?
  validateQREWithSettings(qre: Questionnaire, settings: Settings): string[] {
    const errorMessages: string[] = [];
    const forbidChoices = !settings.answers.choice;
    if (forbidChoices) {
      const choiceTracer = (item: Item) => {
        if (item.type === "choice") {
          errorMessages.push(`Node ${item.linkId} has deactivated type choice`);
        }
      };
      this.forEach(qre.item, choiceTracer);
    }
    const forbidOpenChoices = !settings.answers.openChoice;
    if (forbidOpenChoices) {
      const openChoiceTracer = (item: Item) => {
        if (item.type === "open-choice") {
          errorMessages.push(
            `Node ${item.linkId} has deactivated type open-choice`,
          );
        }
      };
      this.forEach(qre.item, openChoiceTracer);
    }
    return errorMessages;
  },
  getExportObject(jsonObject: Questionnaire) {
    const cloneObject = createQuestionnaireExportCopy(jsonObject);
    const objWithoutItemsDisabled = getObjectWithoutItemsDisabled(cloneObject);
    const finalObj = this.clearMetadataFields(objWithoutItemsDisabled);
    return finalObj;
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
    if (jsonObject?.identifier && jsonObject.identifier.length > 0) {
      const clearedId: Identifier[] = [];
      jsonObject?.identifier.forEach((identifier) => {
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
      });
      jsonObject.identifier = clearedId;
    }
    if (jsonObject?.identifier?.length === 0) {
      delete jsonObject.identifier;
    }
    return jsonObject;
  },
  i18n: i18n,
};

export { exportJsonQuestionnaire };
