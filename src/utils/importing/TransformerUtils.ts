import { ParsedItem } from "./parsing/item";
import { ParsedQuestionnaire } from "./parsing/questionnaire";

class ValidatorUtils {
  sortItemsByLinkId(items: ParsedItem[]): void {
    items.sort(this.sortByLinkId);
    for (const item of items) {
      if (this.nonEmptyList(item.item)) {
        this.sortItemsByLinkId(item.item);
      }
    }
  }

  private sortByLinkId(i1: ParsedItem, i2: ParsedItem): number {
    const nums1 = i1.linkId.split(".");
    const nums2 = i2.linkId.split(".");
    const last1 = nums1.at(-1);
    const last2 = nums2.at(-1);
    if (last1 === undefined && last2 === undefined) return 0;
    if (last1 === undefined) return -1;
    if (last2 === undefined) return 1;
    return parseInt(last1) - parseInt(last2);
  }

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
