import { i18n } from "../i18n";

type Coding = {
  code?: string;
  system?: string;
  display?: string;
  version?: string;
  userSelected?: boolean;
};

type AnswerType =
  | "integer"
  | "decimal"
  | "date"
  | "boolean"
  | "string"
  | "choice"
  | "coding"
  | "open-choice";

type EnableWhen = {
  question: string;
  answer?: string;
  operator: string;
  type?: AnswerType;
  system?: string;
  display?: string;
  answerInteger?: number;
  answerDecimal?: number;
  answerDate?: string;
  answerBoolean?: boolean;
  answerString?: string;
  answerCoding?: Coding;
};

type Extension = {
  valueInteger: Number;
  valueString: String;
  valueCoding: Coding;
};

type AnswerOption = {
  valueInteger: string | number;
};

type Identifier = {
  value?: string;
  use?: string;
  system?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: {
    coding?: Coding;
    text?: string;
  };
};

type Item = {
  item?: Item[];
  extension?: Extension[];
  answerOption?: AnswerOption[];
  answerValueSet?: string;
  disabled?: boolean;
  enableWhen?: EnableWhen[];
  linkId: string;
  identifier?: Identifier[];
  url?: string;
  name?: string;
  version?: string;
  title?: string;
  status?: string;
  publisher?: string;
  date?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  experimental?: boolean;
  resourceType: string;
};

