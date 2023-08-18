<template>
  <div>
    <q-list bordered separator>
      <div>
        <q-input label="Text" v-model="text" clearable @clear="text = ''" />
      </div>
      <div>
        <q-expansion-item expand-separator>
          <template v-slot:header>
            <cxExpansionItemHeader icon="code" title="Coding" tooltip="Codes" />
          </template>
          <q-separator />
          <q-list bordered separator>
            <q-item v-for="(code, index) in coding" :key="index">
              <q-item-section>
                <cxCoding
                  :coding="code"
                  :noButton="true"
                  :header="index + 1 + '. Coding'"
                />
              </q-item-section>
            </q-item>
            <q-btn
              padding="none xl"
              fab
              icon="add"
              color="primary"
              label="Coding"
              @click="coding.push({})"
            />
          </q-list>
        </q-expansion-item>
      </div>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { CodeableConcept } from "@/types";
import { toRefs } from "vue";
import cxCoding from "@/components/datatypes/cxCoding.vue";
import cxExpansionItemHeader from "@/components/helper/cxExpansionItemHeader.vue";

const props = defineProps<{
  value: CodeableConcept;
}>();

const { value: codeableConcept } = toRefs(props);
const { text, coding } = toRefs(codeableConcept.value);
</script>
