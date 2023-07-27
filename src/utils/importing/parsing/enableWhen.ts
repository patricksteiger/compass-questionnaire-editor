import { operators } from "@/types";
import { z } from "zod";
import {
  optionalAttachmentSchema,
  optionalBooleanSchema,
  optionalCodingSchema,
  optionalNumberSchema,
  optionalQuantitySchema,
  optionalReferenceSchema,
  optionalStringSchema,
} from "./schemas";

// TODO: Change integer to BigInt? How to handle q-input?
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
  answerUri: optionalStringSchema,
  answerCoding: optionalCodingSchema,
  answerQuantity: optionalQuantitySchema,
  answerReference: optionalReferenceSchema,
  answerAttachment: optionalAttachmentSchema,
});

export type ParsedEnableWhen = z.infer<typeof enableWhenSchema>;
