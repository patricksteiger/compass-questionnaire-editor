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
// TODO: refactor enableWhen validation
export const enableWhenSchema = z
  .object({
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
  })
  .refine((val) => {
    let count = 0;
    if (val.answerBoolean !== undefined) count++;
    if (val.answerDecimal !== undefined) count++;
    if (val.answerInteger !== undefined) count++;
    if (val.answerTime !== undefined) count++;
    if (val.answerDate !== undefined) count++;
    if (val.answerDateTime !== undefined) count++;
    if (val.answerString !== undefined) count++;
    if (val.answerCoding !== undefined) count++;
    if (val.answerQuantity !== undefined) count++;
    return count <= 1;
  });

export type FHIREnableWhen = z.infer<typeof enableWhenSchema>;

export type ParsableEnableWhen = FHIREnableWhen;
