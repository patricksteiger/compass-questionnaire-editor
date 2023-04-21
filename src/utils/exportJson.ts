import { Settings } from "@/store";
import {
  EnableWhen,
  Identifier,
  Item,
  operators,
  Questionnaire,
} from "@/types";
import { i18n } from "../i18n";
import { allowsMaxLength } from "./constants";
import { dateTools } from "./date";
import { editorTools, UnreachableError } from "./editor";
import { itemTools } from "./item";

export type QuestionnaireBundleEntry = {
  resource: Questionnaire;
};

export type QuestionnaireBundle = {
  resourceType: "Bundle";
  type: "collection";
  entry: QuestionnaireBundleEntry[];
};

function deepCopyFilteredArray<T>(array: T[]): T {
  const result: T[] = [];
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
  for (const key of editorTools.objectKeys(object)) {
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

function clearOptionsOrString(item: Item, enableWhenIndex: number): void {
  const enableWhen = item.enableWhen![enableWhenIndex];
  if (!enableWhen.answerString) {
    item.enableWhen!.splice(enableWhenIndex, 1);
  } else {
    const answer = enableWhen.answerString;
    clearEnableWhenAnswers(enableWhen);
    enableWhen.answerString = answer;
  }
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

  // For items within item
  for (const item of jsonObject.item) {
    getObjectWithoutItemsDisabled(item);

    if (item.extension !== undefined) {
      for (let i = item.extension.length - 1; i >= 0; i--) {
        const extension = item.extension[i];
        switch (extension.__type) {
          case "boolean":
            if (extension.valueBoolean == null) {
              item.extension.splice(i, 1);
            }
            break;
          case "decimal":
            if (extension.valueDecimal == null) {
              item.extension.splice(i, 1);
            }
            break;
          case "integer":
            if (extension.valueInteger == null) {
              item.extension.splice(i, 1);
            }
            break;
          case "date":
            if (dateTools.isDate(extension.valueDate) !== true) {
              item.extension.splice(i, 1);
            }
            break;
          case "time":
            if (dateTools.isTime(extension.valueTime) !== true) {
              item.extension.splice(i, 1);
            }
            break;
          case "string":
            if (!extension.valueString) {
              item.extension.splice(i, 1);
            }
            break;
          case "markdown":
            if (!extension.valueMarkdown) {
              item.extension.splice(i, 1);
            }
            break;
          default:
            throw new UnreachableError(extension);
        }
      }

      if (item.extension.length === 0) {
        delete item.extension;
      }
    }

    //remove empty answerValueSet
    if (item.answerValueSet === "") {
      delete item.answerValueSet;
    }

    // answerOption and answerValueSet
    if (item.answerValueSet) {
      delete item.answerOption;
    } else if (item.answerOption !== undefined) {
      for (let i = item.answerOption.length - 1; i >= 0; i--) {
        const answer = item.answerOption[i];
        if (answer.__type === "coding") {
          if (answer.valueCoding !== undefined) {
            if (!answer.valueCoding.code) {
              delete answer.valueCoding.code;
            }
            if (!answer.valueCoding.system) {
              delete answer.valueCoding.system;
            }
            if (!answer.valueCoding.display) {
              delete answer.valueCoding.display;
            }
            if (!answer.valueCoding.version) {
              delete answer.valueCoding.version;
            }
            if (answer.valueCoding.userSelected === null) {
              delete answer.valueCoding.userSelected;
            }
          }
          if (editorTools.isEmptyObject(answer.valueCoding)) {
            item.answerOption.splice(i, 1);
          }
        } else if (answer.__type === "decimal") {
          if (editorTools.onlyStringFalsy(answer.valueDecimal)) {
            item.answerOption.splice(i, 1);
          } else if (typeof answer.valueDecimal === "string") {
            answer.valueDecimal = Number(answer.valueDecimal);
          }
        } else if (answer.__type === "integer") {
          if (editorTools.onlyStringFalsy(answer.valueInteger)) {
            item.answerOption.splice(i, 1);
          } else if (typeof answer.valueInteger === "string") {
            answer.valueInteger = parseInt(answer.valueInteger);
          }
        } else if (answer.__type === "date") {
          if (editorTools.onlyStringFalsy(answer.valueDate)) {
            item.answerOption.splice(i, 1);
          }
        } else if (answer.__type === "dateTime") {
          if (editorTools.onlyStringFalsy(answer.valueDateTime)) {
            item.answerOption.splice(i, 1);
          }
        } else if (answer.__type === "time") {
          if (editorTools.onlyStringFalsy(answer.valueTime)) {
            item.answerOption.splice(i, 1);
          }
        } else if (answer.__type === "quantity") {
          if (answer.valueQuantity !== undefined) {
            if (!answer.valueQuantity.value) {
              delete answer.valueQuantity.value;
            }
            if (!answer.valueQuantity.code) {
              delete answer.valueQuantity.code;
            }
            if (!answer.valueQuantity.unit) {
              delete answer.valueQuantity.unit;
            }
            if (!answer.valueQuantity.system) {
              delete answer.valueQuantity.system;
            }
            if (!answer.valueQuantity.comparator) {
              delete answer.valueQuantity.comparator;
            }
          }
          if (editorTools.isEmptyObject(answer.valueQuantity)) {
            item.answerOption.splice(i, 1);
          }
        } else if (answer.__type === "reference") {
          if (answer.valueReference !== undefined) {
            if (!answer.valueReference.reference) {
              delete answer.valueReference.reference;
            }
            if (!answer.valueReference.type) {
              delete answer.valueReference.type;
            }
            if (!answer.valueReference.display) {
              delete answer.valueReference.display;
            }
            if (editorTools.isEmptyObject(answer.valueReference.identifier)) {
              delete answer.valueReference.identifier;
            }
          }
          if (editorTools.isEmptyObject(answer.valueReference)) {
            item.answerOption.splice(i, 1);
          }
        }
      }
      if (item.answerOption.length === 0) {
        delete item.answerOption;
      }
    }

    if (itemTools.undefinedAnswerChoices(item)) {
      delete item.answerConstraint;
    }

    if (item.enableWhen) {
      for (let i = item.enableWhen.length - 1; i >= 0; i--) {
        const enableWhen = item.enableWhen[i];
        if (
          !enableWhen.question ||
          !enableWhen.operator ||
          !operators.includes(enableWhen.operator)
        ) {
          item.enableWhen.splice(i, 1);
        } else if (enableWhen.operator === "exists") {
          if (
            enableWhen.__answer !== "true" &&
            enableWhen.__answer !== "false"
          ) {
            item.enableWhen.splice(i, 1);
          } else {
            clearEnableWhenAnswers(enableWhen);
            enableWhen.answerBoolean = enableWhen.__answer === "true";
          }
        } else {
          switch (enableWhen.__type) {
            case "boolean":
              if (
                enableWhen.__answer !== "true" &&
                enableWhen.__answer !== "false"
              ) {
                item.enableWhen.splice(i, 1);
              } else {
                clearEnableWhenAnswers(enableWhen);
                enableWhen.answerBoolean = enableWhen.__answer === "true";
              }
              break;
            case "decimal":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (editorTools.isNumber(enableWhen.__answer)) {
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerDecimal = parseFloat(enableWhen.__answer!);
                } else {
                  item.enableWhen.splice(i, 1);
                }
              }
              break;
            case "integer":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (editorTools.isNumber(enableWhen.__answer)) {
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerInteger = parseInt(enableWhen.__answer!);
                } else {
                  item.enableWhen.splice(i, 1);
                }
              }
              break;
            case "date":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (dateTools.isDate(enableWhen.__answer) !== true) {
                  item.enableWhen.splice(i, 1);
                } else {
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerDate = enableWhen.__answer;
                }
              }
              break;
            case "dateTime":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (dateTools.isDateTime(enableWhen.__answer) !== true) {
                  item.enableWhen.splice(i, 1);
                } else {
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerDateTime = enableWhen.__answer;
                }
              }
              break;
            case "time":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (dateTools.isTime(enableWhen.__answer) !== true) {
                  item.enableWhen.splice(i, 1);
                } else {
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerTime = enableWhen.__answer;
                }
              }
              break;
            case "string":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (!enableWhen.__answer) {
                  item.enableWhen.splice(i, 1);
                } else {
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerString = enableWhen.__answer;
                }
              }
              break;
            case "text":
            case "url":
              if (!enableWhen.__answer) {
                item.enableWhen.splice(i, 1);
              } else {
                clearEnableWhenAnswers(enableWhen);
                enableWhen.answerString = enableWhen.__answer;
              }
              break;
            case "coding":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (enableWhen.answerCoding !== undefined) {
                  if (!enableWhen.answerCoding.code) {
                    delete enableWhen.answerCoding.code;
                  }
                  if (!enableWhen.answerCoding.display) {
                    delete enableWhen.answerCoding.display;
                  }
                  if (!enableWhen.answerCoding.system) {
                    delete enableWhen.answerCoding.system;
                  }
                  if (!enableWhen.answerCoding.version) {
                    delete enableWhen.answerCoding.version;
                  }
                  if (enableWhen.answerCoding.userSelected === null) {
                    delete enableWhen.answerCoding.userSelected;
                  }
                }
                if (editorTools.isNonEmptyObject(enableWhen.answerCoding)) {
                  const safedCoding = enableWhen.answerCoding;
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerCoding = safedCoding;
                } else {
                  item.enableWhen.splice(i, 1);
                }
              }
              break;
            case "quantity":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (enableWhen.answerQuantity !== undefined) {
                  if (!enableWhen.answerQuantity.code) {
                    delete enableWhen.answerQuantity.code;
                  }
                  if (!enableWhen.answerQuantity.unit) {
                    delete enableWhen.answerQuantity.unit;
                  }
                  if (!enableWhen.answerQuantity.system) {
                    delete enableWhen.answerQuantity.system;
                  }
                  if (!enableWhen.answerQuantity.value) {
                    delete enableWhen.answerQuantity.value;
                  }
                  if (!enableWhen.answerQuantity.comparator) {
                    delete enableWhen.answerQuantity.comparator;
                  }
                }
                if (editorTools.isNonEmptyObject(enableWhen.answerQuantity)) {
                  const safedQuantity = enableWhen.answerQuantity;
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerQuantity = safedQuantity;
                } else {
                  item.enableWhen.splice(i, 1);
                }
              }
              break;
            case "reference":
              if (enableWhen.__orString) {
                clearOptionsOrString(item, i);
              } else {
                if (enableWhen.answerReference !== undefined) {
                  if (!enableWhen.answerReference.reference) {
                    delete enableWhen.answerReference.reference;
                  }
                  if (!enableWhen.answerReference.display) {
                    delete enableWhen.answerReference.display;
                  }
                  if (!enableWhen.answerReference.type) {
                    delete enableWhen.answerReference.type;
                  }
                  if (
                    editorTools.isEmptyObject(
                      enableWhen.answerReference.identifier,
                    )
                  ) {
                    delete enableWhen.answerReference.identifier;
                  }
                }
                if (editorTools.isNonEmptyObject(enableWhen.answerReference)) {
                  const safedReference = enableWhen.answerReference;
                  clearEnableWhenAnswers(enableWhen);
                  enableWhen.answerReference = safedReference;
                } else {
                  item.enableWhen.splice(i, 1);
                }
              }
              break;
            case undefined:
              console.error(
                `enableWhen linking to ${enableWhen.question} had no type`,
              );
              item.enableWhen.splice(i, 1);
              break;
            default:
              throw new UnreachableError(enableWhen.__type);
          }
        }
      }
      if (item.enableWhen.length === 0) {
        delete item.enableWhen;
      }
    } else {
      delete item.enableWhen;
    }

    if (!item.enableBehavior) {
      delete item.enableBehavior;
    }

    // Clearing input field in GUI sets value to empty string
    if (typeof item.maxLength === "string" || !allowsMaxLength(item)) {
      delete item.maxLength;
    }
  }
  // Item must be deleted when empty
  if (jsonObject.item.length === 0) {
    delete jsonObject.item;
  }

  return jsonObject;
}

function clearEnableWhenAnswers(enableWhen: EnableWhen): void {
  enableWhen.answerBoolean = undefined;
  enableWhen.answerDecimal = undefined;
  enableWhen.answerInteger = undefined;
  enableWhen.answerDate = undefined;
  enableWhen.answerDateTime = undefined;
  enableWhen.answerTime = undefined;
  enableWhen.answerString = undefined;
  enableWhen.answerCoding = undefined;
  enableWhen.answerQuantity = undefined;
  enableWhen.answerReference = undefined;
}

const exportJsonQuestionnaire = {
  validateQuestionnaire(qre: Questionnaire, _settings: Settings): string[] {
    const errorMessages: string[] = [];
    validateQREGroups(qre, errorMessages);
    return errorMessages;
  },
  getExportObject(jsonObject: Questionnaire): Questionnaire {
    const cloneObject = editorTools.clone(jsonObject);
    const objWithoutItemsDisabled = getObjectWithoutItemsDisabled(cloneObject);
    const filteredInternalStateQRE = createQuestionnaireExportCopy(
      objWithoutItemsDisabled,
    );
    const finalObj = this.clearMetadataFields(filteredInternalStateQRE);
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
          identifier.use === undefined ? delete identifier.use : "";
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
