import { Language } from "@/store";
import { Coding, Item, Questionnaire } from "@/types";
import { dateTools } from "@/utils/date";
import { editorTools, UnreachableError } from "@/utils/editor";
import { itemTools } from "../item";

export type Errors = {
  items: ItemError[];
  primary: string[];
  secondary: string[];
};

export type ItemError = {
  linkId: string;
  internalId: string;
  errors: string[];
};

export class ErrorChecker {
  constructor(readonly questionnaire: Questionnaire) {}

  static check(questionnaire: Questionnaire): Errors {
    return new ErrorChecker(questionnaire).validate();
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

  validate(): Errors {
    const items = this.items();
    const primary = this.primary();
    const secondary = this.secondary();
    return { items, primary, secondary };
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
    this.answerOptionAndValueSetAndConstraint(item, errors);
    this.answerOptionAndInitial(item, errors);
    this.initial(item, errors);
    this.code(item.code, errors);
    if (errors.length > 0) {
      const error: ItemError = {
        linkId: item.linkId,
        internalId: item.__internalID,
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

  private answerOptionAndValueSetAndConstraint(
    item: Item,
    errors: string[],
  ): void {
    if (itemTools.undefinedAnswerChoices(item) && item.answerConstraint) {
      errors.push(
        "answerConstraint should not be defined, if answerValueSet and answerOption are undefined",
      );
    } else if (itemTools.definedAnswerChoices(item) && !item.answerConstraint) {
      errors.push(
        "answerConstraint should be defined, if answerValueSet or answerOption is defined",
      );
    }
    if (editorTools.nonEmptyArray(item.answerOption) && item.answerValueSet) {
      errors.push(
        "answerValueSet and answerOption should not be defined at the same time",
      );
    }
    this.answerOption(item, errors);
  }

  private answerOption(item: Item, errors: string[]): void {
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
          if (!dateTools.isDate(answerOption.valueDate)) {
            errors.push(
              `answerOption at position ${pos} has invalid date-answer`,
            );
          }
          break;
        case "dateTime":
          if (!dateTools.isDateTime(answerOption.valueDateTime)) {
            errors.push(
              `answerOption at position ${pos} has invalid dateTime-answer`,
            );
          }
          break;
        case "time":
          if (!dateTools.isTime(answerOption.valueTime)) {
            errors.push(
              `answerOption at position ${pos} has invalid time-answer`,
            );
          }
          break;
        case "string":
          if (!answerOption.valueString) {
            errors.push(
              `answerOption at position ${pos} has empty string-answer`,
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

  // TODO: Use exhaustive switch-statement
  // FIXME: What about integer, decimal type?
  private enableWhen(item: Item, errors: string[]): void {
    if (item.enableWhen === undefined) return;
    for (let pos = 1; pos <= item.enableWhen.length; pos++) {
      const enableWhen = item.enableWhen[pos - 1];
      if (enableWhen.operator === "exists") {
        if (enableWhen.__answer !== "true" && enableWhen.__answer !== "false") {
          errors.push(
            `enableWhen at position ${pos} has invalid answer for operator "${enableWhen.operator}"`,
          );
        }
        return;
      }
      if (enableWhen.__type === "string" || enableWhen.__type === "text") {
        if (!enableWhen.__answer) {
          errors.push(`enableWhen at position ${pos} has empty answer`);
        }
      } else if (enableWhen.__type === "time") {
        if (dateTools.isTime(enableWhen.__answer) !== true) {
          errors.push(
            `enableWhen at position ${pos} has invalid time answer "${enableWhen.__answer}"`,
          );
        }
      } else if (enableWhen.__type === "date") {
        if (dateTools.isDate(enableWhen.__answer) !== true) {
          errors.push(
            `enableWhen at position ${pos} has invalid date answer "${enableWhen.__answer}"`,
          );
        }
      } else if (enableWhen.__type === "dateTime") {
        if (dateTools.isDateTime(enableWhen.__answer) !== true) {
          errors.push(
            `enableWhen at position ${pos} has invalid dateTime answer "${enableWhen.__answer}"`,
          );
        }
      } else if (enableWhen.__type === "quantity") {
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
      } else if (enableWhen.__type === "coding") {
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
            errors.push(`enableWhen at position ${pos} has empty coding-code`);
          }
        }
      } else if (enableWhen.__type === "reference") {
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
      } else if (enableWhen.__type === "attachment") {
        if (editorTools.isEmptyObject(enableWhen.answerAttachment)) {
          errors.push(`enableWhen at position ${pos} has empty attachment`);
        }
      }
    }
  }

  private primary(): string[] {
    const errors: string[] = [];
    const startMsg = dateTools.isDateTimeOrEmpty(
      this.questionnaire.effectivePeriod.start,
    );
    if (startMsg !== true) {
      errors.push(`effectivePeriod.start: ${startMsg}`);
    }
    const endMsg = dateTools.isDateTimeOrEmpty(
      this.questionnaire.effectivePeriod.end,
    );
    if (endMsg !== true) {
      errors.push(`effectivePeriod.end: ${endMsg}`);
    }
    return errors;
  }

  private secondary(): string[] {
    const errors: string[] = [];
    this.code(this.questionnaire.code, errors);
    this.derivedFrom(this.questionnaire.derivedFrom, errors);
    return errors;
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
