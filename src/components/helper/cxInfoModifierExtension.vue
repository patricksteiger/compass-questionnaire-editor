<template>
  <cxInfoLayout
    header="ModifierExtension"
    :tooltip="$t('tutorial.info.modifierExtension')"
  >
    <template v-slot:content>
      <p class="text-bold">General information</p>
      <p>
        Modifier extensions serve a similar purpose to normal extensions. They
        also add additional functionalities and have the same structure. But,
        they change the meaning of the element containing it and cannot be
        safely ignored by the application processing the questionnaire. Modifier
        extensions should be avoided in general. For more information check the
        <a
          target="_blank"
          href="https://hl7.org/fhir/R5/extensibility.html#modifierExtension"
          >Modifier Extensions Documentation</a
        >.
      </p>
    </template>
  </cxInfoLayout>
</template>

<script setup lang="ts">
import cxInfoLayout from "@/components/helper/cxInfoLayout.vue";
</script>
