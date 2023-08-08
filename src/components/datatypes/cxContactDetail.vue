<template>
  <q-expansion-item icon="contact_phone" expand-separator label="ContactPoint">
    <q-list
      dense
      bordered
      separator
      padding
      class="rounded-borders"
      key="ContactDetails"
    >
      <q-item v-for="(contactPoint, index) in telecom" :key="`d_${index}`">
        <q-item-section>
          <div clickable @click="showComplexDialog(contactPoint)">
            <q-field
              label="CONTACT_POINT"
              stack-label
              :error="editorTools.isEmptyObject(contactPoint)"
              error-message="ContactPoint must be non-empty"
              dense
            >
              <template v-slot:control>
                <div>
                  {{ editorTools.formatContactPoint(contactPoint) }}
                </div>
              </template>
            </q-field>
          </div>
        </q-item-section>
        <q-btn
          flat
          icon="highlight_off"
          color="grey-6"
          @click="() => emits('removeContactPoint', index)"
        />
      </q-item>
    </q-list>
    <q-btn
      icon="add"
      label="ContactPoint"
      @click="() => emits('addContactPoint', { period: {} })"
    />
  </q-expansion-item>

  <q-dialog v-model="complexDialog" v-if="currentContactPoint !== undefined">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title> ContactPoint </q-toolbar-title>
          </q-toolbar>
          <q-input
            label="Value"
            v-model="currentContactPoint.value"
            :clearable="!currentContactPoint.system"
            :error="!!currentContactPoint.value && !currentContactPoint.system"
            error-message="Value can't be defined if System is undefined"
          />
          <q-select
            :options="contactPointSystems"
            label="System"
            v-model="currentContactPoint.system"
            :clearable="!currentContactPoint.value"
            :error="!currentContactPoint.value && !!currentContactPoint.system"
            error-message="System can't be defined if Value is undefined"
          />
          <q-select
            :options="contactPointUses"
            label="Use"
            v-model="currentContactPoint.use"
            clearable
          />
          <q-input
            label="Rank"
            v-model.number="currentContactPoint.rank"
            @keypress="onlyPositiveInteger"
            clearable
          />
          Period:
          <cxPeriod :period="currentContactPoint.period" />
          <q-btn icon="add" @click="() => (complexDialog = false)" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import cxPeriod from "@/components/datatypes/cxPeriod.vue";
import {
  ContactDetail,
  ContactPoint,
  contactPointSystems,
  contactPointUses,
} from "@/types";
import { editorTools } from "@/utils/editor";

const props = defineProps<{
  contactDetail: ContactDetail;
}>();

const emits = defineEmits<{
  (e: "addContactPoint", contactPoint: ContactPoint): void;
  (e: "removeContactPoint", index: number): void;
}>();

const contactDetailProp = toRef(props, "contactDetail");
const telecom = ref(contactDetailProp.value.telecom);
const currentContactPoint = ref<ContactPoint | undefined>(undefined);

const complexDialog = ref(false);

function showComplexDialog(contactPoint: ContactPoint) {
  currentContactPoint.value = contactPoint;
  complexDialog.value = true;
}

function onlyPositiveInteger($event: KeyboardEvent) {
  editorTools.onlyPositiveInteger($event);
}
</script>
