// TODO: Add reference
export const answerOptionButtons = [
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "date", icon: "calendar_month", label: "Date" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "time", icon: "schedule", label: "Time" },
  { name: "coding", icon: "code", label: "Coding" },
] as const;
export type AnswerOptionButton = typeof answerOptionButtons[number];
export type AnswerOptionType = typeof answerOptionButtons[number]["name"];
export type AnswerOptionIcon = typeof answerOptionButtons[number]["icon"];

export function getAnswerOptionIcon(type: AnswerOptionType): AnswerOptionIcon {
  const answerOptionButton = answerOptionButtons.find((a) => a.name === type);
  if (answerOptionButton === undefined) {
    console.error(`Illegal AnswerOptionType: ${type}`);
    return "" as unknown as AnswerOptionIcon;
  }
  return answerOptionButton.icon;
}

export const allItemTypes = [
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
  "time",
  "dateTime",
  "quantity",
] as const;
export type ItemType = typeof allItemTypes[number];
export function isInvalidItemType(type: unknown): boolean {
  return !allItemTypes.includes(type as ItemType);
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

// TODO: Add quantity
// TODO: Add reference
// TODO: Add attachment
export const itemTypeIcons = [
  { name: "group", icon: "group_work", label: "Group" },
  { name: "choice", icon: "toc", label: "Choice" },
  { name: "open-choice", icon: "horizontal_split", label: "Open-Choice" },
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
] as const;
export type ItemTypeLabel = typeof itemTypeIcons[number];
export type ItemTypeIcon = ItemTypeLabel["icon"];

export const complexItemTypeIcons = [
  { name: "group", icon: "group_work", label: "Group" },
  { name: "choice", icon: "toc", label: "Choice" },
  { name: "open-choice", icon: "horizontal_split", label: "Open-Choice" },
  { name: "display", icon: "description", label: "Display" },
] as const;
export const simpleItemTypeIcons = [
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
] as const;

export function getItemTypeIcon(type: ItemType): ItemTypeIcon {
  const icon = itemTypeIcons.find((i) => i.name === type);
  if (icon === undefined) {
    console.error(`Invalid itemType: ${type}`);
    return undefined as unknown as ItemTypeIcon;
  }
  return icon.icon;
}

export const COLORS = {
  itemDragOver: "rgb(2,123,227,0.5)",
} as const;

export const MAX_ALLOWED_LEVELS = 5;
export const MAX_ALLOWED_LEVELS_FOR_GROUPS = MAX_ALLOWED_LEVELS - 1;
export const DRAG_KEY_INTERNAL_ID = "internalId";
