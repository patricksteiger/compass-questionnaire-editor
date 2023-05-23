<template>
  <div class="row">
    <q-input
      label="Start"
      class="col-6"
      dense
      clearable
      v-model="periodValue.start"
      :rules="[dateTools.isDateTimeOrEmpty]"
    />
    <q-input
      label="End"
      class="col-6"
      dense
      clearable
      v-model="periodValue.end"
      :rules="[dateTools.isDateTimeOrEmpty]"
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
