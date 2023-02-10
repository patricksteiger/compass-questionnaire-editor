import { Item, Questionnaire } from "../types";
import { getDefaultQuestionnaire, Language } from "../store";
import { v4 as uuidv4 } from "uuid";
import { itemTools } from "./item";

class LanguageTools {
  private uniquifyItems(items: Item[]): void {
    for (const item of items) {
      item.__internalID = itemTools.createInternalId();
      item.definition = uuidv4();
      item.__newDefinition = true;
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
    const items: Item[] = JSON.parse(JSON.stringify(questionnaire.item));
    newQRE.item = items;
    this.uniquifyItems(newQRE.item);
    return newQRE;
  }
}

export const languageTools = new LanguageTools();
