import { Extension, Item } from "@/types";
import { ItemType } from "./constants";

export type AllowedItems =
  | ItemType[]
  | "all_elements"
  | "all_items"
  | "questionnaire_only";

export type PredefinedExtension = Extension & {
  __allowedItems: AllowedItems;
  __tooltip: string;
};

const MIN_VALUE_TOOLTIP = "Inclusive lower bound for answer";
const MIN_VALUE_URL = "http://hl7.org/fhir/StructureDefinition/minValue";
const minValues: PredefinedExtension[] = [
  {
    __allowedItems: ["decimal"],
    __type: "decimal",
    __tooltip: MIN_VALUE_TOOLTIP,
    url: MIN_VALUE_URL,
    valueDecimal: 0,
  },
  {
    __allowedItems: ["integer"],
    __type: "integer",
    __tooltip: MIN_VALUE_TOOLTIP,
    url: MIN_VALUE_URL,
    valueInteger: 0,
  },
  {
    __allowedItems: ["date"],
    __type: "date",
    __tooltip: MIN_VALUE_TOOLTIP,
    url: MIN_VALUE_URL,
    valueDate: "2000-12-31",
  },
  {
    __allowedItems: ["dateTime"],
    __type: "dateTime",
    __tooltip: MIN_VALUE_TOOLTIP,
    url: MIN_VALUE_URL,
    valueDateTime: "2017-01-01T00:00:00+01:00",
  },
  {
    __allowedItems: ["time"],
    __type: "time",
    __tooltip: MIN_VALUE_TOOLTIP,
    url: MIN_VALUE_URL,
    valueTime: "00:00:00",
  },
];

const MAX_VALUE_TOOLTIP = "Inclusive upper bound for answer";
const MAX_VALUE_URL = "http://hl7.org/fhir/StructureDefinition/maxValue";
const maxValues: PredefinedExtension[] = [
  {
    __allowedItems: ["decimal"],
    __type: "decimal",
    __tooltip: MAX_VALUE_TOOLTIP,
    url: MAX_VALUE_URL,
    valueDecimal: 0,
  },
  {
    __allowedItems: ["integer"],
    __type: "integer",
    __tooltip: MAX_VALUE_TOOLTIP,
    url: MAX_VALUE_URL,
    valueInteger: 0,
  },
  {
    __allowedItems: ["date"],
    __type: "date",
    __tooltip: MAX_VALUE_TOOLTIP,
    url: MAX_VALUE_URL,
    valueDate: "2000-12-31",
  },
  {
    __allowedItems: ["dateTime"],
    __type: "dateTime",
    __tooltip: MAX_VALUE_TOOLTIP,
    url: MAX_VALUE_URL,
    valueDateTime: "2017-01-01T00:00:00+01:00",
  },
  {
    __allowedItems: ["time"],
    __type: "time",
    __tooltip: MAX_VALUE_TOOLTIP,
    url: MAX_VALUE_URL,
    valueTime: "00:00:00",
  },
];

export const HIDDEN_EXTENSION_URL =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden";

export type HiddenExtension = {
  __type: "boolean";
  url: typeof HIDDEN_EXTENSION_URL;
  valueBoolean: boolean;
};
export function getHiddenExtension(): HiddenExtension {
  return { __type: "boolean", url: HIDDEN_EXTENSION_URL, valueBoolean: false };
}

// {
//   __allowedItems: "all_items",
//   __type: "boolean",
//   __tooltip:
//     "Items with hidden=true are not rendered for the user (includes child-elements)",
//   url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
//   valueBoolean: true,
// },

function getPredefinedExtensions(): PredefinedExtension[] {
  return [
    {
      __allowedItems: [
        "boolean",
        "coding",
        "decimal",
        "integer",
        "date",
        "dateTime",
        "time",
        "string",
        "text",
        "url",
        "quantity",
        "reference",
      ],
      __type: "integer",
      __tooltip: "Minimum length of answer",
      url: "http://hl7.org/fhir/StructureDefinition/minLength",
      valueInteger: 1,
    },
    {
      __allowedItems: "all_elements",
      __type: "markdown",
      __tooltip: "Add notes for developers of the Questionnaire-resource",
      url: "http://hl7.org/fhir/StructureDefinition/designNote",
      valueMarkdown: "",
    },
    {
      __allowedItems: ["integer"],
      __type: "integer",
      __tooltip: "Indicates step size for slider-based controls",
      url: "http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue",
      valueInteger: 1,
    },
    {
      __allowedItems: ["attachment"],
      __type: "code",
      __tooltip: "Kind of attachment allowed as answer",
      url: "http://hl7.org/fhir/StructureDefinition/mimeType",
      valueCode: "application/pdf",
    },
    ...minValues,
    ...maxValues,
  ];
}

export function getItemExtensions(item: Item): PredefinedExtension[] {
  return getPredefinedExtensions().filter(
    (ext) =>
      ext.__allowedItems === "all_elements" ||
      ext.__allowedItems === "all_items" ||
      (ext.__allowedItems !== "questionnaire_only" &&
        ext.__allowedItems.includes(item.type)),
  );
}

export function getQuestionnaireExtensions(): PredefinedExtension[] {
  return getPredefinedExtensions().filter(
    (ext) =>
      ext.__allowedItems === "all_elements" ||
      ext.__allowedItems === "questionnaire_only",
  );
}
