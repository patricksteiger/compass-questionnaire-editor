import { editorTools } from "@/utils/editor";
import { ParsedExtension } from "../parsing/item";

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
}

export const fhirValidatorUtils = new FHIRValidatorUtils();
