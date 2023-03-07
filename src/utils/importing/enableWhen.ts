import { operators } from "@/types";
import { z } from "zod";
import {
  optionalBooleanSchema,
  optionalCodingSchema,
  optionalNumberSchema,
  optionalQuantitySchema,
  optionalStringSchema,
  ParsableCoding,
  ParsableQuantity,
} from "./schemas";

// TODO: Add Reference to enableWhenSchema
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

// Filtered values (like null) have to be present in InputType for z.ZodType
// OutputType gets derived from the schemas. If value is equal to InputType, it can be picked without changes.
// If it isn't equal, it needs to be omitted and set manually in InputType.
type EnableWhenInputOutputIntersection = Omit<
  FHIREnableWhen,
  | "answerBoolean"
  | "answerDecimal"
  | "answerInteger"
  | "answerTime"
  | "answerDate"
  | "answerDateTime"
  | "answerString"
  | "answerCoding"
  | "answerQuantity"
>;
export type ParsableEnableWhen = EnableWhenInputOutputIntersection & {
  answerBoolean?: boolean | null;
  answerDecimal?: number | null;
  answerInteger?: number | null;
  answerTime?: string | null;
  answerDate?: string | null;
  answerDateTime?: string | null;
  answerString?: string | null;
  answerCoding?: ParsableCoding | null;
  answerQuantity?: ParsableQuantity | null;
};
