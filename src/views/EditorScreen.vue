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
    <q-tab name="editor" :label="$t('views.tabsTitles.editorQRE')" />
    <q-tab name="primary" :label="$t('views.tabsTitles.primary')" />
    <q-tab name="secondary" :label="$t('views.tabsTitles.secondary')" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="editor">
      <cxEditorItems
        v-on:switchToPrimary="switchToPrimary"
        v-on:switchToSecondary="switchToSecondary"
      />
    </q-tab-panel>

    <q-tab-panel name="primary">
      <cxPrimary />
    </q-tab-panel>

    <q-tab-panel name="secondary">
      <cxSecondary />
    </q-tab-panel>
  </q-tab-panels>

  <div v-if="tab !== 'editor'">
    <!-- ValidationHub -->
    <div>
      <q-page-sticky position="bottom-right" :offset="[130, 18]">
        <q-btn icon="warning_amber" color="orange" @click="validateState">
          <q-tooltip>{{ $t("tutorial.validationHub") }}</q-tooltip>
        </q-btn>
      </q-page-sticky>
    </div>
    <q-dialog v-model="validationLayout">
      <cxValidationHub
        :validationResult="validationResult"
        v-on:switchLanguageFromValidationHub="switchLanguageFromValidationHub"
        v-on:switchToItemFromValidationHub="switchToItemFromValidationHub"
        v-on:switchToPrimary="switchToPrimary"
        v-on:switchToSecondary="switchToSecondary"
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
          <q-tooltip>{{ $t("views.languages.buttonTooltip") }}</q-tooltip>
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
import cxPrimary from "@/components/cxPrimary.vue";
import cxSecondary from "@/components/cxSecondary.vue";
import cxValidationHub from "@/components/cxValidationHub.vue";
import cxLanguageHub from "@/components/cxLanguageHub.vue";
import { Language } from "@/store";
import { Questionnaire } from "@/types";
import { questionnaireTools } from "@/utils/questionnaire";
import { QuestionnaireReport } from "@/utils/validation/QuestionnaireValidator";
import { Validator } from "@/utils/validation/Validator";
import { defineComponent, ref } from "vue";
import { mapGetters, mapMutations, useStore } from "vuex";

type Tab = "editor" | "primary" | "secondary";

export default defineComponent({
  components: {
    cxEditorItems,
    cxPrimary,
    cxSecondary,
    cxValidationHub,
    cxLanguageHub,
  },
  setup() {
    const store = useStore();
    const tab = ref<Tab>("editor");
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tab(_newTab: Tab) {
      this.language = this.getLanguage;
    },
  },
  methods: {
    ...mapMutations(["refreshState", "switchToEditorScreen"]),
    validateState() {
      this.validationResult = Validator.check(this.getQuestionnaires);
      this.validationLayout = true;
    },
    switchLanguageFromValidationHub(language: Language) {
      this.switchQuestionnaireAndLanguage(language);
      this.validationLayout = false;
    },
    switchToPrimary(language: Language) {
      this.switchQuestionnaireAndLanguage(language);
      this.tab = "primary";
      this.validationLayout = false;
    },
    switchToSecondary(language: Language) {
      this.switchQuestionnaireAndLanguage(language);
      this.tab = "secondary";
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
      this.tab = "editor";
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
