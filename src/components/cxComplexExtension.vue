<template>
  <q-list bordered class="bg-grey">
    <cxExtension
      :extensions="extensions"
      :predefinedExtensions="[]"
      v-on:addExtension="(ext: Extension) => extensions.push(ext)"
      v-on:removeExtension="(index: number) => extensions.splice(index, 1)"
    />
  </q-list>
</template>

<script setup lang="ts">
import { ref } from "vue";
// eslint-disable-next-line no-unused-vars
import { ComplexExtension, Extension } from "@/types";
import cxExtension from "@/components/cxExtension.vue";

const props = defineProps<{
  extension: ComplexExtension;
}>();

const extensions = ref(props.extension.extension);
</script>
