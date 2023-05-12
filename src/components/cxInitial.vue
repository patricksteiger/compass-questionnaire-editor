<template>
  <q-expansion-item
    expand-separator
    :icon="selectedItem.__icon"
    :label="$t('views.editor.initials')"
  >
    <q-separator />
    <q-card>
      <q-list
        dense
        bordered
        separator
        padding
        class="rounded-borders"
        key="Initial"
      >
        <q-item v-for="(initial, index) in initials" :key="index">
          <q-item-section>
            <q-card-section>
              <div class="row" v-if="initial.__type === 'boolean'">
                <q-toggle
                  v-model.boolean="initial.valueBoolean"
                  :label="(index + 1).toString()"
                  left-label
                  dense
                />
              </div>
              <div class="row" v-else-if="initial.__type === 'decimal'">
                <q-input
                  :label="initial.__type.toUpperCase()"
                  @keypress="onlyNumberDec"
                  class="col-12"
                  v-model.number="initial.valueDecimal"
                  type="number"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="row" v-else-if="initial.__type === 'integer'">
                <q-input
                  :label="initial.__type.toUpperCase()"
                  @keypress="onlyNumber"
                  class="col-12"
                  v-model.number="initial.valueInteger"
                  type="number"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="row" v-else-if="initial.__type === 'date'">
                <q-input
                  :label="initial.__type.toUpperCase()"
                  class="col-12"
                  v-model="initial.valueDate"
                  :rules="[dateTools.isDate]"
                  type="text"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="row" v-else-if="initial.__type === 'dateTime'">
                <q-input
                  :label="initial.__type.toUpperCase()"
                  class="col-12"
                  v-model="initial.valueDateTime"
                  :rules="[dateTools.isDateTime]"
                  type="text"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="row" v-else-if="initial.__type === 'time'">
                <q-input
                  :label="initial.__type.toUpperCase()"
                  class="col-12"
                  v-model="initial.valueTime"
                  :rules="[dateTools.isTime]"
                  mask="fulltime"
                  fill-mask
                  type="text"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="row" v-else-if="initial.__type === 'string'">
                <q-input
                  :label="initial.__type.toUpperCase()"
                  class="col-12"
                  v-model="initial.valueString"
                  :error="!initial.valueString"
                  error-message="String must be non-empty"
                  type="text"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-input>
              </div>
              <div class="row" v-else-if="initial.__type === 'url'">
                <q-input
                  :label="initial.__type.toUpperCase()"
                  class="col-12"
                  v-model="initial.valueUri"
                  :error="!initial.valueUri"
                  error-message="URL must be non-empty"
                  type="text"
                  dense
                >
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-input>
              </div>
            </q-card-section>
          </q-item-section>
          <div class="col-2">
            <q-btn
              icon="highlight_off"
              flat
              color="grey-6"
              @click="removeInitial(index)"
            />
          </div>
        </q-item>
      </q-list>
      <div>
        <q-btn
          padding="none xl"
          fab
          icon="add"
          color="primary"
          label="Initial"
          @click="addInitial"
        />
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { Initial, Item } from "@/types";
import { InitialItemType } from "@/utils/constants";
import { editorTools } from "@/utils/editor";
import { defineComponent, PropType, ref } from "vue";
import { dateTools } from "../utils/date";

// display- and group-items don't allow initial and are filtered in cxEditorItems
type InitialItem = Omit<Item, "type"> & { type: InitialItemType };

export default defineComponent({
  props: {
    selectedItem: {
      type: Object as PropType<InitialItem>,
      required: true,
    },
  },
  setup(prop) {
    const initials = ref<Initial[]>(prop.selectedItem.initial);
    return {
      initials,
      dateTools,
      editorTools,
    };
  },
  emits: {
    addInitial(initial: Initial): boolean {
      return !!initial;
    },
    removeInitial(index: number): boolean {
      return index >= 0;
    },
  },
  methods: {
    addInitial(): void {
      let initial: Initial;
      switch (this.selectedItem.type) {
        case "boolean":
          initial = { __type: "boolean", valueBoolean: false };
          break;
        case "decimal":
          initial = { __type: "decimal", valueDecimal: 0 };
          break;
        case "integer":
          initial = { __type: "integer", valueInteger: 0 };
          break;
        case "date":
          initial = { __type: "date", valueDate: "2000-01-01" };
          break;
        case "dateTime":
          initial = {
            __type: "dateTime",
            valueDateTime: "2000-01-01T00:00:00+01:00",
          };
          break;
        case "time":
          initial = { __type: "time", valueTime: "00:00:00" };
          break;
        case "string":
          initial = { __type: "string", valueString: "" };
          break;
        case "url":
          initial = { __type: "url", valueUri: "" };
          break;
        default:
          throw new Error(
            `Missing implementation for addInitial: ${this.selectedItem.type}`,
          );
      }
      this.$emit("addInitial", initial);
    },
    removeInitial(index: number): void {
      this.$emit("removeInitial", index);
    },
    onlyNumberDec($event: KeyboardEvent): void {
      this.editorTools.onlyNumberDec($event);
    },
    onlyNumber($event: KeyboardEvent): void {
      this.editorTools.onlyNumber($event);
    },
  },
});
</script>
