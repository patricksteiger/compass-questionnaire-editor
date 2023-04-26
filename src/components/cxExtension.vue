<template>
  <!-- extension -->
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
        padding
        class="rounded-borders"
        :key="'Extensions'"
      >
        <q-item v-for="(extension, index) in extensions" :key="index">
          <q-item-section>
            <q-card-section>
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
              <q-toggle
                v-else-if="extension.__type === 'boolean'"
                :label="getExtensionLabel(extension)"
                dense
                v-model="extension.valueBoolean"
              />
            </q-card-section>
          </q-item-section>
          <q-btn
            icon="highlight_off"
            flat
            color="grey-6"
            @click="removeExtension(index)"
          />
        </q-item>
      </q-list>
      <div class="q-pa-sm">
        <!-- add predefined extension -->
        <q-btn
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
                <div class="q-pa-md" v-if="predefinedExtensions.length > 0">
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
                        :disable="!url"
                        @click="onSelectedCustomExtension(url, type)"
                      />
                      <q-tooltip v-if="!url"> URL must be non-empty </q-tooltip>
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
                          <q-toggle
                            v-if="extension.__type === 'boolean'"
                            :label="getExtensionLabel(extension)"
                            dense
                            disable
                            v-model="extension.valueBoolean"
                          />
                          <q-input
                            v-else-if="extension.__type === 'code'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            disable
                            v-model="extension.valueCode"
                          />
                          <q-input
                            v-else-if="extension.__type === 'decimal'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="number"
                            disable
                            v-model.number="extension.valueDecimal"
                          />
                          <q-input
                            v-else-if="extension.__type === 'integer'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="number"
                            disable
                            v-model.number="extension.valueInteger"
                          />
                          <q-input
                            v-else-if="extension.__type === 'date'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            disable
                            :rules="[dateTools.isDate]"
                            v-model="extension.valueDate"
                          />
                          <q-input
                            v-else-if="extension.__type === 'dateTime'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            disable
                            :rules="[dateTools.isDateTime]"
                            v-model="extension.valueDateTime"
                          />
                          <q-input
                            v-else-if="extension.__type === 'time'"
                            :label="getExtensionLabel(extension)"
                            dense
                            type="text"
                            disable
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
                            disable
                            v-model="extension.valueString"
                          />
                          <q-input
                            v-else-if="extension.__type === 'markdown'"
                            :label="getExtensionLabel(extension)"
                            dense
                            autogrow
                            type="textarea"
                            disable
                            v-model="extension.valueMarkdown"
                          />
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
import { defineComponent, PropType, Ref, ref } from "vue";
import { editorTools, UnreachableError } from "../utils/editor";
import { extensionTypes, Extension, ExtensionType } from "@/types";
import { questionnaireTools } from "@/utils/questionnaire";
import { PredefinedExtension } from "@/utils/extension";
import { dateTools } from "@/utils/date";

export default defineComponent({
  props: {
    extensions: {
      type: Object as PropType<Extension[]>,
      required: true,
    },
    predefinedExtensions: {
      type: Object as PropType<PredefinedExtension[]>,
      required: true,
    },
  },
  setup() {
    const url: Ref<string> = ref("");
    const type: Ref<ExtensionType> = ref("boolean");
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
    };
  },
  emits: {
    addExtension(extension: Extension) {
      return !!extension.url;
    },
    removeExtension(index: number) {
      return index >= 0;
    },
  },
  methods: {
    onSelectedPredefinedExtension(extension: Extension): void {
      const clonedExtension = editorTools.clone(extension);
      this.$emit("addExtension", clonedExtension);
      this.extensionLayout = false;
    },
    onSelectedCustomExtension(url: string, type: ExtensionType): void {
      let extension: Extension;
      switch (type) {
        case "boolean":
          extension = { url, __type: type, valueBoolean: true };
          break;
        case "code":
          extension = { url, __type: type, valueCode: "" };
          break;
        case "decimal":
          extension = { url, __type: type, valueDecimal: 0 };
          break;
        case "integer":
          extension = { url, __type: type, valueInteger: 0 };
          break;
        case "date":
          extension = { url, __type: type, valueDate: "2000-12-31" };
          break;
        case "dateTime":
          extension = {
            url,
            __type: type,
            valueDateTime: "2017-01-01T00:00:00+01:00",
          };
          break;
        case "time":
          extension = { url, __type: type, valueTime: "00:00:00" };
          break;
        case "string":
          extension = { url, __type: type, valueString: "" };
          break;
        case "markdown":
          extension = { url, __type: type, valueMarkdown: "" };
          break;
        default:
          throw new UnreachableError(type);
      }
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
      this.editorTools.onlyNumberDec(event);
    },
    onlyNumber(event: KeyboardEvent): void {
      this.editorTools.onlyNumber(event);
    },
    getExtensionLabel(extension: Extension): string {
      return `${extension.__type.toUpperCase()}: ${extension.url}`;
    },
  },
});
</script>
