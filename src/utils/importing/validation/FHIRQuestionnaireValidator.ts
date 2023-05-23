import { editorTools } from "@/utils/editor";
import { ParsedQuestionnaire } from "../parsing/questionnaire";
import { FHIRItemValidator } from "./FHIRItemValidator";
import { fhirValidatorUtils } from "./FHIRValidatorUtils";

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
    const errors: string[] = [];
    const warnings: string[] = [];
    this.validateVersionAlgorithm(qre, errors);
    this.validateExtension(qre, errors);
    if (editorTools.nonEmptyArray(qre.item)) {
      const itemValidator = new FHIRItemValidator(qre, errors, warnings);
      for (const item of qre.item) {
        itemValidator.validate(item, 1);
      }
    }
    if (errors.length > 0) {
      return { state: "error", errors, warnings };
    } else if (warnings.length > 0) {
      return { state: "warning", data: qre, warnings };
    } else {
      return { state: "success", data: qre };
    }
  }

  private validateExtension(qre: ParsedQuestionnaire, errors: string[]): void {
    if (qre.extension === undefined) return;
    for (const extension of qre.extension) {
      const count = fhirValidatorUtils.countValueInvariants(extension);
      if (count === 0) {
        errors.push(
          `Questionnaire "${qre.language}" has extension with no value.`,
        );
      } else if (count > 1) {
        errors.push(
          `Questionnaire "${qre.language}" has extension with multiple values.`,
        );
      }
    }
  }

  private validateVersionAlgorithm(
    qre: ParsedQuestionnaire,
    errors: string[],
  ): void {
    if (
      qre.versionAlgorithmString &&
      qre.versionAlgorithmCoding !== undefined
    ) {
      errors.push(
        `Questionnaire "${qre.language}" has versionAlgorithm defined as string and coding. Only 1 is allowed.`,
      );
    }
  }
}
