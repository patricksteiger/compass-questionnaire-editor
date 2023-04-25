import { ParsedQuestionnaire } from "../parsing/questionnaire";
import { FHIRItemValidator } from "./FHIRItemValidator";

export type ValidationResult =
  | { state: "success"; data: ParsedQuestionnaire }
  | { state: "warning"; data: ParsedQuestionnaire; warnings: string[] }
  | { state: "error"; errors: string[]; warnings: string[] };

export class FHIRQuestionnaireValidator {
  constructor(private questionnaire: ParsedQuestionnaire) {}

  validate(): ValidationResult {
    const result = this.validateQuestionnaireItems(this.questionnaire);
    return result;
  }

  private validateQuestionnaireItems(
    qre: ParsedQuestionnaire,
  ): ValidationResult {
    if (qre.item === undefined) {
      return { state: "success", data: qre };
    }
    const errors: string[] = [];
    const warnings: string[] = [];
    const itemValidator = new FHIRItemValidator(qre, errors, warnings);
    for (const item of qre.item) {
      itemValidator.validate(item, 1);
    }
    this.validateExtension(qre, errors);
    if (errors.length > 0) {
      return { state: "error", errors, warnings };
    } else if (warnings.length > 0) {
      return { state: "warning", data: qre, warnings };
    } else {
      return { state: "success", data: qre };
    }
  }

  // TODO: refactor validation of extension for qre and items
  private validateExtension(qre: ParsedQuestionnaire, errors: string[]): void {
    if (qre.extension === undefined) return;
    for (const extension of qre.extension) {
      let count = 0;
      if (extension.valueBoolean !== undefined) count++;
      if (extension.valueCode !== undefined) count++;
      if (extension.valueDecimal !== undefined) count++;
      if (extension.valueInteger !== undefined) count++;
      if (extension.valueDate !== undefined) count++;
      if (extension.valueDateTime !== undefined) count++;
      if (extension.valueTime !== undefined) count++;
      if (extension.valueString !== undefined) count++;
      if (extension.valueMarkdown !== undefined) count++;
      if (count === 0) {
        errors.push(
          `Questionnaire "${qre.language}" has extension with no answer.`,
        );
      } else if (count > 1) {
        errors.push(
          `Questionnaire "${qre.language}" has extension with multiple answers.`,
        );
      }
    }
  }
}
