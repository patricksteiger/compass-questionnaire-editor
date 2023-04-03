import { operators } from "@/types";
import { z } from "zod";
import {
  optionalBooleanSchema,
  optionalCodingSchema,
  optionalNumberSchema,
  optionalQuantitySchema,
  optionalReferenceSchema,
  optionalStringSchema,
} from "./schemas";

export const enableWhenSchema = z.object({
  question: z.string(),
  operator: z.enum(operators),
  answerBoolean: optionalBooleanSchema,
  answerDecimal: optionalNumberSchema,
  answerInteger: optionalNumberSchema,
  answerDate: optionalStringSchema,
  answerDateTime: optionalStringSchema,
  answerTime: optionalStringSchema,
  answerString: optionalStringSchema,
  answerCoding: optionalCodingSchema,
  answerQuantity: optionalQuantitySchema,
  answerReference: optionalReferenceSchema,
});

export type ParsedEnableWhen = z.infer<typeof enableWhenSchema>;
