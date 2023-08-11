<template>
  <q-icon left :name="icon" size="sm" />
  <q-item-section>
    {{ title }}
  </q-item-section>
  <cxTooltip :text="tooltip" />
</template>

<script setup lang="ts">
import cxTooltip from "./cxTooltip.vue";

defineProps<{
  icon: string;
  title: string;
  tooltip: string;
}>();
</script>
