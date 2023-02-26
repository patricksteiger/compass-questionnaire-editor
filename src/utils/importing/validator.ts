import { z } from "zod";
import { FHIRQuestionnaire, questionnaireSchema } from "./questionnaire";

export type Result =
  | { state: "success"; data: FHIRQuestionnaire }
  | { state: "error"; errors: z.ZodIssue[] };

class Validator {
  questionnaire(file: unknown): Result {
    const result = questionnaireSchema.safeParse(file);
    if (!result.success) {
      // const errors = result.error.issues.map((i) => i.message);
      return {
        state: "error",
        errors: result.error.errors,
      };
    } else {
      return { state: "success", data: result.data };
    }
  }
}

export const validator = new Validator();
