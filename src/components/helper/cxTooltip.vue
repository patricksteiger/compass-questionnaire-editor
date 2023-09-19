<template>
  <q-tooltip class="text-body1" max-width="600px">
    {{ text }}
  </q-tooltip>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>
