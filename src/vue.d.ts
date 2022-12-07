import { ComponentCustomProperties } from "vue";
import { Store } from "vuex"; // path to store file

declare module "@vue/runtime-core" {
  interface StoreType {
    questionnaire: Object;
    questionnaireImported: Object;
    secondaryItemSelected: Object;
    fileImported: Object;
    settings: {
      answers: {
        answersValueset: Boolean;
        openChoice: Boolean;
        choice: Boolean;
      };
    };
  }

  interface ComponentCustomProperties {
    $store: Store<StoreType>;
    i18n: any;
  }
}
