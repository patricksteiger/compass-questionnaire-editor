<template>
  <q-expansion-item
    expand-separator
    icon="account_tree"
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
            {{ index + 1 }}
            <q-card-section class="col-10">
              <q-toggle
                v-if="initial.__type === 'boolean'"
                v-model="initial.valueBoolean"
                dense
              />
              <q-input
                v-else-if="initial.__type === 'decimal'"
                label="Decimal"
                @keypress="onlyNumberDec"
                class="col-4"
                v-model.number="initial.valueDecimal"
                type="number"
                dense
              />
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
