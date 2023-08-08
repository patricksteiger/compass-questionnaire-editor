import { defaultLanguage, i18n, getLocaleFromLanguage } from "@/i18n";
import {
  Identifier,
  Item,
  Meta,
  Narrative,
  NarrativeStatus,
  Questionnaire,
  Status,
} from "@/types";
import { languageTools } from "@/utils/language";
import { questionnaireTools } from "@/utils/questionnaire";
import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

export const getDefaultQuestionnaire = (lang: Language): Questionnaire => {
  const locale = getLocaleFromLanguage(lang);
  const name = i18n.global.t("store.questionnaire.name", {}, { locale });
  const meta: Meta = {
    profile: [],
    security: [],
    tag: [],
  };
  const text: Narrative = {
    status: "generated",
    div: "",
  };
  return {
    __versionAlgorithmUsesCoding: true,
    language: lang,
    meta,
    text,
    identifier: [],
    url: "https://num-compass.science/de/",
    name: name.replace(" ", ""),
    title: name,
    derivedFrom: [],
    _derivedFrom: [],
    contact: [],
    useContext: [],
    version: "1.0",
    status: "draft",
    publisher: "",
    date: "",
    approvalDate: "",
    lastReviewDate: "",
    effectivePeriod: {},
    experimental: true,
    code: [],
    subjectType: [],
    modifierExtension: [],
    item: [],
    resourceType: "Questionnaire",
  };
};

const defaultQuestionnaire = getDefaultQuestionnaire(defaultLanguage);

export const languages = ["de", "en", "es", "fr"] as const;
export type Language = (typeof languages)[number];
export const isSupportedLanguage = (lang: string): lang is Language => {
  return languages.includes(lang as Language);
};

// Init is used for the first switch from "/"-path to "import"-path in router.
// Switching between screens is done when creating Screen-components (see ImportScreen, EditorScreen)
export type Screen = "init" | "import" | "editor";

export type StoreState = {
  questionnaire: Questionnaire;
  selectedItem: Item | undefined;
  questionnaireRepo: Questionnaire[];
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
  setTextStatus(state: StoreState, payload: NarrativeStatus) {
    state.questionnaire.text.status = payload;
  },
  setTextDiv(state: StoreState, payload: string) {
    state.questionnaire.text.div = payload;
  },
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
  setId(state: StoreState, payload: string) {
    state.questionnaire.id = payload;
  },
  setVersionId(state: StoreState, payload: string) {
    state.questionnaire.meta.versionId = payload;
  },
  setLastUpdated(state: StoreState, payload: string) {
    state.questionnaire.meta.lastUpdated = payload;
  },
  setSource(state: StoreState, payload: string) {
    state.questionnaire.meta.source = payload;
  },
  setImplicitRules(state: StoreState, payload: string) {
    state.questionnaire.implicitRules = payload;
  },
  setExperimental(state: StoreState, payload: boolean) {
    state.questionnaire.experimental = payload;
  },
  setCopyrightLabel(state: StoreState, payload: string | undefined) {
    state.questionnaire.copyrightLabel = payload;
  },
  setCopyright(state: StoreState, payload: string | undefined) {
    state.questionnaire.copyright = payload;
  },
};

const setQuestionnaireMutations = {
  setNewEmptyQuestionnaire(state: StoreState): void {
    const qre = getDefaultQuestionnaire(defaultLanguage);
    state.questionnaire = qre;
    state.questionnaireRepo = [qre];
    state.selectedItem = undefined;
  },
  setQuestionnaireBundle(state: StoreState, payload: Questionnaire[]): void {
    if (payload.length === 0) {
      console.error("Can't set empty questionnaire-bundle");
      return;
    }
    state.questionnaire = payload[0];
    state.questionnaireRepo = payload;
    state.selectedItem = undefined;
  },
  resetQuestionnaire(state: StoreState): void {
    const language = state.questionnaire.language || defaultLanguage;
    state.questionnaire = getDefaultQuestionnaire(language);
    state.questionnaireRepo = [state.questionnaire];
    state.selectedItem = undefined;
  },
  setSelectedItem(state: StoreState, item: Item | undefined): void {
    state.selectedItem = item;
  },
};

