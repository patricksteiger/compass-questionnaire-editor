export type ExportCoding = {
  code?: string;
  system?: string;
  display?: string;
  version?: string;
  userSelected?: boolean;
};

export type ExportAnswerType =
  | "integer"
  | "decimal"
  | "date"
  | "boolean"
  | "string"
  | "choice"
  | "coding"
  | "open-choice";

export type ExportEnableWhen = {
  question: string;
  answer?: string;
  operator: string;
  type?: ExportAnswerType;
  system?: string;
  display?: string;
  answerInteger?: number;
  answerDecimal?: number;
  answerDate?: string;
  answerBoolean?: boolean;
  answerString?: string;
  answerCoding?: ExportCoding;
};

export type ExportExtension = {
  valueInteger: Number;
  valueString: String;
  valueCoding: ExportCoding;
};

export type ExportAnswerOption = {
  valueInteger: string | number;
};

export type ExportIdentifier = {
  value?: string;
  use?: string;
  system?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: {
    coding?: ExportCoding;
    text?: string;
  };
};

export type ExportItem = {
  item?: ExportItem[];
  extension?: ExportExtension[];
  answerOption?: ExportAnswerOption[];
  answerValueSet?: string;
  disabled?: boolean;
  enableWhen?: ExportEnableWhen[];
  linkId: string;
  identifier?: ExportIdentifier[];
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
