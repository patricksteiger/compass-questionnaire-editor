import { comparators, identifierUse } from "@/types";
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

export type ParsedCoding = z.infer<typeof codingSchema>;

export const optionalCodingSchema = codingSchema.optional();

export const optionalComparatorSchema = z.enum(comparators).optional();

export const quantitySchema = z.object({
  value: optionalNumberSchema,
  comparator: optionalComparatorSchema,
  code: optionalStringSchema,
  system: optionalStringSchema,
  unit: optionalStringSchema,
});
export type ParsedQuantity = z.infer<typeof quantitySchema>;
export const optionalQuantitySchema = quantitySchema.optional();

export const periodSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});
export type ParsedPeriod = z.infer<typeof periodSchema>;
export const optionalPeriodSchema = periodSchema.optional();

const use = z.enum(identifierUse).optional();
const period = z
  .object({
    start: optionalStringSchema,
    end: optionalStringSchema,
  })
  .optional();

const coding = optionalCodingSchema;

const type = z
  .object({
    coding,
    text: optionalStringSchema,
  })
  .optional();

// TODO: Add assigner to identifierSchema
export const identifierSchema = z
  .object({
    use,
    type,
    system: optionalStringSchema,
    value: optionalStringSchema,
    period,
  })
  .passthrough();

export const optionalIdentifierSchema = identifierSchema.optional();

export type ParsedIdentifier = z.infer<typeof identifierSchema>;

export const referenceSchema = z.object({
  reference: optionalStringSchema,
  type: optionalStringSchema,
  display: optionalStringSchema,
  identifier: optionalIdentifierSchema,
});

export type ParsedReference = z.infer<typeof referenceSchema>;

export const optionalReferenceSchema = referenceSchema.optional();

export const attachmentSchema = z.object({
  contentType: optionalStringSchema,
  language: optionalStringSchema,
  data: optionalStringSchema,
  url: optionalStringSchema,
  size: optionalNumberSchema,
  hash: optionalStringSchema,
  title: optionalStringSchema,
  creation: optionalStringSchema,
  height: optionalNumberSchema,
  width: optionalNumberSchema,
  frames: optionalNumberSchema,
  duration: optionalNumberSchema,
  pages: optionalNumberSchema,
});

export type ParsedAttachment = z.infer<typeof attachmentSchema>;

export const optionalAttachmentSchema = attachmentSchema.optional();
