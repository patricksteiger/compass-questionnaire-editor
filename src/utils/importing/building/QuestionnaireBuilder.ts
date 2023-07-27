import { defaultLanguage } from "@/i18n";
import {
  AnswerOption,
  ContactDetail,
  ContactPoint,
  DerivedFromExtension,
  derivedFromExtensionUrl,
  EnableWhen,
  Extension,
  Initial,
  Item,
  Meta,
  Narrative,
  Questionnaire,
  UsageContext,
} from "@/types";
import { getOrAddHiddenExtension } from "@/utils/extension";
import {
  allowsAnswerOption,
  getAnswerOptionIcon,
  getItemTypeIcon,
  VersionAlgorithmCoding,
} from "../../constants";
import { editorTools, UnreachableError } from "../../editor";
import { itemTools } from "../../item";
import {
  ParsedAnswerOption,
  ParsedExtension,
  ParsedInitial,
  ParsedItem,
} from "../parsing/item";
import { ParsedContactDetail, ParsedUsageContext } from "../parsing/schemas";
import {
  ParsedMeta,
  ParsedQuestionnaire,
  ParsedText,
} from "../parsing/questionnaire";
import { validatorUtils } from "../TransformerUtils";

export class QuestionnaireBuilder {
  constructor(private readonly qre: ParsedQuestionnaire) {}

