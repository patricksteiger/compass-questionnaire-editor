import { Language } from "@/store";
import {
  Coding,
  ContactDetail,
  ContactPoint,
  Extension,
  Item,
  Meta,
  Narrative,
  Period,
  Questionnaire,
  UsageContext,
} from "@/types";
import { dateTools } from "@/utils/date";
import { editorTools, UnreachableError } from "@/utils/editor";
import { questionnaireTools } from "../questionnaire";
import { allowsAnswerOption, allowsAnswerValueSet } from "../constants";

export type Errors = {
  items: ItemError[];
  primary: string[];
  secondary: string[];
};

export type ItemError = {
  linkId: string;
  internalId: string;
  position: string;
  errors: string[];
};

export class ErrorChecker {
  constructor(readonly questionnaire: Questionnaire) {}

  static check(questionnaire: Questionnaire): Errors {
    return new ErrorChecker(questionnaire).validate();
  }

  validate(): Errors {
    const items = this.items();
    const primary = this.primary();
    const secondary = this.secondary();
    return { items, primary, secondary };
  }

  static nonEmpty(errors: Errors): boolean {
    return (
      errors.items.length > 0 ||
      errors.primary.length > 0 ||
      errors.secondary.length > 0
    );
  }

  static hasErrors(questionnaire: Questionnaire): boolean {
    const errors = ErrorChecker.check(questionnaire);
    return ErrorChecker.nonEmpty(errors);
  }

  static haveErrors(questionnaires: Questionnaire[]): Language[] {
    const languages: Language[] = [];
    for (const questionnaire of questionnaires) {
      if (ErrorChecker.hasErrors(questionnaire)) {
        languages.push(questionnaire.language);
      }
    }
    return languages;
  }

  private items(): ItemError[] {
    const result: ItemError[] = [];
    for (const item of this.questionnaire.item) {
      this.item(item, result);
    }
    return result;
  }

  private item(item: Item, itemErrors: ItemError[]): void {
    const errors: string[] = [];
    this.enableWhen(item, errors);
    this.answerValueSet(item, errors);
    this.answerOption(item, errors);
    this.answerOptionAndInitial(item, errors);
    this.initial(item, errors);
    this.code(item.code, errors);
    this.extension(item.extension, errors, "extension");
    this.extension(item.modifierExtension, errors, "modifierExtension");
    if (errors.length > 0) {
      const error: ItemError = {
        linkId: item.linkId,
        internalId: item.__internalID,
        position: editorTools.formatInternalPosition(item.__linkId),
        errors,
      };
      itemErrors.push(error);
    }
    if (item.item !== undefined) {
      for (const element of item.item) {
        this.item(element, itemErrors);
      }
    }
  }

  private extension(
    extensions: Extension[] | undefined,
    errors: string[],
    name: string,
  ) {
    if (editorTools.emptyArray(extensions)) return;
    this.extensionHelper(extensions, errors, name);
  }

  private extensionHelper(
    extensions: Extension[],
    errors: string[],
    name: string,
    parentPos?: string,
  ) {
    for (let p = 1; p <= extensions.length; p++) {
      const pos = !parentPos ? p.toString() : `${parentPos} -> ${p}`;
      const extension = extensions[p - 1];
      switch (extension.__type) {
        case "boolean":
          break;
        case "code":
          if (!extension.valueCode) {
            errors.push(`${name} at position ${pos} has empty code`);
          }
          break;
        case "decimal":
          if (editorTools.invalidNumber(extension.valueDecimal)) {
            errors.push(`${name} at position ${pos} has empty decimal number`);
          }
          break;
        case "integer":
          if (editorTools.invalidNumber(extension.valueInteger)) {
            errors.push(`${name} at position ${pos} has empty integer number`);
          }
          break;
        case "date":
          if (dateTools.isDate(extension.valueDate) !== true) {
            errors.push(`${name} at position ${pos} has invalid date`);
          }
          break;
        case "dateTime":
          if (dateTools.isDateTime(extension.valueDateTime) !== true) {
            errors.push(`${name} at position ${pos} has invalid dateTime`);
          }
          break;
        case "time":
          if (dateTools.isTime(extension.valueTime) !== true) {
            errors.push(`${name} at position ${pos} has invalid time`);
          }
          break;
        case "string":
          if (!extension.valueString) {
            errors.push(`${name} at position ${pos} has empty string`);
          }
          break;
        case "markdown":
          if (!extension.valueMarkdown) {
            errors.push(`${name} at position ${pos} has empty markdown`);
          }
          break;
        case "complex":
          if (extension.extension.length === 0) {
            errors.push(`complex ${name} at position ${pos} has no children`);
          } else {
            this.extensionHelper(extension.extension, errors, name, pos);
          }
          break;
        default:
          throw new UnreachableError(extension);
      }
    }
  }

