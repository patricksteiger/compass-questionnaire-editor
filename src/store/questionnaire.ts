import { AnswerOption } from "@/types";
import gecco from "./questionnaire.json";
export const geccoQuestionnaire = gecco;

export type GeccoQuestionnaire = typeof geccoQuestionnaire;
type InternalGeccoItem = typeof geccoQuestionnaire["item"][number];

type AdditionalFields = {
  __internalID?: string;
  answerValueSet?: string;
  answerOption?: AnswerOption[];
};

type Iterate<T extends Array<any>> = T extends [infer Head, ...infer Tail]
  ? [IterGeccoItem<Head> & AdditionalFields, ...Iterate<Tail>]
  : [];

type IterGeccoItem<T> = {
  [Key in keyof T]: Key extends "item"
    ? T[Key] extends Array<any>
      ? Iterate<T[Key]>
      : undefined
    : T[Key];
};

export type GeccoItem = IterGeccoItem<InternalGeccoItem> & AdditionalFields;
