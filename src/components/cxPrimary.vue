<template>
  <div class="row justify-center">
    <div class="col-7">
      <q-input
        v-model="URL"
        :label="$t('components.navigationBar.metadataItems.URL')"
        :rules="[questionnaireTools.isUriOrEmpty]"
        clearable
        @clear="
          (_oldUrl: string | undefined) => {
            URL = '';
          }
        "
      />
      <q-list padding bordered>
        <q-input
          v-model="version"
          :label="$t('components.navigationBar.version')"
          clearable
          @clear="
            (_oldVersion: string | undefined) => {
              version = '';
            }
          "
        />
        {{ $t("components.navigationBar.versionAlgorithm") }}
        <div class="row justify-between">
          <q-toggle
            class="col-2"
            :label="
              questionnaire.__versionAlgorithmUsesCoding ? 'Coding' : 'String'
            "
            v-model="questionnaire.__versionAlgorithmUsesCoding"
          />
          <q-select
            v-model="versionAlgorithmCoding"
            class="col-3"
            label="Coding"
            :options="versionAlgorithmCodes"
            :disable="!questionnaire.__versionAlgorithmUsesCoding"
            @update:model-value="updateVersionAlgorithmCoding"
            clearable
          />
          <q-input
            class="col-6"
            :disable="questionnaire.__versionAlgorithmUsesCoding"
            label="String"
            v-model="questionnaire.versionAlgorithmString"
            @update:model-value="updateVersionAlgorithmString"
            clearable
          />
        </div>
      </q-list>

      <q-input
        v-model="name"
        :label="$t('components.navigationBar.metadataItems.name')"
        :rules="[questionnaireTools.isNameOrEmpty]"
        clearable
        @clear="
          (_oldName: string | undefined) => {
            name = '';
          }
        "
      />
      <q-input
        v-model="title"
        :label="$t('components.navigationBar.metadataItems.title')"
        clearable
        @clear="
          (_oldTitle: string | undefined) => {
            title = '';
          }
        "
      />

      <div class="row">
        <q-select
          class="col-3"
          v-model="status"
          :options="statusOptions"
          :label="$t('components.navigationBar.metadataItems.status')"
        />
      </div>

      <q-list class="q-mt-md" padding bordered>
        <div class="row">
          <q-input
            type="text"
            class="col-8"
            dense
            v-model="date"
            :label="$t('components.navigationBar.metadataItems.date')"
            :rules="[dateTools.isDateTimeOrEmpty]"
            clearable
            :clear="() => (date = '')"
          />
          <q-btn
            label="Now"
            flat
            dense
            @click="() => (date = dateTools.getCurrentDateTime())"
          />
        </div>
        <div class="row justify-between">
          <q-input
            class="col-4"
            type="text"
            dense
            v-model="approvalDate"
            :label="$t('components.navigationBar.metadataItems.approvalDate')"
            :rules="[dateTools.isDateOrEmpty]"
            clearable
            :clear="() => (approvalDate = '')"
          />
          <q-btn
            label="Today"
            flat
            dense
            @click="() => (approvalDate = dateTools.getCurrentDate())"
          />
          <q-input
            type="text"
            dense
            class="col-4"
            v-model="lastReviewDate"
            :label="$t('components.navigationBar.metadataItems.lastReviewDate')"
            :rules="[dateTools.isDateOrEmpty]"
            clearable
            :clear="() => (lastReviewDate = '')"
          />
          <q-btn
            label="Today"
            flat
            dense
            @click="() => (lastReviewDate = dateTools.getCurrentDate())"
          />
        </div>
        <q-separator />
        <div class="text-bold">
          EffectivePeriod:
          <cxPeriod :period="questionnaire.effectivePeriod" />
        </div>
      </q-list>

      <q-list class="q-mt-md" padding bordered>
        <q-expansion-item icon="description" label="Text">
          <q-list bordered separator dense padding class="rounded-borders">
            <q-select
              label="Status"
              v-model="textStatus"
              :options="narrativeStatuses"
            />
            <q-input
              label="Div"
              v-model="textDiv"
              :rules="[questionnaireTools.containsNonWhitespace]"
              autogrow
              clearable
              :clear="() => (textDiv = '')"
            />
          </q-list>
        </q-expansion-item>
      </q-list>

      <!-- extension -->
      <q-list padding bordered>
        <cxExtension
          :title="$t('views.editor.extensions')"
          v-if="questionnaire !== undefined"
          :extensions="(questionnaire.extension ??= [])"
          :predefinedExtensions="getQuestionnaireExtensions()"
          v-on:addExtension="addExtension"
          v-on:removeExtension="removeExtension"
        />
      </q-list>

      <!-- modifierExtension -->
      <q-list padding bordered>
        <cxExtension
          title="ModifierExtension"
          v-if="questionnaire !== undefined"
          :extensions="questionnaire.modifierExtension"
          :predefinedExtensions="[]"
          v-on:addExtension="addModifierExtension"
          v-on:removeExtension="removeModifierExtension"
        />
      </q-list>

      <!-- identifier -->
      <q-list padding bordered>
        <q-expansion-item
          icon="info"
          :label="$t('components.navigationBar.metadataItems.identifier')"
          v-model="expanded"
        >
          <q-separator />
          <q-card>
            <!-- Btn Add Identifier -->
            <div class="row">
              <q-btn
                class="q-ma-sm"
                outline
                color="primary"
                size="sm"
                @click="addEmptyId"
              >
                <q-icon left name="add" />
                <div>{{ $t("views.tabs.metadata.addNewId") }}</div>
              </q-btn>
            </div>
            <!-- identifier -->
            <q-list
              dense
              bordered
              padding
              class="rounded-borders"
              v-for="(id, index) in identifier"
              :key="id.value"
            >
              <!-- Btn Remove Identifier -->
              <div class="row justify-end">
                <q-btn
                  class="q-ma-sm"
                  unelevated
                  color="negative"
                  size="sm"
                  @click="removeID(index)"
                >
                  <q-icon left name="add" />
                  <div>{{ $t("views.tabs.metadata.removeId") }}</div>
                </q-btn>
              </div>
              <q-item-section>
                <q-card-section>
                  <div class="row">
                    <div class="col-3">
                      <!-- use -->
                      <q-input
                        v-model="id.use"
                        dense
                        class="q-mr-sm"
                        :label="$t('views.tabs.metadata.use')"
                      />
                    </div>
                    <div class="col-3">
                      <!-- system -->
                      <q-input
                        v-model="id.system"
                        dense
                        class="q-mr-sm"
                        :label="$t('views.tabs.metadata.system')"
                      />
                    </div>
                    <div class="col-3">
                      <!-- value -->
                      <q-input
                        v-model="id.value"
                        dense
                        class="q-mr-sm"
                        :label="$t('views.tabs.metadata.value')"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="row q-my-sm text-weight-medium">
                      {{ $t("views.tabs.metadata.type.type") }}
                    </div>
                  </div>
                  <q-card flat bordered class="my-card">
                    <q-card-section>
                      <div class="text-subtitle2 text-deep-orange q-my-md">
                        {{ $t("views.tabs.metadata.type.coding.coding") }}
                      </div>
                      <q-separator />
                      <div class="row">
                        <div class="col-3">
                          <!-- system -->
                          <q-input
                            v-if="id.type?.coding !== undefined"
                            v-model="id.type.coding.system"
                            dense
                            class="q-mr-sm"
                            :label="
                              $t('views.tabs.metadata.type.coding.system')
                            "
                          />
                        </div>
                        <div class="col-2">
                          <!-- version -->
                          <q-input
                            v-if="id.type?.coding !== undefined"
                            v-model="id.type.coding.version"
                            dense
                            class="q-mr-sm"
                            :label="
                              $t('views.tabs.metadata.type.coding.version')
                            "
                          />
                        </div>
                        <div class="col-2">
                          <!-- code -->
                          <q-input
                            v-if="id.type?.coding !== undefined"
                            v-model="id.type.coding.code"
                            dense
                            class="q-mr-sm"
                            :label="$t('views.tabs.metadata.type.coding.code')"
                          />
                        </div>
                        <div class="col-3">
                          <!-- display -->
                          <q-input
                            v-if="id.type?.coding !== undefined"
                            v-model="id.type.coding.display"
                            dense
                            class="q-mr-sm"
                            :label="
                              $t('views.tabs.metadata.type.coding.display')
                            "
                          />
                        </div>
                        <div class="col-2">
                          <!-- userSelected -->
                          <div class="q-gutter-sm">
                            <q-checkbox
                              left-label
                              v-if="id.type?.coding !== undefined"
                              v-model="id.type.coding.userSelected"
                              :label="
                                $t(
                                  'views.tabs.metadata.type.coding.userSelected',
                                )
                              "
                            />
                          </div>
                        </div>
                      </div>
                      <div class="text-subtitle2 text-deep-orange q-my-md">
                        {{ $t("views.tabs.metadata.type.text") }}
                      </div>
                      <q-separator />
                      <div class="row">
                        <div class="col-3">
                          <!-- system -->
                          <q-input
                            v-if="id.type !== undefined"
                            v-model="id.type.text"
                            dense
                            class="q-mr-sm"
                            :label="$t('views.tabs.metadata.type.text')"
                          />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                  <div class="row q-my-sm text-weight-medium">
                    {{ $t("views.tabs.metadata.period.period") }}
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <!-- start -->
                      <q-input
                        v-if="id.period !== undefined"
                        v-model="id.period.start"
                        dense
                        type="date"
                        stack-label
                        class="q-mr-sm"
                        :label="$t('views.tabs.metadata.period.start')"
                      />
                    </div>
                    <div class="col-3">
                      <!-- end -->
                      <q-input
                        v-if="id.period !== undefined"
                        v-model="id.period.end"
                        dense
                        type="date"
                        stack-label
                        class="q-mr-sm"
                        :label="$t('views.tabs.metadata.period.end')"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-item-section>
            </q-list>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import { computed, defineComponent, ref } from "vue";
