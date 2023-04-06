import { i18n } from "@/i18n";
import { Item } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { ItemType } from "./constants";
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
  noDefinedAnswerChoices(item: Item | ParsedItem): boolean {
    return (
      !item.answerValueSet &&
      (!item.answerOption || item.answerOption.length === 0)
    );
  }
  definedAnswerChoices(item: Item | ParsedItem): boolean {
    return (
      (item.answerOption !== undefined && item.answerOption.length > 0) ||
      (item.answerValueSet !== undefined && item.answerValueSet.length > 0)
    );
  }
}

export const itemTools = new ItemTools();
