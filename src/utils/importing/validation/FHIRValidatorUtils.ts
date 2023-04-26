import { editorTools } from "@/utils/editor";
import { ParsedEnableWhen } from "../parsing/enableWhen";
import { ParsedAnswerOption, ParsedExtension } from "../parsing/item";

class FHIRValidatorUtils {
  countExtensionValue(extension: ParsedExtension): number {
    let count = 0;
    for (const key of editorTools.objectKeys(extension)) {
      if (key.startsWith("value") && extension[key] !== undefined) {
        count++;
      }
    }
    return count;
  }

  countAnswerOptionValue(answerOption: ParsedAnswerOption): number {
    let count = 0;
    for (const key of editorTools.objectKeys(answerOption)) {
      if (key.startsWith("value") && answerOption[key] !== undefined) {
        count++;
      }
    }
    return count;
  }

  countEnableWhenAnswer(enableWhen: ParsedEnableWhen): number {
    let count = 0;
    for (const key of editorTools.objectKeys(enableWhen)) {
      if (key.startsWith("answer") && enableWhen[key] !== undefined) {
        count++;
      }
    }
    return count;
  }
}

export const fhirValidatorUtils = new FHIRValidatorUtils();
