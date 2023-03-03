import { FHIRItem } from "./item";
import { FHIRQuestionnaire } from "./questionnaire";

class ValidatorUtils {
  sortItemsByLinkId(items: FHIRItem[]): void {
    items.sort(this.sortByLinkId);
    for (const item of items) {
      if (this.nonEmptyList(item.item)) {
        this.sortItemsByLinkId(item.item);
      }
    }
  }

  private sortByLinkId(i1: FHIRItem, i2: FHIRItem): number {
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
    qre: FHIRQuestionnaire,
    linkId: string,
  ): FHIRItem | undefined {
    return this.getItemByLinkIdHelper(qre.item, linkId);
  }

  private getItemByLinkIdHelper(
    items: FHIRItem[],
    linkId: string,
  ): FHIRItem | undefined {
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
