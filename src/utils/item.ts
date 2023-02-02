import { i18n } from "@/i18n";
import { v4 as uuidv4 } from "uuid";

class ItemTools {
  createInternalId(): string {
    return `${uuidv4()}-${Date.now()}`;
  }
  getDefaultText(): string {
    return i18n.global.t("views.editor.newQuestion");
  }
}

export const itemTools = new ItemTools();
