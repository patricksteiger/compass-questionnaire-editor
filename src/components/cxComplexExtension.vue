<template>
  <q-list bordered class="bg-grey">
    <cxExtension
      :extensions="extensions"
      :predefinedExtensions="[]"
      v-on:addExtension="(ext) => extensions.push(ext)"
      v-on:removeExtension="(index) => extensions.splice(index, 1)"
    />
  </q-list>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ComplexExtension } from "@/types";
import cxExtension from "@/components/cxExtension.vue";

const props = defineProps<{
  extension: ComplexExtension;
}>();

const extensions = ref(props.extension.extension);
</script>
