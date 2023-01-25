import { defaultLanguage, i18n, getLocaleFromLanguage } from "@/i18n";
import { File, Questionnaire } from "@/types";
import { createStore } from "vuex";

export const defaultQuestionnaire = (lang: Language): Questionnaire => {
  const locale = getLocaleFromLanguage(lang);
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

const qI: Questionnaire = defaultQuestionnaire(defaultLanguage);

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

export type Settings = {
  answers: {
    answersValueset: boolean;
    openChoice: boolean;
    choice: boolean;
  };
};

export type StoreState = {
  questionnaireImported: Questionnaire;
  questionnaireRepo: Map<Language, Questionnaire>;
  language: Language;
  fileImported: File;
  settings: Settings;
};

const store = createStore<StoreState>({
  state: {
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
      let qre = state.questionnaireRepo.get(payload);
      if (qre === undefined) {
        qre = defaultQuestionnaire(payload);
        state.questionnaireRepo.set(qre.language, qre);
      }
      state.questionnaireImported = qre;
      state.language = qre.language;
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
    setQuestionnaireImportedJSON(state: StoreState, payload: Questionnaire) {
      state.language = payload.language;
      state.questionnaireImported = payload;
      state.questionnaireRepo.set(payload.language, payload);
    },
    setFileImported(state, payload = {}) {
      state.fileImported = payload;
    },
    // TODO: Only used to go back to Import: current QRE irrelevant?
    // createNewEmptyQRE-method used instead coming from EditorScreen?
    resetQuestionnaire(state) {
      const language = state.questionnaireImported.language || defaultLanguage;
      state.questionnaireImported = defaultQuestionnaire(language);
      state.questionnaireRepo.set(language, state.questionnaireImported);
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
    getQuestionnaireImportedJSON(state): Questionnaire {
      if (!state.questionnaireImported) {
        state.questionnaireImported = defaultQuestionnaire(defaultLanguage);
        state.questionnaireRepo.set(
          defaultLanguage,
          state.questionnaireImported,
        );
      } else if (!state.questionnaireImported.item) {
        state.questionnaireImported.item = [];
      }
      return state.questionnaireImported;
    },
    getVersionQuestionnaire(state) {
      state.questionnaireImported.version ??= "";
      return state.questionnaireImported.version;
    },
    getFileImported(state) {
      return state.fileImported;
    },
    getNameofQuestionnaire(state) {
      return state?.fileImported?.name
        ? state.fileImported.name.split(".json")[0]
        : "";
    },
  },
});

export default store;
