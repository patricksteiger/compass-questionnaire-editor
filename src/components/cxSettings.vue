<template>
  <div class="row justify-center">
    <div class="col-6">
      <div>
        <q-input
          label="Copyright"
          v-model="questionnaire.copyright"
          type="textarea"
          autogrow
          clearable
        />
      </div>
      <div>
        <q-input
          label="CopyrightLabel"
          v-model="questionnaire.copyrightLabel"
          type="textarea"
          autogrow
          clearable
        />
      </div>
      <div>
        <cxCode :codes="questionnaire.code" />
      </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "@/store";
import { computed, ref } from "vue";
import { resourceTypes } from "@/utils/resourceType";
import cxCode from "@/components/cxCode.vue";
import cxContactDetail from "@/components/datatypes/cxContactDetail.vue";
import { ContactDetail, Questionnaire } from "@/types";

const questionnaire = ref<Questionnaire>(
  computed(() => store.getters.getQuestionnaireImportedJSON).value,
);
const contact = ref<ContactDetail[]>(questionnaire.value.contact);
</script>
