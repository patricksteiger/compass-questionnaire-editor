<template>
  <q-toolbar>
    <q-img src="@/assets/logo.png" width="120px" class="toolbar_logo" />
    <a
      target="_blank"
      href="https://www.hl7.org/fhir/R5/questionnaire.html#resource"
    >
      <q-icon name="link" />
      {{ $t("documentation") }}
    </a>
    <q-toolbar-title v-if="inEditorScreen()" class="text-center">
      {{ getNameOfQuestionnaire }}
    </q-toolbar-title>
    <q-toolbar-title v-else />
    <q-btn
      v-if="inEditorScreen()"
      icon="upload_file"
      flat
      stack
      no-caps
      @click="importing"
    >
      {{ $t("components.navigationBar.ImportJSONBtn") }}
    </q-btn>
    <q-btn
      v-if="inEditorScreen()"
      icon="download"
      flat
      stack
      no-caps
      @click="validateExportQuestionnaire"
    >
      {{ $t("components.navigationBar.ExportJSONBtn") }}
    </q-btn>
    <q-btn
      v-if="inEditorScreen()"
      icon="download"
      flat
      stack
      no-caps
      @click="validateExportBundle"
    >
      {{ $t("components.navigationBar.ExportBundleJSONBtn") }}
    </q-btn>
    <q-btn
      v-if="inImportScreen()"
      icon="post_add"
      flat
      stack
      no-caps
      @click="createNewEmptyQRE"
    >
      {{ $t("components.navigationBar.createNewQRE") }}
    </q-btn>
  </q-toolbar>

  <!-- alert of leaving the screen -->

  <q-dialog v-model="alertWantToLeaveScreen">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning" class="text-red" style="font-size: 2rem" />
          {{ $t("components.navigationBar.warningLeaveDialog.title") }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ $t("components.navigationBar.warningLeaveDialog.instructions") }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('components.navigationBar.warningLeaveDialog.cancel')"
          color="primary"
          v-close-popup
        />
        <q-btn
          flat
          :label="$t('components.navigationBar.warningLeaveDialog.continue')"
          color="primary"
          v-close-popup
          @click="continueLeavingEditorScreen"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- alert of If someting happend the screen -->

  <q-dialog v-model="alertError">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning" class="text-amber" style="font-size: 2rem" />
          {{ $t("messagesErrors.warning") }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ messageError }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('components.navigationBar.warningLeaveDialog.continue')"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Error on invalid values before exporting -->
  <q-dialog v-model="alertValidationError">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <q-icon name="error" class="text-red" style="font-size: 2rem" />
          {{ $t("messagesErrors.error") }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <ul>
          <li v-for="message in validationErrorMessages" :key="message">
            {{ message }}
          </li>
        </ul>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('components.navigationBar.warningLeaveDialog.cancel')"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <q-icon
            name="check_circle"
            class="text-green"
            style="font-size: 2rem"
          />
          {{ $t("export.successfully") }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="confirmQuestionnaireLayout" persistent>
    <cxConfirmDialog
      :message="confirmMessage"
      v-on:confirmation="exportQuestionnaire"
    />
  </q-dialog>

  <q-dialog v-model="confirmBundleLayout" persistent>
    <cxConfirmDialog
      :message="confirmMessage"
      v-on:confirmation="exportQuestionnaireBundle"
    />
  </q-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { mapGetters, mapMutations, useStore } from "vuex";
import { useQuasar } from "quasar";
import FileSaver from "file-saver";
import { exportTools } from "../utils/exportJson";
import { Questionnaire } from "@/types";
import { ErrorChecker } from "@/utils/validation/ErrorChecker";
import cxConfirmDialog from "@/components/cxConfirmDialog.vue";
import { EDITOR_PATH, IMPORT_PATH } from "@/router";

export default defineComponent({
  components: {
    cxConfirmDialog,
  },
  computed: {
    ...mapGetters([
      "getNameOfQuestionnaire",
      "getQuestionnaireImportedJSON",
      "getQuestionnaires",
      "getCurrentScreen",
    ]),
  },
  setup() {
    const store = useStore();
    const currentQuestionnaire = ref<Questionnaire>(
      computed(() => store.getters.getQuestionnaireImportedJSON).value,
    );
    const $q = useQuasar();
    const validationErrorMessages = ref<string[]>([]);
    const messageError = ref("");
    const confirmMessage = ref<string>("");
    return {
      confirmMessage,
      confirmQuestionnaireLayout: ref(false),
      confirmBundleLayout: ref(false),
      currentQuestionnaire,
      exportTools,
      showLoading() {
        $q.loading.show();
      },
      hideLoading() {
        $q.loading.hide();
      },
      alertWantToLeaveScreen: ref(false),
      alertValidationError: ref(false),
      messageError,
      validationErrorMessages,
      alertError: ref(false),
      alert: ref(false),
      alertMetadata: ref(false),
      languageLayout: ref(false),
      version: ref(""),
      FileSaver,
      useQuasar,
    };
  },
  methods: {
    ...mapMutations([
      "resetQuestionnaire",
      "updateVersion",
      "setNewEmptyQuestionnaire",
    ]),
    inEditorScreen(): boolean {
      return this.getCurrentScreen === "editor";
    },
    inImportScreen(): boolean {
      return this.getCurrentScreen === "import";
    },
    importing() {
      this.alertWantToLeaveScreen = true;
    },
    editMetadata() {
      this.alertMetadata = true;
    },
    continueLeavingEditorScreen() {
      this.$router.push(IMPORT_PATH);
    },
    async validateExportBundle() {
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      const languagesWithErrors = ErrorChecker.haveErrors(questionnaires);
      if (languagesWithErrors.length > 0) {
        this.confirmMessage = `Questionnaires [${languagesWithErrors}] have errors. This means elements with errors are deleted/altered before being exported. Do you want to continue?`;
        this.confirmBundleLayout = true;
      } else {
        await this.exportQuestionnaireBundle();
      }
    },
    async exportQuestionnaireBundle() {
      this.showLoading();
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      const exportBundle = this.exportTools.getExportBundle(questionnaires);
      const serializedBundle = this.exportTools.serializeToJSON(exportBundle);
      const name = `${this.getNameOfQuestionnaire}-Bundle`;
      await this.saveAsBlob(serializedBundle, name);
      this.hideLoading();
    },
    async validateExportQuestionnaire() {
      const questionnaire: Questionnaire = this.getQuestionnaireImportedJSON;
      if (ErrorChecker.hasErrors(questionnaire)) {
        this.confirmMessage = `Questionnaire "${questionnaire.language}" has errors. This means elements with errors are deleted/altered before being exported. Do you want to continue?`;
        this.confirmQuestionnaireLayout = true;
      } else {
        await this.exportQuestionnaire();
      }
    },
    async exportQuestionnaire() {
      this.showLoading();
      const questionnaire: Questionnaire = this.getQuestionnaireImportedJSON;
      const exportQuestionnaire =
        this.exportTools.getExportObject(questionnaire);
      const serializedQuestionnaire =
        this.exportTools.serializeToJSON(exportQuestionnaire);
      const name = this.getNameOfQuestionnaire;
      await this.saveAsBlob(serializedQuestionnaire, name);
      this.hideLoading();
    },
    async saveAsBlob(value: string, suggestedName: string): Promise<void> {
      const blob = new Blob([value], {
        type: "application/json;charset=utf-8",
      });
      try {
        const opts = {
          suggestedName,
          types: [
            {
              description: "JSON",
              accept: { "application/json": [".json"] },
            },
          ],
        };
        // Only Chrome, Edge and Opera currently support showSaveFilePicker, throws TypeError otherwise
        // Also throws DOMException if file-dialog gets closed without saving
        const newHandle = await window.showSaveFilePicker(opts);
        const writableStream = await newHandle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();
      } catch (e: any) {
        // True if message doesn't come from DOMException thrown by showSaveFilePicker
        if (e.message !== "The user aborted a request.") {
          // this.messageError = this.$t("messagesErrors.fileNoExported");
          // this.alertError = true;
          this.FileSaver.saveAs(blob, `${suggestedName}.json`);
        }
      }
    },
    createNewEmptyQRE() {
      this.setNewEmptyQuestionnaire();
      this.$router.push(EDITOR_PATH);
    },
  },
});
</script>
<style scoped>
.toolbar_logo {
  margin: 15px;
}
</style>