  private answerOption(item: Item, errors: string[]) {
    if (item.__answerValueSetCheck || !allowsAnswerOption(item.type)) {
      return;
    }
    if (editorTools.emptyArray(item.answerOption)) {
      if (item.answerConstraint) {
        errors.push(
          "answerConstraint should not be defined, if answerOption is undefined",
        );
      }
    } else {
      this.answerOptionHelper(item, errors);
    }
  }

  private answerValueSet(item: Item, errors: string[]) {
    if (!item.__answerValueSetCheck || !allowsAnswerValueSet(item.type)) {
      return;
    }
    if (!item.answerValueSet) {
      if (item.answerConstraint) {
        errors.push(
          "answerConstraint should not be defined, if answerValueSet is empty",
        );
      }
    } else {
      const msg = questionnaireTools.isCanonicalOrEmpty(item.answerValueSet);
      if (msg !== true) {
        errors.push(`answerValueSet: ${msg}`);
      }
    }
  }

  private answerOptionHelper(item: Item, errors: string[]): void {
    if (item.answerOption === undefined) return;
    let initialSelectedCount = 0;
    for (let pos = 1; pos <= item.answerOption.length; pos++) {
      const answerOption = item.answerOption[pos - 1];
      if (answerOption.initialSelected) {
        initialSelectedCount++;
      }
      switch (answerOption.__type) {
        case "coding":
          if (editorTools.isEmptyObject(answerOption.valueCoding)) {
            errors.push(
              `answerOption at position ${pos} has empty coding-answer`,
            );
          } else if (!answerOption.valueCoding?.code) {
            errors.push(
              `answerOption at position ${pos} has empty code in coding-answer`,
            );
          }
          break;
        case "decimal":
          if (editorTools.onlyStringFalsy(answerOption.valueDecimal)) {
            errors.push(
              `answerOption at position ${pos} has empty decimal-answer`,
            );
          }
          break;
        case "integer":
          if (editorTools.onlyStringFalsy(answerOption.valueInteger)) {
            errors.push(
              `answerOption at position ${pos} has empty integer-answer`,
            );
          }
          break;
        case "date":
          if (dateTools.isDate(answerOption.valueDate) !== true) {
            errors.push(
              `answerOption at position ${pos} has invalid date-answer`,
            );
          }
          break;
        case "dateTime":
          if (dateTools.isDateTime(answerOption.valueDateTime) !== true) {
            errors.push(
              `answerOption at position ${pos} has invalid dateTime-answer`,
            );
          }
          break;
        case "time":
          if (dateTools.isTime(answerOption.valueTime) !== true) {
            errors.push(
              `answerOption at position ${pos} has invalid time-answer`,
            );
          }
          break;
        case "text":
        case "string":
          if (!answerOption.valueString) {
            errors.push(`answerOption at position ${pos} has empty answer`);
          }
          break;
        case "url":
          if (questionnaireTools.isUri(answerOption.valueUri) !== true) {
            errors.push(
              `answerOption at position ${pos} has invalid url-answer`,
            );
          }
          break;
        case "quantity":
          if (editorTools.isEmptyObject(answerOption.valueQuantity)) {
            errors.push(
              `answerOption at position ${pos} has empty quantity-answer`,
            );
          } else {
            if (!answerOption.valueQuantity?.value) {
              errors.push(
                `answerOption at position ${pos} has empty value in quantity-answer`,
              );
            }
            if (!answerOption.valueQuantity?.code) {
              errors.push(
                `answerOption at position ${pos} has empty code in quantity-answer`,
              );
            }
          }
          break;
        case "reference":
          if (editorTools.isEmptyObject(answerOption.valueReference)) {
            errors.push(
              `answerOption at position ${pos} has empty reference-answer`,
            );
          }
          break;
        default:
          throw new UnreachableError(answerOption.__type);
      }
    }
    if (!item.repeats && initialSelectedCount > 1) {
      errors.push(
        "There cannot be multiple initialSelected answerOptions for items that do not repeat. Only the first initialSelected answerOption will be exported with initialSelected=true!",
      );
    }
  }

