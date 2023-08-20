<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="items" :label="$t('views.tabsTitles.items')" />
    <q-tab name="elements" :label="$t('views.tabsTitles.elements')" />
    <q-tab name="advanced" :label="$t('views.tabsTitles.advanced')" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="items">
      <cxEditorItems
        v-on:switchToElements="switchToElements"
        v-on:switchToAdvanced="switchToAdvanced"
      />
    </q-tab-panel>

    <q-tab-panel name="elements">
      <cxEditorElements />
    </q-tab-panel>

    <q-tab-panel name="advanced">
      <cxEditorAdvanced />
    </q-tab-panel>
  </q-tab-panels>

  <div v-if="tab !== 'items'">
    <!-- ValidationHub -->
    <div>
      <q-page-sticky position="bottom-right" :offset="[130, 18]">
        <q-btn icon="warning_amber" color="red" @click="validateState">
          <cxTooltip :text="$t('tutorial.validationHub')" />
        </q-btn>
      </q-page-sticky>
    </div>
    <q-dialog v-model="validationLayout">
      <cxValidationHub
        :validationResult="validationResult"
        v-on:switchLanguageFromValidationHub="switchLanguageFromValidationHub"
        v-on:switchToItemFromValidationHub="switchToItemFromValidationHub"
        v-on:switchToElements="switchToElements"
        v-on:switchToAdvanced="switchToAdvanced"
      />
    </q-dialog>

    <!-- LanguageHub -->
    <div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          icon="language"
          color="purple"
          :label="language"
          @click="() => (languageLayout = !languageLayout)"
        >
          <cxTooltip :text="$t('views.languages.buttonTooltip')" />
        </q-btn>
      </q-page-sticky>
    </div>
    <q-dialog v-model="languageLayout">
      <cxLanguageHub
        v-on:switchFromLanguageHub="switchFromLanguageHub"
        v-on:deleteLanguage="deleteLanguage"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import cxEditorItems from "@/components/cxEditorItems.vue";
import cxEditorElements from "@/components/cxEditorElements.vue";
import cxEditorAdvanced from "@/components/cxEditorAdvanced.vue";
import cxValidationHub from "@/components/cxValidationHub.vue";
import cxLanguageHub from "@/components/cxLanguageHub.vue";
import cxTooltip from "@/components/helper/cxTooltip.vue";
import { Language, Tab } from "@/store";
import { Questionnaire } from "@/types";
import { questionnaireTools } from "@/utils/questionnaire";
import { QuestionnaireReport } from "@/utils/validation/QuestionnaireValidator";
import { Validator } from "@/utils/validation/Validator";
import { defineComponent, ref } from "vue";
import { mapGetters, mapMutations, useStore } from "vuex";
import { UnreachableError } from "@/utils/editor";

export default defineComponent({
  components: {
    cxEditorItems,
    cxEditorElements,
    cxEditorAdvanced,
    cxValidationHub,
    cxLanguageHub,
    cxTooltip,
  },
  setup() {
    const store = useStore();
    const tab = ref<Tab>(store.state.currentTab);
    const validationResult = ref<QuestionnaireReport[]>([]);
    const language = ref<Language>(store.state.questionnaire.language);
    return {
      tab,
      validationLayout: ref(false),
      validationResult,
      languageLayout: ref(false),
      language,
    };
  },
  created() {
    this.refreshState();
    this.language = this.getLanguage;
    this.switchToEditorScreen();
  },
  computed: {
    ...mapGetters([
      "getQuestionnaires",
      "getQuestionnaireImportedJSON",
      "getLanguage",
    ]),
  },
  watch: {
    tab(newTab: Tab) {
      this.language = this.getLanguage;
      switch (newTab) {
        case "items":
          this.switchToItemsTab();
          break;
        case "elements":
          this.switchToElementsTab();
          break;
        case "advanced":
          this.switchToAdvancedTab();
          break;
        default:
          throw new UnreachableError(newTab);
      }
    },
  },
  methods: {
    ...mapMutations([
      "refreshState",
      "switchToEditorScreen",
      "switchToItemsTab",
      "switchToElementsTab",
      "switchToAdvancedTab",
    ]),
    validateState() {
      this.validationResult = Validator.check(this.getQuestionnaires);
      this.validationLayout = true;
    },
    switchLanguageFromValidationHub(language: Language) {
      this.switchQuestionnaireAndLanguage(language);
      this.validationLayout = false;
    },
    switchToElements(language: Language) {
      this.switchQuestionnaireAndLanguage(language);
      this.tab = "elements";
      this.validationLayout = false;
    },
    switchToAdvanced(language: Language) {
      this.switchQuestionnaireAndLanguage(language);
      this.tab = "advanced";
      this.validationLayout = false;
    },
    switchToItemFromValidationHub(language: Language, internalId: string) {
      this.switchQuestionnaireAndLanguage(language);
      const questionnaire: Questionnaire = this.getQuestionnaireImportedJSON;
      const selectedItem = questionnaireTools.getItemByInternalId(
        questionnaire,
        internalId,
      );
      this.$store.commit("setSelectedItem", selectedItem);
      this.tab = "items";
      this.validationLayout = false;
    },
    deleteLanguage(): void {
      this.language = this.getLanguage;
    },
    switchFromLanguageHub(language: Language) {
      this.switchQuestionnaireAndLanguage(language);
      this.languageLayout = false;
    },
    switchQuestionnaireAndLanguage(language: Language) {
      this.$store.commit("switchQuestionnaireByLang", language);
      this.language = this.getLanguage;
    },
  },
});
</script>
