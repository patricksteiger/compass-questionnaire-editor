import { i18n } from "@/i18n";
import { v4 as uuidv4 } from "uuid";
import { ItemType } from "./constants";

class ItemTools {
  createInternalId(): string {
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
}

export const itemTools = new ItemTools();
