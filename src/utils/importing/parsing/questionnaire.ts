import { languages } from "@/store";
import { itemSchema } from "./item";
import {
  derivedFromExtensionCodeUrl,
  derivedFromExtensionUrl,
  derivedFromExtensionValues,
  narrativeStatuses,
  status as statusOptions,
} from "@/types";
import {
  codingSchema,
  contactDetailSchema,
  identifierSchema,
  optionalBooleanSchema,
  optionalPeriodSchema,
  optionalStringSchema,
  usageContextSchema,
} from "./schemas";
import { z } from "zod";
import { extensionSchema } from "./extension";
import {
  versionAlgorithmSystem,
  versionAlgorithmVersion,
} from "@/utils/constants";
import { resourceTypes } from "@/utils/resourceType";

const item = itemSchema.array().optional();

// undefined status will be set to "unknown" in import-builder
const status = z.enum(statusOptions).optional();

const language = z.enum(languages).optional();

const url = optionalStringSchema;
const name = optionalStringSchema;
const title = optionalStringSchema;
const version = optionalStringSchema;

// TODO: Add userSelected to versionAlgorithmCoding
function versionAlgorithmHelper<T extends string, R extends string>(
  code: T,
  display: R,
) {
  return z.object({
    code: z.literal(code),
    display: z
      .literal(display)
      .optional()
      .refine((_d) => display),
    system: z
      .literal(versionAlgorithmSystem)
      .optional()
      .refine((_s) => versionAlgorithmSystem),
    version: z
      .literal(versionAlgorithmVersion)
      .optional()
      .refine((_v) => versionAlgorithmVersion),
  });
}

const versionSemver = versionAlgorithmHelper("semver", "SemVer");
const versionInteger = versionAlgorithmHelper("integer", "Integer");
const versionAlpha = versionAlgorithmHelper("alpha", "Alphabetical");
const versionDate = versionAlgorithmHelper("date", "Date");
const versionNatural = versionAlgorithmHelper("natural", "Natural");

const versionAlgorithmCoding = z
  .union([
    versionSemver,
    versionInteger,
    versionAlpha,
    versionDate,
    versionNatural,
  ])
  .optional();

const versionAlgorithmString = z.string().optional();

const publisher = optionalStringSchema;
const description = optionalStringSchema;
const purpose = optionalStringSchema;
const copyright = optionalStringSchema;
const copyrightLabel = optionalStringSchema;
const date = optionalStringSchema;
const approvalDate = optionalStringSchema;
const lastReviewDate = optionalStringSchema;
const effectivePeriod = optionalPeriodSchema;

const id = optionalStringSchema;
const implicitRules = optionalStringSchema;
const experimental = optionalBooleanSchema;

const narrativeSchema = z.object({
  status: z.enum(narrativeStatuses),
  div: z.string().optional(),
});

const text = narrativeSchema.optional();
export type ParsedText = z.infer<typeof text>;

const derivedFrom = z.string().array().optional();

const derivedFromExtension = z
  .object({
    url: z.literal(derivedFromExtensionUrl),
    valueCodeableConcept: z.object({
      coding: z
        .object({
          code: z.enum(derivedFromExtensionValues),
          system: z.literal(derivedFromExtensionCodeUrl),
        })
        .array(),
    }),
  })
  .nullable();
const _derivedFrom = derivedFromExtension.array().optional();
export type ParsedDerivedFromExtension = z.infer<typeof derivedFromExtension>;

const code = codingSchema.array().optional();

const subjectType = z.enum(resourceTypes).array().optional();

const contact = contactDetailSchema.array().optional();

const identifier = identifierSchema.array().optional();

const extension = extensionSchema.array().optional();

const useContext = usageContextSchema.array().optional();

export type ParsedUseContext = z.infer<typeof useContext>;

const metaSchema = z.object({
  versionId: optionalStringSchema,
  lastUpdated: optionalStringSchema,
  source: optionalStringSchema,
  profile: z.string().array().optional(),
  security: codingSchema.array().optional(),
  tag: codingSchema.array().optional(),
});

const meta = metaSchema.optional();
export type ParsedMeta = z.infer<typeof meta>;

export const questionnaireSchema = z
  .object({
    resourceType: z.literal("Questionnaire"),
    id,
    implicitRules,
    meta,
    text,
    identifier,
    status,
    subjectType,
    contact,
    url,
    derivedFrom,
    _derivedFrom,
    version,
    versionAlgorithmString,
    versionAlgorithmCoding,
    language,
    name,
    publisher,
    description,
    purpose,
    useContext,
    copyright,
    copyrightLabel,
    date,
    approvalDate,
    lastReviewDate,
    effectivePeriod,
    title,
    experimental,
    code,
    extension,
    item,
  })
  .passthrough();

export type ParsedQuestionnaire = z.infer<typeof questionnaireSchema>;
