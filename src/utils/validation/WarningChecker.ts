import { Item, Questionnaire } from "@/types";

export type Warnings = {
  metadata: string[];
  items: ItemWarning[];
};

export type ItemWarning = {
  linkId: string;
  internalId: string;
  warnings: string[];
};

export class WarningChecker {
  constructor(readonly questionnaire: Questionnaire) {}

  static check(questionnaire: Questionnaire): Warnings {
    return new WarningChecker(questionnaire).validate();
  }

  validate(): Warnings {
    const metadata = this.metadata();
    const items = this.items();
    return { metadata, items };
  }

  metadata(): string[] {
    const warnings: string[] = [];
    if (this.questionnaire.status === "unknown") {
      warnings.push("status is 'unknown'");
    }
    if (!this.questionnaire.description) {
      warnings.push("description is empty");
    }
    return warnings;
  }

  items(): ItemWarning[] {
    const result: ItemWarning[] = [];
    for (const item of this.questionnaire.item) {
      this.item(item, result);
    }
    return result;
  }

  private item(item: Item, itemWarnings: ItemWarning[]): void {
    const warnings: string[] = [];
    this.text(item, warnings);
    if (warnings.length > 0) {
      const warning: ItemWarning = {
        linkId: item.linkId,
        internalId: item.__internalID,
        warnings,
      };
      itemWarnings.push(warning);
    }
    if (item.item !== undefined) {
      for (const element of item.item) {
        this.item(element, itemWarnings);
      }
    }
  }

  private text(item: Item, warnings: string[]): void {
    if (!item.text) {
      warnings.push("Item has no text");
    }
  }
}
