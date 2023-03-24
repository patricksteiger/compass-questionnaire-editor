import { operators } from "@/types";
import { z } from "zod";
import {
  optionalBooleanSchema,
  optionalCodingSchema,
  optionalNumberSchema,
  optionalQuantitySchema,
  optionalStringSchema,
} from "./schemas";

// TODO: Add Reference to enableWhenSchema
export const enableWhenSchema = z.object({
  question: z.string(),
  operator: z.enum(operators),
  answerBoolean: optionalBooleanSchema,
  answerDecimal: optionalNumberSchema,
  answerInteger: optionalNumberSchema,
  answerTime: optionalStringSchema,
  answerDate: optionalStringSchema,
  answerDateTime: optionalStringSchema,
  answerString: optionalStringSchema,
  answerCoding: optionalCodingSchema,
  answerQuantity: optionalQuantitySchema,
});

export type ParsedEnableWhen = z.infer<typeof enableWhenSchema>;
