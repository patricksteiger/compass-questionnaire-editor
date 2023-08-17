<template>
  <slot name="prepend"></slot>
  <q-input
    :class="inputClass"
    type="text"
    dense
    v-model="time"
    :label="label"
    :rules="[dateTools.isTimeOrEmpty]"
    clearable
    @clear="() => (time = '')"
  >
    <cxTooltip v-if="inputTooltip !== undefined" :text="inputTooltip" />
    <template v-slot:prepend>
      <q-icon name="schedule" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="timePicker" with-seconds format24h>
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Confirm"
                color="primary"
                flat
                :disable="dateTools.isTime(timePicker) !== true"
                @click="time = timePicker"
              />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-btn
    label="Now"
    flat
    dense
    @click="() => (time = dateTools.getCurrentTime())"
  />
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
const time = ref(input.value);
const timePicker = ref(input.value);

const emit = defineEmits<{
  (e: "update", date: string): void;
}>();

watch(time, (value) => {
  if (value === "" || dateTools.isTime(value) === true) {
    emit("update", value);
  }
});
</script>
