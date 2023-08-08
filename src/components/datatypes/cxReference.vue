<template>
  <div class="q-pa-md">
    <q-input
      label="Reference"
      class="col-4"
      v-model="referenceValue.reference"
      type="text"
      dense
    />
    <q-input
      label="Type"
      class="col-4"
      v-model="referenceValue.type"
      type="text"
      dense
    />
    <q-input
      label="Display"
      class="col-4"
      v-model="referenceValue.display"
      type="text"
      dense
    />
    <q-separator />
    <q-btn class="col-4" icon="add" @click="addReference(referenceValue)" />
  </div>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { Reference } from "@/types";

const props = defineProps<{
  reference: Reference;
}>();

const referenceValue = toRef(props, "reference");

const emit = defineEmits<{
  (e: "addReference", _reference: Reference): void;
}>();

function addReference(reference: Reference): void {
  emit("addReference", reference);
}
</script>
