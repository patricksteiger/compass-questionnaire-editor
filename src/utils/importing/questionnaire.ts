import { defaultLanguage } from "@/i18n";
import { Language, languages } from "@/store";
import { itemSchema, FHIRItem } from "./item";
import { z } from "zod";
import {
  nullToUndefined,
  optionalCodingSchema,
  optionalStringSchema,
} from "./schemas";

const item = itemSchema
  .array()
  .nullish()
  .transform((arr): FHIRItem[] => arr ?? []);

const statusOptions = ["draft", "active", "retired", "unknown"] as const;
type Status = typeof statusOptions[number];
const status = z
  .enum([...statusOptions, ""])
  .nullish()
  .transform((val): Status => val || "unknown");

const language = z
  .enum([...languages, ""])
  .nullish()
  .transform((val): Language => val || defaultLanguage);

const url = optionalStringSchema;
const name = optionalStringSchema;
const title = optionalStringSchema;
const version = optionalStringSchema;
const publisher = optionalStringSchema;
const date = optionalStringSchema;
const approvalDate = optionalStringSchema;
const lastReviewDate = optionalStringSchema;

// experimental is used as v-model and should be null for neutral value
const experimental = z
  .boolean()
  .nullish()
  .transform((val) => (val === undefined ? null : val));

const identifierUse = [
  "usual",
  "official",
  "temp",
  "secondary",
  "old",
] as const;

const use = z
  .enum([...identifierUse, ""])
  .nullish()
  .transform((val) => val || undefined);
const period = z
  .object({
    start: optionalStringSchema,
    end: optionalStringSchema,
  })
  .nullish()
  .transform(nullToUndefined);

const coding = optionalCodingSchema;

const type = z
  .object({
    coding,
    text: optionalStringSchema,
  })
  .nullish()
  .transform(nullToUndefined);

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

const identifier = identifierSchema
  .array()
  .nullish()
  .transform(nullToUndefined);

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
