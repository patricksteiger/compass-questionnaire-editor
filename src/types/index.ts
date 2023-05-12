import { Language } from "@/store";
import {
  AnswerOptionType,
  ItemType,
  NotSelectableItem,
  VersionAlgorithmCoding,
} from "@/utils/constants";
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
export type SelectableItem = Exclude<ItemType, NotSelectableItem>;

export type SelectedItem = {
  linkId?: string;
  type?: SelectableItem;
};

export type AnswerType =
  | "integer"
  | "decimal"
  | "date"
  | "boolean"
  | "string"
  | "coding"
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
  __orString?: boolean;
  __answer?: string;
  __type?: AnswerType;
  question: string;
  operator: Operator;
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

export type Coding = {
  code?: string;
  system?: string;
  display?: string;
  version?: string;
  userSelected?: boolean | null;
};

export type AnswerOption = {
  __id?: string;
  __type: AnswerOptionType;
  __icon?: string;
  __newAnswer?: boolean;
  __oldValueCoding?: Coding;
  __oldValueDecimal?: number;
  __oldValueInteger?: number;
  __oldValueDate?: string;
  __oldValueDateTime?: string;
  __oldValueTime?: string;
  __oldValueString?: string;
  __oldValueQuantity?: Quantity;
  __oldValueReference?: Reference;
  __formattedValueCoding?: string;
  __oldFormattedValueCoding?: string;
  __formattedValueQuantity?: string;
  __oldFormattedValueQuantity?: string;
  __formattedValueReference?: string;
  __oldFormattedValueReference?: string;
  __linkId?: string;
  valueCoding?: Coding;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueQuantity?: Quantity;
  valueReference?: Reference;
  initialSelected: boolean;
};

export const extensionTypes = [
  "boolean",
  "code",
  "decimal",
  "integer",
  "date",
  "dateTime",
  "time",
  "string",
  "markdown",
] as const;

export type Extension = { url: string } & (
  | { __type: "boolean"; valueBoolean: boolean }
  | { __type: "code"; valueCode: string }
  | { __type: "decimal"; valueDecimal: number }
  | { __type: "integer"; valueInteger: number }
  | { __type: "date"; valueDate: string }
  | { __type: "dateTime"; valueDateTime: string }
  | { __type: "time"; valueTime: string }
  | { __type: "string"; valueString: string }
  | { __type: "markdown"; valueMarkdown: string }
);

export type ExtensionType = Extension["__type"];

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

export const answerConstraints = [
  "optionsOnly",
  "optionsOrType",
  "optionsOrString",
] as const;
export type AnswerConstraint = typeof answerConstraints[number];

export type Initial =
  | { __type: "boolean"; valueBoolean: boolean }
  | { __type: "decimal"; valueDecimal: number }
  | { __type: "integer"; valueInteger: number }
  | { __type: "date"; valueDate: string }
  | { __type: "dateTime"; valueDateTime: string };

/*
 * Fields with "__"-prefix are used for internal state management
 */
// TODO: add initial-field
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
  // is false if question was imported, used to revert values to original value after changes
  __newQuestion: boolean;
  __oldText?: string;
  __dependenceCondition?: Condition;
  __OldAnswerValueSet?: string;
  __answerValueSetCheck?: boolean;
  // internal linkId, tracking position in item-tree (e.g. 0.2.1)
  __linkId: string;
  linkId: string;
  item?: Item[];
  maxLength?: number;
  type: ItemType;
  enableWhen?: EnableWhen[];
  enableBehavior?: EnableBehavior | null;
  text: string;
  definition?: string;
  answerConstraint?: AnswerConstraint | null;
  answerOption?: AnswerOption[];
  answerValueSet?: string;
  extension?: Extension[];
  required: boolean | undefined;
  repeats: boolean | undefined;
  initial: Initial[];
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
  versionAlgorithmCoding?: VersionAlgorithmCoding;
  title?: string;
  status: Status;
  publisher?: string;
  description?: string;
  purpose?: string;
  date?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  // experimental is optional, so it can be deleted for exporting
  // experimental is null, so it can be used as a v-model
  experimental?: boolean | null;
  extension?: Extension[];
  item: Item[];
};
