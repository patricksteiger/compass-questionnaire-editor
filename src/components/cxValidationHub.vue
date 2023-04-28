<template>
  <q-layout view="Lhh lpR fff" container class="bg-white">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Warnings</q-toolbar-title>
    </q-toolbar>
    <q-list separator>
      <q-item v-for="result in validationResult" :key="result.language">
        <div
          class="q-pa-md"
          v-if="result.metadata.length > 0 || result.items.length > 0"
        >
          <q-toolbar
            class="bg-secondary text-white shadow-2"
            clickable
            @click="switchLanguageFromValidationHub(result.language)"
          >
            <q-toolbar-title>{{ result.language }}</q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-md" v-if="result.metadata.length > 0">
            Metadata:
            <q-list bordered separator>
              <q-item
                v-for="warning in result.metadata"
                :key="warning"
                clickable
                @click="switchLanguageFromValidationHub(result.language)"
              >
                <q-item-section>
                  <q-item-label>{{ warning }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="q-pa-md" v-if="result.items.length > 0">
            Items:
            <q-list bordered separator>
              <q-item
                v-for="item in result.items"
                :key="item.linkId"
                clickable
                @click="
                  switchToItemFromValidationHub(
                    result.language,
                    item.internalId,
                  )
                "
              >
                {{ item.linkId }}
                <q-list separator>
                  <q-item v-for="warning in item.warnings" :key="warning">
                    <q-item-section>
                      <q-item-label>{{ warning }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-item>
    </q-list>
    <div v-if="validationHasNoWarnings()">There are no warnings</div>
  </q-layout>
</template>

<script lang="ts">
import { Language } from "@/store";
import { Questionnaire } from "@/types";
import { Validator } from "@/utils/validation/Validator";
import { defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    questionnaires: {
      type: Object as PropType<Questionnaire[]>,
      required: true,
    },
  },
  setup(prop) {
    const validationResult = ref(Validator.check(prop.questionnaires));
    return { validationResult };
  },
  emtis: {
    switchLanguageFromValidationHub(language: Language): boolean {
      return !!language;
    },
    switchToItemFromValidationHub(
      language: Language,
      internalId: string,
    ): boolean {
      return !!language && !!internalId;
    },
  },
  methods: {
    switchLanguageFromValidationHub(language: Language): void {
      this.$emit("switchLanguageFromValidationHub", language);
    },
    switchToItemFromValidationHub(
      language: Language,
      internalId: string,
    ): void {
      this.$emit("switchToItemFromValidationHub", language, internalId);
    },
    validationHasNoWarnings(): boolean {
      for (const result of this.validationResult) {
        if (result.metadata.length > 0 || result.items.length > 0) {
          return false;
        }
      }
      return true;
    },
  },
});
</script>