const languageMutations = {
  switchQuestionnaireByLang(state: StoreState, payload: Language): void {
    const qre = state.questionnaireRepo.find((qre) => qre.language === payload);
    if (qre === undefined) {
      console.error(`Language ${payload} does not exist!`);
      return;
    }
    if (state.selectedItem !== undefined) {
      const switchSelectedItem = questionnaireTools.getItemByInternalLinkId(
        state.selectedItem.__linkId,
        qre,
      );
      state.selectedItem = switchSelectedItem;
    }
    state.questionnaire = qre;
  },
  removeLanguage(state: StoreState, payload: Language): void {
    if (state.questionnaire.language === payload) {
      const otherQRE = state.questionnaireRepo.find(
        (qre) => qre.language !== payload,
      );
      if (otherQRE === undefined) {
        console.error(`Can't delete the last questionnaire!`);
        return;
      }
      if (state.selectedItem !== undefined) {
        const switchSelectedItem = questionnaireTools.getItemByInternalLinkId(
          state.selectedItem.__linkId,
          otherQRE,
        );
        state.selectedItem = switchSelectedItem;
      }
      state.questionnaire = otherQRE;
    }
    state.questionnaireRepo = state.questionnaireRepo.filter(
      (qre) => qre.language !== payload,
    );
  },
  addLanguage(state: StoreState, payload: Language): void {
    if (
      state.questionnaireRepo.find((qre) => qre.language === payload) !==
      undefined
    ) {
      console.error(`Language ${payload} already exists!`);
      return;
    }
    const newQRE = languageTools.createCloneForLang(
      state.questionnaire,
      payload,
    );
    state.questionnaireRepo.push(newQRE);
  },
};

// TODO: Add Zod-schema for better validation?
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  restoreState: (key, store) => {
    try {
      const value = store!.getItem(key);
      if (!value) return undefined;
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch (e) {
      return undefined;
    }
  },
});

export const store = createStore<StoreState>({
  plugins: [vuexLocal.plugin],
  state: {
    questionnaire: defaultQuestionnaire,
    selectedItem: undefined,
    questionnaireRepo: [],
    currentScreen: "init",
  },
  mutations: {
    ...setQuestionnaireMutations,
    ...languageMutations,
    ...metadataMutations,
    ...screenMutations,
    refreshState(state): void {
      const currentQre = state.questionnaireRepo.find(
        (qre) => qre.language === state.questionnaire.language,
      );
      if (currentQre === undefined) {
        if (state.questionnaireRepo.length > 0) {
          state.questionnaire = state.questionnaireRepo[0];
          console.warn("State refresh had incorrect values!");
        } else {
          console.error("State refresh failed!");
          state.questionnaire = getDefaultQuestionnaire(defaultLanguage);
          state.questionnaireRepo = [state.questionnaire];
          state.selectedItem = undefined;
          // refreshState is only called in EditorScreen
          state.currentScreen = "editor";
          return;
        }
      } else {
        state.questionnaire = currentQre;
      }
      if (state.selectedItem !== undefined) {
        state.selectedItem = questionnaireTools.getItemByInternalLinkId(
          state.selectedItem.__linkId,
          state.questionnaire,
        );
      }
    },
  },
  actions: {},
  modules: {},
  getters: {
    getQuestionnaires(state): Questionnaire[] {
      return state.questionnaireRepo;
    },
    getUsedLanguages(state): Language[] {
      return state.questionnaireRepo.map((qre) => qre.language);
    },
    getUnusedLanguages(state): Language[] {
      return languages.filter(
        (lang) => !state.questionnaireRepo.find((qre) => qre.language === lang),
      );
    },
    getLanguage(state): Language {
      return state.questionnaire.language;
    },
    getQuestionnaireImportedJSON(state): Questionnaire {
      return state.questionnaire;
    },
    getSelectedItem(state): Item | undefined {
      return state.selectedItem;
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
    getId(state): string | undefined {
      return state.questionnaire.id;
    },
    getExperimental(state): boolean {
      return state.questionnaire.experimental;
    },
    getPublisher(state): string | undefined {
      return state.questionnaire.publisher;
    },
    getPurpose(state): string | undefined {
      return state.questionnaire.purpose;
    },
    getDescription(state): string | undefined {
      return state.questionnaire.description;
    },
  },
});
