import { ParsedAnswerOption, ParsedItem } from "../parsing/item";
import { ParsedQuestionnaire } from "../parsing/questionnaire";
import {
  allowsInitial,
  allowsMaxLength,
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  MAX_LENGTH_LINKID,
} from "@/utils/constants";
import { validatorUtils } from "../TransformerUtils";
import { ParsedEnableWhen } from "../parsing/enableWhen";
import { itemTools } from "@/utils/item";
import { fhirValidatorUtils } from "./FHIRValidatorUtils";
import { editorTools } from "@/utils/editor";

export class FHIRItemValidator {
  private linkIdSet: Set<string>;

  constructor(
    private readonly qre: ParsedQuestionnaire,
    private errors: string[],
    private warnings: string[],
  ) {
    this.linkIdSet = new Set();
  }

  validate(item: ParsedItem, level: number): void {
    if (level > MAX_ALLOWED_LEVELS) {
      this.errors.push(
        `LinkId ${item.linkId} exceeds allowed levels of ${MAX_ALLOWED_LEVELS}.`,
      );
      return;
    }
    if (level > MAX_ALLOWED_LEVELS_FOR_GROUPS && item.type === "group") {
      this.errors.push(
        `LinkId ${item.linkId} exceeds allowed levels of ${MAX_ALLOWED_LEVELS_FOR_GROUPS} for groups.`,
      );
      return;
    }
    this.validateLinkId(item);
    this.validateEnableWhenAndBehavior(item);
    this.validateAnswerValueSetAndOption(item);
    this.validateExtension(item);
    this.validateInitial(item);
    this.validateInitialAndAnswerOption(item);
    this.validateMaxLength(item);
    this.validateRequired(item);
    this.validateRepeats(item);
    if (validatorUtils.emptyList(item.item)) return;
    if (item.type === "display") {
      this.errors.push(
        `LinkId "${item.linkId}" has type ${item.type} and must not have children.`,
      );
      return;
    }
    for (const child of item.item) {
      this.validate(child, level + 1);
    }
  }

  private validateLinkId(item: ParsedItem): void {
    if (item.linkId === "") {
      this.errors.push("LinkId has to be a non-empty string.");
      return;
    }
    if (item.linkId.length > MAX_LENGTH_LINKID) {
      this.errors.push(
        `LinkId "${item.linkId}" must not exceed max length ${MAX_LENGTH_LINKID}.`,
      );
      return;
    }
    if (this.linkIdSet.has(item.linkId)) {
      this.errors.push(
        `LinkId "${item.linkId}" is duplicated in questionnaire.`,
      );
    } else {
      this.linkIdSet.add(item.linkId);
    }
  }

  private validateAnswerValueSetAndOption(item: ParsedItem): void {
    if (item.answerValueSet === "") {
      item.answerValueSet = undefined;
    }
    if (!editorTools.nonEmptyArray(item.answerOption)) {
      item.answerOption = undefined;
    }
    if (item.answerValueSet && item.answerOption) {
      this.errors.push(
        `LinkId ${item.linkId} has answerValueSet and answerOption defined. Only 1 is allowed.`,
      );
      return;
    }
    if (item.answerOption) {
      for (const answerOption of item.answerOption) {
        this.validateAnswerOption(answerOption, item);
      }
    }
    if (itemTools.definedAnswerChoices(item) && !item.answerConstraint) {
      item.answerConstraint = "optionsOnly";
      this.warnings.push(
        `LinkId "${item.linkId}" has answerOption or answerValueSet defined, but answerConstraint is undefined. answerConstraint has been initialized to "optionsOnly".`,
      );
    }
  }

  private validateAnswerOption(
    answerOption: ParsedAnswerOption,
    item: ParsedItem,
  ): void {
    const count = fhirValidatorUtils.countValueInvariants(answerOption);
    if (count > 1) {
      this.errors.push(
        `LinkId "${item.linkId}" has answerOption with more than 1 answer.`,
      );
    }
  }

  private validateEnableWhenAndBehavior(item: ParsedItem): void {
    if (validatorUtils.emptyList(item.enableWhen)) return;
    for (const enableWhen of item.enableWhen) {
      const linkedItem = validatorUtils.getItemByLinkId(
        this.qre,
        enableWhen.question,
      );
      if (linkedItem === undefined) {
        this.warnings.push(
          `LinkId "${item.linkId}" has enableWhen linking to invalid linkId "${enableWhen.question}".`,
        );
        continue;
      }
      this.validateEnableWhenAnswerType(linkedItem, enableWhen, item);
    }
    if (item.enableWhen.length > 1) {
      item.enableBehavior ??= "any";
    }
  }

