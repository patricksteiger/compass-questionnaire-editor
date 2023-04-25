<template>
  <div class="row justify-center">
    <div class="col-6">
      <q-list class="rounded-borders">
        <q-expansion-item
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
                <div>
                  {{ $t("views.tabs.metadata.addNewId") }}
                </div></q-btn
              >
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
                  <div>
                    {{ $t("views.tabs.metadata.removeId") }}
                  </div></q-btn
                >
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
      <q-input
        v-if="$route.name !== 'Import'"
        v-model="URL"
        :label="$t('components.navigationBar.metadataItems.URL')"
      />
      <q-input
        v-if="$route.name !== 'Import'"
        v-model="version"
        :label="$t('components.navigationBar.version')"
      />
      <q-input
        v-if="$route.name !== 'Import'"
        v-model="name"
        :label="$t('components.navigationBar.metadataItems.name')"
      />
      <q-input
        v-if="$route.name !== 'Import'"
        v-model="title"
        :label="$t('components.navigationBar.metadataItems.title')"
      />
      <q-select
        v-if="$route.name !== 'Import'"
        v-model="status"
        :options="statusOptions"
        :label="$t('components.navigationBar.metadataItems.status')"
      />
      <q-input
        v-if="$route.name !== 'Import'"
        type="date"
        class="col-12"
        stack-label
        v-model="date"
        :label="$t('components.navigationBar.metadataItems.date')"
      />
      <q-input
        v-if="$route.name !== 'Import'"
        type="date"
        class="col-12"
        stack-label
        v-model="approvalDate"
        :label="$t('components.navigationBar.metadataItems.approvalDate')"
      />
      <q-input
        v-if="$route.name !== 'Import'"
        type="date"
        class="col-12"
        stack-label
        v-model="lastReviewDate"
        :label="$t('components.navigationBar.metadataItems.lastReviewDate')"
      />

      <q-item tag="label" v-ripple v-if="$route.name !== 'Import'">
        <q-item-section>
          <q-item-label>{{
            $t("components.navigationBar.metadataItems.experimental")
          }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="red" v-model="experimental" />
        </q-item-section>
      </q-item>
      <!-- extension -->
      <cx-extension
        v-if="questionnaire !== undefined"
        :extensions="(questionnaire.extension ??= [])"
        :predefinedExtensions="getQuestionnaireExtensions()"
        v-on:addExtension="addExtension"
        v-on:removeExtension="removeExtension"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent, Ref, ref } from "vue";
import { Extension, Identifier, Questionnaire, status } from "@/types";
import { getQuestionnaireExtensions } from "@/utils/extension";
import cxExtension from "./cxExtension.vue";

export default defineComponent({
  components: {
    cxExtension,
  },
  setup() {
    const questionnaire: Ref<Questionnaire | undefined> = ref(undefined);
    return {
      expanded: ref(true),
      statusOptions: status,
      getQuestionnaireExtensions,
      questionnaire,
    };
  },
  created() {
    this.questionnaire = this.getQuestionnaireImportedJSON;
  },
  computed: {
    ...mapGetters(["getNameOfQuestionnaire", "getQuestionnaireImportedJSON"]),
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
      set(value: string) {
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
    publisher: {
      get() {
        return this.$store.state.questionnaire.publisher;
      },
      set(value: string) {
        this.$store.commit("setPublisher", value);
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
    experimental: {
      get() {
        return this.$store.state.questionnaire.experimental;
      },
      set(value: boolean | null) {
        this.$store.commit("setExperimental", value);
      },
    },
  },
  methods: {
    addExtension(extension: Extension): void {
      this.questionnaire!.extension!.push(extension);
    },
    removeExtension(index: number): void {
      this.questionnaire!.extension!.splice(index, 1);
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
