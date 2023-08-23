import {
  CodeableConcept,
  Coding,
  ContactDetail,
  ContactPoint,
  DerivedFromExtension,
  derivedFromExtensionUrl,
  DerivedFromExtensionValue,
  EnableWhen,
  Extension,
  Item,
  Meta,
  Identifier,
  operators,
  Period,
  Quantity,
  Questionnaire,
  Range,
  Reference,
  SimpleQuantity,
  AnswerOption,
  Attachment,
} from "@/types";
import {
  ITEM_WEIGHT_URL,
  allowsMaxLength,
  getItemWeightExtension,
} from "./constants";
import { dateTools } from "./date";
import { editorTools, UnreachableError } from "./editor";
import { itemTools } from "./item";
import { questionnaireTools } from "./questionnaire";

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

function clearOptionsOrString(item: Item, enableWhenIndex: number): void {
  const enableWhen = item.enableWhen[enableWhenIndex];
  if (!enableWhen.answerString) {
    item.enableWhen.splice(enableWhenIndex, 1);
  } else {
    const answer = enableWhen.answerString;
    clearEnableWhenAnswers(enableWhen);
    enableWhen.answerString = answer;
  }
}

function filterAttachment(attachment: Attachment): void {
  if (!attachment.contentType) {
    delete attachment.contentType;
  }
  if (!attachment.language) {
    delete attachment.language;
  }
  if (!attachment.data) {
    delete attachment.data;
  }
  if (!attachment.url) {
    delete attachment.url;
  }
  if (!Number.isInteger(attachment.size)) {
    delete attachment.size;
  }
  if (!attachment.hash) {
    delete attachment.hash;
  }
  if (!attachment.title) {
    delete attachment.title;
  }
  if (dateTools.isDateTime(attachment.creation) !== true) {
    delete attachment.title;
  }
  if (!Number.isInteger(attachment.height)) {
    delete attachment.height;
  }
  if (!Number.isInteger(attachment.width)) {
    delete attachment.width;
  }
  if (!Number.isInteger(attachment.frames)) {
    delete attachment.frames;
  }
  if (typeof attachment.duration !== "number") {
    delete attachment.frames;
  }
  if (!Number.isInteger(attachment.pages)) {
    delete attachment.pages;
  }
}

function filterExtension(extensions: Extension[]): void {
  for (let i = extensions.length - 1; i >= 0; i--) {
    const extension = extensions[i];
    switch (extension.__type) {
      case "boolean":
        if (extension.valueBoolean == null) {
          extensions.splice(i, 1);
        }
        break;
      case "code":
        if (!extension.valueCode) {
          extensions.splice(i, 1);
        }
        break;
      case "decimal":
        if (editorTools.invalidNumber(extension.valueDecimal)) {
          extensions.splice(i, 1);
        }
        break;
      case "integer":
        if (editorTools.invalidNumber(extension.valueInteger)) {
          extensions.splice(i, 1);
        }
        break;
      case "date":
        if (dateTools.isDate(extension.valueDate) !== true) {
          extensions.splice(i, 1);
        }
        break;
      case "dateTime":
        if (dateTools.isDateTime(extension.valueDateTime) !== true) {
          extensions.splice(i, 1);
        }
        break;
      case "time":
        if (dateTools.isTime(extension.valueTime) !== true) {
          extensions.splice(i, 1);
        }
        break;
      case "string":
        if (!extension.valueString) {
          extensions.splice(i, 1);
        }
        break;
      case "markdown":
        if (!extension.valueMarkdown) {
          extensions.splice(i, 1);
        }
        break;
      case "attachment":
        filterAttachment(extension.valueAttachment);
        if (editorTools.isEmptyObject(extension.valueAttachment)) {
          extensions.splice(i, 1);
        }
        break;
      case "coding":
        filterCoding(extension.valueCoding);
        if (editorTools.isEmptyObject(extension.valueCoding)) {
          extensions.splice(i, 1);
        }
        break;
      case "complex":
        filterExtension(extension.extension);
        if (extension.extension.length === 0) {
          extensions.splice(i, 1);
        }
        break;
      default:
        throw new UnreachableError(extension);
    }
  }
}