const exportJsonQuestionnaire = {
  getExportObject(jsonObject: Item) {
    // let cloneObject = this.getObjectExportCopy(jsonObject);
    const objWithoutItemsDisabled =
      this.getObjectWithouItemsDisables(jsonObject);
    const finalObj = this.clearMetadatafields(objWithoutItemsDisabled);
    return finalObj;
  },
  getObjectWithouItemsDisables(jsonObject: Item) {
    if (jsonObject.item === undefined) {
      return jsonObject;
    }
    // To only keep items with linkId
    jsonObject.item = jsonObject.item.filter(
      (element: Item) => element.linkId !== "",
    );

    // For items within item
    jsonObject.item.forEach((element: Item) => {
      if (element.item) {
        this.getObjectWithouItemsDisables(element);
      }

      if (element.extension) {
        let i = element.extension.length;
        while (i--) {
          if (
            (!element.extension[i].valueInteger ||
              element.extension[i].valueInteger === null) &&
            (!element.extension[i].valueString ||
              element.extension[i].valueString === "") &&
            !element.extension[i].valueCoding
          ) {
            element.extension.splice(i, 1);
          }
        }

        if (element.extension.length === 0) {
          delete element.extension;
        }
      }

      //convert to integer ValueInteger
      if (element.answerOption) {
        element.answerOption.forEach((element: AnswerOption) => {
          if (
            element.valueInteger &&
            typeof element.valueInteger === "string"
          ) {
            element.valueInteger = parseInt(element.valueInteger);
          }
        });
      }

      //answerOption and Value Set
      if (element.answerValueSet !== "") {
        delete element.answerOption;
      }
      if (element.answerOption !== undefined) {
        //answerOption has data
        if (element.answerOption.length > 0) {
          delete element.answerValueSet;
        }
        //remove if is empty
        if (element.answerOption.length === 0) {
          delete element.answerOption;
        }
      }

      //remove disable Item property
      delete element.disabled;

      //remove empty answerValueSet
      if (element.answerValueSet === "") {
        delete element.answerValueSet;
      }

      if (element.enableWhen) {
        element.enableWhen = element.enableWhen.filter(
          (element: EnableWhen) => {
            return (
              element.operator !== "" &&
              element.question !== "" &&
              element.answer !== ""
            );
          },
        );
        element.enableWhen.forEach((element: EnableWhen) => {
          if (element.type === "decimal") {
            element.answerDecimal = parseFloat(element.answer || "");
          }
          if (element.type === "integer") {
            element.answerInteger = parseInt(element.answer || "");
          }
          if (element.type === "date") {
            element.answerDate = element.answer;
          }
          if (element.type === "boolean" || element.operator === "exist") {
            element.answerBoolean = element.answer === "true";
          }
          if (element.type === "string") {
            element.answerString = element.answer;
          }
          if (
            element.type === "choice" ||
            element.type === "open-choice" ||
            element.type === "coding"
          ) {
            element.answerCoding = {
              code: element.answer || "",
              display: element.display || "",
              system: element.system || "",
            };
          }
          delete element.system;
          delete element.display;
          delete element.answer;
          delete element.type;
        });
        if (element.enableWhen.length === 0) {
          delete element.enableWhen;
        }
      }
    });
    // Item must be deleted when empty
    if (jsonObject.item.length === 0) {
      delete jsonObject.item;
    }

    return jsonObject;
  },
  getObjectExportCopy(jsonObject: any) {
    if (typeof jsonObject === "string") {
      return jsonObject;
    }
    const newObject: any = {};
    const keys = Object.keys(jsonObject);
    for (const indexKey in keys) {
      const itemKey = keys[indexKey];
      if (!itemKey.startsWith("__")) {
        let value = jsonObject[itemKey];
        if (Array.isArray(value)) {
          value = this.getArrayExportCopy(value);
        } else if (typeof value === "object" && value !== null) {
          value = this.getObjectExportCopy(value);
        }

        newObject[itemKey] = value;
      }
    }
    return newObject;
  },
  getArrayExportCopy(array: any[]) {
    const newArray = [];
    for (const index in array) {
      newArray.push(this.getObjectExportCopy(array[index]));
    }
    return newArray;
  },
  clearMetadatafields(jsonObject: Item) {
    //Version
    if (jsonObject.version === "") {
      delete jsonObject.version;
    }
    //URL
    if (jsonObject.url === "") {
      delete jsonObject.url;
    }
    //Name
    if (jsonObject.name === "") {
      delete jsonObject.name;
    }
    //Status
    if (jsonObject.status === "") {
      delete jsonObject.status;
    }
    //publisher
    if (jsonObject.publisher === "") {
      delete jsonObject.publisher;
    }
    //title
    if (jsonObject.title === "") {
      delete jsonObject.title;
    }
    //approvalDate
    if (jsonObject.date === null) {
      delete jsonObject.date;
    }
    //approvalDate
    if (jsonObject.approvalDate === null) {
      delete jsonObject.approvalDate;
    }
    //lastReviewDate
    if (jsonObject.lastReviewDate === null) {
      delete jsonObject.lastReviewDate;
    }
    //experimental
    if (jsonObject.experimental === null) {
      delete jsonObject.experimental;
    }
    //Identifier
    if (jsonObject?.identifier && jsonObject.identifier.length > 0) {
      const clearedId: Identifier[] = [];
      jsonObject?.identifier.forEach((identifier) => {
        let removeUserSelected = true;
        if (identifier) {
          identifier.use === "" ? delete identifier.use : "";
          identifier.system === "" ? delete identifier.system : "";
          identifier.value === "" ? delete identifier.value : "";
          identifier.period?.start === "" ? delete identifier.period.start : "";
          identifier.period?.end === "" ? delete identifier.period.end : "";
          if (identifier.period) {
            Object.values(identifier.period).length === 0
              ? delete identifier.period
              : "";
          }
          identifier.type?.coding?.system === ""
            ? delete identifier.type.coding.system
            : (removeUserSelected = false);
          identifier.type?.coding?.version === ""
            ? delete identifier.type.coding.version
            : (removeUserSelected = false);
          identifier.type?.coding?.code === ""
            ? delete identifier.type.coding.code
            : (removeUserSelected = false);
          identifier.type?.coding?.display === ""
            ? delete identifier.type.coding.display
            : (removeUserSelected = false);
          removeUserSelected === true
            ? delete identifier.type?.coding?.userSelected
            : "";
          identifier.type?.text === "" ? delete identifier.type.text : "";
          if (identifier.type?.coding) {
            Object.values(identifier.type.coding).length === 0
              ? delete identifier.type.coding
              : "";
          }
          if (identifier.type) {
            Object.values(identifier.type).length === 0
              ? delete identifier.type
              : "";
          }
          Object.values(identifier).length > 0
            ? clearedId.push(identifier)
            : "";
        }
      });
      jsonObject.identifier = clearedId;
    }
    if (jsonObject?.identifier?.length === 0) {
      delete jsonObject.identifier;
    }
    return jsonObject;
  },
  i18n: i18n,
};

export { exportJsonQuestionnaire };
