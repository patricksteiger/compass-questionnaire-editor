<template>
  <div class="q-pa-md">
    <q-input
      label="Value"
      class="col-4"
      v-model.number="quantity.value"
      type="number"
      dense
    />
    <q-input
      label="Code"
      class="col-4"
      v-model="quantity.code"
      type="text"
      dense
    />
    <q-input
      label="Unit"
      class="col-4"
      v-model="quantity.unit"
      type="text"
      dense
    />
    <q-input
      label="System"
      class="col-4"
      v-model="quantity.system"
      type="text"
      dense
    />
    <q-separator />
    <q-btn class="col-4" icon="add" @click="addSimpleQuantity(quantity)" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SimpleQuantity } from "@/types";

const props = defineProps<{
  simpleQuantity: SimpleQuantity;
}>();

const quantity = ref(props.simpleQuantity);

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: "addSimpleQuantity", _coding: SimpleQuantity): void;
}>();

function addSimpleQuantity(coding: SimpleQuantity): void {
  emit("addSimpleQuantity", coding);
}
</script>