function filterCode(resource: Item | Questionnaire): void {
  for (let i = resource.code.length - 1; i >= 0; i--) {
    const code = resource.code[i];
    if (editorTools.isEmptyObject(code)) {
      resource.code.splice(i, 1);
    }
  }
}

function filterVersionAlgorithm(qre: Questionnaire) {
  if (qre.__versionAlgorithmUsesCoding) {
    if (editorTools.isEmptyObject(qre.versionAlgorithmCoding)) {
      delete qre.versionAlgorithmCoding;
    }
    delete qre.versionAlgorithmString;
  } else {
    if (!qre.versionAlgorithmString) {
      delete qre.versionAlgorithmString;
    }
    delete qre.versionAlgorithmCoding;
  }
}

function filterContactPoint(contactPoint: ContactPoint) {
  const { value, system, use, rank, period } = contactPoint;
  if (!value || !system) {
    delete contactPoint.value;
    delete contactPoint.system;
  }
  if (!use) {
    delete contactPoint.use;
  }
  if (!rank) {
    delete contactPoint.rank;
  }
  const invalidStart = dateTools.isDateTime(period.start) !== true;
  const invalidEnd = dateTools.isDateTime(period.end) !== true;
  if (invalidStart && invalidEnd) {
    delete (contactPoint as Partial<ContactPoint>).period;
  } else if (invalidStart) {
    delete contactPoint.period.start;
  } else if (invalidEnd) {
    delete contactPoint.period.end;
  }
}

function filterQuantity(quantity: Quantity) {
  if (!quantity.code) {
    delete quantity.code;
  }
  if (!quantity.system) {
    delete quantity.system;
  }
  if (!quantity.value) {
    delete quantity.value;
  }
  if (!quantity.unit) {
    delete quantity.unit;
  }
  if (!quantity.comparator) {
    delete quantity.comparator;
  }
}

function filterSimpleQuantity(simpleQuantity: SimpleQuantity) {
  if (!simpleQuantity.code) {
    delete simpleQuantity.code;
  }
  if (!simpleQuantity.system) {
    delete simpleQuantity.system;
  }
  if (!simpleQuantity.value) {
    delete simpleQuantity.value;
  }
  if (!simpleQuantity.unit) {
    delete simpleQuantity.unit;
  }
}

function filterRange(range: Range) {
  if (range.low !== undefined) {
    filterSimpleQuantity(range.low);
    if (editorTools.isEmptyObject(range.low)) {
      delete range.low;
    }
  }
  if (range.high !== undefined) {
    filterSimpleQuantity(range.high);
    if (editorTools.isEmptyObject(range.high)) {
      delete range.high;
    }
  }
}

function filterCoding(coding: Coding) {
  if (!coding.code) {
    delete coding.code;
  }
  if (!coding.system) {
    delete coding.system;
  }
  if (!coding.display) {
    delete coding.display;
  }
  if (!coding.version) {
    delete coding.version;
  }
  if (!coding.userSelected && coding.userSelected !== false) {
    delete coding.userSelected;
  }
}

function filterCodeableConcept(codeableConcept: CodeableConcept) {
  const { text, coding } = codeableConcept;
  if (!text) {
    delete codeableConcept.text;
  }
  for (let j = coding.length - 1; j >= 0; j--) {
    const code = coding[j];
    filterCoding(code);
    if (editorTools.isEmptyObject(code)) {
      codeableConcept.coding.splice(j, 1);
    }
  }
  if (editorTools.emptyArray(coding)) {
    delete (codeableConcept as Partial<CodeableConcept>).coding;
  }
}

function filterReference(reference: Reference) {
  if (!reference.display) {
    delete reference.display;
  }
  if (!reference.reference) {
    delete reference.reference;
  }
  if (!reference.type) {
    delete reference.type;
  }
  if (reference.identifier !== undefined) {
    filterIdentifier(reference.identifier);
    if (editorTools.isEmptyObject(reference.identifier)) {
      delete reference.identifier;
    }
  }
}

