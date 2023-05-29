<template>
  <div class="row justify-center">
    <div class="col-6">
      <div>
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
      </div>

      <q-separator />

      <!-- derivedFrom -->
      <div>
        <q-expansion-item icon="upgrade" label="DerivedFrom">
          <q-list
            v-if="$route.name !== 'Import' && questionnaire !== undefined"
            bordered
            separator
            dense
            padding
            class="rounded-borders"
          >
            <q-item
              v-for="(derivedFrom, index) in questionnaire.derivedFrom"
              :key="index"
            >
              <q-item-section>
                <div class="row">
                  <q-input
                    :model-value="derivedFrom"
                    @update:model-value="(v) => {
                      if (v === null) {
                        questionnaire!.derivedFrom[index] = '';
                      } else if (typeof v === 'string') {
                        questionnaire!.derivedFrom[index] = v;
                      }
                    }"
                    clearable
                  >
                    <template v-slot:prepend>
                      <div>{{ index + 1 }}</div>
                    </template>
                  </q-input>
                </div>
              </q-item-section>
              <q-btn
                flat
                icon="highlight_off"
                color="grey-6"
                @click="() => questionnaire!.derivedFrom.splice(index, 1)"
              />
            </q-item>
          </q-list>
          <q-btn
            icon="add"
            label="DerivedFrom"
            padding="none xl"
            color="primary"
            fab
            @click="() => questionnaire!.derivedFrom.push('')"
          />
        </q-expansion-item>
      </div>

      <!-- subjectType -->
      <div>
        <q-expansion-item icon="quickreply" label="SubjectType">
          <q-list
            v-if="$route.name !== 'Import' && questionnaire !== undefined"
            bordered
            separator
            dense
            padding
            class="rounded-borders"
          >
            <q-item
              v-for="(subjectType, index) in questionnaire.subjectType"
              :key="index"
            >
              <q-item-section>
                <div class="row">
                  <q-select
                    :options="resourceTypes"
                    :model-value="subjectType"
                    @update:model-value="(v) => (questionnaire!.subjectType[index] = v)"
                  >
                    <template v-slot:prepend>
                      <div>{{ index + 1 }}</div>
                    </template>
                  </q-select>
                </div>
              </q-item-section>
              <q-btn
                flat
                icon="highlight_off"
                color="grey-6"
                @click="() => questionnaire!.subjectType.splice(index, 1)"
              />
            </q-item>
          </q-list>
          <q-btn
            icon="add"
            label="SubjectType"
            padding="none xl"
            color="primary"
            fab
            @click="() => questionnaire!.subjectType.push('Patient')"
          />
        </q-expansion-item>
      </div>

      <!-- code -->
      <div>
        <cxCode :codes="questionnaire.code" />
      </div>

      <!-- UseContext -->
      <div>
        <q-expansion-item icon="unfold_more" label="UseContext">
          <q-list bordered separator dense padding class="rounded-borders">
            <q-item
              v-for="(usageContext, index) in questionnaire.useContext"
              :key="index"
            >
              <q-item-section>
                <div clickable @click="showUseContextDialog(usageContext)">
                  <q-field
                    label="CODE"
                    stack-label
                    :error="editorTools.isEmptyObject(usageContext.code)"
                    error-message="Coding must be non-empty"
                    dense
                  >
                    <template v-slot:control>
                      <div>
                        {{ editorTools.formatCoding(usageContext.code) }}
                      </div>
                    </template>
                    <template v-slot:prepend>
                      <div>
                        {{ index + 1 }}
                      </div>
                    </template>
                  </q-field>
                </div>
                <div v-if="usageContext.__type === 'codeableConcept'">
                  <div clickable @click="showUseContextDialog(usageContext)">
                    <q-field
                      label="Text"
                      autogrow
                      type="textarea"
                      v-model="usageContext.valueCodeableConcept.text"
                    />
                  </div>
                  <q-expansion-item icon="code" label="Coding">
                    <q-list
                      bordered
                      separator
                      dense
                      padding
                      class="rounded-borders"
                    >
                      <q-item
                        v-for="(coding, cIndex) in usageContext
                          .valueCodeableConcept.coding"
                        :key="cIndex"
                      >
                        <q-item-section
                          clickable
                          @click="showUseContextDialog(usageContext)"
                        >
                          <q-field
                            label="CODING"
                            stack-label
                            :error="editorTools.isEmptyObject(coding)"
                            error-message="Coding must be non-empty"
                            dense
                          >
                            <template v-slot:control>
                              <div>
                                {{ editorTools.formatCoding(coding) }}
                              </div>
                            </template>
                          </q-field>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-expansion-item>
                </div>
                <div
                  v-else-if="usageContext.__type === 'quantity'"
                  clickable
                  @click="showUseContextDialog(usageContext)"
                >
                  <q-field
                    :label="usageContext.__type.toUpperCase()"
                    stack-label
                    :error="
                      editorTools.isEmptyObject(usageContext.valueQuantity)
                    "
                    error-message="Quantity must be non-empty"
                    dense
                  >
                    <template v-slot:control>
                      <div>
                        {{
                          editorTools.formatQuantity(usageContext.valueQuantity)
                        }}
                      </div>
                    </template>
                  </q-field>
                </div>
                <div
                  v-else-if="usageContext.__type === 'range'"
                  clickable
                  @click="showUseContextDialog(usageContext)"
                >
                  <q-field
                    label="LOW"
                    stack-label
                    :error="
                      editorTools.isEmptyObject(usageContext.valueRange.low)
                    "
                    error-message="SimpleQuantity must be non-empty"
                    dense
                  >
                    <template v-slot:control>
                      <div>
                        {{
                          editorTools.formatSimpleQuantity(
                            usageContext.valueRange.low ?? {},
                          )
                        }}
                      </div>
                    </template>
                  </q-field>
                  <q-field
                    label="HIGH"
                    stack-label
                    :error="
                      editorTools.isEmptyObject(usageContext.valueRange.high)
                    "
                    error-message="SimpleQuantity must be non-empty"
                    dense
                  >
                    <template v-slot:control>
                      <div>
                        {{
                          editorTools.formatSimpleQuantity(
                            usageContext.valueRange.high ?? {},
                          )
                        }}
                      </div>
                    </template>
                  </q-field>
                </div>
                <div
                  v-else-if="usageContext.__type === 'reference'"
                  clickable
                  @click="showUseContextDialog(usageContext)"
                >
                  <q-field
                    :label="usageContext.__type.toUpperCase()"
                    stack-label
                    :error="
                      editorTools.isEmptyObject(usageContext.valueReference)
                    "
                    error-message="Reference must be non-empty"
                    dense
                  >
                    <template v-slot:control>
                      <div>
                        {{
                          editorTools.formatReference(
                            usageContext.valueReference,
                          )
                        }}
                      </div>
                    </template>
                  </q-field>
                </div>
              </q-item-section>
              <q-btn
                flat
                icon="highlight_off"
                color="grey-6"
                @click="() => questionnaire.useContext.splice(index, 1)"
              />
            </q-item>
          </q-list>
          <q-fab
            v-model="fabUseContext"
            vertical-actions-align="center"
            color="primary"
            push
            icon="keyboard_arrow_right"
            direction="right"
            padding="none xl"
            label="Add UseContext"
          >
            <q-fab-action
              v-for="useContextType in useContextTypes"
              :key="useContextType"
              label-position="right"
              color="primary"
              @click="addNewToUseContext(useContextType)"
              :label="useContextType.toUpperCase()"
            />
          </q-fab>
        </q-expansion-item>
      </div>

      <q-dialog
        v-model="useContextLayout"
        v-if="currentUsageContext !== undefined"
      >
        <q-layout view="Lhh lpR fff" container class="bg-white">
          <q-page-container>
            <q-page padding>
              <q-toolbar class="bg-primary text-white shadow-2">
                <q-toolbar-title> UsageContext: CODE </q-toolbar-title>
              </q-toolbar>
              <div>
                <cxCoding
                  :coding="currentUsageContext.code"
                  v-on:addCoding="(_coding) => (useContextLayout = false)"
                />
              </div>
              <q-toolbar class="bg-primary text-white shadow-2">
                <q-toolbar-title>
                  UsageContext: {{ currentUsageContext.__type.toUpperCase() }}
                </q-toolbar-title>
              </q-toolbar>
              <div v-if="currentUsageContext.__type === 'codeableConcept'">
                <q-input
                  label="Text"
                  autogrow
                  type="textarea"
                  v-model="currentUsageContext.valueCodeableConcept.text"
                />
                <q-separator />
                Coding:
                <q-list
                  bordered
                  separator
                  dense
                  padding
                  class="rounded-borders"
                >
                  <q-item
                    v-for="(coding, cIndex) in currentUsageContext
                      .valueCodeableConcept.coding"
                    :key="cIndex"
                  >
                    <q-item-section>
                      {{ cIndex + 1 }}
                      <cxCoding :coding="coding" />
                    </q-item-section>
                    <q-btn
                      flat
                      icon="highlight_off"
                      color="grey-6"
                      @click="removeCodingFrom(currentUsageContext, cIndex)"
                    />
                  </q-item>
                  <q-btn
                    icon="add"
                    padding="none xl"
                    color="primary"
                    fab
                    label="Coding"
                    @click="addCodingTo(currentUsageContext)"
                  />
                </q-list>
                <q-btn icon="add" @click="() => (useContextLayout = false)" />
              </div>
              <div v-else-if="currentUsageContext.__type === 'quantity'">
                <cxQuantity
                  :quantity="currentUsageContext.valueQuantity"
                  v-on:addQuantity="(_quantity) => (useContextLayout = false)"
                />
              </div>
              <div v-else-if="currentUsageContext.__type === 'range'">
                Low:
                <cxSimpleQuantity
                  :simpleQuantity="(currentUsageContext.valueRange.low ??= {})"
                  v-on:addSimpleQuantity="
                    (_quantity) => (useContextLayout = false)
                  "
                />
                High:
                <cxSimpleQuantity
                  :simpleQuantity="(currentUsageContext.valueRange.high ??= {})"
                  v-on:addSimpleQuantity="
                    (_quantity) => (useContextLayout = false)
                  "
                />
              </div>
              <div v-else-if="currentUsageContext.__type === 'reference'">
                <cxReference
                  :reference="currentUsageContext.valueReference"
                  v-on:addReference="(_reference) => (useContextLayout = false)"
                />
              </div>
              <div v-else>
                {{ unreachableCode(currentUsageContext) }}
              </div>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

      <!-- Contact -->
      <div>
        <q-expansion-item icon="contacts" label="Contact">
          <q-list bordered separator dense padding class="rounded-borders">
            <q-item
              v-for="(contactDetail, index) in contact"
              :key="`set_${index}`"
            >
              <q-item-section>
                <q-input label="Name" v-model="contactDetail.name" clearable />
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
                @click="() => contact.splice(index, 1)"
              />
            </q-item>
          </q-list>
          <q-btn
            icon="add"
            padding="none xl"
            color="primary"
            fab
            label="ContactDetail"
            @click="() => contact.push({ name: '', telecom: [] })"
          />
        </q-expansion-item>
      </div>

      <div>
        <q-input
          v-model="publisher"
          :label="$t('components.navigationBar.metadataItems.publisher')"
          autogrow
          clearable
          @clear="() => (publisher = '')"
        />
      </div>

      <div>
        <q-input
          v-model="purpose"
          :label="$t('components.navigationBar.metadataItems.purpose')"
          autogrow
          clearable
          @clear="() => (purpose = '')"
        />
      </div>

      <div>
        <q-input
          v-model="description"
          :label="$t('components.navigationBar.metadataItems.description')"
          autogrow
          clearable
          @clear="() => (description = '')"
        />
      </div>

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
    </div>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { editorTools, UnreachableError } from "@/utils/editor";
