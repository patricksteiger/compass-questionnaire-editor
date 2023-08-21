<template>
  <cxInfoLayout :tooltip="$t('tutorial.info.extension')">
    <template v-slot:content>
      <span class="q-pa-md text-bold"> General information </span>
      <span class="q-pa-xs">
        Extensions add functionalities, that are not part of the base FHIR
        specification. Examples for extensions range from notes for implementers
        only, to additional functionalities like minimum length for answers. An
        overview of the extensions of the core FHIR specification can be viewed
        in the
        <a
          target="_blank"
          href="https://hl7.org/fhir/extensions/extensions-Questionnaire.html/"
        >
          Extensions tab
        </a>
        of the Documentation.
      </span>
      <span class="q-pa-xs text-bold"> Structure </span>
      <span class="q-pa-xs">
        An extension always contains a URL pointing to the definition of its
        content and meaning. Additionally, an extension can be simple or
        complex. A simple extension contains a value, while a complex extension
        contains other extensions.
      </span>
      <span class="q-pa-xs text-bold"> Usage </span>
      <span class="q-pa-xs">
        Extensions have to be known by the application processing the
        questionnaire to actually have an effect.
      </span>
    </template>
  </cxInfoLayout>
</template>

<script setup lang="ts">
import cxInfoLayout from "@/components/helper/cxInfoLayout.vue";
</script>
