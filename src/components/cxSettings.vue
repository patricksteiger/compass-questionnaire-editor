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
import { resourceTypes } from "@/utils/resourceType";
import cxCode from "@/components/cxCode.vue";
import cxContactDetail from "@/components/datatypes/cxContactDetail.vue";
import { ContactDetail, Questionnaire } from "@/types";

export default defineComponent({
  components: {
    cxCode,
    cxContactDetail,
  },
  setup() {
    const questionnaire = ref<Questionnaire>(
      computed(() => store.getters.getQuestionnaireImportedJSON).value,
    );
    const contact = ref<ContactDetail[]>(questionnaire.value.contact);
    return {
      questionnaire,
      contact,
      resourceTypes,
    };
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
