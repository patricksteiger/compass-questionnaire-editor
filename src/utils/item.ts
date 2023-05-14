import { i18n } from "@/i18n";
import { Initial, Item } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  allowsAnswerChoice,
  getItemTypeIcon,
  InitialItem,
  ItemType,
} from "./constants";
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
      item: undefined,
      linkId: linkId,
      text: itemTools.getDefaultText(),
      extension: [getHiddenExtension()],
      required: itemTools.getDefaultRequired(type),
      repeats: itemTools.getDefaultRepeats(type),
      initial: [],
    };
  }

  createItemWithType(linkId: string, questionType: ItemType): Item {
    const item = this.createNewItem(linkId, questionType);
    if (allowsAnswerChoice(item.type)) {
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
        return { __type: "date", valueDate: "2000-01-01" };
      case "dateTime":
        return {
          __type: "dateTime",
          valueDateTime: "2000-01-01T00:00:00+01:00",
        };
      case "time":
        return { __type: "time", valueTime: "00:00:00" };
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
        throw new Error(`Missing implementation for addInitial: ${item.type}`);
    }
  }
}

export const itemTools = new ItemTools();
