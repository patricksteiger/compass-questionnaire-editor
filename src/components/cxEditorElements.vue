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
        <q-item tag="label" v-ripple>
          <q-item-section avatar>
            <q-toggle color="red" v-model="experimental" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t("components.navigationBar.metadataItems.experimental") }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <q-list class="q-mt-md" padding bordered>
        <div class="row">
          <cxDateTime
            inputClass="col-8"
            :inputTooltip="$t('tutorial.date')"
            :label="$t('components.navigationBar.metadataItems.date')"
            :value="date"
            v-on:update="(value) => (date = value)"
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
        <div class="q-mt-md text-bold">
          EffectivePeriod:
          <cxPeriod :period="questionnaire.effectivePeriod" />
          <cxTooltip :text="$t('tutorial.effectivePeriod')" />
        </div>
      </q-list>

      <!-- Contact -->
      <div class="q-my-md">
        <q-list bordered padding>
          <q-expansion-item expand-separator>
            <template v-slot:header>
              <cxExpansionItemHeader
                icon="contacts"
                title="Contact"
                :tooltip="$t('tutorial.contact')"
              />
            </template>
            <q-list bordered separator dense padding class="rounded-borders">
              <q-item
                v-for="(contactDetail, index) in contact"
                :key="`set_${index}`"
              >
                <q-item-section>
                  <q-input
                    label="Name"
                    v-model="contactDetail.name"
                    clearable
                  />
                  <cxContactDetail
                    :contactDetail="contactDetail"
                    v-on:addContactPoint="(p) => contactDetail.telecom.push(p)"
                    v-on:removeContactPoint="
                      (i) => contactDetail.telecom.splice(i, 1)
                    "
                  />
                </q-item-section>
                <q-btn
                  flat
                  icon="highlight_off"
                  color="grey-6"
                  @click="() => $store.commit('removeContactDetail', index)"
                />
              </q-item>
            </q-list>
            <q-btn
              icon="add"
              padding="none xl"
              color="primary"
              fab
              label="ContactDetail"
              @click="
                () =>
                  $store.commit('addContactDetail', { name: '', telecom: [] })
              "
            />
          </q-expansion-item>
        </q-list>
      </div>

      <div>
        <q-input
          v-model="publisher"
          :label="$t('components.navigationBar.metadataItems.publisher')"
          autogrow
          clearable
          @clear="publisher = ''"
        />
      </div>

      <div>
        <q-input
          v-model="purpose"
          :label="$t('components.navigationBar.metadataItems.purpose')"
          autogrow
          clearable
          @clear="purpose = ''"
        />
      </div>

      <div>
        <q-input
          v-model="description"
          :label="$t('components.navigationBar.metadataItems.description')"
          autogrow
          clearable
          @clear="description = ''"
        />
      </div>

      <div class="q-my-md">
        <q-list bordered padding>
          <q-expansion-item expand-separator>
            <template v-slot:header>
              <cxExpansionItemHeader icon="copyright" title="Copyright" />
            </template>
            <div>
              <q-input
                label="CopyrightLabel"
                v-model="copyrightLabel"
                type="textarea"
                autogrow
                clearable
                @clear="() => (copyrightLabel = '')"
              />
            </div>

            <div>
              <q-input
                label="Copyright"
                v-model="copyright"
                type="textarea"
                autogrow
                clearable
                @clear="() => (copyright = '')"
              />
            </div>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import { computed, defineComponent, ref } from "vue";
import { Identifier, Questionnaire, status, ContactDetail } from "@/types";
import cxExpansionItemHeader from "@/components/helper/cxExpansionItemHeader.vue";
import cxContactDetail from "@/components/datatypes/cxContactDetail.vue";
import cxPeriod from "@/components/datatypes/cxPeriod.vue";
import cxDate from "@/components/datatypes/cxDate.vue";
import cxDateTime from "@/components/datatypes/cxDateTime.vue";
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
    cxPeriod,
    cxContactDetail,
    cxDate,
    cxDateTime,
    cxExpansionItemHeader,
    cxTooltip,
  },
  setup() {
    const questionnaire = computed<Questionnaire>(
      () => store.getters.getQuestionnaireImportedJSON,
    );
    const versionAlgorithmCoding = ref<VersionAlgorithmCode | null>(
      questionnaire.value.versionAlgorithmCoding?.code ?? null,
    );
    const contact = ref<ContactDetail[]>(questionnaire.value.contact);
    return {
      contact,
      dateTools,
      questionnaireTools,
      statusOptions: status,
      questionnaire,
      versionAlgorithmCoding,
      versionAlgorithmCodes,
      getVersionAlgorithmCoding,
    };
  },
  computed: {
    ...mapGetters(["getNameOfQuestionnaire"]),
    experimental: {
      get(): boolean {
        return this.$store.state.questionnaire.experimental;
      },
      set(value: string) {
        this.$store.commit("setExperimental", value);
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
    publisher: {
      get(): string | undefined {
        return this.$store.state.questionnaire.publisher;
      },
      set(value: string) {
        this.$store.commit("setPublisher", value);
      },
    },
    purpose: {
      get(): string | undefined {
        return this.$store.state.questionnaire.purpose;
      },
      set(value: string) {
        this.$store.commit("setPurpose", value);
      },
    },
    description: {
      get(): string | undefined {
        return this.$store.state.questionnaire.description;
      },
      set(value: string) {
        this.$store.commit("setDescription", value);
      },
    },
    copyrightLabel: {
      get(): string | undefined {
        return this.$store.state.questionnaire.copyrightLabel;
      },
      set(value: string) {
        this.$store.commit("setCopyrightLabel", value);
      },
    },
    copyright: {
      get(): string | undefined {
        return this.$store.state.questionnaire.copyright;
      },
      set(value: string) {
        this.$store.commit("setCopyright", value);
      },
    },
  },
  methods: {
    updateVersionAlgorithmCoding(code: VersionAlgorithmCode | null): void {
      this.$store.commit("updateVersionAlgorithmCoding", code);
    },
    updateVersionAlgorithmString(str: string | number | null): void {
      this.$store.commit("updateVersionAlgorithmString", str);
    },
  },
});
</script>