function filterUseContext(qre: Questionnaire) {
  const { useContext: useContexts } = qre;
  for (let i = useContexts.length - 1; i >= 0; i--) {
    const useContext = useContexts[i];
    filterCoding(useContext.code);
    if (editorTools.isEmptyObject(useContext.code)) {
      useContexts.splice(i, 1);
      continue;
    }
    switch (useContext.__type) {
      case "codeableConcept":
        filterCodeableConcept(useContext.valueCodeableConcept);
        if (editorTools.isEmptyObject(useContext.valueCodeableConcept)) {
          useContexts.splice(i, 1);
        }
        break;
      case "quantity":
        filterQuantity(useContext.valueQuantity);
        if (editorTools.isEmptyObject(useContext.valueQuantity)) {
          useContexts.splice(i, 1);
        }
        break;
      case "range":
        filterRange(useContext.valueRange);
        if (editorTools.isEmptyObject(useContext.valueRange)) {
          useContexts.splice(i, 1);
        }
        break;
      case "reference":
        filterReference(useContext.valueReference);
        if (editorTools.isEmptyObject(useContext.valueReference)) {
          useContexts.splice(i, 1);
        }
        break;
      default:
        throw new UnreachableError(useContext);
    }
  }
  if (editorTools.emptyArray(useContexts)) {
    delete (qre as Partial<Questionnaire>).useContext;
  }
}

function filterContact(qre: Questionnaire) {
  for (let i = qre.contact.length - 1; i >= 0; i--) {
    const contactDetail = qre.contact[i];
    if (!contactDetail.name) {
      delete (contactDetail as Partial<ContactDetail>).name;
    }
    for (let j = contactDetail.telecom.length - 1; j >= 0; j--) {
      const contactPoint = contactDetail.telecom[j];
      filterContactPoint(contactPoint);
      if (editorTools.isEmptyObject(contactPoint)) {
        contactDetail.telecom.splice(j, 1);
      }
    }
    if (contactDetail.telecom.length === 0) {
      delete (contactDetail as Partial<ContactDetail>).telecom;
    }
    if (editorTools.isEmptyObject(contactDetail)) {
      qre.contact.splice(i, 1);
    }
  }
  if (qre.contact.length === 0) {
    delete (qre as Partial<Questionnaire>).contact;
  }
}

function getDerivedFromExtensionCode(
  type: DerivedFromExtensionValue | null,
): DerivedFromExtension {
  switch (type) {
    case null:
      return null as unknown as DerivedFromExtension;
    case "extends":
      return {
        url: derivedFromExtensionUrl,
        __value: "extends",
        valueCodeableConcept: {
          coding: [
            {
              code: "extends",
              display: "extends",
              system: "http://hl7.org/fhir/questionnaire-derivationType",
              version: "1.0.0",
            },
          ],
        },
      };
    case "compliesWith":
      return {
        url: derivedFromExtensionUrl,
        __value: "compliesWith",
        valueCodeableConcept: {
          coding: [
            {
              code: "compliesWith",
              display: "complies with",
              system: "http://hl7.org/fhir/questionnaire-derivationType",
              version: "1.0.0",
            },
          ],
        },
      };
    case "inspiredBy":
      return {
        url: derivedFromExtensionUrl,
        __value: "inspiredBy",
        valueCodeableConcept: {
          coding: [
            {
              code: "inspiredBy",
              display: "inspired by",
              system: "http://hl7.org/fhir/questionnaire-derivationType",
              version: "1.0.0",
            },
          ],
        },
      };
    default:
      throw new UnreachableError(type);
  }
}

