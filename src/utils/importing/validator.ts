import { Questionnaire } from "@/types";
import { questionnaireSchema } from "./questionnaire";
import { QuestionnaireBuilder } from "./QuestionnaireBuilder";
import { FHIRQuestionnaireValidator } from "./fhir/FHIRQuestionnaireValidator";

export type Result =
  | { state: "success"; data: Questionnaire }
  | { state: "warning"; data: Questionnaire; warnings: string[] }
  | { state: "error"; errors: string[]; warnings: string[] };

class Validator {
  questionnaire(file: unknown): Result {
    const result = questionnaireSchema.safeParse(file);
    if (result.success === false) {
      const errors = result.error.errors.map((e) => e.message);
      return {
        state: "error",
        errors: errors,
        warnings: [],
      };
    }
    const validator = new FHIRQuestionnaireValidator(result.data);
    const validationResult = validator.validate();
    if (validationResult.state === "error") {
      return validationResult;
    }
    const qreBuilder = new QuestionnaireBuilder(validationResult.data);
    const questionnaire = qreBuilder.build();
    if (validationResult.state === "warning") {
      return {
        state: "warning",
        data: questionnaire,
        warnings: validationResult.warnings,
      };
    }
    return {
      state: "success",
      data: questionnaire,
    };
  }
}

export const validator = new Validator();
