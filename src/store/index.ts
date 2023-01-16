import { usedLocale, i18n, Locale } from "@/i18n";
import { File, Item } from "@/types";
import { createStore } from "vuex";

type Identifier = {
  use?: string;
  system?: string;
  value?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: {
    coding?: {
      system?: string;
      version?: string;
      code?: string;
      display?: string;
      userSelected?: boolean;
    };
    text?: string;
  };
};

export type Questionnaire = {
  language: Language;
  identifier?: Identifier[];
  url?: string;
  name?: string;
  version?: string;
  title?: string;
  status: "draft" | "active" | "retired" | "unknown";
  publisher?: string;
  date?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  experimental?: Boolean;
  item: Item[];
  resourceType: "Questionnaire";
};

// TODO: If fallback locale is needed, i18n should not log to console
export const defaultQuestionnaire = (lang: Language): Questionnaire => {
  const locale: Locale = lang as Locale;
  const name = i18n.global.t(
    "store.questionnaire.name",
    {},
    { locale: locale },
  );
  return {
    language: lang,
    identifier: [],
    url: "https://num-compass.science/de/",
    name: name,
    title: name,
    version: "1.0",
    status: "draft",
    publisher: "",
    date: "",
    approvalDate: "",
    lastReviewDate: "",
    experimental: true,
    item: [],
    resourceType: "Questionnaire",
  };
};

const qI: Questionnaire = defaultQuestionnaire(usedLocale);

const q: Item = {
  __active: false,
  __icon: "",
  __internalID: "",
  __linkId: "",
  __newQuestion: true,
  __newDefinition: true,
  __OldAnswerValueSet: "",
  __answerValueSetCheck: false,
  linkId: "",
  text: "",
  definition: "",
  type: "group",
  item: [],
};

const fI: File = {
  // Used as name of the Questionnaire
  name: "",
  file: new Blob(),
};

export const languages = ["de", "en", "es"] as const;
export type Language = typeof languages[number];
export const isSupportedLanguage = (lang: string): lang is Language => {
  return languages.includes(lang as Language);
};

export type StoreState = {
  questionnaire: Item;
  questionnaireImported: Questionnaire;
  questionnaireRepo: Map<Language, Questionnaire>;
  language: Language;
  secondaryItemSelected: {};
  fileImported: File;
  settings: {
    answers: {
      answersValueset: boolean;
      openChoice: boolean;
      choice: boolean;
    };
  };
};

const store = createStore<StoreState>({
  state: {
    questionnaire: q, // Only used in MainItems, can be deleted?
    secondaryItemSelected: {}, // Only in MainItem, SecondaryItem, ...
    questionnaireImported: qI,
    language: qI.language,
    questionnaireRepo: new Map([[qI.language, qI]]),
    fileImported: fI,
    settings: {
      answers: {
        answersValueset: false,
        openChoice: true,
        choice: true,
      },
    },
  },
  mutations: {
    switchQuestionnaireByLang(state, payload: Language): void {
      let qre;
      if (state.questionnaireRepo.has(payload)) {
        qre = state.questionnaireRepo.get(payload) as Questionnaire;
        state.questionnaireImported = qre;
      } else {
        qre = defaultQuestionnaire(payload);
        state.questionnaireRepo.set(payload, qre);
        state.questionnaireImported = qre;
      }
      state.language = payload;
    },
    //metaData
    // in cxNavbar
    setNameofQuestionnaireNEW(state) {
      state.fileImported.name = `${i18n.global.t(
        "store.questionnaire.name",
      )}.json`;
    },
    setVersion(state, payload) {
      state.questionnaireImported.version = payload;
    },
    setIdentifier(state, payload) {
      state.questionnaireImported.identifier = payload;
    },
    setURL(state, payload) {
      state.questionnaireImported.url = payload;
    },
    setName(state, payload) {
      state.questionnaireImported.name = payload;
    },
    setTitle(state, payload) {
      state.questionnaireImported.title = payload;
    },
    setDate(state, payload) {
      state.questionnaireImported.date = payload;
    },
    setStatus(state, payload) {
      state.questionnaireImported.status = payload;
    },
    setPublisher(state, payload) {
      state.questionnaireImported.publisher = payload;
    },
    setApprovalDate(state, payload) {
      state.questionnaireImported.approvalDate = payload;
    },
    setLastReviewDate(state, payload) {
      state.questionnaireImported.lastReviewDate = payload;
    },
    setExperimental(state, payload) {
      state.questionnaireImported.experimental = payload;
    },
    //Settings
    setAnswerValueSet(state, payload) {
      state.settings.answers.answersValueset = payload;
    },
    setOpenChoice(state, payload) {
      state.settings.answers.openChoice = payload;
    },
    setChoice(state, payload) {
      state.settings.answers.choice = payload;
    },
    setSecondItemSelected(state, payload = {}) {
      state.secondaryItemSelected = payload;
    },
    setQuestionnaireImportedJSON(state: StoreState, payload: Questionnaire) {
      state.language = payload.language;
      state.questionnaireImported = payload;
      state.questionnaireRepo.set(payload.language, payload);
    },
    // in ImportScreen, cxNavbar but not used?
    setFileImported(state, payload = {}) {
      state.fileImported = payload;
    },
    resetQuestionnaire(state) {
      state.questionnaire = {
        __active: false,
        __icon: "",
        __internalID: "",
        __linkId: "",
        __newQuestion: true,
        __newDefinition: true,
        __OldAnswerValueSet: "",
        __answerValueSetCheck: false,
        linkId: "",
        text: "",
        definition: "",
        type: "group",
        item: [],
      };
      const language = state.questionnaireImported.language || usedLocale;
      state.questionnaireImported = defaultQuestionnaire(language);
      state.questionnaireRepo.set(language, state.questionnaireImported);
      state.secondaryItemSelected = {};
      state.fileImported = {
        name: "",
        file: new Blob(),
      };
    },
  },
  actions: {
    async uploadJSONQuestionnaire(
      { commit },
      payload: Questionnaire,
    ): Promise<void> {
      await commit("setQuestionnaireImportedJSON", payload);
    },
  },
  modules: {},
  getters: {
    getLanguage(state) {
      return state.language;
    },
    //Settings
    getAnswerValueSet(state) {
      return state.settings.answers.answersValueset;
    },
    getOpenChoice(state) {
      return state.settings.answers.openChoice;
    },
    getChoice(state) {
      return state.settings.answers.choice;
    },
    getMainItem(state) {
      return state.questionnaire.item;
    },
    getQuestionnaireImportedJSON(state): Questionnaire {
      if (!state.questionnaireImported) {
        state.questionnaireImported = defaultQuestionnaire(usedLocale);
        state.questionnaireRepo.set(usedLocale, state.questionnaireImported);
      } else if (!state.questionnaireImported.item) {
        state.questionnaireImported.item = [];
      }
      return state.questionnaireImported;
    },
    getVersionQuestionnaire(state) {
      if (state.questionnaireImported.version === undefined) {
        state.questionnaireImported.version = "";
      }
      return state.questionnaireImported.version;
    },
    getFileImported(state) {
      return state.fileImported;
    },
    getNameofQuestionnaire(state) {
      if (state?.fileImported?.name)
        return state.fileImported.name.split(".json")[0];
      else return "";
    },
  },
});

export default store;
