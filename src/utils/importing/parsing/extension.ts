import { z } from "zod";
import {
  optionalBooleanSchema,
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
  })
  .passthrough();

export type ParsedExtension = z.infer<typeof baseExtensionSchema> & {
  extension?: ParsedExtension[];
};

export const extensionSchema: z.ZodType<ParsedExtension> =
  baseExtensionSchema.extend({
    extension: z.lazy(() => extensionSchema.array().optional()),
  });
