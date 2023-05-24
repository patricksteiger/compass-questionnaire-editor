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
          <q-list bordered separator>
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
            label="ContactDetail"
            @click="() => contact.push({ name: '', telecom: [] })"
          />
        </q-expansion-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { computed, defineComponent, ref } from "vue";
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
    };
  },
});
</script>
