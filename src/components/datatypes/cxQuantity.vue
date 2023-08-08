<template>
  <div class="q-pa-md">
    <q-input
      label="Value"
      class="col-4"
      v-model.number="quantityValue.value"
      type="number"
      dense
    />
    <q-input
      label="Code"
      class="col-4"
      v-model="quantityValue.code"
      type="text"
      dense
    />
    <q-input
      label="Unit"
      class="col-4"
      v-model="quantityValue.unit"
      type="text"
      dense
    />
    <q-input
      label="System"
      class="col-4"
      v-model="quantityValue.system"
      type="text"
      dense
    />
    <q-select
      label="Comparator"
      class="col-4"
      v-model="quantityValue.comparator"
      :options="comparators"
      dense
    />
    <q-separator />
    <q-btn class="col-4" icon="add" @click="addQuantity(quantityValue)" />
  </div>
</template>

<script setup lang="ts">
import { comparators, Quantity } from "@/types";
import { toRef } from "vue";

const props = defineProps<{
  quantity: Quantity;
}>();

const quantityValue = toRef(props, "quantity");

const emit = defineEmits<{
  (e: "addQuantity", _coding: Quantity): void;
}>();

function addQuantity(coding: Quantity): void {
  emit("addQuantity", coding);
}
</script>