import {
  Extension,
  Identifier,
  NarrativeStatus,
  narrativeStatuses,
  Questionnaire,
  status,
} from "@/types";
import { getQuestionnaireExtensions } from "@/utils/extension";
import cxExtension from "@/components/cxExtension.vue";
import cxPeriod from "@/components/datatypes/cxPeriod.vue";
import { dateTools } from "@/utils/date";
import {
  getVersionAlgorithmCoding,
  VersionAlgorithmCode,
  versionAlgorithmCodes,
} from "@/utils/constants";
import { store } from "@/store";
import { questionnaireTools } from "@/utils/questionnaire";

export default defineComponent({
  components: {
    cxExtension,
    cxPeriod,
  },
  setup() {
    const questionnaire = ref<Questionnaire>(
      computed(() => store.getters.getQuestionnaireImportedJSON).value,
    );
    const versionAlgorithmCoding = ref<VersionAlgorithmCode | null>(
      questionnaire.value.versionAlgorithmCoding?.code ?? null,
    );
    return {
      dateTools,
      questionnaireTools,
      expanded: ref(false),
      statusOptions: status,
      getQuestionnaireExtensions,
      questionnaire,
      versionAlgorithmCoding,
      versionAlgorithmCodes,
      getVersionAlgorithmCoding,
      narrativeStatuses,
    };
  },
  computed: {
    ...mapGetters(["getNameOfQuestionnaire"]),
    textStatus: {
      get() {
        return this.$store.state.questionnaire.text.status;
      },
      set(value: NarrativeStatus) {
        this.$store.commit("setTextStatus", value);
      },
    },
    textDiv: {
      get() {
        return this.$store.state.questionnaire.text.div;
      },
      set(value: string) {
        this.$store.commit("setTextDiv", value);
      },
    },
    version: {
      get() {
        return this.$store.state.questionnaire.version;
      },
      set(value: string) {
        this.$store.commit("setVersion", value);
      },
    },
    identifier: {
      get() {
        return this.$store.state.questionnaire.identifier;
      },
      set(value: Identifier[]) {
        this.$store.commit("setIdentifier", value);
      },
    },
    URL: {
      get() {
        return this.$store.state.questionnaire.url;
      },
      set(value: string) {
        this.$store.commit("setURL", value);
      },
    },
    name: {
      get() {
        return this.$store.state.questionnaire.name;
      },
      set(value: string) {
        this.$store.commit("setName", value);
      },
    },
    title: {
      get() {
        return this.$store.state.questionnaire.title;
      },
      set(value: string) {
        this.$store.commit("setTitle", value);
      },
    },
    status: {
      get() {
        return this.$store.state.questionnaire.status;
      },
      set(value: string) {
        this.$store.commit("setStatus", value);
      },
    },
    date: {
      get() {
        return this.$store.state.questionnaire.date;
      },
      set(value: string) {
        this.$store.commit("setDate", value);
      },
    },
    approvalDate: {
      get() {
        return this.$store.state.questionnaire.approvalDate;
      },
      set(value: string) {
        this.$store.commit("setApprovalDate", value);
      },
    },
    lastReviewDate: {
      get() {
        return this.$store.state.questionnaire.lastReviewDate;
      },
      set(value: string) {
        this.$store.commit("setLastReviewDate", value);
      },
    },
  },
  methods: {
    updateVersionAlgorithmCoding(code: VersionAlgorithmCode | null): void {
      if (code === null) {
        this.questionnaire!.versionAlgorithmCoding = undefined;
      } else {
        const coding = getVersionAlgorithmCoding(code);
        this.questionnaire!.versionAlgorithmCoding = coding;
      }
    },
    updateVersionAlgorithmString(str: string | number | null): void {
      if (str === null) {
        this.questionnaire!.versionAlgorithmString = undefined;
      } else if (typeof str === "number") {
        this.questionnaire!.versionAlgorithmString = str.toString();
      } else {
        this.questionnaire!.versionAlgorithmString = str;
      }
    },
    addExtension(extension: Extension): void {
      this.questionnaire!.extension!.push(extension);
    },
    removeExtension(index: number): void {
      this.questionnaire!.extension!.splice(index, 1);
    },
    addModifierExtension(extension: Extension): void {
      this.questionnaire!.modifierExtension.push(extension);
    },
    removeModifierExtension(index: number): void {
      this.questionnaire!.modifierExtension.splice(index, 1);
    },
    addEmptyId() {
      const newID: Identifier = {
        system: "",
        value: "",
        period: {
          start: "",
          end: "",
        },
        type: {
          coding: {
            system: "",
            version: "",
            code: "",
            display: "",
            userSelected: false,
          },
          text: "",
        },
      };
      this.$store.state.questionnaire.identifier ??= [];
      this.$store.state.questionnaire.identifier.push(newID);
    },
    removeID(indexID: number) {
      this.$store.state.questionnaire.identifier?.splice(indexID, 1);
    },
  },
});
</script>
