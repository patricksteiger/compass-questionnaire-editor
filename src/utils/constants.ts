import { Item } from "@/types";
import { ParsedItem } from "./importing/parsing/item";

export const allItemTypes = [
  "group",
  "string",
  "boolean",
  "decimal",
  "integer",
  "date",
  "text",
  "url",
  "display",
  "time",
  "dateTime",
  "quantity",
  "attachment",
  "coding",
  "reference",
] as const;
export type ItemType = typeof allItemTypes[number];
export function isInvalidItemType(type: unknown): boolean {
  return !allItemTypes.includes(type as ItemType);
}
export function allowsMaxLength(item: Item | ParsedItem): boolean {
  const type = item.type;
  const answerConstraint = item.answerConstraint;
  return (
    answerConstraint === "optionsOrString" ||
    type === "boolean" ||
    type === "decimal" ||
    type === "integer" ||
    type === "string" ||
    type === "text" ||
    type === "url"
  );
}

export type InitialItemType = Exclude<ItemType, "display" | "group">;

export function allowsInitial(type: ItemType): type is InitialItemType {
  return type !== "display" && type !== "group";
}

// display- and group-items don't allow initial and are filtered in cxEditorItems
export type InitialItem = Omit<Item, "type"> & { type: InitialItemType };

export const itemTypeIcons = [
  { name: "group", icon: "group_work", label: "Group" },
  { name: "display", icon: "description", label: "Display" },
  { name: "text", icon: "input", label: "Text" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "url", icon: "link", label: "URL" },
  { name: "boolean", icon: "toggle_off", label: "Boolean" },
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "decimal", icon: "pin", label: "Decimal" },
  { name: "date", icon: "calendar_month", label: "Date" },
  { name: "time", icon: "schedule", label: "Time" },
  { name: "dateTime", icon: "event", label: "DateTime" },
  { name: "quantity", icon: "biotech", label: "Quantity" },
  { name: "attachment", icon: "library_add", label: "Attachment" },
  { name: "coding", icon: "code", label: "Coding" },
  { name: "reference", icon: "manage_search", label: "Reference" },
] as const;
export type ItemTypeLabel = typeof itemTypeIcons[number];
export type ItemTypeIcon = ItemTypeLabel["icon"];

export const noChoiceItemTypeIcons = [
  { name: "group", icon: "group_work", label: "Group" },
  { name: "display", icon: "description", label: "Display" },
  { name: "text", icon: "input", label: "Text" },
  { name: "url", icon: "link", label: "URL" },
  { name: "boolean", icon: "toggle_off", label: "Boolean" },
  { name: "attachment", icon: "library_add", label: "Attachment" },
] as const;
export const choiceItemTypeIcons = [
  { name: "coding", icon: "code", label: "Coding" },
  { name: "decimal", icon: "pin", label: "Decimal" },
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "date", icon: "calendar_month", label: "Date" },
  { name: "dateTime", icon: "event", label: "DateTime" },
  { name: "time", icon: "schedule", label: "Time" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "quantity", icon: "biotech", label: "Quantity" },
  { name: "reference", icon: "manage_search", label: "Reference" },
] as const;

export type AnswerOptionButton = typeof choiceItemTypeIcons[number];
export type AnswerOptionType = typeof choiceItemTypeIcons[number]["name"];
export type AnswerOptionIcon = typeof choiceItemTypeIcons[number]["icon"];

export function getAnswerOptionIcon(type: AnswerOptionType): AnswerOptionIcon {
  const answerOptionButton = choiceItemTypeIcons.find((a) => a.name === type);
  if (answerOptionButton === undefined) {
    console.error(`Illegal AnswerOptionType: ${type}`);
    return "" as unknown as AnswerOptionIcon;
  }
  return answerOptionButton.icon;
}

export function allowsAnswerOption(type: ItemType): type is AnswerOptionType {
  return choiceItemTypeIcons.some((i) => i.name === type);
}

export function allowsAnswerValueSet(
  type: ItemType,
): type is "coding" | "string" {
  return type === "coding" || type === "string";
}

export function getItemTypeIcon(type: ItemType): ItemTypeIcon {
  const icon = itemTypeIcons.find((i) => i.name === type);
  if (icon === undefined) {
    console.error(`Invalid itemType: ${type}`);
    return undefined as unknown as ItemTypeIcon;
  }
  return icon.icon;
}

export const notSelectableQuestionTypes = ["display", "group"] as const;
export type NotSelectableItem = typeof notSelectableQuestionTypes[number];

export function isSelectableItem(item: Item): boolean {
  const selectableType = !notSelectableQuestionTypes.includes(
    item.type as NotSelectableItem,
  );
  const permissibleAnswerOption =
    item.answerOption === undefined ||
    item.answerOption.length === 0 ||
    item.answerConstraint !== "optionsOnly";
  return selectableType && permissibleAnswerOption;
}

export const versionAlgorithmSystem = "http://hl7.org/fhir/version-algorithm";
export const versionAlgorithmVersion = "5.0.0";
export const versionAlgorithmCodes = [
  "semver",
  "integer",
  "alpha",
  "date",
  "natural",
] as const;
export const versionAlgorithms = [
  {
    code: "semver",
    display: "SemVer",
    system: versionAlgorithmSystem,
    version: versionAlgorithmVersion,
    userSelected: undefined,
  },
  {
    code: "integer",
    display: "Integer",
    system: versionAlgorithmSystem,
    version: versionAlgorithmVersion,
    userSelected: undefined,
  },
  {
    code: "alpha",
    display: "Alphabetical",
    system: versionAlgorithmSystem,
    version: versionAlgorithmVersion,
    userSelected: undefined,
  },
  {
    code: "date",
    display: "Date",
    system: versionAlgorithmSystem,
    version: versionAlgorithmVersion,
    userSelected: undefined,
  },
  {
    code: "natural",
    display: "Natural",
    system: versionAlgorithmSystem,
    version: versionAlgorithmVersion,
    userSelected: undefined,
  },
] as const;
export type VersionAlgorithmCode = typeof versionAlgorithms[number]["code"];
export type VersionAlgorithmCoding = typeof versionAlgorithms[number];
export function getVersionAlgorithmCoding(
  code: VersionAlgorithmCode,
): VersionAlgorithmCoding {
  return versionAlgorithms.find((v) => v.code === code)!;
}

export const COLORS = {
  itemDragOver: "rgb(2,123,227,0.5)",
} as const;

export const MAX_ALLOWED_LEVELS = 5;
export const MAX_ALLOWED_LEVELS_FOR_GROUPS = MAX_ALLOWED_LEVELS - 1;
export const DRAG_KEY_INTERNAL_ID = "internalId";
export const MAX_LENGTH_LINKID = 255;
export const COPYRIGHT_LABEL_LENGTH_LIMIT = 50;
