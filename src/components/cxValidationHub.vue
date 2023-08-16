<template>
  <q-layout view="Lhh lpR fff" container class="bg-white">
    <div>
      <q-toolbar class="bg-red text-white shadow-2">
        <q-toolbar-title>Errors</q-toolbar-title>
      </q-toolbar>
      <div class="text-red q-pa-md" v-if="validationHasErrors()">
        Elements with errors will be deleted/altered during export!
      </div>
      <q-list separator>
        <q-item v-for="result in validationResult" :key="result.language">
          <div class="q-pa-md" v-if="nonEmptyErrors(result)">
            <q-toolbar
              class="bg-purple text-white shadow-2"
              clickable
              @click="switchLanguageFromValidationHub(result.language)"
            >
              <q-toolbar-title>
                {{ result.language.toUpperCase() }}
              </q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md" v-if="result.errors.items.length > 0">
              <div class="text-primary">
                Tab: {{ $t("views.tabsTitles.editorQRE") }}
              </div>
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
                  <div class="row">
                    <div class="text-weight-bold">
                      LinkId: "{{ item.linkId }}" - Position:
                      {{ item.position }}:
                    </div>
                    <q-list separator>
                      <q-item v-for="error in item.errors" :key="error">
                        <q-item-section>
                          <q-item-label>{{ error }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </q-item>
              </q-list>
            </div>
            <div class="q-pa-md" v-if="result.errors.primary.length > 0">
              <div class="text-primary">
                Tab: {{ $t("views.tabsTitles.primary") }}
              </div>
              <q-list bordered separator>
                <q-item
                  v-for="error in result.errors.primary"
                  :key="error"
                  clickable
                  @click="switchToPrimaryWithLanguage(result.language)"
                >
                  <q-item-section>
                    <q-item-label>{{ error }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="q-pa-md" v-if="result.errors.secondary.length > 0">
              <div class="text-primary">
                Tab: {{ $t("views.tabsTitles.secondary") }}
              </div>
              <q-list bordered separator>
                <q-item
                  v-for="error in result.errors.secondary"
                  :key="error"
                  clickable
                  @click="switchToSecondaryWithLanguage(result.language)"
                >
                  <q-item-section>
                    <q-item-label>{{ error }}</q-item-label>
                  </q-item-section>
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
      <q-toolbar class="bg-orange text-white shadow-2">
        <q-toolbar-title>Warnings</q-toolbar-title>
      </q-toolbar>
      <q-list separator>
        <q-item v-for="result in validationResult" :key="result.language">
          <div class="q-pa-md" v-if="nonEmptyWarnings(result)">
            <q-toolbar
              class="bg-purple text-white shadow-2"
              clickable
              @click="switchLanguageFromValidationHub(result.language)"
            >
              <q-toolbar-title>
                {{ result.language.toUpperCase() }}
              </q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md" v-if="result.warnings.items.length > 0">
              <div class="text-primary">
                Tab: {{ $t("views.tabsTitles.editorQRE") }}
              </div>
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
                  <div class="row">
                    <div class="text-weight-bold">
                      LinkId: "{{ item.linkId }}" - Position:
                      {{ item.position }}:
                    </div>
                    <q-list separator>
                      <q-item v-for="warning in item.warnings" :key="warning">
                        <q-item-section>
                          <q-item-label>{{ warning }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </q-item>
              </q-list>
            </div>
            <div class="q-pa-md" v-if="result.warnings.primary.length > 0">
              <div class="text-primary">
                Tab: {{ $t("views.tabsTitles.primary") }}
              </div>
              <q-list bordered separator>
                <q-item
                  v-for="warning in result.warnings.primary"
                  :key="warning"
                  clickable
                  @click="switchToPrimaryWithLanguage(result.language)"
                >
                  <q-item-section>
                    <q-item-label>{{ warning }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="q-pa-md" v-if="result.warnings.secondary.length > 0">
              <div class="text-primary">
                Tab: {{ $t("views.tabsTitles.secondary") }}
              </div>
              <q-list bordered separator>
                <q-item
                  v-for="warning in result.warnings.secondary"
                  :key="warning"
                  clickable
                  @click="switchToSecondaryWithLanguage(result.language)"
                >
                  <q-item-section>
                    <q-item-label>{{ warning }}</q-item-label>
                  </q-item-section>
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
import { ErrorChecker } from "@/utils/validation/ErrorChecker";
import { QuestionnaireReport } from "@/utils/validation/QuestionnaireValidator";
import { WarningChecker } from "@/utils/validation/WarningChecker";

const props = defineProps<{
  validationResult: QuestionnaireReport[];
}>();

const emit = defineEmits<{
  (e: "switchLanguageFromValidationHub", language: Language): void;
  (
    e: "switchToItemFromValidationHub",
    language: Language,
    internalId: string,
  ): void;
  (e: "switchToPrimary", lang: Language): void;
  (e: "switchToSecondary", lang: Language): void;
}>();

function switchLanguageFromValidationHub(language: Language): void {
  emit("switchLanguageFromValidationHub", language);
}
function switchToPrimaryWithLanguage(language: Language): void {
  emit("switchToPrimary", language);
}
function switchToSecondaryWithLanguage(language: Language): void {
  emit("switchToSecondary", language);
}
function switchToItemFromValidationHub(
  language: Language,
  internalId: string,
): void {
  emit("switchToItemFromValidationHub", language, internalId);
}
function nonEmptyErrors(result: QuestionnaireReport): boolean {
  return ErrorChecker.nonEmpty(result.errors);
}
function nonEmptyWarnings(result: QuestionnaireReport): boolean {
  return WarningChecker.nonEmpty(result.warnings);
}
function validationHasErrors(): boolean {
  return props.validationResult.some(nonEmptyErrors);
}
function validationHasNoWarnings(): boolean {
  return !props.validationResult.some(nonEmptyWarnings);
}
</script>
