import { Questionnaire } from "@/types";
import {
  ParsedQuestionnaire,
  questionnaireSchema,
} from "./parsing/questionnaire";
import { QuestionnaireBuilder } from "./building/QuestionnaireBuilder";
import { FHIRQuestionnaireValidator } from "./validation/FHIRQuestionnaireValidator";
import { z } from "zod";
import { bundleSchema } from "./parsing/bundle";

export type Result =
  | { state: "success"; data: Questionnaire }
  | { state: "warning"; data: Questionnaire; warnings: string[] }
  | { state: "error"; errors: string[]; warnings: string[] };

export type BundleResult =
  | { state: "success"; data: Questionnaire[] }
  | { state: "warning"; data: Questionnaire[]; warnings: string[] }
  | { state: "error"; errors: string[]; warnings: string[] };

const questionnaireResourceSchema = z.object({
  resourceType: z.literal("Questionnaire"),
});

const bundleResourceSchema = z.object({
  resourceType: z.literal("Bundle"),
});

class Transformer {
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

  bundle(file: unknown): BundleResult {
    const result = bundleSchema.safeParse(file);
    if (result.success === false) {
      const errors = result.error.errors.map((e) => e.message);
      return {
        state: "error",
        errors: errors,
        warnings: [],
      };
    }
    const warnings: string[] = [];
    const fhirQuestionnaires: ParsedQuestionnaire[] = [];
    for (const entry of result.data.entry) {
      const qre = entry.resource;
      const validator = new FHIRQuestionnaireValidator(qre);
      const validatorResult = validator.validate();
      if (validatorResult.state === "error") {
        return validatorResult;
      } else if (validatorResult.state === "warning") {
        fhirQuestionnaires.push(validatorResult.data);
        warnings.push(...validatorResult.warnings);
      } else {
        fhirQuestionnaires.push(validatorResult.data);
      }
    }
    const questionnaires = fhirQuestionnaires.map((qre) => {
      const qreBuilder = new QuestionnaireBuilder(qre);
      return qreBuilder.build();
    });
    if (warnings.length > 0) {
      return {
        state: "warning",
        data: questionnaires,
        warnings: warnings,
      };
    }
    return {
      state: "success",
      data: questionnaires,
    };
  }

  isQuestionnaireResource(x: unknown): boolean {
    const result = questionnaireResourceSchema.safeParse(x);
    return result.success;
  }

  isBundleResource(x: unknown): boolean {
    const result = bundleResourceSchema.safeParse(x);
    return result.success;
  }
}

export const transformer = new Transformer();
