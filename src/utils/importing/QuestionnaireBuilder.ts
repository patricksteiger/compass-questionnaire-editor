import { AnswerOption, EnableWhen, Item, Questionnaire } from "@/types";
import { getAnswerOptionIcon, getItemTypeIcon } from "../constants";
import { editorTools } from "../editor";
import { itemTools } from "../item";
import { FHIREnableWhen } from "./enableWhen";
import { FHIRAnswerOption, FHIRItem } from "./item";
import { FHIRQuestionnaire } from "./questionnaire";
import { validatorUtils } from "./ValidatorUtils";

export class QuestionnaireBuilder {
  constructor(private readonly qre: FHIRQuestionnaire) {}

  build(): Questionnaire {
    const newItem: Item[] = [];
    for (const i of this.qre.item) {
      newItem.push(this.fromItem(i));
    }
    return {
      ...this.qre,
      item: newItem,
    };
  }

  private fromItem(fhirItem: FHIRItem): Item {
    const {
      item,
      enableWhen: fhirEnableWhen,
      answerOption,
      text,
      definition,
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
      for (const i of item) {
        newItem.push(this.fromItem(i));
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
      __newDefinition: definition ? false : true,
      __oldText: text,
      __dependenceCondition: undefined,
      __OldAnswerValueSet: answerValueSet,
      __answerValueSetCheck: answerValueSet !== undefined,
      __linkId: fhirItem.linkId,
      ...fhirItem,
      answerOption: newAnswerOption,
      enableWhen,
      text: text ?? "",
      definition: definition ?? "",
      required: fhirItem.required,
      repeats: fhirItem.repeats,
      item: newItem,
    };
  }

  private fromAnswerOption(answerOption: FHIRAnswerOption): AnswerOption {
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
      result.__oldValueCoding = { ...result.valueCoding };
      result.__formattedValueCoding = editorTools.formatCoding(
        result.valueCoding,
      );
      result.__oldFormattedValueCoding = result.__formattedValueCoding;
    } else if (result.valueInteger !== undefined) {
      result.__type = "integer";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueInteger = result.valueInteger;
    } else if (result.valueDate !== undefined) {
      result.__type = "date";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueDate = result.valueDate;
    } else if (result.valueString !== undefined) {
      result.__type = "string";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueString = result.valueString;
    } else if (result.valueTime !== undefined) {
      result.__type = "time";
      result.__icon = getAnswerOptionIcon(result.__type);
      result.__oldValueTime = result.valueTime;
    }
    return result;
  }

  private fromEnableWhen(enableWhen: FHIREnableWhen): EnableWhen {
    const result: EnableWhen = {
      ...enableWhen,
    };
    const linkedItem = validatorUtils.getItemByLinkId(
      this.qre,
      enableWhen.question,
    );
    if (linkedItem === undefined) {
      // TODO: Is this a warning/error?
      console.error(`EnableWhen linkId ${enableWhen.question} must exist.`);
    } else {
      result.type =
        linkedItem.type !== "display" && linkedItem.type !== "group"
          ? linkedItem.type
          : undefined;
      result.__answerOption =
        linkedItem.type === "choice" || linkedItem.type === "open-choice";
    }
    if (enableWhen.answerBoolean !== undefined) {
      result.answer = String(enableWhen.answerBoolean);
    } else if (enableWhen.answerInteger !== undefined) {
      result.answer = String(enableWhen.answerInteger);
      if (result.__answerOption) {
        result.type = "integer";
      }
    } else if (enableWhen.answerDecimal !== undefined) {
      result.answer = String(enableWhen.answerDecimal);
    } else if (enableWhen.answerDate !== undefined) {
      result.answer = enableWhen.answerDate;
      if (result.__answerOption) {
        result.type = "date";
      }
    } else if (enableWhen.answerTime !== undefined) {
      result.answer = enableWhen.answerTime;
      if (result.__answerOption) {
        result.type = "time";
      }
    } else if (enableWhen.answerDateTime !== undefined) {
      result.answer = enableWhen.answerDateTime;
    } else if (enableWhen.answerString !== undefined) {
      result.answer = enableWhen.answerString;
      if (result.__answerOption) {
        result.type = "string";
      }
    } else if (enableWhen.answerCoding !== undefined) {
      result.answer = editorTools.formatCoding(enableWhen.answerCoding);
      result.system = enableWhen.answerCoding.system;
      result.display = enableWhen.answerCoding.display;
      if (result.__answerOption) {
        result.type = "coding";
      }
    } else if (enableWhen.answerQuantity !== undefined) {
      result.answer = editorTools.formatQuantity(enableWhen.answerQuantity);
    }
    return result;
  }
}
