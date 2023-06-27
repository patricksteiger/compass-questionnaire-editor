import {
  DerivedFromExtension,
  derivedFromExtensionUrl,
  DerivedFromExtensionValue,
  EnableWhen,
  Item,
  Questionnaire,
  UsageContext,
  UseContextType,
} from "@/types";
import { UnreachableError } from "./editor";
import { itemTools } from "./item";

// Source: https://www.hl7.org/fhir/R5/datatypes.html#id
const ID_REGEXP = /[A-Za-z0-9\-.]{1,64}/g;
// Source: https://www.hl7.org/fhir/R5/datatypes.html#uri
const URI_REGEXP = /\S*/g;
// Source: https://www.hl7.org/fhir/R5/questionnaire-definitions.html#Questionnaire.name
const NAME_REGEXP = /^[A-Z]([A-Za-z0-9_]){1,254}$/g;

class QuestionnaireTools {
  private enableWhenDependsOnHelper(
    items: Item[],
    linkIDs: Set<string>,
  ): boolean {
    for (const item of items) {
      for (const enableWhen of item.enableWhen ?? []) {
        if (linkIDs.has(enableWhen.question)) {
          return true;
        }
      }
      if (item.item) {
        const result = this.enableWhenDependsOnHelper(item.item, linkIDs);
        if (result) return true;
      }
    }
    return false;
  }

  enableWhenDependsOn(questionnaire: Questionnaire, item: Item): boolean {
    const linkIDs = itemTools.getAllLinkIDs(item);
    return this.enableWhenDependsOnHelper(questionnaire.item, linkIDs);
  }

