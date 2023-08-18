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
      >
        <cxTooltip :text="$t('tutorial.url')" />
      </q-input>
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
          >
            <cxTooltip :text="$t('tutorial.versionAlgorithmString')" />
          </q-input>
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
      >
        <cxTooltip :text="$t('tutorial.name')" />
      </q-input>
      <q-input
        v-model="title"
        :label="$t('components.navigationBar.metadataItems.title')"
        clearable
        @clear="
          (_oldTitle: string | undefined) => {
            title = '';
          }
        "
      >
        <cxTooltip :text="$t('tutorial.title')" />
      </q-input>

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
          <cxDateTime
            inputClass="col-8"
            :label="$t('components.navigationBar.metadataItems.date')"
            v-on:update="updateDate"
            :value="date"
          />
        </div>
        <div class="row justify-between">
          <cxDate
            inputClass="col-4"
            :label="$t('components.navigationBar.metadataItems.approvalDate')"
            :value="approvalDate"
            v-on:update="(value) => (approvalDate = value)"
          />
          <cxDate
            inputClass="col-4"
            :label="$t('components.navigationBar.metadataItems.lastReviewDate')"
            :value="lastReviewDate"
            v-on:update="(value) => (lastReviewDate = value)"
          />
        </div>
        <q-separator />
        <div class="text-bold">
          EffectivePeriod:
          <cxPeriod :period="questionnaire.effectivePeriod" />
          <cxTooltip :text="$t('tutorial.effectivePeriod')" />
        </div>
      </q-list>

      <q-list class="q-mt-md" padding bordered>
        <q-expansion-item>
          <template v-slot:header>
            <cxExpansionItemHeader
              icon="description"
              title="Text"
              :tooltip="$t('tutorial.Text')"
            />
          </template>
          <q-separator />
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
          :extensions="questionnaire.extension"
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
        <q-expansion-item expand-separator v-model="expanded">
          <template v-slot:header>
            <cxExpansionItemHeader
              icon="fingerprint"
              :title="$t('components.navigationBar.metadataItems.identifier')"
              :tooltip="$t('tutorial.identifier')"
            />
          </template>
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
              :key="index"
            >
              <q-item-section>
                <q-card-section>
                  <cxIdentifier
                    :identifier="id"
                    :header="index + 1 + '. Identifier'"
                  />
                </q-card-section>
              </q-item-section>
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
  NarrativeStatus,
  narrativeStatuses,
  Identifier,
  Questionnaire,
  status,
} from "@/types";
import { getQuestionnaireExtensions } from "@/utils/extension";
import cxExtension from "@/components/cxExtension.vue";
import cxExpansionItemHeader from "@/components/helper/cxExpansionItemHeader.vue";
import cxPeriod from "@/components/datatypes/cxPeriod.vue";
import cxDate from "@/components/datatypes/cxDate.vue";
import cxDateTime from "@/components/datatypes/cxDateTime.vue";
import cxIdentifier from "@/components/datatypes/cxIdentifier.vue";
import cxTooltip from "@/components/helper/cxTooltip.vue";
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
    cxDate,
    cxDateTime,
    cxIdentifier,
    cxExpansionItemHeader,
    cxTooltip,
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
    updateDate(value: string) {
      this.date = value;
    },
    updateVersionAlgorithmCoding(code: VersionAlgorithmCode | null): void {
      this.$store.commit("updateVersionAlgorithmCoding", code);
    },
    updateVersionAlgorithmString(str: string | number | null): void {
      this.$store.commit("updateVersionAlgorithmString", str);
    },
    addExtension(extension: Extension): void {
      this.$store.commit("addExtension", extension);
    },
    removeExtension(index: number): void {
      this.$store.commit("removeExtension", index);
    },
    addModifierExtension(extension: Extension): void {
      this.$store.commit("addModifierExtension", extension);
    },
    removeModifierExtension(index: number): void {
      this.$store.commit("removeModifierExtension", index);
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
          coding: [],
          text: "",
        },
      };
      this.$store.commit("addIdentifier", newID);
    },
    removeID(indexID: number) {
      this.$store.commit("removeIdentifier", indexID);
    },
  },
});
</script>
