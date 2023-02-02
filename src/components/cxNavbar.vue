<template>
  <q-toolbar>
    <q-img src="@/assets/logo.png" width="120px" class="toolbar_logo" />
    <q-toolbar-title class="text-center">{{
      getNameofQuestionnaire
    }}</q-toolbar-title>
    <q-btn
      icon="upload_file"
      flat
      stack
      no-caps
      v-if="$route.name !== 'Import'"
      @click="importing"
      >{{ $t("components.navigationBar.ImportJSONBtn") }}</q-btn
    >
    <q-btn
      v-if="$route.name !== 'Import'"
      icon="download_file"
      flat
      stack
      no-caps
      @click="exportQuestionnaire"
      >{{ $t("components.navigationBar.ExportJSONBtn") }}</q-btn
    >
    <q-btn
      v-if="$route.name !== 'Import'"
      icon="download_file"
      flat
      stack
      no-caps
      @click="exportQuestionnaireBundle"
      >{{ $t("components.navigationBar.ExportBundleJSONBtn") }}</q-btn
    >
    <q-btn
      v-if="$route.name === 'Import'"
      icon="post_add"
      flat
      stack
      no-caps
      @click="createNewEmptyQRE"
      >{{ $t("components.navigationBar.createNewQRE") }}</q-btn
    >
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
          @click="continueLeavingEditionScreen"
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
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { mapGetters, mapMutations } from "vuex";
import { useQuasar } from "quasar";
import FileSaver from "file-saver";
import { exportJsonQuestionnaire } from "../utils/exportJson";
import { Questionnaire } from "@/types";

export default defineComponent({
  computed: {
    ...mapGetters([
      "getNameofQuestionnaire",
      "getQuestionnaireImportedJSON",
      "getVersionQuestionnaire",
      "getQuestionnaires",
    ]),
  },
  data() {
    return {
      questionnaireGUI: {},
      messageError: "",
    };
  },
  setup() {
    const $q = useQuasar();
    const validationErrorMessages: Ref<string[]> = ref([]);
    return {
      exportJsonQuestionnaire,
      showLoading() {
        $q.loading.show();
      },
      hideLoading() {
        $q.loading.hide();
      },
      alertWantToLeaveScreen: ref(false),
      alertValidationError: ref(false),
      validationErrorMessages,
      alertError: ref(false),
      alert: ref(false),
      alertMetadata: ref(false),
      version: ref(""),
      FileSaver,
      useQuasar,
    };
  },
  created() {
    this.questionnaireGUI = this.getQuestionnaireImportedJSON
      ? this.getQuestionnaireImportedJSON
      : {};
  },
  methods: {
    ...mapMutations([
      "resetQuestionnaire",
      "updateVersion",
      "setNewEmptyQuestionnaire",
    ]),
    importing() {
      this.alertWantToLeaveScreen = true;
    },
    editMetadata() {
      this.alertMetadata = true;
    },
    continueLeavingEditionScreen() {
      this.resetQuestionnaire();
      this.$router.push("Import");
    },
    exportQuestionnaireBundle() {
      this.showLoading();
      const focusedQuestionnaire = this.getQuestionnaireImportedJSON;
      this.validationErrorMessages =
        this.exportJsonQuestionnaire.validateQuestionnaire(
          focusedQuestionnaire,
          this.$store.state.settings,
        );
      if (this.validationErrorMessages.length > 0) {
        this.hideLoading();
        this.alertValidationError = true;
        return;
      }
      const questionnaires = this.getQuestionnaires;
      const exportBundle =
        this.exportJsonQuestionnaire.getExportBundle(questionnaires);
      const exportBundleJson = JSON.stringify(exportBundle, null, 2);
      const blob = new Blob([exportBundleJson], {
        type: "application/json;charset=utf-8",
      });
      this.FileSaver.saveAs(blob, `${this.getNameofQuestionnaire}-Bundle.json`);
      this.hideLoading();
    },
    async exportQuestionnaire() {
      let blob = undefined;
      try {
        this.showLoading();
        const objToExport: Questionnaire = this.getQuestionnaireImportedJSON;
        this.validationErrorMessages =
          this.exportJsonQuestionnaire.validateQuestionnaire(
            objToExport,
            this.$store.state.settings,
          );
        if (this.validationErrorMessages.length > 0) {
          this.hideLoading();
          this.alertValidationError = true;
          return;
        }
        const exportQuestionnaire =
          this.exportJsonQuestionnaire.getExportObject(objToExport);
        const objFinalToExport = JSON.stringify(exportQuestionnaire, null, 2);
        blob = new Blob([objFinalToExport], {
          type: "application/json;charset=utf-8",
        });
        const opts = {
          suggestedName: this.getNameofQuestionnaire,
          types: [
            {
              description: "JSON",
              accept: { "application/json": [".json"] },
            },
          ],
        };

        const newHandle = await window.showSaveFilePicker(opts);

        const writableStream = await newHandle.createWritable();
        // write our file
        await writableStream.write(blob);

        // close the file and write the contents to disk.
        await writableStream.close();
        this.hideLoading();
        this.alert = true;
      } catch (e: any) {
        if (e.message !== "The user aborted a request." && blob !== undefined) {
          this.messageError = this.$t("messagesErrors.fileNoExported");
          this.alertError = true;
          this.FileSaver.saveAs(blob, `${this.getNameofQuestionnaire}.json`);
        }
        this.hideLoading();
      }
    },
    createNewEmptyQRE() {
      this.setNewEmptyQuestionnaire();
      this.$router.push("/");
    },
  },
});
</script>
<style scoped>
.toolbar_logo {
  margin: 15px;
}
</style>
