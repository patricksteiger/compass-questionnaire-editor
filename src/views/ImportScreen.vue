<template>
  <q-page class="q-pa-md" style="min-height: 80vh">
    <div class="row items-center justify-center example-drag">
      <div class="upload">
        <div
          v-show="$refs.upload && ($refs.upload as any).dropActive"
          class="drop-active"
        >
          <h4>{{ $t("views.import.dropFile") }}</h4>
        </div>

        <div
          class="column justify-start"
          style="max-height: 250px; max-width: 450px; color: #888888"
        >
          <file-upload
            post-action="/upload/post"
            :drop="true"
            v-model="files"
            ref="upload"
            :multiple="true"
            put-action="/put.method"
            @input-file="inputFile"
            @input-filter="inputFilter"
          >
            <div class="column items-center">
              <q-icon name="upload_file" size="xl" />
              <h4>{{ $t("views.import.dropFile") }}</h4>
              <p>
                {{ $t("views.import.instructions") }}
              </p>
            </div>
          </file-upload>
        </div>
        <q-card>
          <div v-if="uploadedFiles.length > 0" class="q-pa-md">
            <q-list dense bordered separator>
              <q-item v-for="(file, index) in uploadedFiles" :key="file.uuid">
                <div>
                  <q-btn dense icon="delete" @click="deleteFile(index)" />
                  {{ index + 1 }}. {{ file.file.name }}
                </div>
                <q-separator vertical spaced />
                <q-expansion-item
                  expand-separator
                  dense
                  v-if="file.languages.length > 0"
                  :header-class="
                    file.languages.some((f) => f.included)
                      ? findDuplicateLanguage(file)
                        ? 'text-red'
                        : 'text-purple'
                      : 'text-grey'
                  "
                  icon="languages"
                  :label="'Languages'"
                >
                  <div class="q-pa-md">
                    <q-list separator dense multiline>
                      <q-item
                        v-for="lang in file.languages"
                        :key="lang.language"
                        :class="
                          lang.included
                            ? languageHasDuplicate(lang.language, file)
                              ? 'bg-red text-white justify-center'
                              : 'justify-center bg-white'
                            : 'bg-grey justify-center'
                        "
                        clickable
                        @click="toggleLanguage(lang.language, file)"
                      >
                        {{ lang.language }}
                      </q-item>
                    </q-list>
                    <q-separator />
                  </div>
                </q-expansion-item>
              </q-item>
            </q-list>
          </div>
        </q-card>
        <div class="q-pa-md">
          <q-btn
            icon="upload"
            :label="$t('views.import.createQRE')"
            :disable="duplicateLanguagesExist() || noIncludedLanguageExists()"
            @click="createAndUploadQuestionnaires()"
          />
        </div>
      </div>
    </div>
  </q-page>

  <!-- alert of If someting happend the screen -->

  <q-dialog v-model="alertError">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section
        v-if="messageError.length > 0 || messageErrorFHIR.length > 0"
      >
        <div class="text-h6">
          <q-icon name="error" class="text-red" style="font-size: 2rem" />
          {{ $t("messagesErrors.error") }}
        </div>
      </q-card-section>

      <q-card-section v-if="messageError !== ''">
        {{ messageError }}
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="messageErrorFHIR.length > 0">
        <ul>
          <li v-for="message in messageErrorFHIR" :key="message">
            {{ message }}
          </li>
        </ul>
      </q-card-section>
      <q-separator v-if="messageErrorFHIR.length > 0"></q-separator>

      <q-card-section v-if="warnings.length > 0">
        <div class="text-h6">
          <q-icon name="error" class="text-yellow" style="font-size: 2rem" />
          {{ $t("messagesErrors.warning") }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="warnings.length > 0">
        <ul>
          <li v-for="message in warnings" :key="message">
            {{ message }}
          </li>
        </ul>
      </q-card-section>
      <q-separator v-if="warnings.length > 0"></q-separator>

      <div v-if="messageErrorFHIR.length > 0">
        File contents could not be uploaded due to errors above.
      </div>

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
</template>

<script lang="ts">
import FileUpload, { VueUploadItem } from "vue-upload-component";
import { mapMutations, mapGetters } from "vuex";
import { useQuasar } from "quasar";
import { defineComponent, Ref, ref } from "vue";
import { i18n } from "@/i18n";
import { Questionnaire } from "@/types";
import { Language } from "@/store";
import { v4 as uuidv4 } from "uuid";
import { transformer } from "@/utils/importing/Transformer";
import { fileUtils } from "@/utils/importing/FileUtils";

type LanguageInfo = {
  language: Language;
  included: boolean;
};

type FileInfo = {
  uuid: string;
  file: VueUploadItem;
  languages: LanguageInfo[];
};

export default defineComponent({
  components: {
    FileUpload,
  },
  setup() {
    const $q = useQuasar();
    const messageErrorFHIR: Ref<string[]> = ref([]);
    const warnings: Ref<string[]> = ref([]);
    const files: Ref<VueUploadItem[]> = ref([]);
    const messageError = ref("");
    const uploadedQuestionnaires: Ref<Map<string, Questionnaire[]>> = ref(
      new Map(),
    );
    const uploadedFiles: Ref<FileInfo[]> = ref([]);

    return {
      showLoading() {
        $q.loading.show();
      },
      hideLoading() {
        $q.loading.hide();
      },
      fileUtils,
      alertError: ref(false),
      warnings,
      messageErrorFHIR,
      messageError,
      files,
      uploadedQuestionnaires,
      uploadedFiles,
    };
  },
  created() {
    this.switchToImportScreen();
  },
  methods: {
    ...mapMutations(["setQuestionnaireBundle", "switchToImportScreen"]),
    /**
     * Has changed
     * @param  Object|undefined   newFile   Read only
     * @param  Object|undefined   oldFile   Read only
     * @return undefined
     */
    inputFile(newFile: VueUploadItem | undefined): void {
      if (!newFile) return;
      this.alertError = false;
      this.messageError = "";
      this.messageErrorFHIR = [];
      this.warnings = [];
      this.showLoading();
      const reader = new FileReader();
      if (newFile.file === undefined) {
        this.messageError = `Couldn't read file: ${newFile.name}`;
        this.alertError = true;
        this.hideLoading();
        return;
      }
      reader.readAsText(newFile.file);
      reader.onload = () => {
        try {
          const jsonFile = this.fileUtils.validateJson(reader.result);
          if (transformer.isQuestionnaireResource(jsonFile)) {
            this.handleQuestionnaireResource(newFile, jsonFile);
          } else if (transformer.isBundleResource(jsonFile)) {
            this.handleBundleResource(newFile, jsonFile);
          } else {
            throw new Error(
              "File has to have resourceType equal to Questionnaire or Bundle.",
            );
          }
        } catch (error: any) {
          this.messageError = error.message;
          this.alertError = true;
        } finally {
          this.hideLoading();
        }
      };

      reader.onerror = () => {
        this.messageError =
          reader.error?.message || i18n.global.t("views.import.errorOcurred");
        this.alertError = true;
        this.hideLoading();
      };
    },
    handleQuestionnaireResource(
      newFile: VueUploadItem,
      jsonFile: unknown,
    ): void {
      const result = transformer.questionnaire(jsonFile);
      if (result.state === "error") {
        this.messageErrorFHIR = result.errors;
        this.warnings = result.warnings;
        this.alertError = true;
        return;
      } else if (result.state === "warning") {
        this.warnings = result.warnings;
        this.alertError = true;
      }
      this.validateCompatibleQuestionnaire(newFile, [result.data]);
    },
    handleBundleResource(newFile: VueUploadItem, jsonFile: unknown): void {
      const result = transformer.bundle(jsonFile);
      if (result.state === "error") {
        this.messageErrorFHIR = result.errors;
        this.warnings = result.warnings;
        this.alertError = true;
        return;
      } else if (result.state === "warning") {
        this.warnings = result.warnings;
        this.alertError = true;
      }
      this.validateCompatibleQuestionnaire(newFile, result.data);
    },
    validateCompatibleQuestionnaire(
      newFile: VueUploadItem,
      questionnaires: Questionnaire[],
    ): void {
      if (this.uploadedQuestionnaires.size > 0) {
        const referenceQRE: Questionnaire = [
          ...this.uploadedQuestionnaires.values(),
        ][0][0];
        for (const qre of questionnaires) {
          const errors = this.fileUtils.validateItemStructure(
            referenceQRE.item,
            qre.item,
          );
          if (errors.length > 0) {
            this.messageError =
              "File contains questionnaire with incompatible structure.";
            this.messageErrorFHIR = errors;
            this.alertError = true;
            return;
          }
        }
      }
      const languages: LanguageInfo[] = questionnaires.map((qre) => ({
        language: qre.language,
        included: true,
      }));
      const file: FileInfo = {
        uuid: uuidv4(),
        file: newFile,
        languages,
      };
      this.uploadedQuestionnaires.set(file.uuid, questionnaires);
      this.uploadedFiles.push(file);
    },
    createAndUploadQuestionnaires(): void {
      if (this.uploadedQuestionnaires.size === 0) {
        console.error("No questionnaires were uploaded");
        return;
      }
      const qres: Questionnaire[] = [];
      for (const file of this.uploadedFiles) {
        const uploadedQREs = this.uploadedQuestionnaires.get(file.uuid);
        for (const qre of uploadedQREs ?? []) {
          const qreIsIncluded = file.languages.some(
            (info) => info.included && info.language === qre.language,
          );
          if (qreIsIncluded) {
            qres.push(qre);
          }
        }
      }
      this.setQuestionnaireBundle(qres);
      this.$router.push("/");
    },
    findDuplicateLanguage(file: FileInfo): boolean {
      for (const other of this.uploadedFiles) {
        if (other.uuid === file.uuid) continue;
        for (const lang of file.languages) {
          if (lang.included && this.languageHasDuplicate(lang.language, file)) {
            return true;
          }
        }
      }
      return false;
    },
    languageHasDuplicate(lang: Language, file: FileInfo): boolean {
      for (const other of this.uploadedFiles) {
        if (other.uuid === file.uuid) continue;
        for (const info of other.languages) {
          if (info.included && info.language === lang) {
            return true;
          }
        }
      }
      return false;
    },
    duplicateLanguagesExist(): boolean {
      for (const file of this.uploadedFiles) {
        if (this.findDuplicateLanguage(file)) {
          return true;
        }
      }
      return false;
    },
    noIncludedLanguageExists(): boolean {
      for (const file of this.uploadedFiles) {
        for (const langInfo of file.languages) {
          if (langInfo.included) {
            return false;
          }
        }
      }
      return true;
    },
    toggleLanguage(lang: Language, file: FileInfo): void {
      for (const info of file.languages) {
        if (info.language === lang) {
          info.included = !info.included;
          break;
        }
      }
    },
    deleteFile(index: number) {
      const [deletedFile] = this.uploadedFiles.splice(index, 1);
      this.uploadedQuestionnaires.delete(deletedFile.uuid);
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   Read and write
     * @param  Object|undefined   oldFile   Read only
     * @param  Function           prevent   Prevent changing
     * @return undefined
     */
    inputFilter: function (
      newFile: VueUploadItem | undefined,
      oldFile: VueUploadItem | undefined,
      prevent: () => boolean,
    ): boolean {
      if (newFile !== undefined && oldFile === undefined) {
        if (newFile.name === undefined) {
          throw new Error("empty file name for new file");
        }
        // Filter non-json file
        if (!/\.(json)$/i.test(newFile.name)) {
          this.messageError = this.$t(
            "messagesErrors.GeneralJSONValidations.fileNoJSONType",
            { nameFile: newFile.name },
          );
          this.alertError = true;
          return prevent();
        }
      }
      return true;
    },
  },
  computed: {
    ...mapGetters(["getQuestionnaireImportedJSON"]),
  },
});
</script>

<style>
.example-drag {
  position: absolute;
  top: 10px;
  left: 10px;
  bottom: 10px;
  right: 10px;
  text-align: center;
  height: 100%;
}
.example-drag.draged {
  position: absolute;
  top: 10px;
  left: 10px;
  bottom: 10px;
  right: 10px;
  border: 3px dashed green;
  text-align: center;
}
.example-drag label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.example-drag .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: 0.6;
  text-align: center;
  background: #000;
}
.example-drag .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
