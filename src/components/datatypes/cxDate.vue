<template>
  <slot name="prepend"></slot>
  <q-input
    :class="inputClass"
    type="text"
    dense
    v-model="date"
    :label="label"
    :rules="[dateTools.isDateOrEmpty]"
    clearable
    @clear="date = ''"
  >
    <cxTooltip v-if="inputTooltip !== undefined" :text="inputTooltip" />
    <template v-slot:prepend>
      <q-icon name="calendar_month" class="cursor-pointer">
        <cxTooltip text="Date picker" />
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
          @before-show="updatePickerData"
        >
          <q-date v-model="datePicker" mask="YYYY-MM-DD">
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Confirm"
                color="primary"
                flat
                :disable="dateTools.isDate(datePicker) !== true"
                @click="date = datePicker"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-btn label="Today" flat dense @click="date = dateTools.getCurrentDate()">
    <cxTooltip text="Set to current date" />
  </q-btn>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import { dateTools } from "@/utils/date";
import cxTooltip from "@/components/helper/cxTooltip.vue";

const props = defineProps<{
  inputClass: string;
  inputTooltip?: string;
  label: string;
  value: string;
}>();

const input = toRef(props, "value");
const date = ref(input.value);
const datePicker = ref(input.value);

const emit = defineEmits<{
  (e: "update", date: string): void;
}>();

watch(date, (value) => {
  if (value === "" || dateTools.isDate(value) === true) {
    emit("update", value);
  }
});

function updatePickerData() {
  datePicker.value = date.value;
}
</script>
