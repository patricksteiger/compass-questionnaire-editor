<template>
  <q-layout view="Lhh lpR fff" container class="bg-white">
    <q-page-container>
      <q-page padding>
        <q-splitter
          v-model="splitterModel"
          style="height: 87vh"
          :limits="[30, 100]"
          horizontal
        >
          <template v-slot:before>
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
                  <q-item v-for="(extension, index) in extensions" :key="index">
                    <q-item-section>
                      <q-card-section>
                        <q-toggle
                          v-if="extension.__type === 'boolean'"
                          :label="extension.url"
                          dense
                          disable
                          v-model="extension.valueBoolean"
                        />
                        <q-input
                          v-else-if="extension.__type === 'decimal'"
                          :label="extension.url"
                          dense
                          type="number"
                          disable
                          v-model.number="extension.valueDecimal"
                        />
                        <q-input
                          v-else-if="extension.__type === 'integer'"
                          :label="extension.url"
                          dense
                          type="number"
                          disable
                          v-model.number="extension.valueInteger"
                        />
                        <q-input
                          v-else-if="extension.__type === 'time'"
                          :label="extension.url"
                          dense
                          type="text"
                          disable
                          mask="fulltime"
                          :rules="[dateTools.isTime]"
                          fill-mask
                          v-model="extension.valueTime"
                        />
                        <q-input
                          v-else-if="extension.__type === 'string'"
                          :label="extension.url"
                          dense
                          type="text"
                          disable
                          v-model="extension.valueString"
                        />
                        <q-input
                          v-else-if="extension.__type === 'markdown'"
                          :label="extension.url"
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
          <template v-slot:after>
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
          </template>
        </q-splitter>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { editorTools } from "../utils/editor";
import { Extension } from "@/types";
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
    return {
      splitterModel: ref(50), // start at 50%
      dateTools,
      editorTools,
      questionnaireTools,
    };
  },
  methods: {
    onSelectedPredefinedExtension(extension: Extension): void {
      const clonedExtension = editorTools.clone(extension);
      this.$emit("predefinedExtensionAdded", clonedExtension);
    },
  },
});
</script>
