<template>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="warning" color="primary" text-color="white" />
      <span class="q-ml-sm"> {{ message }} </span>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="primary" v-close-popup />
      <q-btn
        flat
        label="Confirm"
        color="primary"
        v-close-popup
        @click="emit('confirmation')"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-unused-vars
const props = defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (_e: "confirmation"): void;
}>();
</script>
