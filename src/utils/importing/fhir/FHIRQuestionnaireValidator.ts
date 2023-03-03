import { FHIRQuestionnaire } from "../questionnaire";
import { validatorUtils } from "../ValidatorUtils";
import { FHIRItemValidator } from "./FHIRItemValidator";

export type ValidationResult =
  | { state: "success"; data: FHIRQuestionnaire }
  | { state: "warning"; data: FHIRQuestionnaire; warnings: string[] }
  | { state: "error"; errors: string[]; warnings: string[] };

export class FHIRQuestionnaireValidator {
  constructor(private qre: FHIRQuestionnaire) {}

  validate(): ValidationResult {
    validatorUtils.sortItemsByLinkId(this.qre.item);
    const result = this.validateQuestionnaireItems(this.qre);
    return result;
  }

  private validateQuestionnaireItems(qre: FHIRQuestionnaire): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const itemValidator = new FHIRItemValidator(qre, errors, warnings);
    let linkIdCount = 0;
    for (const item of qre.item) {
      linkIdCount++;
      itemValidator.validate(item, linkIdCount.toString());
    }
    if (errors.length > 0) {
      return { state: "error", errors, warnings };
    } else if (warnings.length > 0) {
      return { state: "warning", data: qre, warnings };
    } else {
      return { state: "success", data: qre };
    }
  }
}
