import { EnableWhen, Item, Questionnaire } from "@/types";
import { itemTools } from "./item";

class QuestionnaireTools {
  private enableWhenDependsOnHelper(
    items: Item[],
    linkIDs: Set<string>,
  ): boolean {
    for (const item of items) {
      for (const enableWhen of item.enableWhen ?? []) {
        if (linkIDs.has(enableWhen.question)) {
          return true;
        }
      }
      if (item.item) {
        const result = this.enableWhenDependsOnHelper(item.item, linkIDs);
        if (result) return true;
      }
    }
    return false;
  }

  enableWhenDependsOn(questionnaire: Questionnaire, item: Item): boolean {
    const linkIDs = itemTools.getAllLinkIDs(item);
    return this.enableWhenDependsOnHelper(questionnaire.item, linkIDs);
  }

  private isEnableWhenConditionHelper(item: Item[], linkId: string): boolean {
    for (const element of item) {
      if (element.enableWhen !== undefined) {
        for (const condition of element.enableWhen) {
          if (condition.question === linkId) {
            return true;
          }
        }
      }

      if (element.item) {
        const found = this.isEnableWhenConditionHelper(element.item, linkId);
        if (found) {
          return true;
        }
      }
    }
    return false;
  }

  isEnableWhenCondition(questionnaire: Questionnaire, linkId: string): boolean {
    return this.isEnableWhenConditionHelper(questionnaire.item, linkId);
  }

  getBranchContainingInternalLinkID(
    questionnaire: Questionnaire,
    linkID: string,
  ): [Item[], number] | undefined {
    return this.getBranchContainingInternalLinkIDHelper(
      questionnaire.item,
      linkID,
    );
  }

  private getBranchContainingInternalLinkIDHelper(
    items: Item[],
    linkID: string,
  ): [Item[], number] | undefined {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.__linkId === linkID) {
        return [items, i];
      }
      if (item.item === undefined) continue;
      const result = this.getBranchContainingInternalLinkIDHelper(
        item.item,
        linkID,
      );
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  getItemByInternalId(
    questionnaire: Questionnaire,
    internalId: string,
  ): Item | undefined {
    return itemTools.getItemByInternalId(internalId, questionnaire.item);
  }

  getItemByLinkId(
    questionnaire: Questionnaire,
    linkId: string,
  ): Item | undefined {
    return itemTools.getItemByLinkId(linkId, questionnaire.item);
  }

  getItemByInternalLinkId(id: string, questionnaire: Questionnaire): Item {
    const digits = id.split(".");
    // Number-constructor, since parseInt has strange behavior at times
    const indeces = digits.map(Number);
    let item = questionnaire.item[indeces[0]];
    for (let i = 1; i < indeces.length; i++) {
      const index = indeces[i];
      item = item.item![index];
    }
    return item;
  }

  getLinkIdsExcept(questionnaire: Questionnaire, linkId: string): string[] {
    const linkIds: string[] = [];
    this.getLinkIdsExceptHelper(questionnaire.item, linkId, linkIds);
    return linkIds;
  }

  private getLinkIdsExceptHelper(
    items: Item[],
    linkId: string,
    linkIds: string[],
  ): void {
    for (const item of items) {
      if (item.linkId !== linkId) {
        linkIds.push(item.linkId);
      }
      if (item.item !== undefined) {
        this.getLinkIdsExceptHelper(item.item, linkId, linkIds);
      }
    }
  }

  hasNotMultipleItems(qre: Questionnaire): boolean {
    const items = qre.item;
    return (
      items.length === 0 ||
      (items.length === 1 &&
        (items[0].item === undefined || items[0].item.length === 0))
    );
  }

  linkIdExistsInQuestionnaire(
    questionnaire: Questionnaire,
    linkId: string,
  ): boolean {
    const item = this.getItemByLinkId(questionnaire, linkId);
    return item !== undefined;
  }

  getEnableWhenWithLinkId(
    questionnaire: Questionnaire,
    linkId: string,
  ): EnableWhen[] {
    const result: EnableWhen[] = [];
    this.getEnableWhenWithLinkIdHelper(questionnaire.item, linkId, result);
    return result;
  }

  private getEnableWhenWithLinkIdHelper(
    items: Item[],
    linkId: string,
    enableWhen: EnableWhen[],
  ): void {
    for (const item of items) {
      if (item.enableWhen !== undefined) {
        for (const e of item.enableWhen) {
          if (e.question === linkId) enableWhen.push(e);
        }
      }
      if (item.item !== undefined) {
        this.getEnableWhenWithLinkIdHelper(item.item, linkId, enableWhen);
      }
    }
  }
}

export const questionnaireTools = new QuestionnaireTools();
