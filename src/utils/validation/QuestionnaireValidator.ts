import { Language } from "@/store";
import { EnableWhen, Item, Questionnaire } from "@/types";
import { dateTools } from "../date";
import { editorTools } from "../editor";
import { itemTools } from "../item";

export type Warning = {
  language: Language;
  metadata: string[];
  items: ItemWarning[];
};

export type ItemWarning = {
  linkId: string;
  internalId: string;
  warnings: string[];
};

export class QuestionnaireValidator {
  constructor(private readonly questionnaire: Questionnaire) {}

  check(): Warning {
    return {
      language: this.questionnaire.language,
      metadata: this.metadata(),
      items: this.items(),
    };
  }

  metadata(): string[] {
    const warnings: string[] = [];
    if (this.questionnaire.status === "unknown") {
      warnings.push("status is 'unknown'");
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
    this.enableWhen(item, warnings);
    this.answerOptionAndValueSetAndConstraint(item, warnings);
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

  private answerOptionAndValueSetAndConstraint(
    item: Item,
    warnings: string[],
  ): void {
    if (itemTools.noDefinedAnswerChoices(item) && item.answerConstraint) {
      warnings.push(
        "answerConstraint should not be defined, if answerValueSet and answerOption are undefined",
      );
    } else if (itemTools.definedAnswerChoices(item) && !item.answerConstraint) {
      warnings.push(
        "answerConstraint should be defined, if answerValueSet or answerOption are defined",
      );
    }
  }

  private enableWhen(item: Item, warnings: string[]): void {
    if (item.enableWhen === undefined) return;
    for (let i = 0; i < item.enableWhen.length; i++) {
      const enableWhen = item.enableWhen[i];
      this.enableWhenAnswer(enableWhen, i, warnings);
    }
  }

  // TODO: Better validation for answerOption answers
  private enableWhenAnswer(
    enableWhen: EnableWhen,
    index: number,
    warnings: string[],
  ): void {
    if (!enableWhen.answer) {
      warnings.push(`enableWhen at index ${index} has empty answer`);
      return;
    }
    if (enableWhen.operator === "exists") {
      if (enableWhen.answer !== "true" && enableWhen.answer !== "false") {
        warnings.push(
          `enableWhen at index ${index} has invalid answer for operator "${enableWhen.operator}"`,
        );
      }
      return;
    }
    if (enableWhen.type === "time") {
      if (!dateTools.isTime(enableWhen.answer)) {
        warnings.push(
          `enableWhen at index ${index} has invalid time answer "${enableWhen.answer}"`,
        );
      }
    } else if (enableWhen.type === "date") {
      if (!dateTools.isDate(enableWhen.answer)) {
        warnings.push(
          `enableWhen at index ${index} has invalid date answer "${enableWhen.answer}"`,
        );
      }
    } else if (enableWhen.type === "dateTime") {
      if (!dateTools.isDateTime(enableWhen.answer)) {
        warnings.push(
          `enableWhen at index ${index} has invalid dateTime answer "${enableWhen.answer}"`,
        );
      }
    } else if (enableWhen.type === "quantity") {
      if (
        enableWhen.answerQuantity === undefined ||
        editorTools.formatQuantity(enableWhen.answerQuantity) !==
          enableWhen.answer
      ) {
        warnings.push(
          `enableWhen at index ${index} has invalid quantity-answer`,
        );
      } else {
        if (!enableWhen.answerQuantity!.value) {
          warnings.push(
            `enableWhen at index ${index} has empty quantity-value`,
          );
        }
        if (!enableWhen.answerQuantity!.code) {
          warnings.push(`enableWhen at index ${index} has empty quantity-code`);
        }
      }
    } else if (enableWhen.type === "coding") {
      if (
        enableWhen.answerCoding === undefined ||
        editorTools.formatCoding(enableWhen.answerCoding) !== enableWhen.answer
      ) {
        warnings.push(`enableWhen at index ${index} has invalid coding-answer`);
      } else {
        if (!enableWhen.answerCoding!.code) {
          warnings.push(`enableWhen at index ${index} has empty coding-code`);
        }
      }
    } else if (enableWhen.type === "reference") {
      if (
        enableWhen.answerReference === undefined ||
        editorTools.formatReference(enableWhen.answerReference) !==
          enableWhen.answer
      ) {
        warnings.push(`enableWhen at index ${index} has invalid coding-answer`);
      } else if (
        enableWhen.answerReference === undefined ||
        (!enableWhen.answerReference.reference &&
          !enableWhen.answerReference.display &&
          !enableWhen.answerReference.type &&
          !enableWhen.answerReference.identifier)
      ) {
        warnings.push(`enableWhen at index ${index} has empty reference`);
      }
    }
  }

  private text(item: Item, warnings: string[]): void {
    if (!item.text) {
      warnings.push("Item has no text");
    }
  }
}
