import { Questionnaire } from "@/store";
import { AnswerOption, Identifier, Item } from "@/types";
import { i18n } from "../i18n";

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
  getExportObject(jsonObject: Questionnaire) {
    const cloneObject = this.getObjectExportCopy(jsonObject) as Questionnaire;
    const objWithoutItemsDisabled = getObjectWithoutItemsDisabled(cloneObject);
    const finalObj = this.clearMetadataFields(objWithoutItemsDisabled);
    return finalObj;
  },
  getObjectExportCopy(jsonObject: any): any {
    if (typeof jsonObject === "string") {
      return jsonObject;
    }
    const newObject: any = {};
    const keys = Object.keys(jsonObject);
    for (const itemKey of keys) {
      if (itemKey.startsWith("__")) continue;
      let value = jsonObject[itemKey];
      if (Array.isArray(value)) {
        value = this.getArrayExportCopy(value);
      } else if (typeof value === "object" && value !== null) {
        value = this.getObjectExportCopy(value);
      }

      newObject[itemKey] = value;
    }
    return newObject;
  },
  getArrayExportCopy(array: any[]) {
    const newArray = [];
    for (const index in array) {
      newArray.push(this.getObjectExportCopy(array[index]));
    }
    return newArray;
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
