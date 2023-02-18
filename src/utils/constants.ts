// TODO: Add time
// TODO: Add reference
export const answerOptionButtons = [
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "date", icon: "event", label: "Date" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "coding", icon: "toc", label: "Coding" },
] as const;
export type AnswerOptionButton = typeof answerOptionButtons[number];

const itemTypes = [
  "group",
  "string",
  "choice",
  "open-choice",
  "boolean",
  "decimal",
  "integer",
  "date",
  "text",
  "url",
  "display",
] as const;
export type ItemType = typeof itemTypes[number];
export function isInvalidItemType(type: unknown): boolean {
  return !itemTypes.includes(type as ItemType);
}
export function isSimpleItemType(type: ItemType): boolean {
  return (
    type === "boolean" ||
    type === "decimal" ||
    type === "integer" ||
    type === "string" ||
    type === "text" ||
    type === "open-choice" ||
    type === "url"
  );
}

// TODO: Add time
// TODO: Add dateTime
// TODO: Add quantity
// TODO: Add reference
// TODO: Add attachment
export const itemTypeIcons = [
  { name: "group", icon: "group_work", label: "Group" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "choice", icon: "toc", label: "Choice" },
  { name: "boolean", icon: "toggle_off", label: "Boolean" },
  { name: "date", icon: "event", label: "Date" },
  { name: "open-choice", icon: "horizontal_split", label: "Open-Choice" },
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "decimal", icon: "pin", label: "Decimal" },
  { name: "text", icon: "input", label: "Text" },
  { name: "url", icon: "link", label: "URL" },
  { name: "display", icon: "description", label: "Display" },
] as const;
export type ItemTypeIcon = typeof itemTypeIcons[number];

export function getItemTypeIcon(type: ItemType): ItemTypeIcon["icon"] {
  // return itemTypeIconsMap[type];
  const icon = itemTypeIcons.find((i) => i.name === type);
  if (icon === undefined) {
    console.error(`Invalid itemType: ${type}`);
    return undefined as unknown as ItemTypeIcon["icon"];
  }
  return icon.icon;
}

export const COLORS = {
  itemDragOver: "rgb(2,123,227,0.5)",
} as const;

export const MAX_ALLOWED_LEVELS = 5;
export const MAX_ALLOWED_LEVELS_FOR_GROUPS = MAX_ALLOWED_LEVELS - 1;
export const DRAG_KEY_INTERNAL_ID = "internalId";

// Source: https://www.hl7.org/fhir/datatypes.html#date
export const DATE_REGEXP =
  /([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?/g;
