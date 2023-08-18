import { Language } from "@/store";
import {
  AnswerOptionType,
  ItemType,
  NotSelectableItem,
  VersionAlgorithmCoding,
} from "@/utils/constants";
import { ResourceType } from "@/utils/resourceType";
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
  | "quantity"
  | "attachment";

export const operators = ["exists", "=", "!=", ">", "<", ">=", "<="] as const;
export type Operator = (typeof operators)[number] | "";

export const comparators = [">", ">=", "<", "<=", "ad"] as const;
export type Comparator = (typeof comparators)[number];

export type Quantity = {
  value?: number;
  comparator?: Comparator | "";
  unit?: string;
  system?: string;
  code?: string;
};

export type SimpleQuantity = Omit<Quantity, "comparator">;

export type Range = {
  low?: SimpleQuantity;
  high?: SimpleQuantity;
};

export type Reference = {
  reference?: string;
  type?: string;
  display?: string;
  identifier?: Identifier;
};

export type EnableWhen = {
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
  answerUri?: string;
  answerTime?: string;
  answerDateTime?: string;
  answerCoding?: Coding;
  answerQuantity?: Quantity;
  answerReference?: Reference;
  answerAttachment?: Attachment;
};

export type Coding = {
  code?: string;
  system?: string;
  display?: string;
  version?: string;
  userSelected?: boolean | null;
};

export type CodeableConcept = {
  coding: Coding[];
  text?: string;
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
  __oldValueUri?: string;
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
  valueUri?: string;
  valueQuantity?: Quantity;
  valueReference?: Reference;
  initialSelected: boolean;
};

export const extensionTypes = [
  "complex",
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

type extTypes = typeof extensionTypes;

export type ExtensionType = extTypes[number];

export type ComplexExtension = {
  __type: extTypes[0];
  url: string;
  extension: Extension[];
};

export type Extension = { url: string } & (
  | ComplexExtension
  | { __type: extTypes[1]; valueBoolean: boolean }
  | { __type: extTypes[2]; valueCode: string }
  | { __type: extTypes[3]; valueDecimal: number }
  | { __type: extTypes[4]; valueInteger: number }
  | { __type: extTypes[5]; valueDate: string }
  | { __type: extTypes[6]; valueDateTime: string }
  | { __type: extTypes[7]; valueTime: string }
  | { __type: extTypes[8]; valueString: string }
  | { __type: extTypes[9]; valueMarkdown: string }
);

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

export const identifierUse = [
  "usual",
  "official",
  "temp",
  "secondary",
  "old",
] as const;
export type IdentifierUse = (typeof identifierUse)[number];

export type Identifier = {
  use?: IdentifierUse;
  system?: string;
  value?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: CodeableConcept;
};

export const enableBehaviors = ["all", "any"] as const;
export type EnableBehavior = (typeof enableBehaviors)[number];

export const disabledDisplays = ["hidden", "protected"] as const;
export type DisabledDisplay = (typeof disabledDisplays)[number];

export const answerConstraints = [
  "optionsOnly",
  "optionsOrType",
  "optionsOrString",
] as const;
export type AnswerConstraint = (typeof answerConstraints)[number];

export type Attachment = {
  contentType?: string;
  language?: string;
  // base64Binary
  data?: string;
  // Where Attachment can be found. Usually used without data
  url?: string;
  size?: number;
  // base64Binary
  hash?: string;
  title?: string;
  // dateTime
  creation?: string;
  height?: number;
  width?: number;
  frames?: number;
  duration?: number;
  pages?: number;
};

export type Initial =
  | { __type: "boolean"; valueBoolean: boolean }
  | { __type: "decimal"; valueDecimal: number }
  | { __type: "integer"; valueInteger: number }
  | { __type: "date"; valueDate: string }
  | { __type: "dateTime"; valueDateTime: string }
  | { __type: "time"; valueTime: string }
  | { __type: "string"; valueString: string }
  | { __type: "url"; valueUri: string }
  | { __type: "coding"; valueCoding: Coding }
  | { __type: "quantity"; valueQuantity: Quantity }
  | { __type: "reference"; valueReference: Reference }
  | { __type: "attachment"; valueAttachment: Attachment };

/*
 * Fields with "__"-prefix are used for internal state management
 */
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
  __answerValueSetCheck: boolean;
  // internal linkId, tracking position in item-tree (e.g. 0.2.1)
  __linkId: string;
  linkId: string;
  item?: Item[];
  maxLength?: number;
  type: ItemType;
  enableWhen: EnableWhen[];
  enableBehavior?: EnableBehavior | null;
  disabledDisplay: DisabledDisplay | null;
  text: string;
  definition?: string;
  answerConstraint?: AnswerConstraint | null;
  answerOption?: AnswerOption[];
  answerValueSet?: string;
  extension: Extension[];
  modifierExtension: Extension[];
  code: Coding[];
  prefix?: string;
  required: boolean | undefined;
  repeats: boolean | undefined;
  readOnly: boolean | undefined;
  initial: Initial[];
};

