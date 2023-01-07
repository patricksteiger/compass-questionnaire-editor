export type QuestionType =
  | "group"
  | "string"
  | "choice"
  | "boolean"
  | "date"
  | "open-choice"
  | "integer"
  | "decimal";

export type AnswerType =
  | "integer"
  | "decimal"
  | "date"
  | "boolean"
  | "string"
  | "choice"
  | "coding"
  | "open-choice";

export type EnableWhen = {
  question: string;
  answer?: string;
  operator: string;
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
  type: string;
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
  __type?: string;
  __icon?: string;
  __newAnswer?: boolean;
  __oldValueInteger?: string;
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
  valueInteger?: number | null;
  valueString?: string;
  valueCoding?: Coding;
};

export type Question = {
  __linkId?: string;
  __text?: string;
  __question?: string;
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
  value?: string;
  use?: string;
  system?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: {
    coding?: Coding;
    text?: string;
  };
};

export type Questionnaire = {
  __active: boolean;
  __icon: string;
  __internalID: string;
  __linkId: string;
  __newQuestion: boolean;
  __oldText?: string;
  __dependeceCondition?: Condition;
  __OldAnswerValueSet: string;
  __answerValueSetCheck: boolean;
  disabled?: boolean;
  item: Questionnaire[] | undefined;
  identifier?: Identifier[];
  linkId: string;
  maxLength?: number;
  type: QuestionType;
  enableWhen?: EnableWhen[] | null;
  text: string;
  definition: string;
  answerOption?: AnswerOption[];
  answerValueSet?: string;
  extension?: Extension[];
  url?: string;
  name?: string;
  version?: string;
  title?: string;
  status?: string;
  publisher?: string;
  date?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  experimental?: boolean;
  resourceType: string;
};
