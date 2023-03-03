import { FHIRItem } from "../item";
import { FHIRQuestionnaire } from "../questionnaire";
import { editorTools } from "@/utils/editor";
import {
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
} from "@/utils/constants";
import { validatorUtils } from "../ValidatorUtils";
import { FHIREnableWhen } from "../enableWhen";

export class FHIRItemValidator {
  constructor(
    private readonly qre: FHIRQuestionnaire,
    private errors: string[],
    private warnings: string[],
  ) {}

  validate(item: FHIRItem, expectedLinkId: string): void {
    if (item.linkId !== expectedLinkId) {
      this.errors.push(
        `LinkId "${item.linkId}" should be "${expectedLinkId}".`,
      );
      return;
    }
    const linkIdLevel = editorTools.getLevelFromLinkID(item.linkId);
    if (linkIdLevel > MAX_ALLOWED_LEVELS) {
      this.errors.push(
        `LinkId ${item.linkId} exceeds allowed levels of ${MAX_ALLOWED_LEVELS}.`,
      );
      return;
    }
    if (item.type === "group" && linkIdLevel > MAX_ALLOWED_LEVELS_FOR_GROUPS) {
      this.errors.push(
        `LinkId ${item.linkId} exceeds allowed levels of ${MAX_ALLOWED_LEVELS_FOR_GROUPS} for groups.`,
      );
      return;
    }
    this.validateEnableWhen(item);
    this.validateAnswerValueSetAndOption(item);
    this.validateMaxLength(item);
    this.validateRequired(item);
    this.validateRepeats(item);
    if (validatorUtils.nonEmptyList(item.item)) {
      if (item.type === "display") {
        this.errors.push(
          `LinkId "${item.linkId}" has type ${item.type} and must not have children.`,
        );
        return;
      }
      let linkIdCount = 0;
      for (const child of item.item) {
        linkIdCount++;
        const nextLinkId = `${item.linkId}.${linkIdCount}`;
        this.validate(child, nextLinkId);
      }
    }
  }

  private validateAnswerValueSetAndOption(item: FHIRItem): void {
    if (item.answerValueSet === "") {
      item.answerValueSet = undefined;
    }
    if (item.answerOption !== undefined && item.answerOption.length === 0) {
      item.answerOption = undefined;
    }
    if (item.answerValueSet && item.answerOption) {
      this.errors.push(
        `LinkId ${item.linkId} has defined answerValueSet and answerOption. Only 1 is allowed.`,
      );
    }
  }

  private validateEnableWhen(item: FHIRItem): void {
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
    if (item.enableWhen.length > 1 && item.enableBehavior === undefined) {
      item.enableBehavior = "any";
    }
  }

  private validateEnableWhenAnswerType(
    linkedItem: FHIRItem,
    enableWhen: FHIREnableWhen,
    currentItem: FHIRItem,
  ): void {
    if (linkedItem.type === "boolean" || enableWhen.operator === "exists") {
      if (enableWhen.answerBoolean === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "integer") {
      if (enableWhen.answerInteger === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "decimal") {
      if (enableWhen.answerDecimal === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
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
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "time") {
      if (enableWhen.answerTime === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "dateTime") {
      if (enableWhen.answerDateTime === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "open-choice") {
      if (
        enableWhen.answerString === undefined &&
        enableWhen.answerCoding === undefined
      ) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "choice") {
      if (enableWhen.answerCoding === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else if (linkedItem.type === "group" || linkedItem.type === "display") {
      enableWhen.operator = "exists";
      this.resetEnableWhenAnswers(enableWhen);
      this.warnings.push(
        `LinkId "${currentItem.linkId}" has enableWhen linking to type "${linkedItem.type}" "${linkedItem.linkId}" without operator "exists". Operator and answer have been reset.`,
      );
    }
  }

  private resetEnableWhenAnswers(enableWhen: FHIREnableWhen): void {
    enableWhen.answerBoolean = undefined;
    enableWhen.answerDate = undefined;
    enableWhen.answerTime = undefined;
    enableWhen.answerDateTime = undefined;
    enableWhen.answerString = undefined;
    enableWhen.answerCoding = undefined;
    enableWhen.answerDecimal = undefined;
    enableWhen.answerInteger = undefined;
  }

  private validateRequired(item: FHIRItem): void {
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

  private validateRepeats(item: FHIRItem): void {
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

  private validateMaxLength(item: FHIRItem): void {
    if (
      item.maxLength !== undefined &&
      item.type !== "boolean" &&
      item.type !== "integer" &&
      item.type !== "decimal" &&
      item.type !== "string" &&
      item.type !== "text" &&
      item.type !== "url" &&
      item.type !== "open-choice"
    ) {
      item.maxLength = undefined;
      this.warnings.push(
        `LinkId "${item.linkId}" has type "${item.type}" which does not allow field maxLength. maxLength has been deleted.`,
      );
    }
  }
}
