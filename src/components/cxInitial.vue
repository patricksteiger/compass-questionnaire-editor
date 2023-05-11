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
                  label="Decimal"
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
                  label="Integer"
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
import { editorTools } from "@/utils/editor";
import { defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    selectedItem: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  setup(prop) {
    const initials = ref<Initial[]>(prop.selectedItem.initial);
    return {
      initials,
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
          this.$emit("addInitial", initial);
          break;
        case "decimal":
          initial = { __type: "decimal", valueDecimal: 0 };
          this.$emit("addInitial", initial);
          break;
        case "integer":
          initial = { __type: "integer", valueInteger: 0 };
          this.$emit("addInitial", initial);
          break;
      }
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