import { dateTools } from "@/utils/date";
import { resourceTypes } from "@/utils/resourceType";
import cxCode from "@/components/cxCode.vue";
import cxContactDetail from "@/components/datatypes/cxContactDetail.vue";
import cxCoding from "@/components/datatypes/cxCoding.vue";
import cxQuantity from "@/components/datatypes/cxQuantity.vue";
import cxSimpleQuantity from "@/components/datatypes/cxSimpleQuantity.vue";
import cxReference from "@/components/datatypes/cxReference.vue";
import {
  ContactDetail,
  Questionnaire,
  UsageContext,
  UseContextType,
  useContextTypes,
} from "@/types";

export default defineComponent({
  components: {
    cxCode,
    cxContactDetail,
    cxCoding,
    cxQuantity,
    cxSimpleQuantity,
    cxReference,
  },
  setup() {
    const questionnaire = ref<Questionnaire>(
      computed(() => store.getters.getQuestionnaireImportedJSON).value,
    );
    const contact = ref<ContactDetail[]>(questionnaire.value.contact);
    const currentUsageContext = ref<UsageContext | undefined>(undefined);
    return {
      dateTools,
      editorTools,
      questionnaire,
      contact,
      resourceTypes,
      currentUsageContext,
      useContextLayout: ref(false),
      fabUseContext: ref(true),
      useContextTypes,
    };
  },
  methods: {
    showUseContextDialog(usageContext: UsageContext) {
      this.currentUsageContext = usageContext;
      this.useContextLayout = true;
    },
    removeCodingFrom(usageContext: UsageContext, index: number) {
      if (usageContext.__type === "codeableConcept") {
        usageContext.valueCodeableConcept.coding.splice(index, 1);
      }
    },
    addCodingTo(usageContext: UsageContext) {
      if (usageContext.__type === "codeableConcept") {
        usageContext.valueCodeableConcept.coding.push({});
      }
    },
    addNewToUseContext(type: UseContextType) {
      let usageContext: UsageContext;
      switch (type) {
        case "codeableConcept":
          usageContext = {
            __type: type,
            code: {},
            valueCodeableConcept: { coding: [] },
          };
          break;
        case "quantity":
          usageContext = { __type: type, code: {}, valueQuantity: {} };
          break;
        case "range":
          usageContext = { __type: type, code: {}, valueRange: {} };
          break;
        case "reference":
          usageContext = { __type: type, code: {}, valueReference: {} };
          break;
        default:
          throw new UnreachableError(type);
      }
      this.questionnaire.useContext.push(usageContext);
    },
    unreachableCode(n: never) {
      throw new UnreachableError(n);
    },
  },
  computed: {
    experimental: {
      get(): boolean {
        return this.$store.state.questionnaire.experimental;
      },
      set(value: string) {
        this.$store.commit("setExperimental", value);
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
});
</script>
