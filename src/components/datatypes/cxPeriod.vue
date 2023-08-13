<template>
  <div class="row justify-between">
    <q-input
      label="Start"
      class="col-5"
      dense
      clearable
      v-model="periodValue.start"
      @update:model-value="$store.commit('saveState')"
      :rules="[dateTools.isDateTimeOrEmpty]"
    />
    <q-btn
      label="Now"
      flat
      dense
      @click="
        () => {
          periodValue.start = dateTools.getCurrentDateTime();
          $store.commit('saveState');
        }
      "
    />
    <q-input
      label="End"
      class="col-5"
      dense
      clearable
      v-model="periodValue.end"
      @update:model-value="$store.commit('saveState')"
      :rules="[dateTools.isDateTimeOrEmpty]"
    />
    <q-btn
      label="Now"
      flat
      dense
      @click="
        () => {
          periodValue.end = dateTools.getCurrentDateTime();
          $store.commit('saveState');
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { Period } from "@/types";
import { dateTools } from "@/utils/date";
import { toRef } from "vue";

const props = defineProps<{
  period: Period;
}>();

const periodValue = toRef(props, "period");
</script>
