import { Language } from "@/store";
import { AnswerOptionType, ItemType } from "@/utils/constants";
import { QTree } from "quasar";

export type VueProp = {
  expanded: boolean;
  ticked: boolean;
  tree: QTree;
  node: Item;
  key: string;
  color: string;
  dark: boolean;
};

// Exclude determined in cxEnableWhen when adding condition
export type SelectableQuestion = Exclude<
  ItemType,
  "attachment" | "display" | "group" | "open-choice" | "choice"
>;

export type SelectedQuestion = {
  linkId?: string;
  type?: SelectableQuestion;
};

export type AnswerType =
  | "integer"
  | "decimal"
  | "date"
  | "boolean"
  | "string"
  | "choice"
  | "coding"
  | "open-choice"
  | "text"
  | "url"
  | "time"
  | "dateTime"
  | "reference"
  | "quantity";

export const operators = ["exists", "=", "!=", ">", "<", ">=", "<="] as const;
export type Operator = typeof operators[number] | "";

export const comparators = [">", ">=", "<", "<="] as const;
export type Comparator = typeof comparators[number] | "";

export type Quantity = {
  value?: number;
  comparator?: Comparator;
  unit?: string;
  system?: string;
  code?: string;
};

export type Reference = {
  reference?: string;
  type?: string;
  display?: string;
  identifier?: Identifier;
};

export type EnableWhen = {
  __answerOption?: boolean;
  question: string;
  answer?: string;
  operator: Operator;
  type?: AnswerType;
  answerInteger?: number;
  answerDecimal?: number;
  answerDate?: string;
  answerBoolean?: boolean;
  answerString?: string;
  answerTime?: string;
  answerDateTime?: string;
  answerCoding?: Coding;
  answerQuantity?: Quantity;
  answerReference?: Reference;
};

export type Answer = {
  text: string;
  type: AnswerType;
};

export type Coding = {
  code?: string;
  system?: string;
  display?: string;
  version?: string;
  userSelected?: boolean | null;
};

export type AnswerOption = {
  __id?: string;
  __type?: AnswerOptionType;
  __icon?: string;
  __newAnswer?: boolean;
  __oldValueCoding?: Coding;
  __oldValueDecimal?: string | number;
  __oldValueInteger?: string | number;
  __oldValueDate?: string;
  __oldValueDateTime?: string;
  __oldValueTime?: string;
  __oldValueString?: string;
  __oldValueQuantity?: Quantity;
  __formattedValueCoding?: string;
  __oldFormattedValueCoding?: string;
  __formattedValueQuantity?: string;
  __oldFormattedValueQuantity?: string;
  linkId?: string;
  type?: string;
  valueCoding?: Coding;
  valueDecimal?: string | number;
  valueInteger?: string | number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueQuantity?: Quantity;
};

export type Extension = {
  url: string;
  valueInteger?: number;
  valueString?: string;
  valueCoding?: Coding;
};

export type Question = {
  __linkId?: string;
  __text?: string;
  __question: string;
  __answer?: string;
  __operator?: string;
  __type?: string;
  __display?: string;
  __system?: string;
  __answerInteger?: number;
  __answerDecimal?: number;
  __answerBoolean?: boolean;
  __answerCoding?: Coding;
  __answerDate?: string;
  __answerString?: string;
};

export type Condition = {
  __icon: string;
  __questions: Question[];
  __linkId: string;
  __text: string;
};

export type IdentifierType = {
  coding?: Coding;
  text?: string;
};

export const identifierUse = [
  "usual",
  "official",
  "temp",
  "secondary",
  "old",
] as const;
export type IdentifierUse = typeof identifierUse[number];

export type Identifier = {
  use?: IdentifierUse;
  system?: string;
  value?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: IdentifierType;
};

export const enableBehaviors = ["all", "any"] as const;
export type EnableBehavior = typeof enableBehaviors[number];

/*
 * Fields with "__"-prefix are used for internal state management
 */
// TODO: add initial-field
// TODO: rework answerValueSet-field
export type Item = {
  __active: boolean;
  /*
   * __disabled items can't be selected in GUI
   * __disabled === !__active, unless inactive Item still needs to be selectable (to enable it again)
   */
  __disabled: boolean;
  __icon: string;
  // unique ID based on uuidv4 and Date
  __internalID: string;
  __newQuestion: boolean;
  __oldText?: string;
  __dependenceCondition?: Condition;
  __OldAnswerValueSet?: string;
  __answerValueSetCheck?: boolean;
  // tracks position of item regardless whether it's active or not
  __linkId: string;
  // tracks position of active items, linkId === "" if inactive/disabled
  linkId: string;
  item?: Item[];
  maxLength?: number;
  type: ItemType;
  enableWhen?: EnableWhen[];
  enableBehavior?: EnableBehavior;
  text: string;
  definition?: string;
  answerOption?: AnswerOption[];
  answerValueSet?: string;
  extension?: Extension[];
  required: boolean | undefined;
  repeats: boolean | undefined;
};

export const status = ["draft", "active", "retired", "unknown"] as const;
export type Status = typeof status[number];

export type Questionnaire = {
  resourceType: "Questionnaire";
  language: Language;
  identifier?: Identifier[];
  url?: string;
  name?: string;
  version?: string;
  title?: string;
  status: Status;
  publisher?: string;
  date?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  // experimental is optional, so it can be deleted for exporting
  // experimental is null, so it can be used as a v-model
  experimental?: boolean | null;
  item: Item[];
};
