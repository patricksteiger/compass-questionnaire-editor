import { defaultLanguage } from "@/i18n";
import {
  AnswerOption,
  EnableWhen,
  Extension,
  Initial,
  Item,
  Questionnaire,
} from "@/types";
import { getOrAddHiddenExtension } from "@/utils/extension";
import {
  allowsAnswerChoice,
  getAnswerOptionIcon,
  getItemTypeIcon,
  VersionAlgorithmCoding,
} from "../../constants";
import { editorTools } from "../../editor";
import { itemTools } from "../../item";
import {
  ParsedAnswerOption,
  ParsedExtension,
  ParsedInitial,
  ParsedItem,
} from "../parsing/item";
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
    for (const parsedItem of this.qre.item) {
      const item = this.fromItem(parsedItem, linkIdCount.toString());
      this.handleHiddenFor(item);
      newItem.push(item);
      linkIdCount++;
    }
    const extension = this.qre.extension;
    const newExtension: Extension[] = [];
    if (extension !== undefined) {
      for (let i = 0; i < extension.length; i++) {
        const e = extension[i];
        newExtension.push(this.fromExtension(e));
      }
    }
    let versAlg = undefined;
    if (this.qre.versionAlgorithmCoding !== undefined) {
      versAlg = this.qre.versionAlgorithmCoding as VersionAlgorithmCoding;
    }
    return {
      ...this.qre,
      versionAlgorithmCoding: versAlg,
      status,
      language,
      experimental,
      extension: newExtension,
      item: newItem,
    };
  }

  private handleHiddenFor(item: Item): void {
    const extension = item.extension!;
    const hiddenExtension = getOrAddHiddenExtension(extension);
    if (hiddenExtension.valueBoolean) {
      item.__active = false;
      // First hidden item still needs to allow toggle
      item.__disabled = false;
      if (item.item !== undefined) {
        for (const child of item.item) {
          this.setHiddenFor(child);
        }
      }
    } else if (item.item !== undefined) {
      for (const child of item.item) {
        this.handleHiddenFor(child);
      }
    }
  }

  private setHiddenFor(item: Item): void {
    const extension = item.extension!;
    const hiddenExtension = getOrAddHiddenExtension(extension);
    hiddenExtension.valueBoolean = true;
    item.__active = false;
    item.__disabled = true;
    if (item.item !== undefined) {
      for (const child of item.item) {
        this.setHiddenFor(child);
      }
    }
  }

  private fromItem(fhirItem: ParsedItem, internalLinkId: string): Item {
    const { item, answerOption, extension, initial, text, answerValueSet } =
      fhirItem;
    const enableWhen = this.fromEnableWhen(fhirItem);
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
    const newExtension: Extension[] = [];
    if (extension !== undefined) {
      for (let i = 0; i < extension.length; i++) {
        const e = extension[i];
        newExtension.push(this.fromExtension(e));
      }
    }
    const newInitial: Initial[] = [];
    if (initial !== undefined) {
      for (let i = 0; i < initial.length; i++) {
        const e = initial[i];
        newInitial.push(this.fromInitial(e));
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
      extension: newExtension,
      text: text ?? "",
      required: fhirItem.required,
      repeats: fhirItem.repeats,
      initial: newInitial,
      item: newItem,
    };
  }

  private fromInitial(initial: ParsedInitial): Initial {
    if (initial.valueBoolean !== undefined) {
      return { __type: "boolean", valueBoolean: initial.valueBoolean };
    } else if (initial.valueDecimal !== undefined) {
      return { __type: "decimal", valueDecimal: initial.valueDecimal };
    } else if (initial.valueInteger !== undefined) {
      return { __type: "integer", valueInteger: initial.valueInteger };
    } else if (initial.valueDate !== undefined) {
      return { __type: "date", valueDate: initial.valueDate };
    } else if (initial.valueDateTime !== undefined) {
      return { __type: "dateTime", valueDateTime: initial.valueDateTime };
    } else if (initial.valueTime !== undefined) {
      return { __type: "time", valueTime: initial.valueTime };
    } else if (initial.valueString !== undefined) {
      return { __type: "string", valueString: initial.valueString };
    }

    throw new Error(
      `fromInitial has missing implementation: ${JSON.stringify(initial)}`,
    );
  }

  private fromExtension(extension: ParsedExtension): Extension {
    if (extension.valueBoolean !== undefined) {
      return {
        __type: "boolean",
        url: extension.url,
        valueBoolean: extension.valueBoolean,
      };
    } else if (extension.valueCode !== undefined) {
      return {
        __type: "code",
        url: extension.url,
        valueCode: extension.valueCode,
      };
    } else if (extension.valueDecimal !== undefined) {
      return {
        __type: "decimal",
        url: extension.url,
        valueDecimal: extension.valueDecimal,
      };
    } else if (extension.valueInteger !== undefined) {
      return {
        __type: "integer",
        url: extension.url,
        valueInteger: extension.valueInteger,
      };
    } else if (extension.valueDate !== undefined) {
      return {
        __type: "date",
        url: extension.url,
        valueDate: extension.valueDate,
      };
    } else if (extension.valueDateTime !== undefined) {
      return {
        __type: "dateTime",
        url: extension.url,
        valueDateTime: extension.valueDateTime,
      };
    } else if (extension.valueTime !== undefined) {
      return {
        __type: "time",
        url: extension.url,
        valueTime: extension.valueTime,
      };
    } else if (extension.valueMarkdown !== undefined) {
      return {
        __type: "markdown",
        url: extension.url,
        valueMarkdown: extension.valueMarkdown,
      };
    } else {
      return {
        __type: "string",
        url: extension.url,
        valueString: extension.valueString ?? "",
      };
    }
  }

  private fromAnswerOption(answerOption: ParsedAnswerOption): AnswerOption {
    const initialSelected = answerOption.initialSelected ?? false;
    const result: AnswerOption = {
      ...answerOption,
      initialSelected,
      __id: itemTools.createAnswerOptionId(),
      __type: "coding",
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
    } else {
      throw new Error("Unreachable: answerOption has no defined value!");
    }
    return result;
  }

  private fromEnableWhen(fhirItem: ParsedItem): EnableWhen[] | undefined {
    if (fhirItem.enableWhen === undefined) return undefined;
    const resultEnableWhen: EnableWhen[] = [];
    for (const enableWhen of fhirItem.enableWhen) {
      const result: EnableWhen = editorTools.clone(enableWhen);
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
        // FIXME: is __answerOption still needed?
        result.__answerOption =
          allowsAnswerChoice(linkedItem.type) &&
          itemTools.definedAnswerChoices(fhirItem);
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
        if (result.__answerOption) {
          result.__type = "decimal";
        }
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
        if (result.__answerOption) {
          result.__type = "dateTime";
        }
      } else if (enableWhen.answerString !== undefined) {
        result.__answer = enableWhen.answerString;
        result.__orString = linkedItem?.type !== "string";
        if (linkedItem === undefined && result.__answerOption) {
          result.__type = "string";
        }
      } else if (enableWhen.answerCoding !== undefined) {
        result.__answer = editorTools.formatCoding(enableWhen.answerCoding);
        if (result.__answerOption) {
          result.__type = "coding";
        }
      } else if (enableWhen.answerQuantity !== undefined) {
        result.__answer = editorTools.formatQuantity(enableWhen.answerQuantity);
        if (result.__answerOption) {
          result.__type = "quantity";
        }
      } else if (enableWhen.answerReference !== undefined) {
        result.__answer = editorTools.formatReference(
          enableWhen.answerReference,
        );
        if (result.__answerOption) {
          result.__type = "reference";
        }
      }
      resultEnableWhen.push(result);
    }

    return resultEnableWhen;
  }
}
