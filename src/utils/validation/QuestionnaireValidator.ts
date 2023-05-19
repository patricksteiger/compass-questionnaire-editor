import { Language } from "@/store";
import { EnableWhen, Item, Questionnaire } from "@/types";
import { dateTools } from "../date";
import { editorTools, UnreachableError } from "../editor";
import { itemTools } from "../item";

export type Warning = {
  language: Language;
  metadata: string[];
  items: ItemWarning[];
};

export type ItemWarning = {
  linkId: string;
  internalId: string;
  warnings: string[];
};

// FIXME: Separate warnings to warnings and errors
export class QuestionnaireValidator {
  constructor(private readonly questionnaire: Questionnaire) {}

  // TODO: Add extension to validation
  check(): Warning {
    return {
      language: this.questionnaire.language,
      metadata: this.metadata(),
      items: this.items(),
    };
  }

  metadata(): string[] {
    const warnings: string[] = [];
    if (this.questionnaire.status === "unknown") {
      warnings.push("status is 'unknown'");
    }
    if (!this.questionnaire.description) {
      warnings.push("description is empty");
    }
    return warnings;
  }

  items(): ItemWarning[] {
    const result: ItemWarning[] = [];
    for (const item of this.questionnaire.item) {
      this.item(item, result);
    }
    return result;
  }

  private item(item: Item, itemWarnings: ItemWarning[]): void {
    const warnings: string[] = [];
    this.text(item, warnings);
    this.enableWhen(item, warnings);
    this.answerOptionAndValueSetAndConstraint(item, warnings);
    this.answerOptionAndInitial(item, warnings);
    this.initial(item, warnings);
    if (warnings.length > 0) {
      const warning: ItemWarning = {
        linkId: item.linkId,
        internalId: item.__internalID,
        warnings,
      };
      itemWarnings.push(warning);
    }
    if (item.item !== undefined) {
      for (const element of item.item) {
        this.item(element, itemWarnings);
      }
    }
  }

