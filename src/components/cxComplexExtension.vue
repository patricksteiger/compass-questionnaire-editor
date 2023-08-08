<template>
  <q-list bordered class="bg-grey">
    <cxExtension
      :title="$t('views.editor.extensions')"
      :extensions="extensions"
      :predefinedExtensions="[]"
      v-on:addExtension="(ext) => extensions.push(ext)"
      v-on:removeExtension="(index) => extensions.splice(index, 1)"
    />
  </q-list>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { ComplexExtension } from "@/types";
import cxExtension from "@/components/cxExtension.vue";

const props = defineProps<{
  extension: ComplexExtension;
}>();

const { extension } = toRefs(props);
const extensions = ref(extension.value.extension);
</script>
