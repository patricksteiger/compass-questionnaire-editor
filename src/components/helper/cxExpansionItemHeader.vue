<template>
  <q-icon left :name="icon" size="sm" />
  <q-item-section>
    {{ title }}
  </q-item-section>
  <q-tooltip>{{ tooltip }}</q-tooltip>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  tooltip: string;
}>();
</script>
