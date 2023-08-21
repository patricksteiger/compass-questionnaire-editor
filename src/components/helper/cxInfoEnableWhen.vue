<template>
  <cxInfoLayout header="EnableWhen" :tooltip="$t('tutorial.info.enableWhen')">
    <template v-slot:content>
      <p class="text-bold">General information</p>
      <p>
        EnableWhen contains conditions, based on answers to other questions. If
        they are met the question is enabled, otherwise it is disabled. If
        EnableWhen is empty, the question is enabled by default. The child-items
        of a disabled question are also disabled.
      </p>
      <p>
        Enabled questions are shown to the end-user and are interactable, if
        nothing else hides or disables them.
      </p>
      <p class="text-bold">DisabledDisplay</p>
      <p>
        Behavior of disabled questions is driven by DisabledDisplay. If it is
        set to hidden, disabled questions are not shown to the end-user. If it
        is set to protected, they are not interactable. If it isn't present, it
        is up to the application rendering the questionnaire.
      </p>
      <p class="text-bold">EnableBehavior</p>
      <p>
        EnableBehavior indicates whether all or at least 1 condition have to be
        met for the question to be enabled.
      </p>
      <p class="text-bold">EnableWhen</p>
      <p>
        Question contains the LinkId of another question. Operator implements
        the condition which checks whether the collected answer complies with
        the value in Answer according to the operator.
      </p>
      <p>
        If the linked question is of type "integer", Operator is set to "=" and
        Answer is "10", then this question is disabled until the linked question
        is answered with "10".
      </p>
      <p>
        The special operator "exists" is used to check whether the linked
        question was already answered or not, independent of the value of the
        collected answer. If Answer is set to "true", the linked question has to
        be answered with any value for this question to be enabled. If Answer is
        set to "false", this question is enabled as long as the linked question
        is not answered with any value.
      </p>
    </template>
  </cxInfoLayout>
</template>

<script setup lang="ts">
import cxInfoLayout from "@/components/helper/cxInfoLayout.vue";
</script>
