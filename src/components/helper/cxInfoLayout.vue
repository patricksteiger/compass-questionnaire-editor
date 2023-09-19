<template>
  <q-btn flat class="col-1" icon="info" color="blue" @click="showDialog = true">
    <cxTooltip v-if="tooltip !== undefined" :text="tooltip" />
  </q-btn>

  <q-dialog v-model="showDialog">
    <q-card full-width>
      <q-card-section style="max-height: 80vh" class="scroll">
        <div class="row q-mb-md">
          <q-avatar icon="info" color="blue" text-color="white" />
          <div class="text-h5 q-ml-md q-mt-sm text-primary">
            {{ header }}
          </div>
        </div>
        <div>
          <slot name="content"></slot>
        </div>
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
  header: string;
  tooltip?: string;
}>();

const showDialog = ref(false);
</script>
