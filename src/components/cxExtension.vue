<template>
  <q-expansion-item
    expand-separator
    icon="account_tree"
    :label="$t('views.editor.extensions')"
  >
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
                label="URL"
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
                <q-tooltip v-if="disableGUIExtension(extension)">
                  Hidden can only be changed using the toggle in the item-tree
                </q-tooltip>
              </div>
              <div v-else-if="extension.__type === 'complex'">
                <!-- <q-btn icon="add" @click="handleComplexExtension(extension)" /> -->
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
                          <q-tooltip>{{ extension.__tooltip }}</q-tooltip>
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
                    <q-input v-model="url" label="URL" />
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
                      <q-tooltip v-if="invalidToAddCustomExtension(url, type)">
                        {{
                          !url
                            ? "URL must be non-empty"
                            : "Hidden extension already exists and cannot be added"
                        }}
                      </q-tooltip>
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
                            label="URL"
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
                            <q-tooltip v-if="disableGUIExtension(extension)">
                              Hidden can only be changed using the toggle in the
                              item-tree
                            </q-tooltip>
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
                          <!-- TODO: How should already added complex extensions be viewed? -->
                          <div v-else-if="extension.__type === 'complex'">
                            Complex extension {{ extension.url }}
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
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { editorTools } from "../utils/editor";
import { extensionTypes, Extension, ExtensionType } from "@/types";
import { questionnaireTools } from "@/utils/questionnaire";
import { HIDDEN_EXTENSION_URL, PredefinedExtension } from "@/utils/extension";
import { dateTools } from "@/utils/date";
import cxComplexExtension from "@/components/cxComplexExtension.vue";
import { itemTools } from "@/utils/item";

export default defineComponent({
  components: {
    cxComplexExtension,
  },
  props: {
    extensions: {
      type: Object as PropType<Extension[]>,
      required: true,
    },
    predefinedExtensions: {
      type: Object as PropType<PredefinedExtension[]>,
      required: false,
    },
  },
  setup() {
    const url = ref("");
    const type = ref<ExtensionType>("boolean");
    return {
      splitterLimits: ref([30, 100]),
      splitterModel: ref(60),
      extensionLayout: ref(false),
      addPredefinedLayout: ref(true),
      url,
      extensionTypes,
      type,
      dateTools,
      editorTools,
      questionnaireTools,
      HIDDEN_EXTENSION_URL,
    };
  },
  emits: {
    addExtension(extension: Extension): boolean {
      return !!extension.url;
    },
    removeExtension(index: number): boolean {
      return index >= 0;
    },
  },
  methods: {
    disableGUIExtension(extension: Extension): boolean {
      return extension.url === HIDDEN_EXTENSION_URL;
    },
    onSelectedPredefinedExtension(extension: Extension): void {
      const clonedExtension = editorTools.clone(extension);
      this.$emit("addExtension", clonedExtension);
      this.extensionLayout = false;
    },
    invalidToAddCustomExtension(url: string, type: ExtensionType): boolean {
      return !url || (type === "boolean" && url === HIDDEN_EXTENSION_URL);
    },
    onSelectedCustomExtension(url: string, type: ExtensionType): void {
      const extension = itemTools.getExtensionFrom(url, type);
      this.$emit("addExtension", extension);
      this.extensionLayout = false;
    },
    removeExtension(index: number): void {
      this.$emit("removeExtension", index);
    },
    addPredefinedExtension(): void {
      this.addPredefinedLayout = true;
      this.extensionLayout = true;
    },
    addCustomExtension(): void {
      this.addPredefinedLayout = false;
      this.extensionLayout = true;
    },
    onlyNumberDec(event: KeyboardEvent): void {
      this.editorTools.onlyDecimal(event);
    },
    onlyNumber(event: KeyboardEvent): void {
      this.editorTools.onlyInteger(event);
    },
    getExtensionLabel(extension: Extension): string {
      return extension.__type.toUpperCase();
    },
  },
});
</script>
