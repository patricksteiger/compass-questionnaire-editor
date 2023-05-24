<template>
  <div clickable @click="() => (complexDialog = true)">
    <q-field
      label="CONTACT_POINT"
      stack-label
      :error="editorTools.isEmptyObject(contactPointValue)"
      error-message="ContactPoint must be non-empty"
      dense
    >
      <template v-slot:control>
        <div>
          {{ editorTools.formatContactPoint(contactPointValue) }}
        </div>
      </template>
    </q-field>
  </div>

  <q-dialog v-model="complexDialog">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title> ContactPoint </q-toolbar-title>
          </q-toolbar>
          <q-input
            label="Value"
            v-model="contactPointValue.value"
            :clearable="!contactPointValue.system"
            :error="!!contactPointValue.value && !contactPointValue.system"
            error-message="Value can't be defined if System is undefined"
          />
          <q-select
            :options="contactPointSystems"
            label="System"
            v-model="contactPointValue.system"
            :clearable="!contactPointValue.value"
            :error="!contactPointValue.value && !!contactPointValue.system"
            error-message="System can't be defined if Value is undefined"
          />
          <q-select
            :options="contactPointUses"
            label="Use"
            v-model="contactPointValue.use"
            clearable
          />
          <q-input
            label="Rank"
            v-model.number="contactPointValue.rank"
            @keypress="onlyPositiveInteger"
            clearable
          />
          Period:
          <cxPeriod :period="contactPointValue.period" />
          <q-btn icon="add" @click="() => (complexDialog = false)" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { editorTools } from "@/utils/editor";
import { ContactPoint, contactPointSystems, contactPointUses } from "@/types";
import { ref } from "vue";
import cxPeriod from "@/components/datatypes/cxPeriod.vue";

const props = defineProps<{
  contactPoint: ContactPoint;
}>();

const contactPointValue = ref(props.contactPoint);

const complexDialog = ref(false);

function onlyPositiveInteger($event: KeyboardEvent) {
  editorTools.onlyPositiveInteger($event);
}
</script>
