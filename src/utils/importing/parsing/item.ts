import { answerConstraints, enableBehaviors } from "@/types";
import { z } from "zod";
import { allItemTypes } from "@/utils/constants";
import { enableWhenSchema } from "./enableWhen";
import { extensionSchema } from "./extension";
import {
  optionalBooleanSchema,
  optionalCodingSchema,
  optionalNumberSchema,
  optionalQuantitySchema,
  optionalReferenceSchema,
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

const answerConstraint = z.enum(answerConstraints).optional();

const answerOptionSchema = z.object({
  valueCoding: optionalCodingSchema,
  valueDecimal: optionalNumberSchema,
  valueInteger: optionalNumberSchema,
  valueDate: optionalStringSchema,
  valueDateTime: optionalStringSchema,
  valueTime: optionalStringSchema,
  valueString: optionalStringSchema,
  valueQuantity: optionalQuantitySchema,
  valueReference: optionalReferenceSchema,
  initialSelected: optionalBooleanSchema,
});

export type ParsedAnswerOption = z.infer<typeof answerOptionSchema>;

const answerOption = answerOptionSchema.array().optional();

const answerValueSet = optionalStringSchema;

const linkId = z.string();

const extension = extensionSchema.array().optional();

export type ParsedExtension = z.infer<typeof extensionSchema>;

const initialSchema = z.object({
  valueBoolean: optionalBooleanSchema,
  valueDecimal: optionalNumberSchema,
  valueInteger: optionalNumberSchema,
});

const initial = initialSchema.array().optional();

export type ParsedInitial = z.infer<typeof initialSchema>;

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
  extension,
  answerConstraint,
  answerOption,
  answerValueSet,
  initial,
});

export type ParsedItem = z.infer<typeof baseItemSchema> & {
  item?: ParsedItem[];
};

export const itemSchema: z.ZodType<ParsedItem> = baseItemSchema
  .extend({
    item: z.lazy(() => itemSchema.array().optional()),
  })
  .passthrough();
