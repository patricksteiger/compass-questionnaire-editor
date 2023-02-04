import { defaultLanguage, i18n, getLocaleFromLanguage } from "@/i18n";
import { File, Questionnaire } from "@/types";
import { languageTools } from "@/utils/language";
import { createStore } from "vuex";

export const getDefaultQuestionnaire = (lang: Language): Questionnaire => {
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

const defaultQuestionnaire = getDefaultQuestionnaire(defaultLanguage);

const emptyFile: File = {
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
    answerValueSet: boolean;
    openChoice: boolean;
    choice: boolean;
  };
};

export type StoreState = {
  questionnaire: Questionnaire;
  questionnaireRepo: Map<Language, Questionnaire>;
  importedFile: File;
  settings: Settings;
};

const store = createStore<StoreState>({
  state: {
    questionnaire: defaultQuestionnaire,
    questionnaireRepo: new Map(),
    importedFile: emptyFile,
    settings: {
      answers: {
        answerValueSet: false,
        openChoice: true,
        choice: true,
      },
    },
  },
  mutations: {
    switchQuestionnaireByLang(state, payload: Language): void {
      const qre = state.questionnaireRepo.get(payload);
      if (qre === undefined) {
        console.error(`Language ${payload} does not exist!`);
        return;
      }
      state.questionnaire = qre;
    },
    removeLanguage(state, payload: Language): void {
      if (state.questionnaire.language === payload) {
        const questionnaires: Questionnaire[] = [
          ...state.questionnaireRepo.values(),
        ];
        const otherQRE = questionnaires.find((qre) => qre.language !== payload);
        if (otherQRE === undefined) {
          console.error(`Can't delete the last questionnaire!`);
          return;
        }
        state.questionnaire = otherQRE;
      }
      state.questionnaireRepo.delete(payload);
    },
    addLanguage(state, payload: Language): void {
      if (state.questionnaireRepo.has(payload)) {
        console.error(`Language ${payload} already exists!`);
        return;
      }
      const newQRE = languageTools.createCloneForLang(
        state.questionnaire,
        payload,
      );
      state.questionnaireRepo.set(newQRE.language, newQRE);
    },
    setNewEmptyQuestionnaire(state) {
      const qre = getDefaultQuestionnaire(defaultLanguage);
      state.questionnaire = qre;
      state.questionnaireRepo.clear();
      state.questionnaireRepo.set(qre.language, qre);
      state.importedFile.name = `${i18n.global.t(
        "store.questionnaire.name",
      )}.json`;
      state.importedFile.file = new Blob();
      state.settings.answers.answerValueSet = false;
      state.settings.answers.openChoice = true;
      state.settings.answers.choice = true;
    },
    //metaData
    // in cxNavbar
    setNameofQuestionnaireNEW(state) {
      state.importedFile.name = `${i18n.global.t(
        "store.questionnaire.name",
      )}.json`;
    },
    setVersion(state, payload) {
      state.questionnaire.version = payload;
    },
    setIdentifier(state, payload) {
      state.questionnaire.identifier = payload;
    },
    setURL(state, payload) {
      state.questionnaire.url = payload;
    },
    setName(state, payload) {
      state.questionnaire.name = payload;
    },
    setTitle(state, payload) {
      state.questionnaire.title = payload;
    },
    setDate(state, payload) {
      state.questionnaire.date = payload;
    },
    setStatus(state, payload) {
      state.questionnaire.status = payload;
    },
    setPublisher(state, payload) {
      state.questionnaire.publisher = payload;
    },
    setApprovalDate(state, payload) {
      state.questionnaire.approvalDate = payload;
    },
    setLastReviewDate(state, payload) {
      state.questionnaire.lastReviewDate = payload;
    },
    setExperimental(state, payload) {
      state.questionnaire.experimental = payload;
    },
    //Settings
    setAnswerValueSet(state, payload) {
      state.settings.answers.answerValueSet = payload;
    },
    setOpenChoice(state, payload) {
      state.settings.answers.openChoice = payload;
    },
    setChoice(state, payload) {
      state.settings.answers.choice = payload;
    },
    // Used for imported files?
    setQuestionnaireImportedJSON(state: StoreState, payload: Questionnaire) {
      state.questionnaire = payload;
      state.questionnaireRepo.set(payload.language, payload);
    },
    setFileImported(state, payload: File) {
      state.importedFile = payload;
    },
    // TODO: Only used to go back to Import: current QREs should be reset?
    // createNewEmptyQRE-method used instead coming from EditorScreen?
    resetQuestionnaire(state) {
      const language = state.questionnaire.language || defaultLanguage;
      state.questionnaire = getDefaultQuestionnaire(language);
      state.questionnaireRepo.set(language, state.questionnaire);
      state.importedFile = {
        name: "",
        file: new Blob(),
      };
    },
  },
  actions: {},
  modules: {},
  getters: {
    getQuestionnaires(state): Questionnaire[] {
      return [...state.questionnaireRepo.values()];
    },
    getUsedLanguages(state): Language[] {
      return [...state.questionnaireRepo.keys()];
    },
    getLanguage(state) {
      return state.questionnaire.language;
    },
    //Settings
    getAnswerValueSet(state) {
      return state.settings.answers.answerValueSet;
    },
    getOpenChoice(state) {
      return state.settings.answers.openChoice;
    },
    getChoice(state) {
      return state.settings.answers.choice;
    },
    getQuestionnaireImportedJSON(state): Questionnaire {
      return state.questionnaire;
    },
    getVersionQuestionnaire(state) {
      state.questionnaire.version ??= "";
      return state.questionnaire.version;
    },
    getFileImported(state) {
      return state.importedFile;
    },
    getNameofQuestionnaire(state) {
      return state?.importedFile?.name
        ? state.importedFile.name.split(".json")[0]
        : "";
    },
  },
});

export default store;