  private answerOptionAndInitial(item: Item, errors: string[]): void {
    if (
      editorTools.nonEmptyArray(item.answerOption) &&
      editorTools.nonEmptyArray(item.initial)
    ) {
      errors.push(
        "answerOption and initial should not have defined elements at the same time",
      );
    }
  }

  private initial(item: Item, errors: string[]): void {
    if (!item.repeats && item.initial.length > 1) {
      errors.push(
        "initial can not have more than 1 element if item does not repeat. Only the first valid element will be exported",
      );
    }
    for (let i = 0; i < item.initial.length; i++) {
      const initial = item.initial[i];
      const pos = i + 1;
      switch (initial.__type) {
        case "boolean":
          break;
        case "decimal":
          if (initial.valueDecimal !== 0 && !initial.valueDecimal) {
            errors.push(`inital at position ${pos} has empty valueDecimal`);
          }
          break;
        case "integer":
          if (initial.valueInteger !== 0 && !initial.valueInteger) {
            errors.push(`inital at position ${pos} has empty valueInteger`);
          }
          break;
        case "date":
          if (dateTools.isDate(initial.valueDate) !== true) {
            errors.push(`inital at position ${pos} has invalid valueDate`);
          }
          break;
        case "dateTime":
          if (dateTools.isDateTime(initial.valueDateTime) !== true) {
            errors.push(`inital at position ${pos} has invalid valueDateTime`);
          }
          break;
        case "time":
          if (dateTools.isTime(initial.valueTime) !== true) {
            errors.push(`inital at position ${pos} has invalid valueTime`);
          }
          break;
        case "string":
          if (!initial.valueString) {
            errors.push(`inital at position ${pos} has empty valueString`);
          }
          break;
        case "url":
          if (!initial.valueUri) {
            errors.push(`inital at position ${pos} has empty valueUri`);
          }
          break;
        case "coding":
          if (editorTools.isEmptyObject(initial.valueCoding)) {
            errors.push(`inital at position ${pos} has empty valueCoding`);
          }
          break;
        case "quantity":
          if (editorTools.isEmptyObject(initial.valueQuantity)) {
            errors.push(`inital at position ${pos} has empty valueQuantity`);
          }
          break;
        case "reference":
          if (editorTools.isEmptyObject(initial.valueReference)) {
            errors.push(`inital at position ${pos} has empty valueReference`);
          }
          break;
        case "attachment":
          if (editorTools.isEmptyObject(initial.valueAttachment)) {
            errors.push(`inital at position ${pos} has empty valueAttachment`);
          } else if (
            !initial.valueAttachment.contentType &&
            initial.valueAttachment.data
          ) {
            errors.push(
              `inital at position ${pos} has empty contentType while data is present`,
            );
          }
          break;
        default:
          throw new UnreachableError(initial);
      }
    }
  }

