<template>
  <q-expansion-item expand-separator>
    <template v-slot:header>
      <cxExpansionItemHeader
        icon="account_tree"
        :title="title"
        :tooltip="$t('tutorial.extension')"
      />
    </template>
    <q-separator />
    <q-card>
      <q-list
        dense
        bordered
        separator
        padding
        class="rounded-borders"
        :key="'Extensions'"
      >
        <q-item v-for="(extension, index) in extensions" :key="index">
          <q-item-section>
            <q-card-section>
              <q-input
                label="URI"
                dense
                type="text"
                readonly
                v-model="extension.url"
              />
              <q-input
                v-if="extension.__type === 'decimal'"
                :label="getExtensionLabel(extension)"
                dense
                type="number"
                @keypress="onlyNumberDec"
                v-model.number="extension.valueDecimal"
              />
              <q-input
                v-else-if="extension.__type === 'code'"
                :label="getExtensionLabel(extension)"
                dense
                type="text"
                :error="!extension.valueCode"
                error-message="Code must be non-empty"
                v-model="extension.valueCode"
              />
              <q-input
                v-else-if="extension.__type === 'integer'"
                :label="getExtensionLabel(extension)"
                dense
                type="number"
                @keypress="onlyNumber"
                v-model.number="extension.valueInteger"
              />
              <q-input
                v-else-if="extension.__type === 'date'"
                :label="getExtensionLabel(extension)"
                dense
                type="text"
                :rules="[dateTools.isDate]"
                v-model="extension.valueDate"
              />
              <q-input
                v-else-if="extension.__type === 'dateTime'"
                :label="getExtensionLabel(extension)"
                dense
                type="text"
                :rules="[dateTools.isDateTime]"
                v-model="extension.valueDateTime"
              />
              <q-input
                v-else-if="extension.__type === 'time'"
                :label="getExtensionLabel(extension)"
                dense
                type="text"
                mask="fulltime"
                fill-mask
                :rules="[dateTools.isTime]"
                v-model="extension.valueTime"
              />
              <q-input
                v-else-if="extension.__type === 'string'"
                :label="getExtensionLabel(extension)"
                dense
                type="text"
                :error="!extension.valueString"
                error-message="String must be non-empty"
                v-model="extension.valueString"
              />
              <q-input
                v-else-if="extension.__type === 'markdown'"
                :label="getExtensionLabel(extension)"
                dense
                autogrow
                type="textarea"
                :error="!extension.valueMarkdown"
                error-message="Markdown must be non-empty"
                v-model="extension.valueMarkdown"
              />
              <div v-else-if="extension.__type === 'boolean'">
                <q-toggle
                  :label="getExtensionLabel(extension)"
                  v-model.boolean="extension.valueBoolean"
                  :disable="disableGUIExtension(extension)"
                />
                <cxTooltip
                  v-if="disableGUIExtension(extension)"
                  :text="$t('tutorial.Extension.hidden')"
                />
              </div>
              <div v-else-if="extension.__type === 'complex'">
                <cxComplexExtension :extension="extension" />
              </div>
            </q-card-section>
          </q-item-section>
          <q-btn
            icon="highlight_off"
            flat
            color="grey-6"
            @click="removeExtension(index)"
            :disable="disableGUIExtension(extension)"
          />
        </q-item>
      </q-list>
      <div class="q-pa-sm">
        <!-- add predefined extension -->
        <q-btn
          v-if="editorTools.nonEmptyArray(predefinedExtensions)"
          padding="none xl"
          fab
          icon="add"
          color="primary"
          label="Predefined extension"
          @click="addPredefinedExtension"
        />
        <!-- add custom extension -->
        <q-btn
          padding="none xl"
          fab
          icon="add"
          color="primary"
          label="Custom extension"
          @click="addCustomExtension"
        />
      </div>
    </q-card>
  </q-expansion-item>
  <q-dialog v-model="extensionLayout">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-splitter
            v-model="splitterModel"
            style="height: 87vh"
            :limits="splitterLimits"
            horizontal
          >
            <template v-slot:before>
              <div v-if="addPredefinedLayout">
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-toolbar-title> Predefined extensions </q-toolbar-title>
                </q-toolbar>
                <div
                  class="q-pa-md"
                  v-if="editorTools.nonEmptyArray(predefinedExtensions)"
                >
                  <q-card>
                    <q-list
                      dense
                      bordered
                      padding
                      separator
                      class="rounded-borders"
                      key="Extensions"
                    >
                      <q-item
                        v-for="(extension, index) in predefinedExtensions"
                        :key="index"
                        clickable
                        @dblclick="onSelectedPredefinedExtension(extension)"
                        v-ripple
                      >
                        <div class="q-pa-md">
                          Type: {{ extension.__type.toUpperCase() }}
                          <q-item-section>
                            URL: {{ extension.url }}
                          </q-item-section>
                          <cxTooltip :text="extension.__tooltip" />
                        </div>
                      </q-item>
                    </q-list>
                  </q-card>
                </div>
                <div v-else>There are no predefined extensions</div>
              </div>
              <div v-else>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-toolbar-title> Custom extension </q-toolbar-title>
                </q-toolbar>
                <div class="q-pa-md">
                  <q-card>
                    <q-input v-model="url" label="URI" />
                    <q-select
                      v-model="type"
                      label="Type"
                      :options="extensionTypes"
                    />
                    <div>
                      <q-btn
                        icon="add"
                        :disable="invalidToAddCustomExtension(url, type)"
                        @click="onSelectedCustomExtension(url, type)"
                      />
                      <cxTooltip
                        v-if="invalidToAddCustomExtension(url, type)"
                        :text="
                          !url
                            ? 'URL must be non-empty'
                            : 'Hidden extension already exists and cannot be added'
                        "
                      />
                    </div>
                  </q-card>
                </div>
              </div>
            </template>
            <template v-slot:after>
              <q-toolbar class="bg-primary text-white shadow-2">
                <q-toolbar-title> Current extensions </q-toolbar-title>
              </q-toolbar>
              <div class="q-pa-md">
                <q-card>
                  <q-list
                    dense
                    bordered
                    separator
                    padding
                    class="rounded-borders"
                    key="Extensions"
                    v-if="extensions.length > 0"
                  >
                    <q-item
                      v-for="(extension, index) in extensions"
                      :key="index"
                    >
                      <q-item-section>
                        <q-card-section>
                          <q-input
                            label="URI"
                            dense
                            type="text"
                            readonly
                            v-model="extension.url"
                          />
                          <div v-if="extension.__type === 'boolean'">
                            <q-toggle
                              :label="getExtensionLabel(extension)"
                              v-model.boolean="extension.valueBoolean"
                              :disable="disableGUIExtension(extension)"
                            />
                            <cxTooltip
                              v-if="disableGUIExtension(extension)"
                              :text="$t('tutorial.Extension.hidden')"
                            />
                          </div>
                          <q-input
                            v-else-if="extension.__type === 'code'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            v-model="extension.valueCode"
                          />
                          <q-input
                            v-else-if="extension.__type === 'decimal'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="number"
                            v-model.number="extension.valueDecimal"
                          />
                          <q-input
                            v-else-if="extension.__type === 'integer'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="number"
                            v-model.number="extension.valueInteger"
                          />
                          <q-input
                            v-else-if="extension.__type === 'date'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            :rules="[dateTools.isDate]"
                            v-model="extension.valueDate"
                          />
                          <q-input
                            v-else-if="extension.__type === 'dateTime'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            :rules="[dateTools.isDateTime]"
                            v-model="extension.valueDateTime"
                          />
                          <q-input
                            v-else-if="extension.__type === 'time'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            mask="fulltime"
                            fill-mask
                            :rules="[dateTools.isTime]"
                            v-model="extension.valueTime"
                          />
                          <q-input
                            v-else-if="extension.__type === 'string'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            v-model="extension.valueString"
                          />
                          <q-input
                            v-else-if="extension.__type === 'markdown'"
                            :label="getExtensionLabel(extension)"
                            dense
                            autogrow
                            type="textarea"
                            v-model="extension.valueMarkdown"
                          />
                          <div v-else-if="extension.__type === 'complex'">
                            <div
                              v-if="
                                editorTools.nonEmptyArray(extension.extension)
                              "
                            >
                              <div v-if="extension.extension.length > 1">
                                Complex extension with
                                {{ extension.extension.length }} children
                              </div>
                              <div v-else>
                                Complex extension with
                                {{ extension.extension.length }} child
                              </div>
                            </div>
                            <div v-else>Empty complex extension</div>
                          </div>
                        </q-card-section>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div v-else>extension is currently empty</div>
                </q-card>
              </div>
            </template>
          </q-splitter>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { editorTools } from "../utils/editor";
