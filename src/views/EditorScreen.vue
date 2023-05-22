<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="editor" :label="$t('views.tabsTitles.editorQRE')" />
    <q-tab name="primary" :label="$t('views.tabsTitles.primary')" />
    <q-tab name="secondary" :label="$t('views.tabsTitles.secondary')" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="editor">
      <cx-editor-items />
    </q-tab-panel>

    <q-tab-panel name="primary">
      <cx-metadata />
    </q-tab-panel>

    <q-tab-panel name="secondary">
      <cx-settings />
    </q-tab-panel>
  </q-tab-panels>
</template>
<script lang="ts">
import cxEditorItems from "@/components/cxEditorItems.vue";
import cxMetadata from "@/components/cxMetadata.vue";
import cxSettings from "@/components/cxSettings.vue";
import { defineComponent, ref } from "vue";
import { mapMutations } from "vuex";

type Tab = "editor" | "primary" | "secondary";

export default defineComponent({
  components: {
    cxEditorItems,
    cxMetadata,
    cxSettings,
  },
  setup() {
    const tab = ref<Tab>("editor");
    return { tab };
  },
  created() {
    this.switchToEditorScreen();
  },
  methods: {
    ...mapMutations(["switchToEditorScreen"]),
  },
});
</script>
