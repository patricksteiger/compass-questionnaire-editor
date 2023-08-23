import { z } from "zod";
import {
  optionalAttachmentSchema,
  optionalBooleanSchema,
  optionalCodingSchema,
  optionalNumberSchema,
  optionalStringSchema,
} from "./schemas";

const baseExtensionSchema = z
  .object({
    url: z.string(),
    valueBoolean: optionalBooleanSchema,
    valueCode: optionalStringSchema,
    valueDecimal: optionalNumberSchema,
    valueInteger: optionalNumberSchema,
    valueDate: optionalStringSchema,
    valueDateTime: optionalStringSchema,
    valueTime: optionalStringSchema,
    valueString: optionalStringSchema,
    valueMarkdown: optionalStringSchema,
    valueAttachment: optionalAttachmentSchema,
    valueCoding: optionalCodingSchema,
  })
  .passthrough();

export type ParsedExtension = z.infer<typeof baseExtensionSchema> & {
  extension?: ParsedExtension[];
};

export const extensionSchema: z.ZodType<ParsedExtension> =
  baseExtensionSchema.extend({
    extension: z.lazy(() => extensionSchema.array().optional()),
  });