  build(): Questionnaire {
    const status = this.qre.status ?? "unknown";
    const language = this.qre.language ?? defaultLanguage;
    const experimental = this.qre.experimental ?? false;
    const subjectType = this.qre.subjectType ?? [];
    const code = this.qre.code ?? [];
    const derivedFrom = this.qre.derivedFrom ?? [];
    const _derivedFrom = this.fromDerivedFromExtension(this.qre);
    const effectivePeriod = this.qre.effectivePeriod ?? {};
    const contact = this.qre.contact;
    const newContact: ContactDetail[] = [];
    if (contact !== undefined) {
      for (const c of contact) {
        newContact.push(this.fromContactDetail(c));
      }
    }
    const newUseContext: UsageContext[] = [];
    if (this.qre.useContext !== undefined) {
      for (const u of this.qre.useContext) {
        newUseContext.push(this.fromUseContext(u));
      }
    }
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
      for (const e of extension) {
        newExtension.push(this.fromExtension(e));
      }
    }
    const modifierExtension = this.qre.modifierExtension;
    const newModifierExtension: Extension[] = [];
    if (modifierExtension !== undefined) {
      for (const e of modifierExtension) {
        newModifierExtension.push(this.fromExtension(e));
      }
    }
    let versAlg = undefined;
    if (this.qre.versionAlgorithmCoding !== undefined) {
      versAlg = this.qre.versionAlgorithmCoding as VersionAlgorithmCoding;
    }
    const meta = this.fromMeta(this.qre.meta);
    const text = this.fromText(this.qre.text);
    return {
      ...this.qre,
      __versionAlgorithmUsesCoding: !this.qre.versionAlgorithmString,
      code,
      meta,
      text,
      derivedFrom,
      _derivedFrom,
      subjectType,
      contact: newContact,
      useContext: newUseContext,
      versionAlgorithmCoding: versAlg,
      status,
      effectivePeriod,
      language,
      experimental,
      extension: newExtension,
      modifierExtension: newModifierExtension,
      item: newItem,
    };
  }

  private fromDerivedFromExtension(
    qre: ParsedQuestionnaire,
  ): DerivedFromExtension[] {
    if (editorTools.emptyArray(qre.derivedFrom)) {
      return [];
    }
    const _derivedFrom: DerivedFromExtension[] = [];
    for (const ext of qre._derivedFrom ?? []) {
      if (ext === null) {
        _derivedFrom.push({ url: derivedFromExtensionUrl, __value: null });
      } else {
        // Length should always be 1. Validated in import-validator.
        const code = ext.valueCodeableConcept.coding[0].code;
        switch (code) {
          case "extends":
            _derivedFrom.push({
              url: derivedFromExtensionUrl,
              __value: code,
            });
            break;
          case "compliesWith":
            _derivedFrom.push({
              url: derivedFromExtensionUrl,
              __value: code,
            });
            break;
          case "inspiredBy":
            _derivedFrom.push({
              url: derivedFromExtensionUrl,
              __value: code,
            });
            break;
          default:
            throw new UnreachableError(code);
        }
      }
    }
    const padding = qre.derivedFrom.length - _derivedFrom.length;
    for (let count = 1; count <= padding; count++) {
      _derivedFrom.push({ url: derivedFromExtensionUrl, __value: null });
    }
    return _derivedFrom;
  }

  private fromUseContext(useContext: ParsedUsageContext): UsageContext {
    const { code } = useContext;
    if (useContext.valueCodeableConcept !== undefined) {
      const { text, coding } = useContext.valueCodeableConcept;
      return {
        __type: "codeableConcept",
        code,
        valueCodeableConcept: { text, coding: coding ?? [] },
      };
    } else if (useContext.valueQuantity !== undefined) {
      return {
        __type: "quantity",
        code,
        valueQuantity: useContext.valueQuantity,
      };
    } else if (useContext.valueRange !== undefined) {
      return {
        __type: "range",
        code,
        valueRange: useContext.valueRange,
      };
    } else if (useContext.valueReference !== undefined) {
      return {
        __type: "reference",
        code,
        valueReference: useContext.valueReference,
      };
    }
    throw new Error("Missing implementation!");
  }

  private fromContactDetail(contactDetail: ParsedContactDetail): ContactDetail {
    let telecom: ContactPoint[];
    if (contactDetail.telecom === undefined) {
      telecom = [];
    } else {
      telecom = contactDetail.telecom.map((t) => ({ period: {}, ...t }));
    }
    return {
      name: contactDetail.name ?? "",
      telecom,
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
    const {
      item,
      answerOption,
      extension,
      modifierExtension,
      initial,
      text,
      answerValueSet,
    } = fhirItem;
    const enableWhen = this.fromEnableWhen(fhirItem);
    const disabledDisplay = fhirItem.disabledDisplay ?? null;
    const code = fhirItem.code ?? [];
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
    const newModifierExtension: Extension[] = [];
    if (modifierExtension !== undefined) {
      for (let i = 0; i < modifierExtension.length; i++) {
        const e = modifierExtension[i];
        newModifierExtension.push(this.fromExtension(e));
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
      code,
      answerOption: newAnswerOption,
      enableWhen,
      disabledDisplay,
      extension: newExtension,
      modifierExtension: newModifierExtension,
      text: text ?? "",
      required: fhirItem.required,
      repeats: fhirItem.repeats,
      readOnly: fhirItem.readOnly,
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
    } else if (initial.valueUri !== undefined) {
      return { __type: "url", valueUri: initial.valueUri };
    } else if (initial.valueCoding !== undefined) {
      return { __type: "coding", valueCoding: initial.valueCoding };
    } else if (initial.valueQuantity !== undefined) {
      return { __type: "quantity", valueQuantity: initial.valueQuantity };
    } else if (initial.valueReference !== undefined) {
      return { __type: "reference", valueReference: initial.valueReference };
    } else if (initial.valueAttachment !== undefined) {
      return { __type: "attachment", valueAttachment: initial.valueAttachment };
    }

    throw new Error(
      `fromInitial has missing implementation: ${JSON.stringify(initial)}`,
    );
  }

  private fromText(text: ParsedText): Narrative {
    return {
      status: text?.status ?? "generated",
      div: text?.div ?? "",
    };
  }

  private fromMeta(meta: ParsedMeta): Meta {
    return {
      ...meta,
      profile: meta?.profile ?? [],
      security: meta?.security ?? [],
      tag: meta?.tag ?? [],
    };
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
    } else if (extension.valueString !== undefined) {
      return {
        __type: "string",
        url: extension.url,
        valueString: extension.valueString,
      };
    } else if (editorTools.nonEmptyArray(extension.extension)) {
      const newExtension: Extension[] = [];
      for (const child of extension.extension) {
        const ext = this.fromExtension(child);
        newExtension.push(ext);
      }
      return { __type: "complex", url: extension.url, extension: newExtension };
    }
    throw new Error(
      `fromExtension is missing implementation: ${JSON.stringify(extension)}`,
    );
  }

  private fromAnswerOption(
    parsedAnswerOption: ParsedAnswerOption,
  ): AnswerOption {
    const initialSelected = parsedAnswerOption.initialSelected ?? false;
    const answerOption: AnswerOption = {
      ...parsedAnswerOption,
      initialSelected,
      __id: itemTools.createAnswerOptionId(),
      __type: "coding",
    };
    if (answerOption.valueCoding !== undefined) {
      answerOption.__type = "coding";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.valueCoding.code ??= "";
      answerOption.valueCoding.system ??= "";
      answerOption.valueCoding.display ??= "";
      answerOption.__oldValueCoding = editorTools.clone(
        answerOption.valueCoding,
      );
      answerOption.__formattedValueCoding = editorTools.formatCoding(
        answerOption.valueCoding,
      );
      answerOption.__oldFormattedValueCoding =
        answerOption.__formattedValueCoding;
    } else if (answerOption.valueDecimal !== undefined) {
      answerOption.__type = "decimal";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueDecimal = answerOption.valueDecimal;
    } else if (answerOption.valueInteger !== undefined) {
      answerOption.__type = "integer";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueInteger = answerOption.valueInteger;
    } else if (answerOption.valueDate !== undefined) {
      answerOption.__type = "date";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueDate = answerOption.valueDate;
    } else if (answerOption.valueDateTime !== undefined) {
      answerOption.__type = "dateTime";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueDateTime = answerOption.valueDateTime;
    } else if (answerOption.valueTime !== undefined) {
      answerOption.__type = "time";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueTime = answerOption.valueTime;
    } else if (answerOption.valueString !== undefined) {
      answerOption.__type = "string";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueString = answerOption.valueString;
    } else if (answerOption.valueQuantity !== undefined) {
      answerOption.__type = "quantity";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueQuantity = editorTools.clone(
        answerOption.valueQuantity,
      );
      answerOption.__formattedValueQuantity = editorTools.formatQuantity(
        answerOption.valueQuantity,
      );
      answerOption.__oldFormattedValueQuantity =
        answerOption.__formattedValueQuantity;
    } else if (answerOption.valueReference !== undefined) {
      answerOption.__type = "reference";
      answerOption.__icon = getAnswerOptionIcon(answerOption.__type);
      answerOption.__oldValueReference = editorTools.clone(
        answerOption.valueReference,
      );
      answerOption.__formattedValueReference = editorTools.formatReference(
        answerOption.valueReference,
      );
      answerOption.__oldFormattedValueReference =
        answerOption.__formattedValueReference;
    } else {
      throw new Error(
        `fromAnswerOption missing implementation: ${JSON.stringify(
          answerOption,
        )}`,
      );
    }
    return answerOption;
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
          linkedItem.type !== "display" && linkedItem.type !== "group"
            ? linkedItem.type
            : undefined;
        // FIXME: is __answerOption still needed?
        result.__answerOption =
          allowsAnswerOption(linkedItem.type) &&
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
      } else if (enableWhen.answerUri !== undefined) {
        result.__answer = enableWhen.answerUri;
        if (linkedItem === undefined && result.__answerOption) {
          result.__type = "url";
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
      } else if (enableWhen.answerAttachment !== undefined) {
        result.__answer = editorTools.formatAttachment(
          enableWhen.answerAttachment,
        );
      }
      resultEnableWhen.push(result);
    }

    return resultEnableWhen;
  }
}
