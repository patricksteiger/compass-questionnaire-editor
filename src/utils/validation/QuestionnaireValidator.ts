import { Language } from "@/store";
import { Questionnaire } from "@/types";
import { ErrorChecker, Errors } from "./ErrorChecker";
import { WarningChecker, Warnings } from "./WarningChecker";

export type QuestionnaireReport = {
  language: Language;
  errors: Errors;
  warnings: Warnings;
};

export class QuestionnaireValidator {
  constructor(private readonly questionnaire: Questionnaire) {}

  // TODO: Add extension to validation
  check(): QuestionnaireReport {
    const errors = ErrorChecker.check(this.questionnaire);
    const warnings = WarningChecker.check(this.questionnaire);
    return {
      language: this.questionnaire.language,
      errors,
      warnings,
    };
  }
}