  private initial(item: Item, warnings: string[]): void {
    if (!item.repeats && item.initial.length > 1) {
      warnings.push(
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
            warnings.push(`inital at position ${pos} has empty valueDecimal`);
          }
          break;
        case "integer":
          if (initial.valueInteger !== 0 && !initial.valueInteger) {
            warnings.push(`inital at position ${pos} has empty valueInteger`);
          }
          break;
        case "date":
          if (dateTools.isDate(initial.valueDate) !== true) {
            warnings.push(`inital at position ${pos} has invalid valueDate`);
          }
          break;
        case "dateTime":
          if (dateTools.isDateTime(initial.valueDateTime) !== true) {
            warnings.push(
              `inital at position ${pos} has invalid valueDateTime`,
            );
          }
          break;
        case "time":
          if (dateTools.isTime(initial.valueTime) !== true) {
            warnings.push(`inital at position ${pos} has invalid valueTime`);
          }
          break;
        case "string":
          if (!initial.valueString) {
            warnings.push(`inital at position ${pos} has empty valueString`);
          }
          break;
        case "url":
          if (!initial.valueUri) {
            warnings.push(`inital at position ${pos} has empty valueUri`);
          }
          break;
        case "coding":
          if (editorTools.isEmptyObject(initial.valueCoding)) {
            warnings.push(`inital at position ${pos} has empty valueCoding`);
          }
          break;
        case "quantity":
          if (editorTools.isEmptyObject(initial.valueQuantity)) {
            warnings.push(`inital at position ${pos} has empty valueQuantity`);
          }
          break;
        case "reference":
          if (editorTools.isEmptyObject(initial.valueReference)) {
            warnings.push(`inital at position ${pos} has empty valueReference`);
          }
          break;
        case "attachment":
          if (editorTools.isEmptyObject(initial.valueAttachment)) {
            warnings.push(
              `inital at position ${pos} has empty valueAttachment`,
            );
          } else if (
            !initial.valueAttachment.contentType &&
            initial.valueAttachment.data
          ) {
            warnings.push(
              `inital at position ${pos} has empty contentType while data is present`,
            );
          }
          break;
        default:
          throw new UnreachableError(initial);
      }
    }
  }

  private answerOptionAndInitial(item: Item, warnings: string[]): void {
    if (
      editorTools.nonEmptyArray(item.answerOption) &&
      editorTools.nonEmptyArray(item.initial)
    ) {
      warnings.push(
        "answerOption and initial should not have defined elements at the same time",
      );
    }
  }

  private answerOptionAndValueSetAndConstraint(
    item: Item,
    warnings: string[],
  ): void {
    if (itemTools.undefinedAnswerChoices(item) && item.answerConstraint) {
      warnings.push(
        "answerConstraint should not be defined, if answerValueSet and answerOption are undefined",
      );
    } else if (itemTools.definedAnswerChoices(item) && !item.answerConstraint) {
      warnings.push(
        "answerConstraint should be defined, if answerValueSet or answerOption is defined",
      );
    }
    if (
      item.answerOption !== undefined &&
      item.answerOption.length > 0 &&
      item.answerValueSet
    ) {
      warnings.push(
        "answerValueSet and answerOption should not be defined at the same time",
      );
    }
    this.answerOption(item, warnings);
  }

  private answerOption(item: Item, warnings: string[]): void {
    if (item.answerOption === undefined) return;
    let initialSelectedCount = 0;
    for (let i = 0; i < item.answerOption.length; i++) {
      const answerOption = item.answerOption[i];
      if (answerOption.initialSelected) {
        initialSelectedCount++;
      }
      switch (answerOption.__type) {
        case "coding":
          if (editorTools.isEmptyObject(answerOption.valueCoding)) {
            warnings.push(
              `answerOption at position ${i + 1} has empty coding-answer`,
            );
          } else if (!answerOption.valueCoding?.code) {
            warnings.push(
              `answerOption at position ${
                i + 1
              } has empty code in coding-answer`,
            );
          }
          break;
        case "decimal":
          if (editorTools.onlyStringFalsy(answerOption.valueDecimal)) {
            warnings.push(
              `answerOption at position ${i + 1} has empty decimal-answer`,
            );
          }
          break;
        case "integer":
          if (editorTools.onlyStringFalsy(answerOption.valueInteger)) {
            warnings.push(
              `answerOption at position ${i + 1} has empty integer-answer`,
            );
          }
          break;
        case "date":
          if (!dateTools.isDate(answerOption.valueDate)) {
            warnings.push(
              `answerOption at position ${i + 1} has invalid date-answer`,
            );
          }
          break;
        case "dateTime":
          if (!dateTools.isDateTime(answerOption.valueDateTime)) {
            warnings.push(
              `answerOption at position ${i + 1} has invalid dateTime-answer`,
            );
          }
          break;
        case "time":
          if (!dateTools.isTime(answerOption.valueTime)) {
            warnings.push(
              `answerOption at position ${i + 1} has invalid time-answer`,
            );
          }
          break;
        case "string":
          if (!answerOption.valueString) {
            warnings.push(
              `answerOption at position ${i + 1} has empty string-answer`,
            );
          }
          break;
        case "quantity":
          if (editorTools.isEmptyObject(answerOption.valueQuantity)) {
            warnings.push(
              `answerOption at position ${i + 1} has empty quantity-answer`,
            );
          } else {
            if (!answerOption.valueQuantity?.value) {
              warnings.push(
                `answerOption at position ${
                  i + 1
                } has empty value in quantity-answer`,
              );
            }
            if (!answerOption.valueQuantity?.code) {
              warnings.push(
                `answerOption at position ${
                  i + 1
                } has empty code in quantity-answer`,
              );
            }
          }
          break;
        case "reference":
          if (editorTools.isEmptyObject(answerOption.valueReference)) {
            warnings.push(
              `answerOption at position ${i + 1} has empty reference-answer`,
            );
          }
          break;
        default:
          throw new UnreachableError(answerOption.__type);
      }
    }
    if (!item.repeats && initialSelectedCount > 1) {
      warnings.push(
        "There cannot be multiple initialSelected answerOptions for items that do not repeat. Only the first initialSelected answerOption will be exported with initialSelected=true!",
      );
    }
  }

  private enableWhen(item: Item, warnings: string[]): void {
    if (item.enableWhen === undefined) return;
    for (let i = 0; i < item.enableWhen.length; i++) {
      const enableWhen = item.enableWhen[i];
      this.enableWhenAnswer(enableWhen, i, warnings);
    }
  }

  // TODO: Better validation for answerOption answers
  private enableWhenAnswer(
    enableWhen: EnableWhen,
    index: number,
    warnings: string[],
  ): void {
    if (!enableWhen.__answer) {
      warnings.push(`enableWhen at position ${index + 1} has empty answer`);
      return;
    }
    if (enableWhen.operator === "exists") {
      if (enableWhen.__answer !== "true" && enableWhen.__answer !== "false") {
        warnings.push(
          `enableWhen at position ${
            index + 1
          } has invalid answer for operator "${enableWhen.operator}"`,
        );
      }
      return;
    }
    if (enableWhen.__type === "time") {
      if (!dateTools.isTime(enableWhen.__answer)) {
        warnings.push(
          `enableWhen at position ${index + 1} has invalid time answer "${
            enableWhen.__answer
          }"`,
        );
      }
    } else if (enableWhen.__type === "date") {
      if (!dateTools.isDate(enableWhen.__answer)) {
        warnings.push(
          `enableWhen at position ${index + 1} has invalid date answer "${
            enableWhen.__answer
          }"`,
        );
      }
    } else if (enableWhen.__type === "dateTime") {
      if (!dateTools.isDateTime(enableWhen.__answer)) {
        warnings.push(
          `enableWhen at position ${index + 1} has invalid dateTime answer "${
            enableWhen.__answer
          }"`,
        );
      }
    } else if (enableWhen.__type === "quantity") {
      if (
        enableWhen.answerQuantity === undefined ||
        editorTools.formatQuantity(enableWhen.answerQuantity) !==
          enableWhen.__answer
      ) {
        warnings.push(
          `enableWhen at position ${index + 1} has invalid quantity-answer`,
        );
      } else {
        if (!enableWhen.answerQuantity!.value) {
          warnings.push(
            `enableWhen at position ${index + 1} has empty quantity-value`,
          );
        }
        if (!enableWhen.answerQuantity!.code) {
          warnings.push(
            `enableWhen at position ${index + 1} has empty quantity-code`,
          );
        }
      }
    } else if (enableWhen.__type === "coding") {
      if (
        enableWhen.answerCoding === undefined ||
        editorTools.formatCoding(enableWhen.answerCoding) !==
          enableWhen.__answer
      ) {
        warnings.push(
          `enableWhen at position ${index + 1} has invalid coding-answer`,
        );
      } else {
        if (!enableWhen.answerCoding!.code) {
          warnings.push(
            `enableWhen at position ${index + 1} has empty coding-code`,
          );
        }
      }
    } else if (enableWhen.__type === "reference") {
      if (
        enableWhen.answerReference === undefined ||
        editorTools.formatReference(enableWhen.answerReference) !==
          enableWhen.__answer
      ) {
        warnings.push(
          `enableWhen at position ${index + 1} has invalid coding-answer`,
        );
      } else if (
        enableWhen.answerReference === undefined ||
        (!enableWhen.answerReference.reference &&
          !enableWhen.answerReference.display &&
          !enableWhen.answerReference.type &&
          !enableWhen.answerReference.identifier)
      ) {
        warnings.push(
          `enableWhen at position ${index + 1} has empty reference`,
        );
      }
    } else if (enableWhen.__type === "attachment") {
      if (editorTools.isEmptyObject(enableWhen.answerAttachment)) {
        warnings.push(
          `enableWhen at position ${index + 1} has empty attachment`,
        );
      }
    }
  }

  private text(item: Item, warnings: string[]): void {
    if (!item.text) {
      warnings.push("Item has no text");
    }
  }
}
