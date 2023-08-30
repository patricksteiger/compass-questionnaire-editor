import {
  DerivedFromExtension,
  derivedFromExtensionUrl,
  DerivedFromExtensionValue,
  EnableWhen,
  Item,
  Narrative,
  NarrativeStatus,
  Questionnaire,
  UsageContext,
  UseContextType,
} from "@/types";
import { matches } from "./constants";
import { editorTools, UnreachableError } from "./editor";
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
      for (const enableWhen of item.enableWhen) {
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

  enableWhenDependsOn(
    questionnaire: Questionnaire,
    linkIDs: Set<string>,
  ): boolean {
    return this.enableWhenDependsOnHelper(questionnaire.item, linkIDs);
  }

  private isEnableWhenConditionHelper(item: Item[], linkId: string): boolean {
    for (const element of item) {
      for (const condition of element.enableWhen) {
        if (condition.question === linkId) {
          return true;
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
      for (const e of item.enableWhen) {
        if (e.question === linkId) enableWhen.push(e);
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
    return (
      matches(ID_REGEXP, id) ||
      "ID can only contain a-z, A-Z, 0-9, . and - with a max length of 64"
    );
  }

  isIdOrEmpty(id: string | null | undefined): true | string {
    return (
      !id ||
      matches(ID_REGEXP, id) ||
      "ID can only contain a-z, A-Z, 0-9, . and - with a max length of 64"
    );
  }

  isUri(uri: string | null | undefined): true | string {
    if (!uri) return "URI has to be non-empty";
    return matches(URI_REGEXP, uri) || "URI cannot contain whitespace";
  }

  isUriOrEmpty(uri: string | null | undefined): true | string {
    return !uri || matches(URI_REGEXP, uri) || "URI cannot contain whitespace";
  }

  isCanonical(uri: string | null | undefined): true | string {
    if (!uri) return "Cannonical-URI has to be non-empty";
    return (
      matches(URI_REGEXP, uri) || "Cannonical-URI cannot contain whitespace"
    );
  }

  isCanonicalOrEmpty(uri: string | null | undefined): true | string {
    return (
      !uri ||
      matches(URI_REGEXP, uri) ||
      "Cannonical-URI cannot contain whitespace"
    );
  }

  isName(name: string | null | undefined): true | string {
    if (!name) return "name has to be non-empty";
    return (
      matches(NAME_REGEXP, name) ||
      "Name has to start with A-Z, continue with at least 1 alphanumerical or underscore character, with max length of 255"
    );
  }

  isNameOrEmpty(name: string | null | undefined): true | string {
    return (
      !name ||
      matches(NAME_REGEXP, name) ||
      "Name has to start with A-Z, continue with at least 1 alphanumerical or underscore character, with max length of 255"
    );
  }

  generateText(qre: Questionnaire): Narrative {
    const status: NarrativeStatus = this.hasHiddenItem(qre.item)
      ? "extensions"
      : "generated";
    const items = this.generateItemText(qre.item, 0);
    const div = `<div xmlns="http://www.w3.org/1999/xhtml">\n    <p>\n    ${qre.title}\n    </p>\n    <pre>\n${items}    </pre>\n</div>`;
    return { status, div };
  }

  private generateItemText(items: Item[], prefixFreq: number): string {
    const whitespace = "    ".repeat(prefixFreq);
    let result = "";
    for (const item of items) {
      if (!item.__active) continue;
      const prefix = !item.prefix ? "" : `${item.prefix} `;
      let itemResult = `${whitespace}${prefix}${item.text}\n`;
      if (editorTools.nonEmptyArray(item.item)) {
        const child = this.generateItemText(item.item, prefixFreq + 1);
        itemResult += child;
      }
      result += itemResult;
    }
    return result;
  }

  private hasHiddenItem(items: Item[]): boolean {
    for (const item of items) {
      if (!item.__active) {
        return true;
      }
      if (editorTools.nonEmptyArray(item.item)) {
        const result = this.hasHiddenItem(item.item);
        if (result) {
          return true;
        }
      }
    }
    return false;
  }
}

export const questionnaireTools = new QuestionnaireTools();
