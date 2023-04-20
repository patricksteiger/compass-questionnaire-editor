import { z } from "zod";
import {
  optionalBooleanSchema,
  optionalNumberSchema,
  optionalStringSchema,
} from "./schemas";

export const extensionSchema = z
  .object({
    url: z.string(),
    valueBoolean: optionalBooleanSchema,
    valueInteger: optionalNumberSchema,
    valueString: optionalStringSchema,
    valueMarkdown: optionalStringSchema,
  })
  .passthrough();
