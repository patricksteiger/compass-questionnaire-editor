import { enableBehaviors } from "@/types";
import { z } from "zod";
import { allItemTypes } from "@/utils/constants";
import { enableWhenSchema } from "./enableWhen";
import {
  optionalBooleanSchema,
  optionalCodingSchema,
  optionalNumberSchema,
  optionalStringSchema,
} from "./schemas";

const definition = optionalStringSchema;
const text = optionalStringSchema;
const type = z.enum(allItemTypes);

const enableWhen = enableWhenSchema.array().optional();

const enableBehavior = z.enum(enableBehaviors).optional();
const required = optionalBooleanSchema;
const repeats = optionalBooleanSchema;
const maxLength = optionalNumberSchema;

// TODO: Add valueReference to answerOption
const answerOptionSchema = z.object({
  valueInteger: optionalNumberSchema,
  valueDate: optionalStringSchema,
  valueTime: optionalStringSchema,
  valueString: optionalStringSchema,
  valueCoding: optionalCodingSchema,
  initialSelected: optionalBooleanSchema,
});

export type FHIRAnswerOption = z.infer<typeof answerOptionSchema>;

const answerOption = answerOptionSchema.array().optional();

const answerValueSet = optionalStringSchema;

// Valid examples:   "1", "1.13.2"
// Invalid examples: "", "1..2", ".1", "."
function validLinkId(linkId: string): boolean {
  let dotIsAllowed = false;
  for (const char of linkId) {
    if (char >= "0" && char <= "9") {
      dotIsAllowed = true;
    } else if (char === ".") {
      if (!dotIsAllowed) return false;
      dotIsAllowed = false;
    } else {
      return false;
    }
  }
  // Make sure at least 1 number is present and linkId doesn't end with a dot
  return dotIsAllowed;
}

// TODO: refactor linkId validation
const linkId = z.string().refine(validLinkId);

const baseItemSchema = z.object({
  linkId,
  definition,
  text,
  type,
  enableWhen,
  enableBehavior,
  required,
  repeats,
  maxLength,
  answerOption,
  answerValueSet,
});

export type FHIRItem = z.infer<typeof baseItemSchema> & {
  item?: FHIRItem[];
};

export const itemSchema: z.ZodType<FHIRItem> = baseItemSchema
  .extend({
    item: z.lazy(() => itemSchema.array().optional()),
  })
  .passthrough();
