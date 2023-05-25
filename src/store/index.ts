import { defaultLanguage, i18n, getLocaleFromLanguage } from "@/i18n";
import { Identifier, Questionnaire, Status } from "@/types";
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
    __versionAlgorithmUsesCoding: true,
    language: lang,
    identifier: [],
    url: "https://num-compass.science/de/",
    name: name.replace(" ", ""),
    title: name,
    derivedFrom: [],
    contact: [],
    version: "1.0",
    status: "draft",
    publisher: "",
    date: "",
    approvalDate: "",
    lastReviewDate: "",
    effectivePeriod: {},
    experimental: null,
    code: [],
    subjectType: [],
    item: [],
    resourceType: "Questionnaire",
  };
};

const defaultQuestionnaire = getDefaultQuestionnaire(defaultLanguage);

export const languages = ["de", "en", "es", "fr"] as const;
export type Language = typeof languages[number];
export const isSupportedLanguage = (lang: string): lang is Language => {
  return languages.includes(lang as Language);
};

// Init is used for the first switch from "/"-path to "import"-path in router.
// Switching between screens is done when creating Screen-components (see ImportScreen, EditorScreen)
export type Screen = "init" | "import" | "editor";

export type StoreState = {
  questionnaire: Questionnaire;
  questionnaireRepo: Map<Language, Questionnaire>;
  currentScreen: Screen;
};

const screenMutations = {
  switchToEditorScreen(state: StoreState): void {
    state.currentScreen = "editor";
  },
  switchToImportScreen(state: StoreState): void {
    state.currentScreen = "import";
  },
};

const metadataMutations = {
  setVersion(state: StoreState, payload: string) {
    state.questionnaire.version = payload;
  },
  setIdentifier(state: StoreState, payload: Identifier[]) {
    state.questionnaire.identifier = payload;
  },
  setURL(state: StoreState, payload: string) {
    state.questionnaire.url = payload;
  },
  setName(state: StoreState, payload: string) {
    state.questionnaire.name = payload;
  },
  setTitle(state: StoreState, payload: string) {
    state.questionnaire.title = payload;
  },
  setDate(state: StoreState, payload: string) {
    state.questionnaire.date = payload;
  },
  setStatus(state: StoreState, payload: Status) {
    state.questionnaire.status = payload;
  },
  setPublisher(state: StoreState, payload: string) {
    state.questionnaire.publisher = payload;
  },
  setDescription(state: StoreState, payload: string) {
    state.questionnaire.description = payload;
  },
  setPurpose(state: StoreState, payload: string) {
    state.questionnaire.purpose = payload;
  },
  setApprovalDate(state: StoreState, payload: string) {
    state.questionnaire.approvalDate = payload;
  },
  setLastReviewDate(state: StoreState, payload: string) {
    state.questionnaire.lastReviewDate = payload;
  },
  setExperimental(state: StoreState, payload: boolean | null) {
    state.questionnaire.experimental = payload;
  },
};

const setQuestionnaireMutations = {
  setNewEmptyQuestionnaire(state: StoreState): void {
    const qre = getDefaultQuestionnaire(defaultLanguage);
    state.questionnaire = qre;
    state.questionnaireRepo.clear();
    state.questionnaireRepo.set(qre.language, qre);
  },
  setQuestionnaireBundle(state: StoreState, payload: Questionnaire[]): void {
    if (payload.length === 0) {
      console.error("Can't set empty questionnaires");
      return;
    }
    state.questionnaire = payload[0];
    state.questionnaireRepo.clear();
    for (const qre of payload) {
      state.questionnaireRepo.set(qre.language, qre);
    }
  },
  resetQuestionnaire(state: StoreState): void {
    const language = state.questionnaire.language || defaultLanguage;
    state.questionnaire = getDefaultQuestionnaire(language);
    state.questionnaireRepo.clear();
    state.questionnaireRepo.set(language, state.questionnaire);
  },
};

const languageMutations = {
  switchQuestionnaireByLang(state: StoreState, payload: Language): void {
    const qre = state.questionnaireRepo.get(payload);
    if (qre === undefined) {
      console.error(`Language ${payload} does not exist!`);
      return;
    }
    state.questionnaire = qre;
  },
  removeLanguage(state: StoreState, payload: Language): void {
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
  addLanguage(state: StoreState, payload: Language): void {
    if (state.questionnaireRepo.has(payload)) {
      console.error(`Language ${payload} already exists!`);
      return;
    }
    const newQRE = languageTools.createCloneForLang(
      state.questionnaire,
      payload,
    );
    state.questionnaireRepo.set(payload, newQRE);
  },
};

export const store = createStore<StoreState>({
  state: {
    questionnaire: defaultQuestionnaire,
    questionnaireRepo: new Map(),
    currentScreen: "init",
  },
  mutations: {
    ...setQuestionnaireMutations,
    ...languageMutations,
    ...metadataMutations,
    ...screenMutations,
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
    getLanguage(state): Language {
      return state.questionnaire.language;
    },
    getQuestionnaireImportedJSON(state): Questionnaire {
      return state.questionnaire;
    },
    getCurrentScreen(state): Screen {
      return state.currentScreen;
    },
    getNameOfQuestionnaire(state) {
      return (
        state.questionnaire.title ||
        i18n.global.t("store.questionnaire.noTitle")
      );
    },
  },
});
