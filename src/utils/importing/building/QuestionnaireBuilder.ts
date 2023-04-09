import { defaultLanguage } from "@/i18n";
import { AnswerOption, EnableWhen, Item, Questionnaire } from "@/types";
import { getAnswerOptionIcon, getItemTypeIcon } from "../../constants";
import { editorTools } from "../../editor";
import { itemTools } from "../../item";
import { ParsedEnableWhen } from "../parsing/enableWhen";
import { ParsedAnswerOption, ParsedItem } from "../parsing/item";
import { ParsedQuestionnaire } from "../parsing/questionnaire";
import { validatorUtils } from "../TransformerUtils";

export class QuestionnaireBuilder {
  constructor(private readonly qre: ParsedQuestionnaire) {}

  build(): Questionnaire {
    const status = this.qre.status ?? "unknown";
    const language = this.qre.language ?? defaultLanguage;
    const experimental = this.qre.experimental ?? null;
    this.qre.item ??= [];
    const newItem: Item[] = [];
    let linkIdCount = 0;
    for (const i of this.qre.item) {
      newItem.push(this.fromItem(i, linkIdCount.toString()));
      linkIdCount++;
    }
    return {
      ...this.qre,
      status,
      language,
      experimental,
      item: newItem,
    };
  }

  private fromItem(fhirItem: ParsedItem, internalLinkId: string): Item {
    const {
      item,
      enableWhen: fhirEnableWhen,
      answerOption,
      text,
      answerValueSet,
    } = fhirItem;
    let enableWhen: EnableWhen[] | undefined = undefined;
    if (fhirEnableWhen !== undefined) {
      enableWhen = [];
      for (const e of fhirEnableWhen) {
        enableWhen.push(this.fromEnableWhen(e));
      }
    }
    let newItem: Item[] | undefined = undefined;
    if (item !== undefined) {
      newItem = [];
      let linkIdCount = 0;
      for (const i of item) {
        const nextInternalLinkId = `${internalLinkId}.${linkIdCount}`;
        newItem.push(this.fromItem(i, nextInternalLinkId));
        linkIdCount++;
      }
    }
    let newAnswerOption: AnswerOption[] | undefined = undefined;
    if (answerOption !== undefined) {
      newAnswerOption = [];
      for (let i = 0; i < answerOption.length; i++) {
        const a = answerOption[i];
        newAnswerOption.push(this.fromAnswerOption(a));
      }
    }
    return {
      __active: true,
      __disabled: false,
      __icon: getItemTypeIcon(fhirItem.type),
      __internalID: itemTools.createInternalId(),
      __newQuestion: true,
      __oldText: text,
      __dependenceCondition: undefined,
      __OldAnswerValueSet: answerValueSet,
      __answerValueSetCheck: answerValueSet !== undefined,
      __linkId: internalLinkId,
      ...fhirItem,
      answerOption: newAnswerOption,
      enableWhen,
      text: text ?? "",
      required: fhirItem.required,
      repeats: fhirItem.repeats,
      item: newItem,
    };
  }

  private fromAnswerOption(answerOption: ParsedAnswerOption): AnswerOption {
    const result: AnswerOption = {
      ...answerOption,
      __id: itemTools.createAnswerOptionId(),
    };
    if (result.valueCoding !== undefined) {
      result.__type = "coding";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.valueCoding.code ??= "";
      result.valueCoding.system ??= "";
      result.valueCoding.display ??= "";
      result.__oldValueCoding = editorTools.clone(result.valueCoding);
      result.__formattedValueCoding = editorTools.formatCoding(
        result.valueCoding,
      );
      result.__oldFormattedValueCoding = result.__formattedValueCoding;
    } else if (result.valueDecimal !== undefined) {
      result.__type = "decimal";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueDecimal = result.valueDecimal;
    } else if (result.valueInteger !== undefined) {
      result.__type = "integer";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueInteger = result.valueInteger;
    } else if (result.valueDate !== undefined) {
      result.__type = "date";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueDate = result.valueDate;
    } else if (result.valueDateTime !== undefined) {
      result.__type = "dateTime";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueDateTime = result.valueDateTime;
    } else if (result.valueTime !== undefined) {
      result.__type = "time";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueTime = result.valueTime;
    } else if (result.valueString !== undefined) {
      result.__type = "string";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueString = result.valueString;
    } else if (result.valueQuantity !== undefined) {
      result.__type = "quantity";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueQuantity = editorTools.clone(result.valueQuantity);
      result.__formattedValueQuantity = editorTools.formatQuantity(
        result.valueQuantity,
      );
      result.__oldFormattedValueQuantity = result.__formattedValueQuantity;
    } else if (result.valueReference !== undefined) {
      result.__type = "reference";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueReference = editorTools.clone(result.valueReference);
      result.__formattedValueReference = editorTools.formatReference(
        result.valueReference,
      );
      result.__oldFormattedValueReference = result.__formattedValueReference;
    }
    return result;
  }

  private fromEnableWhen(enableWhen: ParsedEnableWhen): EnableWhen {
    const result: EnableWhen = {
      ...enableWhen,
    };
    const linkedItem = validatorUtils.getItemByLinkId(
      this.qre,
      enableWhen.question,
    );
    if (linkedItem !== undefined) {
      result.__type =
        linkedItem.type !== "display" &&
        linkedItem.type !== "group" &&
        linkedItem.type !== "attachment"
          ? linkedItem.type
          : undefined;
      result.__answerOption =
        linkedItem.type === "choice" || linkedItem.type === "open-choice";
    }
    if (enableWhen.answerBoolean !== undefined) {
      result.__answer = String(enableWhen.answerBoolean);
    } else if (enableWhen.answerInteger !== undefined) {
      result.__answer = String(enableWhen.answerInteger);
      if (result.__answerOption) {
        result.__type = "integer";
      }
    } else if (enableWhen.answerDecimal !== undefined) {
      result.__answer = String(enableWhen.answerDecimal);
    } else if (enableWhen.answerDate !== undefined) {
      result.__answer = enableWhen.answerDate;
      if (result.__answerOption) {
        result.__type = "date";
      }
    } else if (enableWhen.answerTime !== undefined) {
      result.__answer = enableWhen.answerTime;
      if (result.__answerOption) {
        result.__type = "time";
      }
    } else if (enableWhen.answerDateTime !== undefined) {
      result.__answer = enableWhen.answerDateTime;
    } else if (enableWhen.answerString !== undefined) {
      result.__answer = enableWhen.answerString;
      if (result.__answerOption) {
        result.__type = "string";
      }
    } else if (enableWhen.answerCoding !== undefined) {
      result.__answer = editorTools.formatCoding(enableWhen.answerCoding);
      if (result.__answerOption) {
        result.__type = "coding";
      }
    } else if (enableWhen.answerQuantity !== undefined) {
      result.__answer = editorTools.formatQuantity(enableWhen.answerQuantity);
    } else if (enableWhen.answerReference !== undefined) {
      result.__answer = editorTools.formatReference(enableWhen.answerReference);
    }

    return result;
  }
}