export const status = ["draft", "active", "retired", "unknown"] as const;
export type Status = (typeof status)[number];

export type Period = {
  start?: string;
  end?: string;
};

export const contactPointSystems = [
  "phone",
  "fax",
  "email",
  "pager",
  "url",
  "sms",
  "other",
] as const;
export type ContactPointSystem = (typeof contactPointSystems)[number];

export const contactPointUses = [
  "home",
  "work",
  "temp",
  "old",
  "mobile",
] as const;
export type ContactPointUse = (typeof contactPointUses)[number];

export type ContactPoint = {
  system?: ContactPointSystem;
  value?: string;
  use?: ContactPointUse;
  rank?: number;
  period: Period;
};

export type ContactDetail = {
  name: string;
  telecom: ContactPoint[];
};

export const useContextTypes = [
  "codeableConcept",
  "quantity",
  "range",
  "reference",
] as const;
export type UseContextType = (typeof useContextTypes)[number];

export type UsageContext = {
  code: Coding;
} & (
  | { __type: "codeableConcept"; valueCodeableConcept: CodeableConcept }
  | { __type: "quantity"; valueQuantity: Quantity }
  | { __type: "range"; valueRange: Range }
  | { __type: "reference"; valueReference: Reference }
);

export const derivedFromExtensionValues = [
  "extends",
  "compliesWith",
  "inspiredBy",
] as const;
export type DerivedFromExtensionValue =
  (typeof derivedFromExtensionValues)[number];

export const derivedFromExtensionUrl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-derivationType";
export const derivedFromExtensionCodeUrl =
  "http://hl7.org/fhir/questionnaire-derivationType";

export type DerivedFromExtension = {
  url: typeof derivedFromExtensionUrl;
} & (
  | {
      __value: "extends";
      valueCodeableConcept?: {
        text?: string;
        coding: [
          {
            code: "extends";
            display: "extends";
            system: typeof derivedFromExtensionCodeUrl;
            version: "1.0.0";
            userSelected?: boolean;
          },
        ];
      };
    }
  | {
      __value: "compliesWith";
      valueCodeableConcept?: {
        text?: string;
        coding: [
          {
            code: "compliesWith";
            display: "complies with";
            system: typeof derivedFromExtensionCodeUrl;
            version: "1.0.0";
            userSelected?: boolean;
          },
        ];
      };
    }
  | {
      __value: "inspiredBy";
      valueCodeableConcept?: {
        text?: string;
        coding: [
          {
            code: "inspiredBy";
            display: "inspired by";
            system: typeof derivedFromExtensionCodeUrl;
            version: "1.0.0";
            userSelected?: boolean;
          },
        ];
      };
    }
  | {
      __value: null;
    }
);

export type Meta = {
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile: string[];
  security: Coding[];
  tag: Coding[];
};

export const narrativeStatuses = [
  "generated",
  "extensions",
  "additional",
  "empty",
] as const;
export type NarrativeStatus = (typeof narrativeStatuses)[number];

export type Narrative = {
  status: NarrativeStatus;
  div: string;
};

export type Questionnaire = {
  __versionAlgorithmUsesCoding: boolean;
  resourceType: "Questionnaire";
  id?: string;
  implicitRules?: string;
  meta: Meta;
  language: Language;
  text: Narrative;
  url?: string;
  identifier: Identifier[];
  version?: string;
  versionAlgorithmString?: string;
  versionAlgorithmCoding?: VersionAlgorithmCoding;
  name?: string;
  title?: string;
  derivedFrom: string[];
  _derivedFrom: DerivedFromExtension[];
  status: Status;
  experimental: boolean;
  subjectType: ResourceType[];
  date: string;
  publisher?: string;
  description?: string;
  contact: ContactDetail[];
  purpose?: string;
  useContext: UsageContext[];
  copyright?: string;
  copyrightLabel?: string;
  approvalDate: string;
  lastReviewDate: string;
  effectivePeriod: Period;
  code: Coding[];
  extension: Extension[];
  modifierExtension: Extension[];
  item: Item[];
};
