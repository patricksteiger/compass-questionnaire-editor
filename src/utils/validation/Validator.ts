import { Questionnaire } from "@/types";
import {
  QuestionnaireValidator,
  QuestionnaireReport,
} from "./QuestionnaireValidator";

export class Validator {
  static check(questionnaires: Questionnaire[]): QuestionnaireReport[] {
    const warnings: QuestionnaireReport[] = [];
    for (const qre of questionnaires) {
      const qreValidator = new QuestionnaireValidator(qre);
      warnings.push(qreValidator.check());
    }
    return warnings;
  }
}
