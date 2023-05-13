<template>
  <div class="q-pa-md">
    <q-input
      label="Code"
      class="col-4"
      v-model="codingValue.code"
      type="text"
      dense
    />
    <q-input
      label="Display"
      class="col-4"
      v-model="codingValue.display"
      type="text"
      dense
    />
    <q-input
      label="System"
      class="col-4"
      v-model="codingValue.system"
      type="text"
      dense
    />
    <q-input
      label="Version"
      class="col-4"
      v-model="codingValue.version"
      type="text"
      dense
    />
    <q-toggle
      label="UserSelected"
      class="col-4"
      v-model.boolean="codingValue.userSelected"
      toggle-indeterminate
      dense
    />
    <q-separator />
    <q-btn class="col-4" icon="add" @click="addCoding(codingValue)" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Coding } from "@/types";

const props = defineProps<{
  coding: Coding;
}>();

const codingValue = ref(props.coding);

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: "addCoding", _coding: Coding): void;
}>();

function addCoding(coding: Coding): void {
  emit("addCoding", coding);
}
</script>
