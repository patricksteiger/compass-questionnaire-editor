import { languages } from "@/store";
import { itemSchema } from "./item";
import { status as statusOptions } from "@/types";
import {
  identifierSchema,
  optionalBooleanSchema,
  optionalStringSchema,
} from "./schemas";
import { z } from "zod";

const item = itemSchema.array().optional();

// undefined status will be set to "unknown"
const status = z.enum(statusOptions).optional();

const language = z.enum(languages).optional();

const url = optionalStringSchema;
const name = optionalStringSchema;
const title = optionalStringSchema;
const version = optionalStringSchema;
const publisher = optionalStringSchema;
const date = optionalStringSchema;
const approvalDate = optionalStringSchema;
const lastReviewDate = optionalStringSchema;

const experimental = optionalBooleanSchema;

const identifier = identifierSchema.array().optional();

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
    date,
    approvalDate,
    lastReviewDate,
    title,
    experimental,
    item,
  })
  .passthrough();

export type ParsedQuestionnaire = z.infer<typeof questionnaireSchema>;