function filterDerivedFrom(qre: Questionnaire) {
  for (let i = qre.derivedFrom.length - 1; i >= 0; i--) {
    const derivedFrom = qre.derivedFrom[i];
    if (!derivedFrom) {
      qre.derivedFrom.splice(i, 1);
      qre._derivedFrom.splice(i, 1);
    } else {
      const ext = qre._derivedFrom[i];
      qre._derivedFrom[i] = getDerivedFromExtensionCode(ext.__value);
    }
  }
  if (qre.derivedFrom.length === 0) {
    delete (qre as Partial<Questionnaire>).derivedFrom;
    delete (qre as Partial<Questionnaire>)._derivedFrom;
  } else {
    const indx = qre._derivedFrom.findIndex((d) => d !== null);
    if (indx < 0) {
      delete (qre as Partial<Questionnaire>)._derivedFrom;
    }
  }
}

function filterEffectivePeriod(qre: Questionnaire) {
  const { start, end } = qre.effectivePeriod;
  const invalidStart = dateTools.isDateTime(start) !== true;
  const invalidEnd = dateTools.isDateTime(end) !== true;
  if (invalidStart && invalidEnd) {
    delete (qre as Partial<Questionnaire>).effectivePeriod;
  } else if (invalidStart) {
    delete qre.effectivePeriod.start;
  } else if (invalidEnd) {
    delete qre.effectivePeriod.end;
  }
}

function filterDate(qre: Questionnaire) {
  if (dateTools.isDateTime(qre.date) !== true) {
    delete (qre as Partial<Questionnaire>).date;
  }
}

function filterApprovalDate(qre: Questionnaire) {
  if (dateTools.isDate(qre.approvalDate) !== true) {
    delete (qre as Partial<Questionnaire>).approvalDate;
  }
}

function filterLastReviewDate(qre: Questionnaire) {
  if (dateTools.isDate(qre.lastReviewDate) !== true) {
    delete (qre as Partial<Questionnaire>).lastReviewDate;
  }
}

function filterPeriod(period: Period) {
  const invalidStart = dateTools.isDateTime(period.start) !== true;
  if (invalidStart) {
    delete period.start;
  }
  const invalidEnd = dateTools.isDateTime(period.end) !== true;
  if (invalidEnd) {
    delete period.end;
  }
}

function filterIdentifier(identifier: Identifier) {
  if (!identifier.system) {
    delete identifier.system;
  }
  if (!identifier.value) {
    delete identifier.value;
  }
  if (!identifier.use) {
    delete identifier.use;
  }
  const { type } = identifier;
  if (type !== undefined) {
    if (!type.text) {
      delete type.text;
    }
    filterCodeableConcept(type);
    if (editorTools.isEmptyObject(identifier.type)) {
      delete identifier.type;
    }
  }
  if (identifier.period !== undefined) {
    filterPeriod(identifier.period);
    if (editorTools.isEmptyObject(identifier.period)) {
      delete identifier.period;
    }
  }
}

function filterIdentifiers(qre: Questionnaire) {
  for (let i = qre.identifier.length - 1; i >= 0; i--) {
    const id = qre.identifier[i];
    filterIdentifier(id);
    if (editorTools.isEmptyObject(id)) {
      qre.identifier.splice(i, 1);
    }
  }
  if (qre.identifier.length === 0) {
    delete (qre as Partial<Questionnaire>).identifier;
  }
}

function filterCodingArray(arr: Coding[]) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const coding = arr[i];
    filterCoding(coding);
    if (editorTools.isEmptyObject(coding)) {
      arr.splice(i, 1);
    }
  }
}

function filterMeta(qre: Questionnaire) {
  const { meta } = qre;
  if (questionnaireTools.isId(meta.versionId) !== true) {
    delete meta.versionId;
  }
  if (dateTools.isInstant(meta.lastUpdated) !== true) {
    delete meta.lastUpdated;
  }
  if (questionnaireTools.isUri(meta.source) !== true) {
    delete meta.source;
  }
  meta.profile = meta.profile.filter(
    (p) => questionnaireTools.isCanonical(p) === true,
  );
  if (meta.profile.length === 0) {
    delete (qre.meta as Partial<Meta>).profile;
  }
  filterCodingArray(meta.security);
  if (meta.security.length === 0) {
    delete (qre.meta as Partial<Meta>).security;
  }
  filterCodingArray(meta.tag);
  if (meta.tag.length === 0) {
    delete (qre.meta as Partial<Meta>).tag;
  }
  if (editorTools.isEmptyObject(qre.meta)) {
    delete (qre as Partial<Questionnaire>).meta;
  }
}

