import {
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
} from "../constants";
import { editorTools } from "../editor";
import { FHIREnableWhen } from "./enableWhen";
import { FHIRItem } from "./item";
import { FHIRQuestionnaire, questionnaireSchema } from "./questionnaire";

export type Result =
  | { state: "success"; data: FHIRQuestionnaire }
  | { state: "warning"; data: FHIRQuestionnaire; warnings: string[] }
  | { state: "error"; errors: string[]; warnings: string[] };

class Validator {
  questionnaire(file: unknown): Result {
    const result = questionnaireSchema.safeParse(file);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message);
      return {
        state: "error",
        errors: errors,
        warnings: [],
      };
    }
    return QuestionnaireValidator.validate(result.data);
  }
}

class ValidatorUtils {
  static sortItemsByLinkId(items: FHIRItem[]): void {
    items.sort(this.sortByLinkId);
    for (const item of items) {
      if (this.nonEmptyList(item.item)) {
        this.sortItemsByLinkId(item.item);
      }
    }
  }

  private static sortByLinkId(i1: FHIRItem, i2: FHIRItem): number {
    const nums1 = i1.linkId.split(".");
    const nums2 = i2.linkId.split(".");
    const last1 = nums1.at(-1);
    const last2 = nums2.at(-1);
    if (last1 === undefined && last2 === undefined) return 0;
    if (last1 === undefined) return -1;
    if (last2 === undefined) return 1;
    return parseInt(last1) - parseInt(last2);
  }

  static getItemByLinkId(
    qre: FHIRQuestionnaire,
    linkId: string,
  ): FHIRItem | undefined {
    return this.getItemByLinkIdHelper(qre.item, linkId);
  }

  private static getItemByLinkIdHelper(
    items: FHIRItem[],
    linkId: string,
  ): FHIRItem | undefined {
    for (const item of items) {
      if (item.linkId === linkId) return item;
      if (this.emptyList(item.item)) continue;
      const result = this.getItemByLinkIdHelper(item.item, linkId);
      if (result !== undefined) return result;
    }
    return undefined;
  }

  static emptyList<T>(list: T[] | undefined): list is undefined {
    return list === undefined || list.length === 0;
  }

  static nonEmptyList<T>(list: T[] | undefined): list is T[] {
    return list !== undefined && list.length > 0;
  }
}

class QuestionnaireValidator {
  static validate(qre: FHIRQuestionnaire): Result {
    ValidatorUtils.sortItemsByLinkId(qre.item);
    const result = this.validateQuestionnaireItems(qre);
    return result;
  }

  private static validateQuestionnaireItems(qre: FHIRQuestionnaire): Result {
    const errors: string[] = [];
    const warnings: string[] = [];
    const itemValidator = new ItemValidator(qre, errors, warnings);
    let linkIdCount = 0;
    for (const item of qre.item) {
      linkIdCount++;
      itemValidator.validate(item, linkIdCount.toString());
    }
    if (errors.length > 0) {
      return { state: "error", errors, warnings };
    } else if (warnings.length > 0) {
      return { state: "warning", data: qre, warnings };
    } else {
      return { state: "success", data: qre };
    }
  }
}

class ItemValidator {
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
    if (ValidatorUtils.nonEmptyList(item.item)) {
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
    if (ValidatorUtils.emptyList(item.enableWhen)) return;
    for (const enableWhen of item.enableWhen) {
      const linkedItem = ValidatorUtils.getItemByLinkId(
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

export const validator = new Validator();
