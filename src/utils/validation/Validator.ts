import { Questionnaire } from "@/types";
import { QuestionnaireValidator, Warning } from "./QuestionnaireValidator";

export class Validator {
  static check(questionnaires: Questionnaire[]): Warning[] {
    const warnings: Warning[] = [];
    for (const qre of questionnaires) {
      const qreValidator = new QuestionnaireValidator(qre);
      warnings.push(qreValidator.check());
    }
    return warnings;
  }
}
