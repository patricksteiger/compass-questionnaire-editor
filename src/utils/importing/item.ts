import { EnableBehavior, enableBehaviors } from "@/types";
import { z } from "zod";
import { allItemTypes } from "../constants";
import {
  enableWhenSchema,
  FHIREnableWhen,
  ParsableEnableWhen,
} from "./enableWhen";

const optionalStringSchema = z
  .string()
  .nullish()
  .transform((val): string | undefined => (val === null ? undefined : val));
const optionalBooleanSchema = z
  .boolean()
  .nullish()
  .transform((val) => (val === null ? undefined : val));
const optionalNumberSchema = z
  .number()
  .nullish()
  .transform((val) => (val === null ? undefined : val));
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

const definition = optionalStringSchema;
const text = optionalStringSchema;
const type = z.enum(allItemTypes);

const enableWhen = enableWhenSchema
  .array()
  .nullish()
  .transform((val): FHIREnableWhen[] | undefined =>
    val === null ? undefined : val,
  );

const enableBehavior = z
  .enum([...enableBehaviors, ""])
  .nullish()
  .transform((val): EnableBehavior | undefined => val || undefined);
const required = optionalBooleanSchema;
const repeats = optionalBooleanSchema;
const maxLength = z
  .number()
  .nullish()
  .transform((val): number | undefined => (val === null ? undefined : val));

const answerOptionSchema = z
  .object({
    valueInteger: optionalNumberSchema,
    valueDate: optionalStringSchema,
    valueTime: optionalStringSchema,
    valueString: optionalStringSchema,
    valueCoding: optionalCodingSchema,
    initialSelected: optionalBooleanSchema,
  })
  .refine((val) => {
    let count = 0;
    if (val.valueInteger !== undefined) count++;
    if (val.valueDate !== undefined) count++;
    if (val.valueTime !== undefined) count++;
    if (val.valueString !== undefined) count++;
    if (val.valueCoding !== undefined) count++;
    return count <= 1;
  });

export type FHIRAnswerOption = z.infer<typeof answerOptionSchema>;

type ParsableCoding = {
  system?: string | null;
  version?: string | null;
  code?: string | null;
  display?: string | null;
  userSelected?: boolean | null;
};

// TODO: Add valueReference to answerOption
type ParsableAnswerOption = {
  valueInteger?: number | null;
  valueDate?: string | null;
  valueTime?: string | null;
  valueString?: string | null;
  valueCoding?: ParsableCoding | null;
  initialSelected?: boolean | null;
};
const answerOption = answerOptionSchema
  .array()
  .nullish()
  .transform((val) => (val === null ? undefined : val));

const answerValueSet = optionalStringSchema;

// Valid examples:   "1", "1.13.2"
// Invalid examples: "", "1..2", ".1", "."
function validLinkId(linkId: string): boolean {
  let dotIsAllowed = false;
  for (const digit of linkId) {
    if (digit >= "0" && digit <= "9") {
      dotIsAllowed = true;
    } else if (digit === ".") {
      if (!dotIsAllowed) return false;
      dotIsAllowed = false;
    } else {
      return false;
    }
  }
  return linkId.length > 0 && dotIsAllowed;
}

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

// Filtered values (like null) have to be present in InputType for z.ZodType
// OutputType gets derived from the schemas. If value is equal to InputType, it can be picked without changes.
// If it isn't equal, it needs to be omitted and set manually in InputType.
type ItemInputOutputIntersection = Omit<
  FHIRItem,
  | "definition"
  | "text"
  | "enableWhen"
  | "enableBehavior"
  | "required"
  | "repeats"
  | "maxLength"
  | "item"
  | "answerOption"
  | "answerValueSet"
>;
type ParsableFHIRItem = ItemInputOutputIntersection & {
  definition?: string | null;
  text?: string | null;
  enableWhen?: ParsableEnableWhen[] | null;
  enableBehavior?: EnableBehavior | null | "";
  required?: boolean | null;
  repeats?: boolean | null;
  maxLength?: number | null;
  item?: ParsableFHIRItem[] | null;
  answerOption?: ParsableAnswerOption[] | null;
  answerValueSet?: string | null;
};

type ItemSchema = z.ZodType<FHIRItem, z.ZodTypeDef, ParsableFHIRItem>;

export const itemSchema: ItemSchema = baseItemSchema
  .extend({
    item: z.lazy(() =>
      itemSchema
        .array()
        .nullish()
        .transform((items): FHIRItem[] | undefined =>
          items === null ? undefined : items,
        ),
    ),
  })
  .passthrough();