  private enableWhen(item: Item, errors: string[]): void {
    if (item.enableWhen === undefined) return;
    for (let pos = 1; pos <= item.enableWhen.length; pos++) {
      const enableWhen = item.enableWhen[pos - 1];
      if (!enableWhen.question) {
        errors.push(`enableWhen at position ${pos} has no linked question`);
      }
      if (enableWhen.operator === "exists") {
        if (enableWhen.__answer !== "true" && enableWhen.__answer !== "false") {
          errors.push(
            `enableWhen at position ${pos} has invalid answer for operator "${enableWhen.operator}"`,
          );
        }
        return;
      }
      switch (enableWhen.__type) {
        case "boolean":
          if (
            enableWhen.__answer !== "true" &&
            enableWhen.__answer !== "false"
          ) {
            errors.push(
              `enableWhen at position ${pos} has invalid boolean answer`,
            );
          }
          break;
        case "decimal":
        case "integer":
          if (!enableWhen.__answer) {
            errors.push(`enableWhen at position ${pos} has empty answer`);
          }
          break;
        case "string":
        case "text":
          if (!enableWhen.__answer) {
            errors.push(`enableWhen at position ${pos} has empty answer`);
          }
          break;
        case "url":
          if (!enableWhen.__answer) {
            errors.push(`enableWhen at position ${pos} has empty answer`);
          }
          break;
        case "time":
          if (dateTools.isTime(enableWhen.__answer) !== true) {
            errors.push(
              `enableWhen at position ${pos} has invalid time answer "${enableWhen.__answer}"`,
            );
          }
          break;
        case "date":
          if (dateTools.isDate(enableWhen.__answer) !== true) {
            errors.push(
              `enableWhen at position ${pos} has invalid date answer "${enableWhen.__answer}"`,
            );
          }
          break;
        case "dateTime":
          if (dateTools.isDateTime(enableWhen.__answer) !== true) {
            errors.push(
              `enableWhen at position ${pos} has invalid dateTime answer "${enableWhen.__answer}"`,
            );
          }
          break;
        case "quantity":
          if (
            enableWhen.answerQuantity === undefined ||
            editorTools.formatQuantity(enableWhen.answerQuantity) !==
              enableWhen.__answer
          ) {
            errors.push(
              `enableWhen at position ${pos} has invalid quantity-answer`,
            );
          } else {
            if (!enableWhen.answerQuantity!.value) {
              errors.push(
                `enableWhen at position ${pos} has empty quantity-value`,
              );
            }
            if (!enableWhen.answerQuantity!.code) {
              errors.push(
                `enableWhen at position ${pos} has empty quantity-code`,
              );
            }
          }
          break;
        case "coding":
          if (
            enableWhen.answerCoding === undefined ||
            editorTools.formatCoding(enableWhen.answerCoding) !==
              enableWhen.__answer
          ) {
            errors.push(
              `enableWhen at position ${pos} has invalid coding-answer`,
            );
          } else {
            if (!enableWhen.answerCoding!.code) {
              errors.push(
                `enableWhen at position ${pos} has empty coding-code`,
              );
            }
          }
          break;
        case "reference":
          if (
            enableWhen.answerReference === undefined ||
            editorTools.formatReference(enableWhen.answerReference) !==
              enableWhen.__answer
          ) {
            errors.push(
              `enableWhen at position ${pos} has invalid reference-answer`,
            );
          } else if (editorTools.isEmptyObject(enableWhen.answerReference)) {
            errors.push(`enableWhen at position ${pos} has empty reference`);
          }
          break;
        case "attachment":
          if (editorTools.isEmptyObject(enableWhen.answerAttachment)) {
            errors.push(`enableWhen at position ${pos} has empty attachment`);
          }
          break;
        case undefined:
          break;
        default:
          throw new UnreachableError(enableWhen.__type);
      }
    }
  }

  private primary(): string[] {
    const errors: string[] = [];
    this.url(this.questionnaire.url, errors);
    this.name(this.questionnaire.name, errors);
    this.date(this.questionnaire.date, errors);
    this.approvalDate(this.questionnaire.approvalDate, errors);
    this.lastReviewDate(this.questionnaire.lastReviewDate, errors);
    this.text(this.questionnaire.text, errors);
    this.extension(this.questionnaire.extension, errors, "extension");
    this.extension(
      this.questionnaire.modifierExtension,
      errors,
      "modifierExtension",
    );
    this.effectivePeriod(this.questionnaire.effectivePeriod, errors);
    return errors;
  }

