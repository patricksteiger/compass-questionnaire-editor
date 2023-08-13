<template>
  <div>
    <div>
      <q-input
        label="Text"
        v-model="text"
        clearable
        @clear="() => (text = '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CodeableConcept } from "@/types";
import { toRefs } from "vue";

const props = defineProps<{
  value: CodeableConcept;
}>();

const { value: codeableConcept } = toRefs(props);
const { text } = toRefs(codeableConcept.value);
</script>
