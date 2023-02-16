// TODO: Add time
// TODO: Add reference
export const answerOptionButtons = [
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "date", icon: "event", label: "Date" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "coding", icon: "toc", label: "Coding" },
] as const;
export type AnswerOptionButton = typeof answerOptionButtons[number];

// TODO: Add display
// TODO: Add time
// TODO: Add dateTime
// TODO: Add url
// TODO: Add text
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
] as const;
export type ItemTypeIcon = typeof itemTypeIcons[number];
export type ItemType = ItemTypeIcon["name"];

const itemTypeIconsMap = {
  group: "group_work",
  // display: "table_rows",
  boolean: "toggle_off",
  decimal: "pin",
  integer: "pin",
  date: "event",
  // dateTime: "date_range",
  string: "text_fields",
  choice: "toc",
  ["open-choice"]: "horizontal_split",
} as const;

export function getTypeQuestionIcon(type: ItemType): ItemTypeIcon["icon"] {
  return itemTypeIconsMap[type];
}

export const COLORS = {
  itemDragOver: "rgb(2,123,227,0.5)",
} as const;

export const MAX_ALLOWED_LEVELS = 5;
export const MAX_ALLOWED_LEVELS_FOR_GROUPS = MAX_ALLOWED_LEVELS - 1;
export const DRAG_KEY_INTERNAL_ID = "internalId";
