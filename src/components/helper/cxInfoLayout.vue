<template>
  <q-btn flat class="col-1" icon="info" color="blue" @click="showDialog = true">
    <cxTooltip v-if="tooltip !== undefined" :text="tooltip" />
  </q-btn>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="info" color="blue" text-color="white" />
        <slot name="content"></slot>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="blue" @click="showDialog = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import cxTooltip from "@/components/helper/cxTooltip.vue";

defineProps<{
  tooltip?: string;
}>();

const showDialog = ref(false);
</script>