  private isEnableWhenConditionHelper(item: Item[], linkId: string): boolean {
    for (const element of item) {
      if (element.enableWhen !== undefined) {
        for (const condition of element.enableWhen) {
          if (condition.question === linkId) {
            return true;
          }
        }
      }

      if (element.item) {
        const found = this.isEnableWhenConditionHelper(element.item, linkId);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  isEnableWhenCondition(questionnaire: Questionnaire, linkId: string): boolean {
    return this.isEnableWhenConditionHelper(questionnaire.item, linkId);
  }

  getBranchContainingInternalLinkID(
    questionnaire: Questionnaire,
    linkID: string,
  ): [Item[], number] | undefined {
    return this.getBranchContainingInternalLinkIDHelper(
      questionnaire.item,
      linkID,
    );
  }

  private getBranchContainingInternalLinkIDHelper(
    items: Item[],
    linkID: string,
  ): [Item[], number] | undefined {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.__linkId === linkID) {
        return [items, i];
      }
      if (item.item === undefined) continue;
      const result = this.getBranchContainingInternalLinkIDHelper(
        item.item,
        linkID,
      );
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getItemByInternalId(
    questionnaire: Questionnaire,
    internalId: string,
  ): Item | undefined {
    return itemTools.getItemByInternalId(internalId, questionnaire.item);
  }

  getItemByLinkId(
    questionnaire: Questionnaire,
    linkId: string,
  ): Item | undefined {
    return itemTools.getItemByLinkId(linkId, questionnaire.item);
  }

  getItemByInternalLinkId(id: string, questionnaire: Questionnaire): Item {
    const digits = id.split(".");
    // Number-constructor, since parseInt has strange behavior at times
    const indeces = digits.map(Number);
    let item = questionnaire.item[indeces[0]];
    for (let i = 1; i < indeces.length; i++) {
      const index = indeces[i];
      item = item.item![index];
    }
    return item;
  }

  getLinkIdsExcept(questionnaire: Questionnaire, linkId: string): string[] {
    const linkIds: string[] = [];
    this.getLinkIdsExceptHelper(questionnaire.item, linkId, linkIds);
    return linkIds;
  }

  private getLinkIdsExceptHelper(
    items: Item[],
    linkId: string,
    linkIds: string[],
  ): void {
    for (const item of items) {
      if (item.linkId !== linkId) {
        linkIds.push(item.linkId);
      }
      if (item.item !== undefined) {
        this.getLinkIdsExceptHelper(item.item, linkId, linkIds);
      }
    }
  }

  hasNotMultipleItems(qre: Questionnaire): boolean {
    const items = qre.item;
    return (
      items.length === 0 ||
      (items.length === 1 &&
        (items[0].item === undefined || items[0].item.length === 0))
    );
  }

  linkIdExistsInQuestionnaire(
    questionnaire: Questionnaire,
    linkId: string,
  ): boolean {
    const item = this.getItemByLinkId(questionnaire, linkId);
    return item !== undefined;
  }

  getEnableWhenWithLinkId(
    questionnaire: Questionnaire,
    linkId: string,
  ): EnableWhen[] {
    const result: EnableWhen[] = [];
    this.getEnableWhenWithLinkIdHelper(questionnaire.item, linkId, result);
    return result;
  }

  private getEnableWhenWithLinkIdHelper(
    items: Item[],
    linkId: string,
    enableWhen: EnableWhen[],
  ): void {
    for (const item of items) {
      if (item.enableWhen !== undefined) {
        for (const e of item.enableWhen) {
          if (e.question === linkId) enableWhen.push(e);
        }
      }
      if (item.item !== undefined) {
        this.getEnableWhenWithLinkIdHelper(item.item, linkId, enableWhen);
      }
    }
  }

  getUsageContextFrom(type: UseContextType): UsageContext {
    switch (type) {
      case "codeableConcept":
        return {
          __type: type,
          code: {},
          valueCodeableConcept: { coding: [] },
        };
      case "quantity":
        return { __type: type, code: {}, valueQuantity: {} };
      case "range":
        return { __type: type, code: {}, valueRange: {} };
      case "reference":
        return { __type: type, code: {}, valueReference: {} };
      default:
        throw new UnreachableError(type);
    }
  }

  getDerivedFromExtension(
    type: DerivedFromExtensionValue | null,
  ): DerivedFromExtension {
    switch (type) {
      case null:
        return {
          url: derivedFromExtensionUrl,
          __value: null,
        };
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

  containsNonWhitespace(s: string | undefined | null): true | string {
    return (
      (!!s && /\S/g.test(s)) ||
      "string has to contain non-whitespace characters"
    );
  }

  isId(id: string | null | undefined): true | string {
    if (!id) return "id has to be non-empty";
    const match = id.match(ID_REGEXP);
    return (
      (match !== null && match.length > 0 && id.length === match[0].length) ||
      "ID can only contain a-z, A-Z, 0-9, . and - with a max length of 64"
    );
  }

  isIdOrEmpty(id: string | null | undefined): true | string {
    if (!id) return true;
    const match = id.match(ID_REGEXP);
    return (
      (match !== null && match.length > 0 && id.length === match[0].length) ||
      "ID can only contain a-z, A-Z, 0-9, . and - with a max length of 64"
    );
  }

  isUri(uri: string | null | undefined): true | string {
    if (!uri) return "id has to be non-empty";
    const match = uri.match(URI_REGEXP);
    return (
      (match !== null && match.length > 0 && uri.length === match[0].length) ||
      "URI cannot contain whitespace"
    );
  }

  isUriOrEmpty(uri: string | null | undefined): true | string {
    if (!uri) return true;
    const match = uri.match(URI_REGEXP);
    return (
      (match !== null && match.length > 0 && uri.length === match[0].length) ||
      "URI cannot contain whitespace"
    );
  }

  isCanonical(uri: string | null | undefined): true | string {
    if (!uri) return "Cannonical-URI has to be non-empty";
    const match = uri.match(URI_REGEXP);
    return (
      (match !== null && match.length > 0 && uri.length === match[0].length) ||
      "Cannonical-URI cannot contain whitespace"
    );
  }

  isCanonicalOrEmpty(uri: string | null | undefined): true | string {
    if (!uri) return true;
    const match = uri.match(URI_REGEXP);
    return (
      (match !== null && match.length > 0 && uri.length === match[0].length) ||
      "Cannonical-URI cannot contain whitespace"
    );
  }

  isName(name: string | null | undefined): true | string {
    if (!name) return "name has to be non-empty";
    const match = name.match(NAME_REGEXP);
    return (
      (match !== null && match.length > 0 && name.length === match[0].length) ||
      "Name has to start with A-Z, continue with at least 1 alphanumerical or underscore character, with max length of 255"
    );
  }

  isNameOrEmpty(name: string | null | undefined): true | string {
    if (!name) return true;
    const match = name.match(NAME_REGEXP);
    return (
      (match !== null && match.length > 0 && name.length === match[0].length) ||
      "Name has to start with A-Z, continue with at least 1 alphanumerical or underscore character, with max length of 255"
    );
  }
}

export const questionnaireTools = new QuestionnaireTools();
