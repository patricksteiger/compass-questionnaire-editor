import { Extension, Item } from "@/types";
import { ItemType } from "./constants";

export type AllowedItems = ItemType[] | "all";

export type PredefinedExtension = Extension & {
  __allowedItems: AllowedItems;
  __tooltip: string;
};

const minValues: PredefinedExtension[] = [
  {
    __allowedItems: ["decimal"],
    __type: "decimal",
    __tooltip: "Inclusive lower bound for answer",
    url: "http://hl7.org/fhir/StructureDefinition/minValue",
    valueDecimal: 0,
  },
  {
    __allowedItems: ["integer"],
    __type: "integer",
    __tooltip: "Inclusive lower bound for answer",
    url: "http://hl7.org/fhir/StructureDefinition/minValue",
    valueInteger: 0,
  },
];

const maxValues: PredefinedExtension[] = [
  {
    __allowedItems: ["decimal"],
    __type: "decimal",
    __tooltip: "Inclusive upper bound for answer",
    url: "http://hl7.org/fhir/StructureDefinition/maxValue",
    valueDecimal: 0,
  },
  {
    __allowedItems: ["integer"],
    __type: "integer",
    __tooltip: "Inclusive upper bound for answer",
    url: "http://hl7.org/fhir/StructureDefinition/maxValue",
    valueInteger: 0,
  },
];

const getPredefinedExtensions = (): PredefinedExtension[] => [
  {
    __allowedItems: "all",
    __type: "boolean",
    __tooltip: "Items with hidden=true are not rendered for the user",
    url: "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
    valueBoolean: false,
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
    valueInteger: 0,
  },
  ...minValues,
  ...maxValues,
];

export function getExtensions(item: Item): PredefinedExtension[] {
  return getPredefinedExtensions().filter(
    (ext) =>
      ext.__allowedItems === "all" || ext.__allowedItems.includes(item.type),
  );
}
