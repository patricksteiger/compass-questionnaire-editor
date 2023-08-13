<template>
  <div>
    <div>
      <q-select
        label="Use"
        :options="identifierUse"
        v-model="identifier.use"
        clearable
        @clear="
          () => {
            identifier.use = undefined;
          }
        "
      />
    </div>
    <div>
      <q-input
        label="System"
        v-model="identifier.system"
        :rules="[questionnaireTools.isUriOrEmpty]"
        clearable
        @clear="
          () => {
            identifier.system = '';
          }
        "
      />
    </div>
    <div>
      <q-input
        label="Value"
        v-model="identifier.value"
        clearable
        @clear="
          () => {
            identifier.value = '';
          }
        "
      />
    </div>
    <div class="text-bold">
      Period:
      <cxPeriod :period="(identifier.period ??= {})" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Identifier, identifierUse } from "@/types";
import { questionnaireTools } from "@/utils/questionnaire";
import { toRefs } from "vue";
import cxPeriod from "@/components/datatypes/cxPeriod.vue";

const props = defineProps<{
  identifier: Identifier;
}>();

const { identifier } = toRefs(props);
</script>
