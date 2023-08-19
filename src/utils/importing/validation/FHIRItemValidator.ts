import {
  ParsedAnswerOption,
  ParsedExtension,
  ParsedItem,
} from "../parsing/item";
import { ParsedQuestionnaire } from "../parsing/questionnaire";
import {
  allowsAnswerOption,
  allowsAnswerValueSet,
  allowsMaxLength,
  MAX_ALLOWED_LEVELS,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  MAX_LENGTH_LINKID,
  typeAllowsInitial,
} from "@/utils/constants";
import { validatorUtils } from "../TransformerUtils";
import { ParsedEnableWhen } from "../parsing/enableWhen";
import { itemTools } from "@/utils/item";
import { fhirValidatorUtils } from "./FHIRValidatorUtils";
import { editorTools, UnreachableError } from "@/utils/editor";

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
    this.validateModifierExtension(item);
    this.validateInitial(item);
    this.validateInitialAndAnswerOption(item);
    this.validateCode(item);
    this.validateMaxLength(item);
    this.validateRequired(item);
    this.validateRepeats(item);
    this.validateReadOnly(item);
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
    if (!item.answerValueSet) {
      item.answerValueSet = undefined;
    } else if (!allowsAnswerValueSet(item.type)) {
      this.errors.push(
        `LinkId ${item.linkId}: answerValueSet can not be defined for item with type ${item.type}.`,
      );
      return;
    }
    if (editorTools.emptyArray(item.answerOption)) {
      item.answerOption = undefined;
    } else {
      if (!allowsAnswerOption(item.type)) {
        this.errors.push(
          `LinkId ${item.linkId}: answerOption cannot be defined for item with type ${item.type}.`,
        );
        return;
      }
      for (const answerOption of item.answerOption) {
        this.validateAnswerOption(answerOption, item);
      }
    }
    if (item.answerValueSet && item.answerOption) {
      this.errors.push(
        `LinkId ${item.linkId} has answerValueSet and answerOption defined. Only 1 is allowed.`,
      );
      return;
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
    } else if (count === 1 && allowsAnswerOption(item.type)) {
      switch (item.type) {
        case "coding":
          if (answerOption.valueCoding === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueCoding.`,
            );
          }
          break;
        case "decimal":
          if (answerOption.valueDecimal === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueDecimal.`,
            );
          }
          break;
        case "integer":
          if (answerOption.valueInteger === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueInteger.`,
            );
          }
          break;
        case "date":
          if (answerOption.valueDate === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueDate.`,
            );
          }
          break;
        case "dateTime":
          if (answerOption.valueDateTime === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueDateTime.`,
            );
          }
          break;
        case "time":
          if (answerOption.valueTime === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueTime.`,
            );
          }
          break;
        case "text":
        case "string":
          if (answerOption.valueString === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueString.`,
            );
          }
          break;
        case "url":
          if (answerOption.valueUri === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueUri.`,
            );
          }
          break;
        case "quantity":
          if (answerOption.valueQuantity === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueQuantity.`,
            );
          }
          break;
        case "reference":
          if (answerOption.valueReference === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" has answerOption with invalid value[x]. Item-type "${item.type}" only allows valueReference.`,
            );
          }
          break;
        default:
          throw new UnreachableError(item.type);
      }
    }
    if (answerOption.extension) {
      this.validateExtensionHelper(
        answerOption.extension,
        item,
        "answerOption.extension",
        undefined,
      );
    }
  }

  private validateEnableWhenAndBehavior(item: ParsedItem): void {
    if (validatorUtils.emptyList(item.enableWhen)) return;
    for (let i = item.enableWhen.length - 1; i >= 0; i--) {
      const enableWhen = item.enableWhen[i];
      const linkedItem = validatorUtils.getItemByLinkId(
        this.qre,
        enableWhen.question,
      );
      if (linkedItem === undefined) {
        this.warnings.push(
          `LinkId "${item.linkId}" has enableWhen linking to nonexistent linkId "${enableWhen.question}". This enableWhen has been removed.`,
        );
        item.enableWhen.splice(i, 1);
      } else {
        this.validateEnableWhenAnswerType(linkedItem, enableWhen, item);
      }
    }
    if (item.enableWhen.length > 1 && !item.enableBehavior) {
      this.warnings.push(
        `LinkId "${item.linkId}" has more than 1 enableWhen defined while enableBehavior is undefined. enableBehavior has been initialized to "any".`,
      );
      item.enableBehavior = "any";
    }
  }

  private validateEnableWhenAnswerType(
    linkedItem: ParsedItem,
    enableWhen: ParsedEnableWhen,
    currentItem: ParsedItem,
  ): void {
    this.validateEnableWhenAnswers(enableWhen, currentItem);
    if (enableWhen.operator === "exists") {
      if (enableWhen.answerBoolean === undefined) {
        this.resetEnableWhenAnswers(enableWhen);
      }
    } else {
      switch (linkedItem.type) {
        case "boolean":
          if (enableWhen.answerBoolean === undefined) {
            this.resetEnableWhenAnswers(enableWhen);
          }
          break;
        case "integer":
          if (enableWhen.answerInteger === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "decimal":
          if (enableWhen.answerDecimal === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "date":
          if (enableWhen.answerUri === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "dateTime":
          if (enableWhen.answerDateTime === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "time":
          if (enableWhen.answerTime === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "text":
        case "string":
          if (enableWhen.answerString === undefined) {
            this.resetEnableWhenAnswers(enableWhen);
          }
          break;
        case "url":
          if (enableWhen.answerUri === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "quantity":
          if (enableWhen.answerQuantity === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "reference":
          if (enableWhen.answerReference === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "coding":
          if (enableWhen.answerCoding === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "attachment":
          if (enableWhen.answerAttachment === undefined) {
            this.clearOptionsOrString(enableWhen, linkedItem);
          }
          break;
        case "group":
        case "display":
          this.errors.push(
            `LinkId "${currentItem.linkId}" has enableWhen linking to type "${linkedItem.type}" which is not a question.`,
          );
          break;
        default:
          throw new UnreachableError(linkedItem.type);
      }
    }
  }

  private clearOptionsOrString(
    enableWhen: ParsedEnableWhen,
    linkedItem: ParsedItem,
  ) {
    if (
      linkedItem.answerConstraint !== "optionsOrString" ||
      !enableWhen.answerString
    ) {
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

  private validateCode(item: ParsedItem): void {
    if (item.type === "display" && editorTools.nonEmptyArray(item.code)) {
      this.errors.push(
        `LinkId "${item.linkId}" has type "${item.type}" which does not allow field "code".`,
      );
      return;
    }
  }

  private validateInitial(item: ParsedItem): void {
    if (!editorTools.nonEmptyArray(item.initial)) return;
    if (!typeAllowsInitial(item.type)) {
      this.errors.push(
        `LinkId "${item.linkId}" has type "${item.type}" which does not allow initial values.`,
      );
      return;
    }
    for (const initial of item.initial) {
      const count = fhirValidatorUtils.countValueInvariants(initial);
      if (count === 0) {
        this.errors.push(`LinkId "${item.linkId}" has initial with no value.`);
        continue;
      }
      if (count > 1) {
        this.errors.push(
          `LinkId "${item.linkId}" has initial with multiple values.`,
        );
        continue;
      }
      switch (item.type) {
        case "boolean":
          if (initial.valueBoolean === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "decimal":
          if (initial.valueDecimal === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "integer":
          if (initial.valueInteger === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "date":
          if (initial.valueDate === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "dateTime":
          if (initial.valueDateTime === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "time":
          if (initial.valueTime === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "text":
        case "string":
          if (initial.valueString === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "url":
          if (initial.valueUri === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "coding":
          if (initial.valueCoding === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "quantity":
          if (initial.valueQuantity === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "reference":
          if (initial.valueReference === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        case "attachment":
          if (initial.valueAttachment === undefined) {
            this.errors.push(
              `LinkId "${item.linkId}" of type "${item.type}" has initial with invalid value-type.`,
            );
          }
          break;
        default:
          throw new UnreachableError(item.type);
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
    if (item.extension !== undefined) {
      this.validateExtensionHelper(
        item.extension,
        item,
        "extension",
        undefined,
      );
    }
  }

  private validateModifierExtension(item: ParsedItem): void {
    if (item.modifierExtension !== undefined) {
      this.validateExtensionHelper(
        item.modifierExtension,
        item,
        "modifierExtension",
        undefined,
      );
    }
  }

  private validateExtensionHelper(
    extensions: ParsedExtension[],
    item: ParsedItem,
    name: string,
    prefix: string | undefined,
  ): void {
    for (let pos = 1; pos <= extensions.length; pos++) {
      const extension = extensions[pos - 1];
      const count = fhirValidatorUtils.countValueInvariants(extension);
      const path: string =
        prefix !== undefined ? `${prefix} -> ${pos}` : pos.toString();
      if (count === 0) {
        if (extension.extension === undefined) {
          this.errors.push(
            `LinkId "${item.linkId}" has ${name} at position ${path} with value and extension both undefined.`,
          );
        } else {
          this.validateExtensionHelper(extension.extension, item, name, path);
        }
      } else if (count > 1) {
        this.errors.push(
          `LinkId "${item.linkId}" has ${name} at position ${path} with multiple (${count}) value invariants defined.`,
        );
      } else if (extension.extension !== undefined) {
        this.errors.push(
          `LinkId "${item.linkId}" has ${name} at position ${path} with value and extension both defined.`,
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
    } else if (item.required === undefined) {
      item.required = itemTools.getDefaultRequired(item.type);
      this.warnings.push(
        `LinkId "${item.linkId}" is of type "${item.type}" which allows field "required". "required" has been initialized to ${item.required}.`,
      );
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
    } else if (item.repeats === undefined) {
      item.repeats = itemTools.getDefaultRepeats(item.type);
      this.warnings.push(
        `LinkId ${item.linkId} is of type "${item.type}" which allows field "repeats". "repeats" has been initialized to ${item.repeats}.`,
      );
    }
  }

  private validateReadOnly(item: ParsedItem): void {
    if (item.type === "display") {
      if (item.readOnly !== undefined) {
        item.readOnly = undefined;
        this.warnings.push(
          `LinkId ${item.linkId} is of type "${item.type}" which does not allow field "readOnly". "readOnly" has been deleted.`,
        );
      }
    } else if (item.readOnly === undefined) {
      item.readOnly = itemTools.getDefaultReadOnly(item.type);
      this.warnings.push(
        `LinkId ${item.linkId} is of type "${item.type}" which allows field "readOnly". "readOnly" has been initialized to ${item.readOnly}.`,
      );
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
