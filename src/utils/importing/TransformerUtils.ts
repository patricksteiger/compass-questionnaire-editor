import { ParsedItem } from "./parsing/item";
import { ParsedQuestionnaire } from "./parsing/questionnaire";

class ValidatorUtils {
  getItemByLinkId(
    qre: ParsedQuestionnaire,
    linkId: string,
  ): ParsedItem | undefined {
    if (qre.item === undefined) return undefined;
    return this.getItemByLinkIdHelper(qre.item, linkId);
  }

  private getItemByLinkIdHelper(
    items: ParsedItem[],
    linkId: string,
  ): ParsedItem | undefined {
    for (const item of items) {
      if (item.linkId === linkId) return item;
      if (this.emptyList(item.item)) continue;
      const result = this.getItemByLinkIdHelper(item.item, linkId);
      if (result !== undefined) return result;
    }
    return undefined;
  }

  emptyList<T>(list: T[] | undefined): list is undefined {
    return list === undefined || list.length === 0;
  }

  nonEmptyList<T>(list: T[] | undefined): list is T[] {
    return list !== undefined && list.length > 0;
  }
}

export const validatorUtils = new ValidatorUtils();