  private url(url: string | undefined, errors: string[]) {
    const msg = questionnaireTools.isUriOrEmpty(url);
    if (msg !== true) {
      errors.push(`URL: ${msg}`);
    }
  }

  private name(name: string | undefined, errors: string[]) {
    const msg = questionnaireTools.isNameOrEmpty(name);
    if (msg !== true) {
      errors.push(msg);
    }
  }

  private date(dateTime: string | undefined, errors: string[]) {
    const msg = dateTools.isDateTimeOrEmpty(dateTime);
    if (msg !== true) {
      errors.push(`Date: ${msg}`);
    }
  }

  private approvalDate(date: string | undefined, errors: string[]) {
    const msg = dateTools.isDateOrEmpty(date);
    if (msg !== true) {
      errors.push(`approvalDate: ${msg}`);
    }
  }

  private lastReviewDate(date: string | undefined, errors: string[]) {
    const msg = dateTools.isDateOrEmpty(date);
    if (msg !== true) {
      errors.push(`lastReviewDate: ${msg}`);
    }
  }

  private text(text: Narrative, errors: string[]) {
    const msg = questionnaireTools.containsNonWhitespace(text.div);
    if (msg !== true) {
      errors.push(`Text.Div: ${msg}. Text won't be exported!`);
    }
  }

  private effectivePeriod(period: Period, errors: string[]) {
    const startMsg = dateTools.isDateTimeOrEmpty(period.start);
    if (startMsg !== true) {
      errors.push(`effectivePeriod.start: ${startMsg}`);
    }
    const endMsg = dateTools.isDateTimeOrEmpty(period.end);
    if (endMsg !== true) {
      errors.push(`effectivePeriod.end: ${endMsg}`);
    }
  }

  private secondary(): string[] {
    const errors: string[] = [];
    this.id(this.questionnaire.id, errors);
    this.meta(this.questionnaire.meta, errors);
    this.implicitRules(this.questionnaire.implicitRules, errors);
    this.derivedFrom(this.questionnaire.derivedFrom, errors);
    this.code(this.questionnaire.code, errors);
    this.useContext(this.questionnaire.useContext, errors);
    this.contact(this.questionnaire.contact, errors);
    return errors;
  }

  private id(id: string | undefined, errors: string[]) {
    const msg = questionnaireTools.isIdOrEmpty(id);
    if (msg !== true) {
      errors.push(msg);
    }
  }

  private meta(meta: Meta, errors: string[]) {
    let msg = questionnaireTools.isIdOrEmpty(meta.versionId);
    if (msg !== true) {
      errors.push(`Meta: VersionId - ${msg}`);
    }
    msg = dateTools.isInstantOrEmpty(meta.lastUpdated);
    if (msg !== true) {
      errors.push(`Meta: Last updated - ${msg}`);
    }
    msg = questionnaireTools.isUriOrEmpty(meta.source);
    if (msg !== true) {
      errors.push(`Meta: Source - ${msg}`);
    }
    for (let pos = 1; pos <= meta.profile.length; pos++) {
      const profile = meta.profile[pos - 1];
      msg = questionnaireTools.isCanonical(profile);
      if (msg !== true) {
        errors.push(`Meta: Profile at position ${pos} - ${msg}`);
      }
    }
    for (let pos = 1; pos <= meta.security.length; pos++) {
      const security = meta.security[pos - 1];
      if (editorTools.isEmptyObject(security)) {
        errors.push(
          `Meta: Security at position ${pos} - Coding must be non-empty`,
        );
      }
    }
    for (let pos = 1; pos <= meta.tag.length; pos++) {
      const tag = meta.tag[pos - 1];
      if (editorTools.isEmptyObject(tag)) {
        errors.push(`Meta: Tag at position ${pos} - Coding must be non-empty`);
      }
    }
  }

  private implicitRules(rules: string | undefined, errors: string[]) {
    const msg = questionnaireTools.isUriOrEmpty(rules);
    if (msg !== true) {
      errors.push(`Implicit rules: ${msg}`);
    }
  }

