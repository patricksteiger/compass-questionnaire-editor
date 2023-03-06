import { questionnaireSchema } from "./questionnaire";
import { z } from "zod";

const bundleEntrySchema = z.object({
  resource: questionnaireSchema,
});

export const bundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  type: z.literal("collection"),
  entry: bundleEntrySchema.array().min(1),
});
