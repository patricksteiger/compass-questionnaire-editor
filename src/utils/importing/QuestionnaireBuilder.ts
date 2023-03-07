import {
  AnswerOption,
  EnableWhen,
  Identifier,
  IdentifierType,
  Item,
  Questionnaire,
} from "@/types";
import { getItemTypeIcon } from "../constants";
import { editorTools } from "../editor";
import { itemTools } from "../item";
import { FHIREnableWhen } from "./enableWhen";
import { FHIRAnswerOption, FHIRItem } from "./item";
import { FHIRIdentifier, FHIRQuestionnaire } from "./questionnaire";
import { validatorUtils } from "./ValidatorUtils";

export class QuestionnaireBuilder {
  constructor(private readonly qre: FHIRQuestionnaire) {}

  build(): Questionnaire {
    const { identifier: fhirIdentifier, item } = this.qre;
    let identifier: Identifier[] | undefined = undefined;
    if (fhirIdentifier !== undefined) {
      identifier = [];
      for (const i of fhirIdentifier) {
        identifier.push(this.fromIdentifier(i));
      }
    }
    const newItem: Item[] = [];
    for (const i of item) {
      newItem.push(this.fromItem(i));
    }
    return {
      ...this.qre,
      identifier,
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
        newAnswerOption.push(this.fromAnswerOption(a, i + 1));
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

  private fromAnswerOption(
    answerOption: FHIRAnswerOption,
    id: number,
  ): AnswerOption {
    const result: AnswerOption = {
      ...answerOption,
      __id: id,
    };
    if (result.valueCoding !== undefined) {
      result.__type = "coding";
      result.__icon = "radio_button_unchecked";
      result.valueCoding.__oldDisplay = result.valueCoding.display;
      result.valueCoding.code ??= "";
      result.valueCoding.system ??= "";
      result.valueCoding.display ??= "";
    } else if (result.valueInteger !== undefined) {
      result.__type = "integer";
      result.__icon = "pin";
      result.__oldValueInteger = result.valueInteger;
    } else if (result.valueDate !== undefined) {
      result.__type = "date";
      result.__icon = "calendar_month";
      result.__oldValueDate = result.valueDate;
    } else if (result.valueString !== undefined) {
      result.__type = "string";
      result.__icon = "text_fields";
      result.__oldValueString = result.valueString;
    } else if (result.valueTime !== undefined) {
      result.__type = "time";
      result.__icon = "schedule";
      result.__oldValueString = result.valueString;
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
      console.error(`EnableWhen linkId ${enableWhen.question} must exist.`);
    } else {
      result.type =
        linkedItem.type !== "display" && linkedItem.type !== "group"
          ? linkedItem.type
          : undefined;
    }
    if (enableWhen.answerBoolean !== undefined) {
      result.answer = String(enableWhen.answerBoolean);
    } else if (enableWhen.answerInteger !== undefined) {
      result.answer = String(enableWhen.answerInteger);
    } else if (enableWhen.answerDecimal !== undefined) {
      result.answer = String(enableWhen.answerDecimal);
    } else if (enableWhen.answerDate !== undefined) {
      result.answer = enableWhen.answerDate;
    } else if (enableWhen.answerTime !== undefined) {
      result.answer = enableWhen.answerTime;
    } else if (enableWhen.answerDateTime !== undefined) {
      result.answer = enableWhen.answerDateTime;
    } else if (enableWhen.answerString !== undefined) {
      result.answer = enableWhen.answerString;
    } else if (enableWhen.answerCoding !== undefined) {
      result.answer = enableWhen.answerCoding.code;
      result.system = enableWhen.answerCoding.system;
      result.display = enableWhen.answerCoding.display;
    } else if (enableWhen.answerQuantity !== undefined) {
      result.answer = editorTools.formatQuantity(enableWhen.answerQuantity);
    }
    return result;
  }

  private fromIdentifier(identifier: FHIRIdentifier): Identifier {
    const { type: identifierType } = identifier;
    let type: IdentifierType | undefined = undefined;
    if (identifierType !== undefined) {
      const { coding, text } = identifierType;
      type = {
        coding: {
          ...coding,
          __oldDisplay: undefined,
        },
        text: text,
      };
    }
    return {
      ...identifier,
      type,
    };
  }
}