  private useContext(useContext: UsageContext[], errors: string[]) {
    for (let pos = 1; pos <= useContext.length; pos++) {
      const usageContext = useContext[pos - 1];
      if (editorTools.isEmptyObject(usageContext.code)) {
        errors.push(`UseContext at position ${pos} has empty code.`);
      }
      switch (usageContext.__type) {
        case "codeableConcept":
          if (editorTools.isEmptyObject(usageContext.valueCodeableConcept)) {
            errors.push(
              `UseContext at position ${pos} has empty CodeableConcept.`,
            );
          } else {
            for (
              let codingPos = 1;
              codingPos <= usageContext.valueCodeableConcept.coding.length;
              codingPos++
            ) {
              const coding =
                usageContext.valueCodeableConcept.coding[codingPos - 1];
              if (editorTools.isEmptyObject(coding)) {
                errors.push(
                  `UseContext at position ${pos} has empty Coding at position ${codingPos}.`,
                );
              }
            }
          }
          break;
        case "quantity":
          if (editorTools.isEmptyObject(usageContext.valueQuantity)) {
            errors.push(`UseContext at position ${pos} has empty Quantity.`);
          }
          break;
        case "range":
          if (editorTools.isEmptyObject(usageContext.valueRange)) {
            errors.push(`UseContext at position ${pos} has empty Range.`);
          }
          break;
        case "reference":
          if (editorTools.isEmptyObject(usageContext.valueReference)) {
            errors.push(`UseContext at position ${pos} has empty Reference.`);
          }
          break;
        default:
          throw new UnreachableError(usageContext);
      }
    }
  }

  private contact(contact: ContactDetail[], errors: string[]) {
    for (let contactPos = 1; contactPos <= contact.length; contactPos++) {
      const { name, telecom } = contact[contactPos - 1];
      if (!name && telecom.length === 0) {
        errors.push(`ContactDetail at position ${contactPos} is empty.`);
      } else if (telecom.length > 0) {
        const prefix = `ContactDetail ${contactPos}`;
        for (let pointPos = 1; pointPos <= telecom.length; pointPos++) {
          this.contactPoint(telecom[pointPos - 1], errors, prefix, pointPos);
        }
      }
    }
  }

  private contactPoint(
    contactPoint: ContactPoint,
    errors: string[],
    prefix: string,
    pos: number,
  ) {
    if (editorTools.isEmptyObject(contactPoint)) {
      errors.push(`${prefix}: ContactPoint at position ${pos} is empty.`);
    } else {
      const { value, system, period } = contactPoint;
      if (!value && system) {
        errors.push(
          `${prefix}: ContactPoint at position ${pos} has undefined value and defined system.`,
        );
      } else if (value && !system) {
        errors.push(
          `${prefix}: ContactPoint at position ${pos} has defined value and undefined system.`,
        );
      }
      const invalidStart = dateTools.isDateTimeOrEmpty(period.start) !== true;
      if (invalidStart) {
        errors.push(
          `${prefix}: ContactPoint at position ${pos} has invalid start-value.`,
        );
      }
      const invalidEnd = dateTools.isDateTimeOrEmpty(period.end) !== true;
      if (invalidEnd) {
        errors.push(
          `${prefix}: ContactPoint at position ${pos} has invalid end-value.`,
        );
      }
    }
  }

  private derivedFrom(derivedFroms: string[], errors: string[]) {
    for (let pos = 1; pos <= derivedFroms.length; pos++) {
      const derivedFrom = derivedFroms[pos - 1];
      if (!derivedFrom) {
        errors.push(`derivedFrom at position ${pos} has empty value`);
      }
    }
  }

  private code(codes: Coding[], errors: string[]) {
    for (let pos = 1; pos <= codes.length; pos++) {
      const code = codes[pos - 1];
      if (editorTools.isEmptyObject(code)) {
        errors.push(`code at position ${pos} has empty coding`);
      }
    }
  }
}
