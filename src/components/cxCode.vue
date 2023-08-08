<template>
  <q-expansion-item label="Code" expand-separator icon="code">
    <q-list
      dense
      bordered
      separator
      padding
      class="rounded-borders"
      key="Codes"
    >
      <q-item v-for="(code, index) in codesValue" :key="index">
        <q-item-section>
          <div clickable @click="showComplexDialog(code)">
            <q-field
              label="CODING"
              stack-label
              :error="editorTools.isEmptyObject(code)"
              error-message="Coding must be non-empty"
              dense
            >
              <template v-slot:control>
                <div>
                  {{ editorTools.formatCoding(code) }}
                </div>
              </template>
              <template v-slot:prepend>
                <div>
                  {{ index + 1 }}
                </div>
              </template>
            </q-field>
          </div>
        </q-item-section>
        <q-btn
          icon="highlight_off"
          flat
          color="grey-6"
          @click="() => codesValue.splice(index, 1)"
        />
      </q-item>
    </q-list>
    <q-btn
      label="Code"
      icon="add"
      padding="none xl"
      color="primary"
      fab
      @click="() => codesValue.push({})"
    />
  </q-expansion-item>

  <q-dialog v-model="complexLayout" v-if="selectedCoding !== undefined">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title> Code </q-toolbar-title>
          </q-toolbar>
          <cxCoding
            :coding="selectedCoding"
            v-on:addCoding="(_coding) => (complexLayout = false)"
          />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { Coding } from "@/types";
import { ref, toRef } from "vue";
import { editorTools } from "@/utils/editor";
import cxCoding from "@/components/datatypes/cxCoding.vue";

const props = defineProps<{
  codes: Coding[];
}>();

const codesValue = toRef(props, "codes");

const complexLayout = ref(false);
const selectedCoding = ref<Coding | undefined>(undefined);
function showComplexDialog(coding: Coding) {
  selectedCoding.value = coding;
  complexLayout.value = true;
}
</script>
