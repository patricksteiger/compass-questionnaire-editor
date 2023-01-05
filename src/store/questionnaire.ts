import { AnswerOption } from "@/utils/editor";
import gecco from "./questionnaire.json";
export const geccoQuestionnaire = gecco;

export type Gecco = typeof geccoQuestionnaire;
type GeccoItem = typeof geccoQuestionnaire["item"][number];

type NodeAdditional = {
  __internalID?: string;
  answerValueSet?: string;
  answerOption?: AnswerOption[];
};

type Iterate<T extends Array<any>> = T extends [infer Head, ...infer Tail]
  ? [IterGeccoItem<Head> & NodeAdditional, ...Iterate<Tail>]
  : [];

type IterGeccoItem<T> = {
  [Key in keyof T]: Key extends "item"
    ? T[Key] extends Array<any>
      ? Iterate<T[Key]>
      : undefined
    : T[Key];
};

export type GeccoNode = IterGeccoItem<GeccoItem> & NodeAdditional;
