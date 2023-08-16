<template>
  <div class="row justify-between">
    <cxDateTime
      inputClass="col-5"
      label="Start"
      :value="(period.start ??= '')"
      v-on:update="
        (value) => {
          period.start = value;
          $store.commit('saveState');
        }
      "
    />
    <cxDateTime
      inputClass="col-5"
      label="End"
      :value="(period.end ??= '')"
      v-on:update="
        (value) => {
          period.end = value;
          $store.commit('saveState');
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { Period } from "@/types";
import { toRefs } from "vue";
import cxDateTime from "@/components/datatypes/cxDateTime.vue";

const props = defineProps<{
  period: Period;
}>();

const { period } = toRefs(props);
</script>
