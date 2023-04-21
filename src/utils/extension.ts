import { Extension, Item } from "@/types";
import { ItemType } from "./constants";

export type AllowedItems = ItemType[] | "all";

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
    __allowedItems: ["time"],
    __type: "time",
    __tooltip: MAX_VALUE_TOOLTIP,
    url: MAX_VALUE_URL,
    valueTime: "00:00:00",
  },
];

function getPredefinedExtensions(): PredefinedExtension[] {
  return [
    {
      __allowedItems: "all",
      __type: "boolean",
      __tooltip: "Items with hidden=true are not rendered for the user",
      url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
      valueBoolean: true,
    },
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
      __allowedItems: "all",
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
    ...minValues,
    ...maxValues,
  ];
}

export function getExtensions(item: Item): PredefinedExtension[] {
  return getPredefinedExtensions().filter(
    (ext) =>
      ext.__allowedItems === "all" || ext.__allowedItems.includes(item.type),
  );
}
