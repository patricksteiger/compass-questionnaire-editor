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
    this.validateUseContext(qre, errors);
    this.validateDerivedFrom(qre, errors);
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

  private validateDerivedFrom(
    qre: ParsedQuestionnaire,
    errors: string[],
  ): void {
    if (editorTools.emptyArray(qre._derivedFrom)) {
      return;
    }
    if (editorTools.emptyArray(qre.derivedFrom)) {
      errors.push(
        `Questionnaire "${qre.language}" has derivedFrom-extensions without derivedFrom-values.`,
      );
      return;
    } else if (qre._derivedFrom.length > qre.derivedFrom.length) {
      errors.push(
        `Questionnaire "${qre.language}" has more derivedFrom-extensions than derivedFrom-values.`,
      );
      return;
    }
    for (let pos = 1; pos <= qre._derivedFrom.length; pos++) {
      const ext = qre._derivedFrom[pos - 1];
      if (ext !== null) {
        if (ext.valueCodeableConcept.coding.length === 0) {
          errors.push(
            `Questionnaire "${qre.language}" has derivedFrom-extension at position ${pos} with no coding.`,
          );
        } else if (ext.valueCodeableConcept.coding.length > 1) {
          errors.push(
            `Questionnaire "${qre.language}" has derivedFrom-extension at position ${pos} with more than 1 coding.`,
          );
        }
      }
    }
  }

  private validateUseContext(qre: ParsedQuestionnaire, errors: string[]): void {
    if (editorTools.emptyArray(qre.useContext)) return;
    for (let pos = 1; pos <= qre.useContext.length; pos++) {
      const useContext = qre.useContext[pos - 1];
      const count = fhirValidatorUtils.countValueInvariants(useContext);
      if (count === 0) {
        errors.push(
          `Questionnaire "${qre.language}" has useContext at position ${pos} with no value.`,
        );
      } else if (count > 1) {
        errors.push(
          `Questionnaire "${qre.language}" has useContext at position ${pos} with multiple value invariants.`,
        );
      }
    }
  }

  private validateExtension(qre: ParsedQuestionnaire, errors: string[]): void {
    if (editorTools.emptyArray(qre.extension)) return;
    for (let pos = 1; pos <= qre.extension.length; pos++) {
      const extension = qre.extension[pos - 1];
      const count = fhirValidatorUtils.countValueInvariants(extension);
      if (count === 0) {
        errors.push(
          `Questionnaire "${qre.language}" has extension at position ${pos} with no value.`,
        );
      } else if (count > 1) {
        errors.push(
          `Questionnaire "${qre.language}" has extension at position ${pos} with multiple value invariants.`,
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
