import { comparators } from "@/types";
import { z } from "zod";

export const optionalStringSchema = z.string().optional();

export const optionalBooleanSchema = z.boolean().optional();

export const optionalNumberSchema = z.number().optional();

export const codingSchema = z.object({
  system: optionalStringSchema,
  version: optionalStringSchema,
  code: optionalStringSchema,
  display: optionalStringSchema,
  userSelected: optionalBooleanSchema,
});

export type FHIRCoding = z.infer<typeof codingSchema>;

export const optionalCodingSchema = codingSchema.optional();

export const optionalComparatorSchema = z.enum(comparators).optional();

export const quantitySchema = z.object({
  value: optionalNumberSchema,
  comparator: optionalComparatorSchema,
  code: optionalStringSchema,
  system: optionalStringSchema,
  unit: optionalStringSchema,
});

export type FHIRQuantity = z.infer<typeof quantitySchema>;

export const optionalQuantitySchema = quantitySchema.optional();
