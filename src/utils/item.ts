import { i18n } from "@/i18n";
import { Extension, ExtensionType, Initial, Item } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  allowsAnswerOption,
  getItemTypeIcon,
  InitialItem,
  ItemType,
} from "./constants";
import { dateTools } from "./date";
import { UnreachableError } from "./editor";
import { getHiddenExtension } from "./extension";
import { ParsedItem } from "./importing/parsing/item";

class ItemTools {
  createInternalId(): string {
    return `${uuidv4()}-${Date.now()}`;
  }
  createAnswerOptionId(): string {
    return `${uuidv4()}-${Date.now()}`;
  }
  getDefaultText(): string {
    return i18n.global.t("views.editor.newQuestion");
  }
  getDefaultRequired(type: ItemType): false | undefined {
    return type !== "display" ? false : undefined;
  }
  getDefaultRepeats(type: ItemType): false | undefined {
    return type !== "display" ? false : undefined;
  }
  getDefaultReadOnly(type: ItemType): false | undefined {
    return type !== "display" ? false : undefined;
  }
  definedAnswerChoices(item: Item | ParsedItem): boolean {
    return !this.undefinedAnswerChoices(item);
  }
  undefinedAnswerChoices(item: Item | ParsedItem): boolean {
    return (
      this.undefinedAnswerOption(item) && this.undefinedAnswerValueSet(item)
    );
  }
  undefinedAnswerOption(item: Item | ParsedItem): boolean {
    return !item.answerOption || item.answerOption.length === 0;
  }
  undefinedAnswerValueSet(item: Item | ParsedItem): boolean {
    return !item.answerValueSet;
  }
  definedAnswerOption(item: Item | ParsedItem): boolean {
    return !this.undefinedAnswerOption(item);
  }
  definedAnswerValueSet(item: Item | ParsedItem): boolean {
    return !this.undefinedAnswerValueSet(item);
  }

  private getAllLinkIDsHelper(item: Item, linkIDs: Set<string>): void {
    if (!item.__active) return;
    linkIDs.add(item.linkId);
    if (item.item === undefined) return;
    for (const element of item.item) {
      this.getAllLinkIDsHelper(element, linkIDs);
    }
  }

  getAllLinkIDs(item: Item): Set<string> {
    const linkIDs = new Set<string>();
    this.getAllLinkIDsHelper(item, linkIDs);
    return linkIDs;
  }

  getAllLinkIDsStrict(item: Item): Set<string> {
    const linkIDs = new Set<string>();
    this.getAllLinkIDsStrictHelper(item, linkIDs);
    return linkIDs;
  }

  private getAllLinkIDsStrictHelper(item: Item, linkIDs: Set<string>): void {
    linkIDs.add(item.linkId);
    if (item.item === undefined) return;
    for (const element of item.item) {
      this.getAllLinkIDsStrictHelper(element, linkIDs);
    }
  }

  getItemByInternalId(
    internalId: string,
    rootItem: Item[] | undefined,
  ): Item | undefined {
    if (rootItem !== undefined) {
      for (const item of rootItem) {
        if (item.__internalID === internalId) {
          return item;
        }
        const result = this.getItemByInternalId(internalId, item.item);
        if (result !== undefined) {
          return result;
        }
      }
    }
    return undefined;
  }

  getItemByLinkId(linkId: string, rootItem: Item[]): Item | undefined {
    for (const item of rootItem) {
      if (item.linkId === linkId) {
        return item;
      }
      if (item.item === undefined) continue;
      const result = this.getItemByLinkId(linkId, item.item);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  private createNewItem(linkId: string, type: ItemType): Item {
    return {
      type: type,
      __icon: getItemTypeIcon(type),
      __internalID: itemTools.createInternalId(),
      __active: true,
      __disabled: false,
      __linkId: "",
      __newQuestion: true,
      __answerValueSetCheck: false,
      item: undefined,
      linkId: linkId,
      disabledDisplay: null,
      text: itemTools.getDefaultText(),
      extension: [getHiddenExtension()],
      required: itemTools.getDefaultRequired(type),
      repeats: itemTools.getDefaultRepeats(type),
      readOnly: itemTools.getDefaultReadOnly(type),
      initial: [],
      code: [],
    };
  }

  createItemWithType(linkId: string, questionType: ItemType): Item {
    const item = this.createNewItem(linkId, questionType);
    if (allowsAnswerOption(item.type)) {
      item.answerOption = [];
      item.__OldAnswerValueSet = item.answerValueSet = "";
      item.__answerValueSetCheck = false;
    }
    return item;
  }

  getInitialFrom(item: InitialItem): Initial {
    switch (item.type) {
      case "boolean":
        return { __type: "boolean", valueBoolean: false };
      case "decimal":
        return { __type: "decimal", valueDecimal: 0 };
      case "integer":
        return { __type: "integer", valueInteger: 0 };
      case "date":
        return { __type: "date", valueDate: dateTools.getCurrentDate() };
      case "dateTime":
        return {
          __type: "dateTime",
          valueDateTime: dateTools.getCurrentDateTime(),
        };
      case "time":
        return { __type: "time", valueTime: dateTools.getCurrentTime() };
      case "text":
      case "string":
        return { __type: "string", valueString: "" };
      case "url":
        return { __type: "url", valueUri: "" };
      case "coding":
        return { __type: "coding", valueCoding: {} };
      case "quantity":
        return { __type: "quantity", valueQuantity: {} };
      case "reference":
        return { __type: "reference", valueReference: {} };
      case "attachment":
        return { __type: "attachment", valueAttachment: {} };
      default:
        throw new UnreachableError(item.type);
    }
  }

  getExtensionFrom(url: string, type: ExtensionType): Extension {
    switch (type) {
      case "boolean":
        return { url, __type: type, valueBoolean: true };
      case "code":
        return { url, __type: type, valueCode: "" };
      case "decimal":
        return { url, __type: type, valueDecimal: 0 };
      case "integer":
        return { url, __type: type, valueInteger: 0 };
      case "date":
        return { url, __type: type, valueDate: dateTools.getCurrentDate() };
      case "dateTime":
        return {
          url,
          __type: type,
          valueDateTime: dateTools.getCurrentDateTime(),
        };
      case "time":
        return { url, __type: type, valueTime: dateTools.getCurrentTime() };
      case "string":
        return { url, __type: type, valueString: "" };
      case "markdown":
        return { url, __type: type, valueMarkdown: "" };
      case "complex":
        return { url, __type: type, extension: [] };
      default:
        throw new UnreachableError(type);
    }
  }
}

export const itemTools = new ItemTools();
