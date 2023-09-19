<template>
  <cxInfoLayout header="Item types" :tooltip="$t('tutorial.info.itemTypes')">
    <template v-slot:content>
      <p class="text-bold">General information</p>
      <p>
        An item has 1 of 15 different types. "Display" is an item containing a
        display text, without child-items and the end-user cannot answer it.
        "Group" is a grouping of items, which also cannot be answered, but
        allows child-items. Every other type represents a question. A question
        allows child-items and answers, with the type specifying the type of the
        answers allowed for this question.
      </p>
      <p class="text-bold">String vs. Text</p>
      <p>
        Both String and Text capture text from the end-user. The difference:
        String should be used for short, single-line answers, while long,
        multi-line paragraphs are captured in Text.
      </p>
      <p class="text-bold">Date vs. Time vs. DateTime</p>
      <p>
        Date is a string in the format YYYY, YYYY-MM or YYYY-MM-DD. Time is a
        string in the format HH:MM:SS. DateTime is a string allowing all Date
        values and optionally extends the full Date (YYYY-MM-DD) with a Time and
        timezone. An example for a full DateTime would be
        "2023-09-19T20:16:42+02:00".
      </p>
      <p class="text-bold">Coding</p>
      <p>
        A coding defines a code from an optional system and version.
        Additionally, it allows a display, which is the value actually shown to
        the end-user. Splitting code and display allows a code shared across
        multiple language versions for machine processing, while still
        displaying a value in the needed language to the end-user. It is
        generally used to present the end-user with multiple answer choices.
      </p>
      <p class="text-bold">Quantity</p>
      <p>
        A quantity consists of a "value"-element containing the numeric value,
        "code"- and "unit"-element to represent the unit, and a system for the
        "code"-element. "unit" is the human-readable version of "code". A common
        system is the UCUM code system.<br />An example for representing "10
        counts per minute" in UCUM:<br />"value"=10,<br />"unit"="counts per
        minute",<br />"code"="{CPM}",<br />"system"="http://unitsofmeasure.org".
      </p>
      <p class="text-bold">Attachment</p>
      <p>
        An attachment captures binary data like images, PDFs or videos. Usually,
        an attachment either links to the data with the "url"-element or
        contains a binary string in the "data"-element. The editor allows
        uploading of a file to be captured in the "data"-element, though the
        size of the uploaded data should always be considered.
      </p>
      <p class="text-bold">Reference</p>
      <p>A reference references another FHIR resource.</p>
    </template>
  </cxInfoLayout>
</template>

<script setup lang="ts">
import cxInfoLayout from "@/components/helper/cxInfoLayout.vue";
</script>
