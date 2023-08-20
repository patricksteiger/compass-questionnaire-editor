<template>
  <div>
    <div v-if="header" class="text-h5">{{ header }}</div>
    <div>
      <q-select
        label="Use"
        :options="identifierUse"
        v-model="identifier.use"
        clearable
        @clear="identifier.use = undefined"
      />
    </div>
    <div>
      <q-input
        label="System"
        v-model="identifier.system"
        :rules="[questionnaireTools.isUriOrEmpty]"
        clearable
        @clear="identifier.system = ''"
      />
    </div>
    <div>
      <q-input
        label="Value"
        v-model="identifier.value"
        clearable
        @clear="identifier.value = ''"
      />
    </div>
    <div class="text-bold">
      Period:
      <cxPeriod :period="(identifier.period ??= {})" />
    </div>
    <div class="text-bold">
      Type:
      <cxCodeableConcept :value="getType()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Identifier, identifierUse, CodeableConcept } from "@/types";
import { questionnaireTools } from "@/utils/questionnaire";
import { toRefs } from "vue";
import cxPeriod from "@/components/datatypes/cxPeriod.vue";
import cxCodeableConcept from "@/components/datatypes/cxCodeableConcept.vue";

const props = defineProps<{
  header?: string;
  identifier: Identifier;
}>();

const { identifier } = toRefs(props);

function getType(): CodeableConcept {
  identifier.value.type ??= { coding: [] };
  return identifier.value.type;
}
</script>
