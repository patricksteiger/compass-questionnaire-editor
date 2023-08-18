<template>
  <div class="q-pa-md">
    <div class="text-h6" v-if="header">{{ header }}</div>
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
    <q-btn
      v-if="!noButton"
      class="col-4"
      icon="add"
      @click="addCoding(codingValue)"
    />
  </div>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { Coding } from "@/types";

const props = defineProps<{
  coding: Coding;
  noButton?: true;
  header?: string;
}>();

const codingValue = toRef(props, "coding");

const emit = defineEmits<{
  (e: "addCoding", _coding: Coding): void;
}>();

function addCoding(coding: Coding): void {
  emit("addCoding", coding);
}
</script>
