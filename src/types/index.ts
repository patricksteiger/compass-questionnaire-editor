import { Language } from "@/store";
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

export type QuestionType =
  | "group"
  | "open-choice"
  | "choice"
  | "string"
  | "boolean"
  | "date"
  | "integer"
  | "decimal";

// Exclude determined in cxEnableWhen when adding condition
export type SelectableQuestion = Exclude<
  QuestionType,
  "group" | "open-choice" | "choice"
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
  | "open-choice";

export const operators = ["exists", "=", "!=", ">", "<", ">=", "<="] as const;
export type Operator = typeof operators[number] | "";

export type EnableWhen = {
  question: string;
  answer?: string;
  operator: Operator;
  type?: AnswerType;
  system?: string;
  display?: string;
  answerInteger?: number;
  answerDecimal?: number;
  answerDate?: string;
  answerBoolean?: boolean;
  answerString?: string;
  answerCoding?: Coding;
};

export type Answer = {
  text: string;
  type: AnswerType;
};

export type Coding = {
  __oldDisplay?: string;
  code?: string;
  system?: string;
  display?: string;
  version?: string;
  userSelected?: boolean;
};

export type AnswerOption = {
  __id?: number;
  __type?: AnswerType;
  __icon?: string;
  __newAnswer?: boolean;
  __oldValueInteger?: string | number;
  __oldValueDate?: string;
  __oldValueString?: string;
  linkId?: string;
  type?: string;
  valueCoding?: Coding;
  valueString?: string;
  valueInteger?: string | number;
  valueDate?: string;
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

export type Identifier = {
  use?: string;
  system?: string;
  value?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: {
    coding?: Coding;
    text?: string;
  };
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
  __newDefinition: boolean;
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
  type: QuestionType;
  enableWhen?: EnableWhen[];
  enableBehavior?: EnableBehavior;
  text: string;
  definition: string;
  answerOption?: AnswerOption[];
  answerValueSet?: string;
  extension?: Extension[];
  required: boolean;
  repeats: boolean;
};

export type Status = "draft" | "active" | "retired" | "unknown";

export type Questionnaire = {
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
  experimental?: Boolean;
  item: Item[];
  resourceType: "Questionnaire";
};
