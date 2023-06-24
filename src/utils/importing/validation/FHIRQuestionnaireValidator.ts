import { editorTools } from "@/utils/editor";
import { ParsedExtension } from "../parsing/item";
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
    this.validateModifierExtension(qre, errors);
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
    this.validateExtensionHelper(
      qre.extension,
      qre,
      "extension",
      undefined,
      errors,
    );
  }

  private validateModifierExtension(
    qre: ParsedQuestionnaire,
    errors: string[],
  ): void {
    if (editorTools.emptyArray(qre.modifierExtension)) return;
    this.validateExtensionHelper(
      qre.modifierExtension,
      qre,
      "modifierExtension",
      undefined,
      errors,
    );
  }

  private validateExtensionHelper(
    extensions: ParsedExtension[],
    qre: ParsedQuestionnaire,
    name: string,
    prefix: string | undefined,
    errors: string[],
  ): void {
    for (let pos = 1; pos <= extensions.length; pos++) {
      const extension = extensions[pos - 1];
      const count = fhirValidatorUtils.countValueInvariants(extension);
      const path: string =
        prefix !== undefined ? `${prefix} -> ${pos}` : pos.toString();
      if (count === 0) {
        if (extension.extension === undefined) {
          errors.push(
            `Questionnaire "${qre.language}" has ${name} at position ${path} with value and extension both undefined.`,
          );
        } else {
          this.validateExtensionHelper(
            extension.extension,
            qre,
            name,
            path,
            errors,
          );
        }
      } else if (count > 1) {
        errors.push(
          `Questionnaire "${qre.language}" has ${name} at position ${path} with multiple (${count}) value invariants defined.`,
        );
      } else if (extension.extension !== undefined) {
        errors.push(
          `Questionnaire "${qre.language}" has ${name} at position ${path} with value and extension both defined.`,
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