import { extensionTypes, Extension, ExtensionType } from "@/types";
import { HIDDEN_EXTENSION_URL, PredefinedExtension } from "@/utils/extension";
import { dateTools } from "@/utils/date";
import cxComplexExtension from "@/components/cxComplexExtension.vue";
import cxExpansionItemHeader from "@/components/helper/cxExpansionItemHeader.vue";
import cxTooltip from "@/components/helper/cxTooltip.vue";
import { itemTools } from "@/utils/item";

const props = defineProps<{
  title: string;
  extensions: Extension[];
  predefinedExtensions: PredefinedExtension[];
}>();

const { title, extensions, predefinedExtensions } = toRefs(props);
const url = ref("");
const type = ref<ExtensionType>("boolean");
const splitterLimits = ref([30, 100]);
const splitterModel = ref(60);
const extensionLayout = ref(false);
const addPredefinedLayout = ref(true);

const emit = defineEmits<{
  (e: "addExtension", extension: Extension): void;
  (e: "removeExtension", index: number): void;
}>();

function disableGUIExtension(extension: Extension): boolean {
  return extension.url === HIDDEN_EXTENSION_URL;
}
function onSelectedPredefinedExtension(extension: Extension): void {
  const clonedExtension = editorTools.clone(extension);
  emit("addExtension", clonedExtension);
  extensionLayout.value = false;
}

function invalidToAddCustomExtension(
  url: string,
  type: ExtensionType,
): boolean {
  return !url || (type === "boolean" && url === HIDDEN_EXTENSION_URL);
}

function onSelectedCustomExtension(url: string, type: ExtensionType): void {
  const extension = itemTools.getExtensionFrom(url, type);
  emit("addExtension", extension);
  extensionLayout.value = false;
}

function removeExtension(index: number): void {
  emit("removeExtension", index);
}

function addPredefinedExtension(): void {
  addPredefinedLayout.value = true;
  extensionLayout.value = true;
}

function addCustomExtension(): void {
  addPredefinedLayout.value = false;
  extensionLayout.value = true;
}

function onlyNumberDec(event: KeyboardEvent): void {
  editorTools.onlyDecimal(event);
}

function onlyNumber(event: KeyboardEvent): void {
  editorTools.onlyInteger(event);
}

function getExtensionLabel(extension: Extension): string {
  return extension.__type.toUpperCase();
}
</script>
