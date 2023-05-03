import { languages } from "@/store";
import { itemSchema } from "./item";
import { status as statusOptions } from "@/types";
import {
  identifierSchema,
  optionalBooleanSchema,
  optionalStringSchema,
} from "./schemas";
import { z } from "zod";
import { extensionSchema } from "./extension";

const item = itemSchema.array().optional();

// undefined status will be set to "unknown"
const status = z.enum(statusOptions).optional();

const language = z.enum(languages).optional();

const url = optionalStringSchema;
const name = optionalStringSchema;
const title = optionalStringSchema;
const version = optionalStringSchema;
const publisher = optionalStringSchema;
const description = optionalStringSchema;
const purpose = optionalStringSchema;
const date = optionalStringSchema;
const approvalDate = optionalStringSchema;
const lastReviewDate = optionalStringSchema;

const experimental = optionalBooleanSchema;

const identifier = identifierSchema.array().optional();

const extension = extensionSchema.array().optional();

export const questionnaireSchema = z
  .object({
    resourceType: z.literal("Questionnaire"),
    identifier,
    status,
    url,
    version,
    language,
    name,
    publisher,
    description,
    purpose,
    date,
    approvalDate,
    lastReviewDate,
    title,
    experimental,
    extension,
    item,
  })
  .passthrough();

export type ParsedQuestionnaire = z.infer<typeof questionnaireSchema>;
