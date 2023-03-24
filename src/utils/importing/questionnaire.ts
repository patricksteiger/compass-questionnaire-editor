import { languages } from "@/store";
import { itemSchema } from "./item";
import { identifierUse, status as statusOptions } from "@/utils/constants";
import {
  optionalBooleanSchema,
  optionalCodingSchema,
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
const identifierSchema = z
  .object({
    use,
    type,
    system: optionalStringSchema,
    value: optionalStringSchema,
    period,
  })
  .passthrough();

export type FHIRIdentifier = z.infer<typeof identifierSchema>;

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

export type FHIRQuestionnaire = z.infer<typeof questionnaireSchema>;
