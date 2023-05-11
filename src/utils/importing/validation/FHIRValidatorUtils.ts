import { editorTools } from "@/utils/editor";

class FHIRValidatorUtils {
  countValueInvariants<T extends object>(object: T): number {
    let count = 0;
    for (const key of editorTools.objectKeys(object)) {
      if (
        typeof key === "string" &&
        key.startsWith("value") &&
        object[key] !== undefined
      ) {
        count++;
      }
    }
    return count;
  }

  countAnswerInvariants<T extends object>(object: T): number {
    let count = 0;
    for (const key of editorTools.objectKeys(object)) {
      if (
        typeof key === "string" &&
        key.startsWith("answer") &&
        object[key] !== undefined
      ) {
        count++;
      }
    }
    return count;
  }
}

export const fhirValidatorUtils = new FHIRValidatorUtils();
