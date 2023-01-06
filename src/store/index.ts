import { createStore } from "vuex";

// state.questionnaireImported = {
//   identifier: [],
//   url: "",
//   name: "",
//   version: "",
//   title: "",
//   status: "unknown",
//   publisher: "",
//   date: "",
//   approvalDate: "",
//   lastReviewDate: "",
//   experimental: true,
//   resourceType: "Questionnaire",
//   item: [],
// };
type Identifier = {
  use: string;
  system: string;
  value: string;
  period: {
    start: string;
    end: string;
  };
  type: {
    coding: {
      system: string;
      version: string;
      code: string;
      display: string;
      userSelected: boolean;
    };
    text: string;
  };
};

export type ImportedQuestionnaire = {
  identifier: Identifier[];
  url: string;
  name: string;
  version: string;
  title: string;
  status: "draft" | "active" | "retired" | "unknown";
  publisher: string;
  date: string;
  approvalDate: string;
  lastReviewDate: string;
  experimental: Boolean;
  item: object[];
  resourceType: string;
};

const qI: ImportedQuestionnaire = {
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

const store = createStore({
  state: {
    questionnaire: {
      item: {},
    },
    questionnaireImported: qI,
    secondaryItemSelected: {},
    fileImported: {
      name: "",
    },
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
    setNameofQuestionnaireNEW(state) {
      state.fileImported.name = "New Questionnaire.json";
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
    setFileImported(state, payload = {}) {
      state.fileImported = payload;
    },
    resetQuestionnaire(state) {
      state.questionnaire = { item: {} };
      state.questionnaireImported = {
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
        resourceType: "",
      };
      state.secondaryItemSelected = {};
      state.fileImported = {
        name: "",
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
    getQuestionnaireImportedJSON(state): ImportedQuestionnaire {
      if (!state.questionnaireImported) {
        state.questionnaireImported = {
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
