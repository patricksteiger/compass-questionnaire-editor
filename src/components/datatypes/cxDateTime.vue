<template>
  <slot name="prepend"></slot>
  <q-input
    :class="inputClass"
    type="text"
    dense
    v-model="dateTime"
    :label="label"
    :rules="[dateTools.isDateTimeOrEmpty]"
    clearable
    @clear="dateTime = ''"
  >
    <cxTooltip v-if="inputTooltip !== undefined" :text="inputTooltip" />
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <cxTooltip text="DateTime picker" />
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
          @before-show="updatePickerData"
        >
          <div>Value preview: {{ getCurrentDateTime() }}</div>
          <div class="row">
            <cxDate
              inputClass="col-8"
              label="New Date"
              :value="date"
              v-on:update="updateFromDate"
            />
          </div>
          <div class="row">
            <cxTime
              inputClass="col-8"
              label="New Time"
              :value="time"
              v-on:update="updateFromTime"
            />
          </div>
          <div>
            <q-input
              type="text"
              label="Timezone offset"
              dense
              v-model="timezoneOffset"
              :rules="[dateTools.isTimezoneOffsetOrEmpty]"
              clearable
              @clear="timezoneOffset = dateTools.getTimezoneOffset(new Date())"
            />
          </div>
          <div class="row items-center justify-end">
            <q-btn
              v-close-popup
              label="Confirm"
              color="primary"
              flat
              @click="setCurrentDateTime"
            />
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-btn
    label="Now"
    flat
    dense
    @click="dateTime = dateTools.getCurrentDateTime()"
  >
    <cxTooltip text="Set to current timestamp" />
  </q-btn>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import { dateTools } from "@/utils/date";
import cxDate from "@/components/datatypes/cxDate.vue";
import cxTime from "@/components/datatypes/cxTime.vue";
import cxTooltip from "@/components/helper/cxTooltip.vue";

const props = defineProps<{
  inputClass: string;
  inputTooltip?: string;
  label: string;
  value: string;
}>();

const input = toRef(props, "value");
const dateTime = ref(input.value);
const date = ref(getDateFromDateTime(dateTime.value));
const time = ref(getTimeFromDateTime(dateTime.value));
const timezoneOffset = ref(getTimezoneOffsetFromDateTime(dateTime.value));

const emit = defineEmits<{
  (e: "update", dateTime: string): void;
}>();

watch(dateTime, (value) => {
  emit("update", value);
});

function updateFromDate(value: string) {
  date.value = value;
}

function updateFromTime(value: string) {
  time.value = value;
}

function getCurrentDateTime() {
  // Validity of date and time is enforced by cxDate and cxTime
  const d = date.value;
  const t = time.value;
  if (d.length < 10 || t.length < 8) {
    return d;
  } else {
    const offset = timezoneOffset.value;
    return dateTools.isTimezoneOffset(offset) !== true
      ? dateTools.getDateTime(d, t)
      : `${d}T${t}${offset}`;
  }
}

function setCurrentDateTime() {
  dateTime.value = getCurrentDateTime();
}

function getDateFromDateTime(value: string): string {
  // Example: 2020-12-30T23:59:59+02:00
  const date = value.length > 10 ? value.substring(0, 10) : value;
  return dateTools.isDateOrEmpty(date) === true ? date : "";
}
function getTimeFromDateTime(value: string): string {
  // Example: 2020-12-30T23:59:59+02:00
  if (value.length <= 10) return "";
  const time = value.length >= 19 ? value.substring(11, 19) : "";
  return dateTools.isTimeOrEmpty(time) === true ? time : "";
}
function getTimezoneOffsetFromDateTime(value: string): string {
  // Example: 2020-12-30T23:59:59+02:00
  if (value.length <= 19 || dateTools.isDateTime(value) !== true) {
    return dateTools.getTimezoneOffset(new Date());
  } else if (value.endsWith("Z")) {
    return "Z";
  }
  const offset = value.substring(value.length - 6, value.length);
  if (dateTools.isTimezoneOffset(offset)) {
    return offset;
  }
  return dateTools.getTimezoneOffset(new Date());
}

function updatePickerData() {
  const value = dateTime.value;
  date.value = getDateFromDateTime(value);
  time.value = getTimeFromDateTime(value);
  timezoneOffset.value = getTimezoneOffsetFromDateTime(value);
}
</script>
