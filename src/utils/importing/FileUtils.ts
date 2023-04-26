import { i18n } from "@/i18n";
import { Item } from "@/types";

class GeneralJSONValidationException {
  private readonly name = "GeneralJSONValidationException";
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  toString() {
    return `${this.name}: "${this.message}"`;
  }
}

function emptyItems(items: Item[] | undefined): items is undefined {
  return items === undefined || items.length === 0;
}

function validateItem(item1: Item, item2: Item, errorMessages: string[]): void {
  if (item1.linkId !== item2.linkId) {
    errorMessages.push(
      `LinkIDs '${item1.linkId} and ${item2.linkId}' are incompatible.`,
    );
    return;
  }
  if (item1.type !== item2.type) {
    errorMessages.push(
      `Types '${item1.type}' and '${item2.type}' are incompatible.`,
    );
    return;
  }
  itemStructure(item1.item, item2.item, errorMessages);
}

function itemStructure(
  qre1: Item[] | undefined,
  qre2: Item[] | undefined,
  errorMessages: string[],
): void {
  if (emptyItems(qre1) && emptyItems(qre2)) return;
  if (emptyItems(qre1) || emptyItems(qre2)) {
    errorMessages.push("Can't have empty items if others are non-empty.");
    return;
  }
  if (qre1.length !== qre2.length) {
    errorMessages.push("All Items need to have the same length");
    return;
  }
  for (let i = 0; i < qre1.length; i++) {
    validateItem(qre1[i], qre2[i], errorMessages);
  }
}

class FileUtils {
  validateJson(jsonFile: string | ArrayBuffer | null): unknown {
    if (jsonFile === null || typeof jsonFile !== "string") {
      throw new GeneralJSONValidationException(
        i18n.global.t(
          "messagesErrors.GeneralJSONValidations.jsonFileIsNotString",
        ),
      );
    }
    try {
      return JSON.parse(jsonFile);
    } catch (error: any) {
      const message = `${i18n.global.t(
        "messagesErrors.GeneralJSONValidations.NoJSONFILEStructure",
      )}
      ${error.message}`;
      throw new GeneralJSONValidationException(message);
    }
  }

  validateItemStructure(items1: Item[], items2: Item[]): string[] {
    const errorMessages: string[] = [];
    itemStructure(items1, items2, errorMessages);
    return errorMessages;
  }
}

export const fileUtils = new FileUtils();