function filterText(qre: Questionnaire) {
  if (questionnaireTools.containsNonWhitespace(qre.text.div) !== true) {
    delete (qre as Partial<Questionnaire>).text;
  }
}

function getFilteredQuestionnaire(qre: Questionnaire): Questionnaire {
  if (!qre.version) {
    delete qre.version;
  }
  if (questionnaireTools.isId(qre.id) !== true) {
    delete qre.id;
  }
  filterMeta(qre);
  filterText(qre);
  if (questionnaireTools.isUri(qre.implicitRules) !== true) {
    delete qre.implicitRules;
  }
  if (qre.subjectType.length === 0) {
    delete (qre as Partial<Questionnaire>).subjectType;
  }
  if (!qre.title) {
    delete qre.title;
  }
  if (questionnaireTools.isName(qre.name) !== true) {
    delete qre.name;
  }
  if (questionnaireTools.isUri(qre.url) !== true) {
    delete qre.url;
  }
  if (!qre.publisher) {
    delete qre.publisher;
  }
  if (!qre.purpose) {
    delete qre.purpose;
  }
  if (!qre.description) {
    delete qre.description;
  }
  if (!qre.copyright) {
    delete qre.copyright;
  }
  if (!qre.copyrightLabel) {
    delete qre.copyrightLabel;
  }
  filterContact(qre);
  filterUseContext(qre);
  filterEffectivePeriod(qre);
  filterDate(qre);
  filterApprovalDate(qre);
  filterLastReviewDate(qre);
  filterVersionAlgorithm(qre);
  filterDerivedFrom(qre);
  filterCode(qre);
  filterIdentifiers(qre);
  if (qre.code.length === 0) {
    delete (qre as Partial<Questionnaire>).code;
  }
  filterExtension(qre.extension);
  if (qre.extension.length === 0) {
    delete (qre as Partial<Questionnaire>).extension;
  }
  filterExtension(qre.modifierExtension);
  if (qre.modifierExtension.length === 0) {
    delete (qre as Partial<Questionnaire>).modifierExtension;
  }
  for (const item of qre.item) {
    filterItem(item);
  }
  if (qre.item.length === 0) {
    delete (qre as Partial<Questionnaire>).item;
  }
  return qre;
}

function filterInitial(item: Item): void {
  for (let i = item.initial.length - 1; i >= 0; i--) {
    const initial = item.initial[i];
    switch (initial.__type) {
      case "boolean":
        if (initial.valueBoolean !== true && initial.valueBoolean !== false) {
          item.initial.splice(i, 1);
        }
        break;
      case "decimal":
        if (typeof initial.valueDecimal !== "number") {
          item.initial.splice(i, 1);
        }
        break;
      case "integer":
        if (!Number.isInteger(initial.valueInteger)) {
          item.initial.splice(i, 1);
        }
        break;
      case "date":
        if (dateTools.isDate(initial.valueDate) !== true) {
          item.initial.splice(i, 1);
        }
        break;
      case "dateTime":
        if (dateTools.isDateTime(initial.valueDateTime) !== true) {
          item.initial.splice(i, 1);
        }
        break;
      case "time":
        if (dateTools.isTime(initial.valueTime) !== true) {
          item.initial.splice(i, 1);
        }
        break;
      case "string":
        if (!initial.valueString) {
          item.initial.splice(i, 1);
        }
        break;
      case "url":
        if (questionnaireTools.isUri(initial.valueUri) !== true) {
          item.initial.splice(i, 1);
        }
        break;
      case "coding":
        filterCoding(initial.valueCoding);
        if (editorTools.isEmptyObject(initial.valueCoding)) {
          item.initial.splice(i, 1);
        }
        break;
      case "quantity":
        filterQuantity(initial.valueQuantity);
        if (editorTools.isEmptyObject(initial.valueQuantity)) {
          item.initial.splice(i, 1);
        }
        break;
      case "reference":
        filterReference(initial.valueReference);
        if (editorTools.isEmptyObject(initial.valueReference)) {
          item.initial.splice(i, 1);
        }
        break;
      case "attachment":
        filterAttachment(initial.valueAttachment);
        if (editorTools.isEmptyObject(initial.valueAttachment)) {
          item.initial.splice(i, 1);
        }
        break;
      default:
        throw new UnreachableError(initial);
    }
  }
  if (!item.repeats && item.initial.length > 1) {
    item.initial = [item.initial[0]];
  }
}

