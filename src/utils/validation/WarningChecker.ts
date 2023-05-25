import { Item, Questionnaire } from "@/types";
import { COPYRIGHT_LABEL_LENGTH_LIMIT } from "../constants";

export type Warnings = {
  items: ItemWarning[];
  primary: string[];
  secondary: string[];
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

  static nonEmpty(warnings: Warnings): boolean {
    return (
      warnings.items.length > 0 ||
      warnings.primary.length > 0 ||
      warnings.secondary.length > 0
    );
  }

  validate(): Warnings {
    const items = this.items();
    const primary = this.primary();
    const secondary = this.secondary();
    return { items, primary, secondary };
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

  primary(): string[] {
    const { description, status, url } = this.questionnaire;
    const warnings: string[] = [];
    if (url) {
      if (url.includes("|")) {
        warnings.push("url should not include the character '|'");
      }
      if (url.includes("#")) {
        warnings.push("url should not include the character '#'");
      }
    }
    if (status === "unknown") {
      warnings.push("status is 'unknown'");
    }
    if (!description) {
      warnings.push("description is empty");
    }
    return warnings;
  }

  secondary(): string[] {
    const warnings: string[] = [];
    if (
      this.questionnaire.copyrightLabel &&
      this.questionnaire.copyrightLabel.length >= COPYRIGHT_LABEL_LENGTH_LIMIT
    ) {
      warnings.push(
        `CopyrightLabel should be less than ${COPYRIGHT_LABEL_LENGTH_LIMIT} characters`,
      );
    }
    return warnings;
  }
}
