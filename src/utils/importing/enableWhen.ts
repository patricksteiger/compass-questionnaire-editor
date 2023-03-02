import { operators } from "@/types";
import { z } from "zod";

const optionalStringSchema = z
  .string()
  .nullish()
  .transform((val): string | undefined => (val === null ? undefined : val));
const optionalBooleanSchema = z
  .boolean()
  .nullish()
  .transform((val): boolean | undefined => (val === null ? undefined : val));
const optionalNumberSchema = z
  .number()
  .nullish()
  .transform((val): number | undefined => (val === null ? undefined : val));
const optionalCodingSchema = z
  .object({
    system: optionalStringSchema,
    version: optionalStringSchema,
    code: optionalStringSchema,
    display: optionalStringSchema,
    userSelected: optionalBooleanSchema,
  })
  .nullish()
  .transform((val) => (val === null ? undefined : val));

type ParsableCoding = {
  system?: string | null;
  version?: string | null;
  code?: string | null;
  display?: string | null;
  userSelected?: boolean | null;
};

// TODO: Add Quantity to enableWhenSchema
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
};
