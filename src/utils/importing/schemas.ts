import { Comparator, comparators } from "@/types";
import { z } from "zod";

export function nullToUndefined<T>(input: T | null | undefined): T | undefined {
  return input === null ? undefined : input;
}

export const optionalStringSchema = z
  .string()
  .nullish()
  .transform(nullToUndefined);

export const optionalBooleanSchema = z
  .boolean()
  .nullish()
  .transform(nullToUndefined);

export const optionalNumberSchema = z
  .number()
  .nullish()
  .transform(nullToUndefined);

export const codingSchema = z.object({
  system: optionalStringSchema,
  version: optionalStringSchema,
  code: optionalStringSchema,
  display: optionalStringSchema,
  userSelected: optionalBooleanSchema,
});
export type ParsableCoding = {
  system?: string | null;
  version?: string | null;
  code?: string | null;
  display?: string | null;
  userSelected?: boolean | null;
};
export const optionalCodingSchema = codingSchema
  .nullish()
  .transform(nullToUndefined);

export const optionalComparatorSchema = z
  .enum([...comparators, ""])
  .nullish()
  .transform((val) => val || undefined);

export const optionalQuantitySchema = z
  .object({
    value: optionalNumberSchema,
    comparator: optionalComparatorSchema,
    code: optionalStringSchema,
    system: optionalStringSchema,
    unit: optionalStringSchema,
  })
  .nullish()
  .transform((val) => (val === null ? undefined : val));

export type ParsableQuantity = {
  value?: number | null;
  comparator?: Comparator | null;
  code?: string | null;
  system?: string | null;
  unit?: string | null;
};
