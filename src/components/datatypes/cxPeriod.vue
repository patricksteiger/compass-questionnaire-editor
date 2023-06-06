<template>
  <div class="row justify-between">
    <q-input
      label="Start"
      class="col-5"
      dense
      clearable
      v-model="periodValue.start"
      :rules="[dateTools.isDateTimeOrEmpty]"
    />
    <q-btn
      label="Now"
      flat
      dense
      @click="() => (periodValue.start = dateTools.getCurrentDateTime())"
    />
    <q-input
      label="End"
      class="col-5"
      dense
      clearable
      v-model="periodValue.end"
      :rules="[dateTools.isDateTimeOrEmpty]"
    />
    <q-btn
      label="Now"
      flat
      dense
      @click="() => (periodValue.end = dateTools.getCurrentDateTime())"
    />
  </div>
</template>

<script setup lang="ts">
import { Period } from "@/types";
import { dateTools } from "@/utils/date";
import { ref } from "vue";

const props = defineProps<{
  period: Period;
}>();

const periodValue = ref(props.period);
</script>
