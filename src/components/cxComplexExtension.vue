<template>
  <q-list bordered class="bg-grey">
    <cxExtension
      :extensions="extensionValue.extension"
      :predefinedExtensions="[]"
      v-on:addExtension="(ext: Extension) => extensionValue.extension.push(ext)"
      v-on:removeExtension="(index: number) => extensionValue.extension.splice(index, 1)"
    />
  </q-list>
</template>

<script setup lang="ts">
import { ref } from "vue";
// eslint-disable-next-line no-unused-vars
import { ComplexExtension, Extension } from "@/types";
import cxExtension from "@/components/cxExtension.vue";

// const splitterModel = ref(50);

const props = defineProps<{
  extension: ComplexExtension;
}>();

const extensionValue = ref(props.extension);
</script>
