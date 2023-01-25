export const answerType = {
  boolean: { name: "boolean", icon: "check_box_outline_blank" },
  decimal: { name: "decimal", icon: "input" },
  integer: { name: "integer", icon: "pin" },
  date: { name: "date", icon: "event" },
  string: { name: "string", icon: "input" },
  choice: { name: "choice", icon: "radio_button_unchecked" },
  open_choice: { name: "open-choice", icon: "input" },
} as const;

export const questionType = {
  group: { name: "group", icon: "article", label: "Group" },
  display: { name: "display", icon: "table_rows", label: "Display" },
  boolean: { name: "boolean", icon: "toggle_off", label: "Boolean" },
  decimal: { name: "decimal", icon: "input", label: "Decimal" },
  integer: { name: "integer", icon: "pin", label: "Integer" },
  date: { name: "date", icon: "event", label: "Date" },
  dateTime: { name: "dateTime", icon: "date_range", label: "Date Time" },
  string: { name: "string", icon: "input", label: "String" },
  choice: { name: "choice", icon: "toc", label: "Choice" },
  open_choice: {
    name: "open-choice",
    icon: "horizontal_split",
    label: "Open-Choice",
  },
} as const;
type QuestionType = typeof questionType;
export type QuestionTypeIndex = QuestionType[keyof QuestionType]["name"];

export const answerTypeButton = [
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "date", icon: "event", label: "Date" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "coding", icon: "toc", label: "Coding" },
] as const;
export type AnswerButtonType = typeof answerTypeButton[number];

export const questionTypesIcons = [
  { name: "group", icon: "article", label: "Group" },
  { name: "string", icon: "text_fields", label: "String" },
  { name: "choice", icon: "toc", label: "Choice" },
  { name: "boolean", icon: "toggle_off", label: "Boolean" },
  { name: "date", icon: "event", label: "Date" },
  { name: "open-choice", icon: "horizontal_split", label: "Open-Choice" },
  { name: "integer", icon: "pin", label: "Integer" },
  { name: "decimal", icon: "input", label: "Decimal" },
] as const;
export type QuestionIcon = typeof questionTypesIcons[number];

export const questionTypes = {
  group: "group",
  string: "string",
  choice: "choice",
  boolean: "boolean",
  date: "date",
  openChoice: "open-choice",
  integer: "integer",
  decimal: "decimal",
} as const;

export const COLORS = {
  itemDragOver: "rgb(2,123,227,0.5)",
} as const;

export const MAX_ALLOWED_LEVELS = 5;
export const MAX_ALLOWED_LEVELS_FOR_GROUPS = MAX_ALLOWED_LEVELS - 1;
export const COMPASS_GECCO_ITEM_URL =
  "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem";