function filterItem(item: Item): void {
  filterExtension(item.extension);
  if (item.extension.length === 0) {
    delete (item as Partial<Item>).extension;
  }
  filterExtension(item.modifierExtension);
  if (item.modifierExtension.length === 0) {
    delete (item as Partial<Item>).modifierExtension;
  }
  filterCode(item);
  if (item.code.length === 0) {
    delete (item as Partial<Item>).code;
  }

  if (!item.prefix) {
    delete item.prefix;
  }

  if (!item.disabledDisplay) {
    delete (item as Partial<Item>).disabledDisplay;
  }

  if (item.__answerValueSetCheck) {
    delete item.answerOption;
    if (questionnaireTools.isCanonical(item.answerValueSet) !== true) {
      delete item.answerValueSet;
    }
  } else {
    delete item.answerValueSet;
    if (item.answerOption !== undefined) {
      for (let i = item.answerOption.length - 1; i >= 0; i--) {
        const answer = item.answerOption[i];
        filterExtension(answer.extension);
        const itemWeightIndex = answer.extension.findIndex(
          (e) => e.url === ITEM_WEIGHT_URL && e.__type === "decimal",
        );
        if (itemWeightIndex < 0) {
          if (answer.__itemWeight != null) {
            answer.extension.push(getItemWeightExtension(answer.__itemWeight));
          }
        } else {
          if (answer.__itemWeight != null) {
            const ext = answer.extension[itemWeightIndex];
            if (ext.__type === "decimal") {
              ext.valueDecimal = answer.__itemWeight;
            }
          } else {
            answer.extension.splice(itemWeightIndex, 1);
          }
        }
        if (answer.extension.length === 0) {
          delete (answer as Partial<AnswerOption>).extension;
        }
        switch (answer.__type) {
          case "coding":
            if (answer.valueCoding !== undefined) {
              filterCoding(answer.valueCoding);
            }
            if (editorTools.isEmptyObject(answer.valueCoding)) {
              item.answerOption.splice(i, 1);
            }
            break;
          case "decimal":
            if (editorTools.onlyStringFalsy(answer.valueDecimal)) {
              item.answerOption.splice(i, 1);
            } else if (typeof answer.valueDecimal === "string") {
              answer.valueDecimal = Number(answer.valueDecimal);
            }
            break;
          case "integer":
            if (editorTools.onlyStringFalsy(answer.valueInteger)) {
              item.answerOption.splice(i, 1);
            } else if (typeof answer.valueInteger === "string") {
              answer.valueInteger = parseInt(answer.valueInteger);
            }
            break;
          case "date":
            if (dateTools.isDate(answer.valueDate) !== true) {
              item.answerOption.splice(i, 1);
            }
            break;
          case "dateTime":
            if (dateTools.isDateTime(answer.valueDateTime) !== true) {
              item.answerOption.splice(i, 1);
            }
            break;
          case "time":
            if (dateTools.isTime(answer.valueTime) !== true) {
              item.answerOption.splice(i, 1);
            }
            break;
          case "text":
          case "string":
            if (!answer.valueString) {
              item.answerOption.splice(i, 1);
            }
            break;
          case "url":
            if (questionnaireTools.isUri(answer.valueUri) !== true) {
              item.answerOption.splice(i, 1);
            }
            break;
          case "quantity":
            if (answer.valueQuantity !== undefined) {
              filterQuantity(answer.valueQuantity);
            }
            if (editorTools.isEmptyObject(answer.valueQuantity)) {
              item.answerOption.splice(i, 1);
            }
            break;
          case "reference":
            if (answer.valueReference !== undefined) {
              filterReference(answer.valueReference);
            }
            if (editorTools.isEmptyObject(answer.valueReference)) {
              item.answerOption.splice(i, 1);
            }
            break;
          default:
            throw new UnreachableError(answer.__type);
        }
      }
      if (item.answerOption.length === 0) {
        delete item.answerOption;
      } else {
        if (!item.repeats) {
          const firstSelected = item.answerOption.findIndex(
            (a) => a.initialSelected,
          );
          for (let i = firstSelected + 1; i < item.answerOption.length; i++) {
            item.answerOption[i].initialSelected = false;
          }
        }
      }
    }
  }

  if (
    !item.answerConstraint || item.__answerValueSetCheck
      ? !item.answerValueSet
      : itemTools.undefinedAnswerOption(item)
  ) {
    delete item.answerConstraint;
  }

  if (editorTools.emptyArray(item.answerOption)) {
    filterInitial(item);
    if (item.initial.length === 0) {
      delete (item as Partial<Item>).initial;
    }
  } else {
    delete (item as Partial<Item>).initial;
  }

  for (let i = item.enableWhen.length - 1; i >= 0; i--) {
    const enableWhen = item.enableWhen[i];
    if (
      !enableWhen.question ||
      !enableWhen.operator ||
      !operators.includes(enableWhen.operator)
    ) {
      item.enableWhen.splice(i, 1);
    } else if (enableWhen.operator === "exists") {
      if (enableWhen.__answer !== "true" && enableWhen.__answer !== "false") {
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
              enableWhen.answerDecimal = parseFloat(enableWhen.__answer);
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
              enableWhen.answerInteger = parseInt(enableWhen.__answer);
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
          if (!enableWhen.__answer) {
            item.enableWhen.splice(i, 1);
          } else {
            clearEnableWhenAnswers(enableWhen);
            enableWhen.answerString = enableWhen.__answer;
          }
          break;
        case "url":
          if (!enableWhen.__answer) {
            item.enableWhen.splice(i, 1);
          } else {
            clearEnableWhenAnswers(enableWhen);
            enableWhen.answerUri = enableWhen.__answer;
          }
          break;
        case "coding":
          if (enableWhen.__orString) {
            clearOptionsOrString(item, i);
          } else {
            if (enableWhen.answerCoding !== undefined) {
              filterCoding(enableWhen.answerCoding);
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
              filterQuantity(enableWhen.answerQuantity);
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
              filterReference(enableWhen.answerReference);
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
        case "attachment":
          if (enableWhen.answerAttachment) {
            filterAttachment(enableWhen.answerAttachment);
          }
          if (editorTools.isEmptyObject(enableWhen.answerAttachment)) {
            item.enableWhen.splice(i, 1);
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
    delete (item as Partial<Item>).enableWhen;
  }

  if (!item.enableBehavior) {
    delete item.enableBehavior;
  }

  // Clearing input field in GUI sets value to empty string
  if (typeof item.maxLength !== "number" || !allowsMaxLength(item)) {
    delete item.maxLength;
  }

  if (item.item !== undefined) {
    // For items within item
    for (const child of item.item) {
      filterItem(child);
    }
    // Item must be deleted when empty
    if (item.item.length === 0) {
      delete item.item;
    }
  }
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

const exportTools = {
  getExportObject(jsonObject: Questionnaire): Questionnaire {
    const cloneObject = editorTools.clone(jsonObject);
    const objWithoutItemsDisabled = getFilteredQuestionnaire(cloneObject);
    const finalObj = createQuestionnaireExportCopy(objWithoutItemsDisabled);
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
  serializeToJSON(obj: Questionnaire | QuestionnaireBundle): string {
    return JSON.stringify(obj, null, 2);
  },
};

export { exportTools };
