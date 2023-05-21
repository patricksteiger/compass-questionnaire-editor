<template>
  <q-layout view="Lhh lpR fff" container class="bg-white">
    <div>
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>Errors</q-toolbar-title>
      </q-toolbar>
      <div class="q-pa-md" v-if="validationHasErrors()">
        Elements with errors will be deleted/altered during export!
      </div>
      <q-list separator>
        <q-item v-for="result in validationResult" :key="result.language">
          <div class="q-pa-md" v-if="nonEmptyErrors(result)">
            <q-toolbar
              class="bg-secondary text-white shadow-2"
              clickable
              @click="switchLanguageFromValidationHub(result.language)"
            >
              <q-toolbar-title>{{ result.language }}</q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md" v-if="result.errors.metadata.length > 0">
              Metadata:
              <q-list bordered separator>
                <q-item
                  v-for="error in result.errors.metadata"
                  :key="error"
                  clickable
                  @click="switchLanguageFromValidationHub(result.language)"
                >
                  <q-item-section>
                    <q-item-label>{{ error }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="q-pa-md" v-if="result.errors.items.length > 0">
              Items:
              <q-list bordered separator>
                <q-item
                  v-for="item in result.errors.items"
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
                    <q-item v-for="error in item.errors" :key="error">
                      <q-item-section>
                        <q-item-label>{{ error }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-item>
      </q-list>
      <div class="q-pa-md" v-if="!validationHasErrors()">
        There are no errors
      </div>
    </div>
    <div>
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>Warnings</q-toolbar-title>
      </q-toolbar>
      <q-list separator>
        <q-item v-for="result in validationResult" :key="result.language">
          <div class="q-pa-md" v-if="nonEmptyWarnings(result)">
            <q-toolbar
              class="bg-secondary text-white shadow-2"
              clickable
              @click="switchLanguageFromValidationHub(result.language)"
            >
              <q-toolbar-title>{{ result.language }}</q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md" v-if="result.warnings.metadata.length > 0">
              Metadata:
              <q-list bordered separator>
                <q-item
                  v-for="warning in result.warnings.metadata"
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
            <div class="q-pa-md" v-if="result.warnings.items.length > 0">
              Items:
              <q-list bordered separator>
                <q-item
                  v-for="item in result.warnings.items"
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
      <div class="q-pa-md" v-if="validationHasNoWarnings()">
        There are no warnings
      </div>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { Language } from "@/store";
import { QuestionnaireReport } from "@/utils/validation/QuestionnaireValidator";

const props = defineProps<{
  validationResult: QuestionnaireReport[];
}>();

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: "switchLanguageFromValidationHub", language: Language): void;
  (
    // eslint-disable-next-line no-unused-vars
    e: "switchToItemFromValidationHub",
    // eslint-disable-next-line no-unused-vars
    language: Language,
    // eslint-disable-next-line no-unused-vars
    internalId: string,
  ): void;
}>();

function switchLanguageFromValidationHub(language: Language): void {
  emit("switchLanguageFromValidationHub", language);
}
function switchToItemFromValidationHub(
  language: Language,
  internalId: string,
): void {
  emit("switchToItemFromValidationHub", language, internalId);
}
function nonEmptyErrors(result: QuestionnaireReport): boolean {
  const { errors } = result;
  return errors.metadata.length > 0 || errors.items.length > 0;
}
function nonEmptyWarnings(result: QuestionnaireReport): boolean {
  const { warnings } = result;
  return warnings.metadata.length > 0 || warnings.items.length > 0;
}
function validationHasErrors(): boolean {
  return props.validationResult.some(nonEmptyErrors);
}
function validationHasNoWarnings(): boolean {
  return !props.validationResult.some(nonEmptyWarnings);
}
</script>
