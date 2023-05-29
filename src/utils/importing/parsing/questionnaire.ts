import { languages } from "@/store";
import { itemSchema } from "./item";
import { status as statusOptions } from "@/types";
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

const experimental = optionalBooleanSchema;

const derivedFrom = z.string().array().optional();

const code = codingSchema.array().optional();

const subjectType = z.enum(resourceTypes).array().optional();

const contact = contactDetailSchema.array().optional();

const identifier = identifierSchema.array().optional();

const extension = extensionSchema.array().optional();

const useContext = usageContextSchema.array().optional();

export type ParsedUseContext = z.infer<typeof useContext>;

export const questionnaireSchema = z
  .object({
    resourceType: z.literal("Questionnaire"),
    identifier,
    status,
    subjectType,
    contact,
    url,
    derivedFrom,
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