  private validateEnableWhenAnswerType(
    linkedItem: ParsedItem,
    enableWhen: ParsedEnableWhen,
    currentItem: ParsedItem,
  ): void {
    this.validateEnableWhenAnswers(enableWhen, currentItem);
    // FIXME: What to do when invalid type for answerOption question?
    if (linkedItem.type === "boolean" || enableWhen.operator === "exists") {
      if (enableWhen.answerBoolean === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "integer") {
      if (enableWhen.answerInteger === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    } else if (linkedItem.type === "decimal") {
      if (enableWhen.answerDecimal === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    } else if (
      linkedItem.type === "string" ||
      linkedItem.type === "text" ||
      linkedItem.type === "url"
    ) {
      if (enableWhen.answerString === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "date") {
      if (enableWhen.answerDate === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    } else if (linkedItem.type === "time") {
      if (enableWhen.answerTime === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    } else if (linkedItem.type === "dateTime") {
      if (enableWhen.answerDateTime === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    } else if (
      linkedItem.type === "group" ||
      linkedItem.type === "display" ||
      linkedItem.type === "attachment"
    ) {
      enableWhen.operator = "exists";
      this.resetEnableWhenAnswers(enableWhen);
      this.warnings.push(
        `LinkId "${currentItem.linkId}" has enableWhen linking to type "${linkedItem.type}" "${linkedItem.linkId}" without operator "exists". Operator and answer have been reset.`,
      );
    } else if (linkedItem.type === "quantity") {
      if (enableWhen.answerQuantity === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    } else if (linkedItem.type === "reference") {
      if (enableWhen.answerReference === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    } else if (linkedItem.type === "coding") {
      if (enableWhen.answerCoding === undefined) {
        this.clearOptionsOrString(enableWhen, linkedItem);
      }
    }
  }

  private clearOptionsOrString(
    enableWhen: ParsedEnableWhen,
    linkedItem: ParsedItem,
  ) {
    if (linkedItem.answerConstraint === "optionsOrString") {
      if (!enableWhen.answerString) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else {
      this.resetEnableWhenAnswers(enableWhen);
    }
  }

  private validateEnableWhenAnswers(
    enableWhen: ParsedEnableWhen,
    item: ParsedItem,
  ): void {
    const count = fhirValidatorUtils.countAnswerInvariants(enableWhen);
    if (count > 1) {
      this.errors.push(
        `LinkId "${item.linkId}" has enableWhen with more than 1 answer.`,
      );
    }
  }

  private resetEnableWhenAnswers(enableWhen: ParsedEnableWhen): void {
    enableWhen.answerBoolean = undefined;
    enableWhen.answerDecimal = undefined;
    enableWhen.answerInteger = undefined;
    enableWhen.answerDate = undefined;
    enableWhen.answerDateTime = undefined;
    enableWhen.answerTime = undefined;
    enableWhen.answerString = undefined;
    enableWhen.answerCoding = undefined;
    enableWhen.answerQuantity = undefined;
    enableWhen.answerReference = undefined;
  }

  private validateInitial(item: ParsedItem): void {
    if (!editorTools.nonEmptyArray(item.initial)) return;
    if (!allowsInitial(item)) {
      this.errors.push(
        `LinkId "${item.linkId}" has type "${item.type}" which does not allow initial values.`,
      );
      return;
    }
    for (const initial of item.initial) {
      const count = fhirValidatorUtils.countValueInvariants(initial);
      if (count === 0) {
        this.errors.push(`LinkId "${item.linkId}" has initial with no value.`);
      } else if (count > 1) {
        this.errors.push(
          `LinkId "${item.linkId}" has initial with multiple values.`,
        );
      }
    }
  }

  private validateInitialAndAnswerOption(item: ParsedItem): void {
    if (
      editorTools.nonEmptyArray(item.initial) &&
      editorTools.nonEmptyArray(item.answerOption)
    ) {
      this.errors.push(
        `LinkId ${item.linkId} has initial and answerOption defined. Only 1 is allowed.`,
      );
    }
  }

  private validateExtension(item: ParsedItem): void {
    if (item.extension === undefined) return;
    for (const extension of item.extension) {
      const count = fhirValidatorUtils.countValueInvariants(extension);
      if (count === 0) {
        this.errors.push(
          `LinkId "${item.linkId}" has extension with no value.`,
        );
      } else if (count > 1) {
        this.errors.push(
          `LinkId "${item.linkId}" has extension with multiple values.`,
        );
      }
    }
  }

  private validateRequired(item: ParsedItem): void {
    if (item.type === "display") {
      if (item.required !== undefined) {
        item.required = undefined;
        this.warnings.push(
          `LinkId "${item.linkId}" is of type "${item.type}" which does not allow field "required". "required" has been deleted.`,
        );
      }
    } else {
      if (item.required === undefined) {
        item.required = false;
        this.warnings.push(
          `LinkId "${item.linkId}" is of type "${item.type}" which allows field "required". "required" has been initialized to false.`,
        );
      }
    }
  }

  private validateRepeats(item: ParsedItem): void {
    if (item.type === "display") {
      if (item.repeats !== undefined) {
        item.repeats = undefined;
        this.warnings.push(
          `LinkId ${item.linkId} is of type "${item.type}" which does not allow field "repeats". "repeats" has been deleted.`,
        );
      }
    } else {
      if (item.repeats === undefined) {
        item.repeats = false;
        this.warnings.push(
          `LinkId ${item.linkId} is of type "${item.type}" which allows field "repeats". "repeats" has been initialized to false.`,
        );
      }
    }
  }

  private validateMaxLength(item: ParsedItem): void {
    if (item.maxLength !== undefined && !allowsMaxLength(item)) {
      item.maxLength = undefined;
      this.warnings.push(
        `LinkId "${item.linkId}" has type "${item.type}" which does not allow field maxLength. maxLength has been deleted.`,
      );
    }
  }
}
