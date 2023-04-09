import { Item, Questionnaire } from "../types";
import { getDefaultQuestionnaire, Language } from "../store";
import { itemTools } from "./item";
import { editorTools } from "./editor";

class LanguageTools {
  private uniquifyItems(items: Item[]): void {
    for (const item of items) {
      item.__internalID = itemTools.createInternalId();
      if (item.item) {
        this.uniquifyItems(item.item);
      }
    }
  }

  createCloneForLang(
    questionnaire: Questionnaire,
    language: Language,
  ): Questionnaire {
    const newQRE = getDefaultQuestionnaire(language);
    const items: Item[] = editorTools.clone(questionnaire.item);
    newQRE.item = items;
    this.uniquifyItems(newQRE.item);
    return newQRE;
  }
}

export const languageTools = new LanguageTools();
