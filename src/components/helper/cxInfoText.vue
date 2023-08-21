<template>
  <cxInfoLayout header="Text" :tooltip="$t('tutorial.info.text')">
    <template v-slot:content>
      <p class="text-bold">General information</p>
      <p>
        Text is a Narrative containing the summary of the content of the
        questionnaire that is a safe, alternative way to render it to the
        end-user. It can be used to in case the application rendering the
        questionnaire does not fully understand the contained data.
      </p>
      <p class="text-bold">Structure</p>
      <p>
        Text is split into "status" and "div". "div" contains the summary of the
        content in
        <a
          target="_blank"
          href="https://www.hl7.org/fhir/R5/narrative.html#xhtml"
        >
          XHTML-format
        </a>
        . "status" sepcifies how "div" should be interpreted.
      </p>
      <p>
        "generated" means it only contains core features of the specification,
        meaning no extensions are used. "extensions" specifies, extensions are
        used as well. "additional" means the content contains additional
        information not processable by applications, but by humans. "empty"
        specifies no human-readable content is available.
      </p>
      <p class="text-bold">Example</p>
      <p>
        status equals "generated".<br />div equals:
        <pre>
          <code>
&lt;div xmlns="http://www.w3.org/1999/xhtml">
    &lt;pre>
        Tutorial Questionnaire
        1) What is your name?
        2) What is your date of birth?
    &lt;/pre>
&lt;/div>
          </code>
        </pre>
      </p>
    </template>
  </cxInfoLayout>
</template>

<script setup lang="ts">
import cxInfoLayout from "@/components/helper/cxInfoLayout.vue";
</script>
