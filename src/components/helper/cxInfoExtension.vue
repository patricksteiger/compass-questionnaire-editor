<template>
  <cxInfoLayout header="Extension" :tooltip="$t('tutorial.info.extension')">
    <template v-slot:content>
      <p class="text-bold">General information</p>
      <p>
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
      </p>
      <p class="text-bold">Structure</p>
      <p>
        An extension always contains a URL pointing to the definition of its
        content and meaning. Additionally, an extension can be simple or
        complex. A simple extension contains a value, while a complex extension
        contains other extensions.
      </p>
      <p class="text-bold">Usage</p>
      <p>
        Extensions have to be known by the application processing the
        questionnaire to actually have an effect.
      </p>
    </template>
  </cxInfoLayout>
</template>

<script setup lang="ts">
import cxInfoLayout from "@/components/helper/cxInfoLayout.vue";
</script>
