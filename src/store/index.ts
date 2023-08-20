import { defaultLanguage, i18n, getLocaleFromLanguage } from "@/i18n";
import {
  Coding,
  ContactDetail,
  Extension,
  Item,
  Meta,
  Narrative,
  NarrativeStatus,
  Identifier,
  Questionnaire,
  Status,
  UsageContext,
} from "@/types";
import {
  getVersionAlgorithmCoding,
  VersionAlgorithmCode,
} from "@/utils/constants";
import { languageTools } from "@/utils/language";
import { questionnaireTools } from "@/utils/questionnaire";
import { createStore } from "vuex";
import VuexPersister from "vuex-persister";

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
    extension: [],
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

export type Tab = "items" | "elements" | "advanced";

export type StoreState = {
  questionnaire: Questionnaire;
  selectedItem: Item | undefined;
  questionnaireRepo: Questionnaire[];
  currentScreen: Screen;
  currentTab: Tab;
};

const screenMutations = {
  switchToEditorScreen(state: StoreState): void {
    state.currentScreen = "editor";
  },
  switchToImportScreen(state: StoreState): void {
    state.currentScreen = "import";
  },
  switchToItemsTab(state: StoreState): void {
    state.currentTab = "items";
  },
  switchToElementsTab(state: StoreState): void {
    state.currentTab = "elements";
  },
  switchToAdvancedTab(state: StoreState): void {
    state.currentTab = "advanced";
  },
};

const primaryMutations = {
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
  addIdentifier(state: StoreState, payload: Identifier) {
    state.questionnaire.identifier.push(payload);
  },
  removeIdentifier(state: StoreState, index: number) {
    state.questionnaire.identifier.splice(index, 1);
  },
  addExtension(state: StoreState, payload: Extension) {
    state.questionnaire.extension.push(payload);
  },
  removeExtension(state: StoreState, index: number) {
    state.questionnaire.extension.splice(index, 1);
  },
  addModifierExtension(state: StoreState, payload: Extension) {
    state.questionnaire.modifierExtension.push(payload);
  },
  removeModifierExtension(state: StoreState, index: number) {
    state.questionnaire.modifierExtension.splice(index, 1);
  },
  updateVersionAlgorithmCoding(
    state: StoreState,
    code: VersionAlgorithmCode | null,
  ) {
    if (code === null) {
      state.questionnaire.versionAlgorithmCoding = undefined;
    } else {
      const coding = getVersionAlgorithmCoding(code);
      state.questionnaire.versionAlgorithmCoding = coding;
    }
  },
  updateVersionAlgorithmString(state: StoreState, str: string | number | null) {
    if (str === null) {
      state.questionnaire.versionAlgorithmString = undefined;
    } else if (typeof str === "number") {
      state.questionnaire.versionAlgorithmString = str.toString();
    } else {
      state.questionnaire.versionAlgorithmString = str;
    }
  },
  addUseContext(state: StoreState, payload: UsageContext) {
    state.questionnaire.useContext.push(payload);
  },
  removeUseContext(state: StoreState, index: number) {
    state.questionnaire.useContext.splice(index, 1);
  },
  addProfile(state: StoreState, profile: string) {
    state.questionnaire.meta.profile.push(profile);
  },
  removeProfileAt(state: StoreState, index: number) {
    state.questionnaire.meta.profile.splice(index, 1);
  },
  clearProfileAt(state: StoreState, index: number) {
    state.questionnaire.meta.profile[index] = "";
  },
  addSecurity(state: StoreState, security: Coding) {
    state.questionnaire.meta.security.push(security);
  },
  removeSecurityAt(state: StoreState, index: number) {
    state.questionnaire.meta.security.splice(index, 1);
  },
  addTag(state: StoreState, tag: Coding) {
    state.questionnaire.meta.tag.push(tag);
  },
  removeTagAt(state: StoreState, index: number) {
    state.questionnaire.meta.tag.splice(index, 1);
  },
  addEmptyDerivedFrom(state: StoreState) {
    state.questionnaire.derivedFrom.push("");
    const ext = questionnaireTools.getDerivedFromExtension(null);
    state.questionnaire._derivedFrom.push(ext);
  },
  removeDerivedFrom(state: StoreState, index: number) {
    state.questionnaire.derivedFrom.splice(index, 1);
    state.questionnaire._derivedFrom.splice(index, 1);
  },
  addPatientSubjectType(state: StoreState) {
    state.questionnaire.subjectType.push("Patient");
  },
  removeSubjectType(state: StoreState, index: number) {
    state.questionnaire.subjectType.splice(index, 1);
  },
  addContactDetail(state: StoreState, payload: ContactDetail) {
    state.questionnaire.contact.push(payload);
  },
  removeContactDetail(state: StoreState, index: number) {
    state.questionnaire.contact.splice(index, 1);
  },
};

const itemMutations = {
  setText(state: StoreState, payload: string) {
    state.selectedItem!.text = payload;
  },
  setPrefix(state: StoreState, payload: string) {
    state.selectedItem!.prefix = payload;
  },
  setRepeats(state: StoreState, payload: boolean) {
    state.selectedItem!.repeats = payload;
  },
  setRequired(state: StoreState, payload: boolean) {
    state.selectedItem!.required = payload;
  },
  setReadOnly(state: StoreState, payload: boolean) {
    state.selectedItem!.readOnly = payload;
  },
};

const setQuestionnaireMutations = {
  setNewEmptyQuestionnaire(state: StoreState): void {
    const qre = getDefaultQuestionnaire(defaultLanguage);
    state.questionnaire = qre;
    state.questionnaireRepo = [qre];
    state.selectedItem = undefined;
    state.currentTab = "items";
  },
  setQuestionnaireBundle(state: StoreState, payload: Questionnaire[]): void {
    if (payload.length === 0) {
      console.error("Can't set empty questionnaire-bundle");
      return;
    }
    state.questionnaire = payload[0];
    state.questionnaireRepo = payload;
    state.selectedItem = undefined;
    state.currentTab = "items";
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

const vuexPersister = new VuexPersister({
  key: "editor-state",
  overwrite: false,
  storage: localStorage,
});

export const store = createStore<StoreState>({
  plugins: [vuexPersister.persist],
  state: {
    questionnaire: defaultQuestionnaire,
    selectedItem: undefined,
    questionnaireRepo: [],
    currentScreen: "init",
    currentTab: "items",
  },
  mutations: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    saveState(state: StoreState) {
      // Calling a mutation persists state with VuexPersister.
    },
    ...setQuestionnaireMutations,
    ...languageMutations,
    ...primaryMutations,
    ...screenMutations,
    ...itemMutations,
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
