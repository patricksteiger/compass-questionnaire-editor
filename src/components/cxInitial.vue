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
                  <template v-slot:after>
                    <div>
                      <q-btn
                        label="Now"
                        @click="
                          () =>
                            (initial.valueDateTime =
                              dateTools.getCurrentDateTime())
                        "
                      />
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
                  autogrow
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
              <div
                class="row"
                v-else-if="initial.__type === 'coding'"
                clickable
                @click="showComplexDialog(initial)"
              >
                <q-field
                  :label="initial.__type.toUpperCase()"
                  stack-label
                  class="col-12"
                  :error="editorTools.isEmptyObject(initial.valueCoding)"
                  error-message="Coding must be non-empty"
                  dense
                >
                  <template v-slot:control>
                    <div>
                      {{ editorTools.formatCoding(initial.valueCoding) }}
                    </div>
                  </template>
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div
                class="row"
                v-else-if="initial.__type === 'quantity'"
                clickable
                @click="showComplexDialog(initial)"
              >
                <q-field
                  :label="initial.__type.toUpperCase()"
                  stack-label
                  class="col-12"
                  :error="editorTools.isEmptyObject(initial.valueQuantity)"
                  error-message="Quantity must be non-empty"
                  dense
                >
                  <template v-slot:control>
                    <div>
                      {{ editorTools.formatQuantity(initial.valueQuantity) }}
                    </div>
                  </template>
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div
                class="row"
                v-else-if="initial.__type === 'reference'"
                clickable
                @click="showComplexDialog(initial)"
              >
                <q-field
                  :label="initial.__type.toUpperCase()"
                  stack-label
                  class="col-12"
                  :error="editorTools.isEmptyObject(initial.valueReference)"
                  error-message="Reference must be non-empty"
                  dense
                >
                  <template v-slot:control>
                    <div>
                      {{ editorTools.formatReference(initial.valueReference) }}
                    </div>
                  </template>
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div
                class="row"
                v-else-if="initial.__type === 'attachment'"
                clickable
                @click="showComplexDialog(initial)"
              >
                <q-field
                  :label="initial.__type.toUpperCase()"
                  stack-label
                  class="col-12"
                  :error="editorTools.isEmptyObject(initial.valueAttachment)"
                  error-message="Attachment must be non-empty"
                  dense
                >
                  <template v-slot:control>
                    <div>
                      {{
                        editorTools.formatAttachment(initial.valueAttachment)
                      }}
                    </div>
                  </template>
                  <template v-slot:prepend>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </template>
                </q-field>
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
          @click="addInitialTo(selectedItem)"
        />
      </div>
    </q-card>
  </q-expansion-item>

  <q-dialog v-model="complexLayout" v-if="selectedInitial !== undefined">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>
              {{ `Initial: ${selectedInitial.__type}` }}
            </q-toolbar-title>
          </q-toolbar>
          <div v-if="selectedInitial.__type === 'coding'">
            <cxCoding
              :coding="selectedInitial.valueCoding"
              v-on:addCoding="(_coding) => (complexLayout = false)"
            />
          </div>
          <div v-else-if="selectedInitial.__type === 'quantity'">
            <cxQuantity
              :quantity="selectedInitial.valueQuantity"
              v-on:addQuantity="(_quantity) => (complexLayout = false)"
            />
          </div>
          <div v-else-if="selectedInitial.__type === 'reference'">
            <cxReference
              :reference="selectedInitial.valueReference"
              v-on:addReference="(_reference) => (complexLayout = false)"
            />
          </div>
          <div v-else-if="selectedInitial.__type === 'attachment'">
            <cxAttachment
              :attachment="selectedInitial.valueAttachment"
              v-on:addAttachment="(_attachment) => (complexLayout = false)"
            />
          </div>
          <div v-else>
            Type {{ selectedInitial.__type }} is not a complex type!
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { Initial } from "@/types";
import { InitialItem } from "@/utils/constants";
import { editorTools } from "@/utils/editor";
import { itemTools } from "@/utils/item";
import { ref, toRefs } from "vue";
import { dateTools } from "../utils/date";
import cxCoding from "@/components/datatypes/cxCoding.vue";
import cxQuantity from "@/components/datatypes/cxQuantity.vue";
import cxReference from "@/components/datatypes/cxReference.vue";
import cxAttachment from "@/components/datatypes/cxAttachment.vue";

const props = defineProps<{
  selectedItem: InitialItem;
}>();

const { selectedItem } = toRefs(props);
const initials = ref<Initial[]>(selectedItem.value.initial);

const selectedInitial = ref<Initial | undefined>(undefined);
const complexLayout = ref(false);

function showComplexDialog(initial: Initial): void {
  selectedInitial.value = initial;
  complexLayout.value = true;
}

const emit = defineEmits<{
  (e: "addInitial", _initial: Initial): void;
  (e: "removeInitial", _index: number): void;
}>();

function addInitialTo(item: InitialItem): void {
  const initial = itemTools.getInitialFrom(item);
  emit("addInitial", initial);
}

function removeInitial(index: number): void {
  emit("removeInitial", index);
}

function onlyNumberDec($event: KeyboardEvent): void {
  editorTools.onlyDecimal($event);
}

function onlyNumber($event: KeyboardEvent): void {
  editorTools.onlyInteger($event);
}
</script>
