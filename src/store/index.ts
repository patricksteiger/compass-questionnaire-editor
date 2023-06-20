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
  selectedItem: Item | undefined;
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
  setSelectedItem(state: StoreState, item: Item | undefined): void {
    state.selectedItem = item;
  },
};

const languageMutations = {
  switchQuestionnaireByLang(state: StoreState, payload: Language): void {
    const qre = state.questionnaireRepo.get(payload);
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
      const questionnaires: Questionnaire[] = [
        ...state.questionnaireRepo.values(),
      ];
      const otherQRE = questionnaires.find((qre) => qre.language !== payload);
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
    selectedItem: undefined,
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
