<template>
  <div class="row justify-center">
    <div class="col-6">
      <div>
        <q-input
          label="Copyright"
          v-model="questionnaire.copyright"
          type="textarea"
          autogrow
          clearable
        />
      </div>
      <div>
        <q-input
          label="CopyrightLabel"
          v-model="questionnaire.copyrightLabel"
          type="textarea"
          autogrow
          clearable
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { Questionnaire } from "@/types";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const questionnaire = ref<Questionnaire>(
      computed(() => store.getters.getQuestionnaireImportedJSON).value,
    );
    return {
      questionnaire,
    };
  },
});
</script>
