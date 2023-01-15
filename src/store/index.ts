import { usedLocale, Locale, i18n } from "@/i18n";
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
  language: Locale;
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

const qI: Questionnaire = {
  language: usedLocale,
  identifier: [],
  url: "",
  name: "",
  version: "",
  title: "",
  status: "unknown",
  publisher: "",
  date: "",
  approvalDate: "",
  lastReviewDate: "",
  experimental: true,
  item: [],
  resourceType: "Questionnaire",
};

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

export type StoreState = {
  questionnaire: Item;
  questionnaireImported: Questionnaire;
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

const store = createStore({
  state: {
    questionnaire: q, // Only used in MainItems, can be deleted?
    secondaryItemSelected: {}, // Only in MainItem, SecondaryItem, ...
    questionnaireImported: qI,
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
    setQuestionnaireImportedJSON(state, payload = {}) {
      state.questionnaireImported = payload;
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
      state.questionnaireImported = {
        language: usedLocale,
        identifier: [],
        url: "",
        name: "",
        version: "",
        title: "",
        status: "unknown",
        publisher: "",
        date: "",
        approvalDate: "",
        lastReviewDate: "",
        experimental: true,
        item: [],
        resourceType: "Questionnaire",
      };
      state.secondaryItemSelected = {};
      state.fileImported = {
        name: "",
        file: new Blob(),
      };
    },
  },
  actions: {
    async uploadJSONQuestionnaire({ commit }, payload) {
      await commit("setQuestionnaireImportedJSON", payload);
    },
  },
  modules: {},
  getters: {
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
        state.questionnaireImported = {
          language: usedLocale,
          identifier: [],
          url: "",
          name: "",
          version: "",
          title: "",
          status: "unknown",
          publisher: "",
          date: "",
          approvalDate: "",
          lastReviewDate: "",
          experimental: true,
          resourceType: "Questionnaire",
          item: [],
        };
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
