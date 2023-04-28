<template>
  <q-layout view="Lhh lpR fff" container class="bg-white">
    <q-page-container>
      <q-page padding>
        <q-splitter
          v-model="languageSplitter"
          style="height: 87vh"
          :limits="languageSplitterLimits"
          horizontal
        >
          <template v-slot:before>
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title>{{
                $t("views.languages.selectedLanguages")
              }}</q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md">
              <q-list bordered separator>
                <q-item
                  v-for="lang in getUsedLanguages"
                  :key="lang"
                  v-ripple
                  clickable
                  :class="getSelectedLanguageClass(lang)"
                  @click="switchFromLanguageHub(lang)"
                >
                  <q-item-section>
                    <q-btn
                      style="width: 50%"
                      icon="delete"
                      :disable="getUsedLanguages.length <= 1"
                      @click="deleteLanguage(lang)"
                    >
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ lang }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </template>
          <template v-slot:after>
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title>{{
                $t("views.languages.notSelectedLanguages")
              }}</q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md">
              <q-list bordered separator>
                <q-item
                  v-for="lang in getUnusedLanguages()"
                  :key="lang"
                  v-ripple
                  clickable
                  @click="addAndSwitchFromLanguageHub(lang)"
                >
                  <q-item-section icon>
                    <q-btn
                      style="width: 50%"
                      icon="add"
                      @click="addLanguage(lang)"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ lang }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </template>
        </q-splitter>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defaultLanguage } from "@/i18n";
import { Language, languages } from "@/store";
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  setup() {
    const language = ref<Language>(defaultLanguage);
    return {
      languageSplitter: ref(40),
      languageSplitterLimits: ref([30, 100]),
      language,
      languages,
    };
  },
  created() {
    this.language = this.getLanguage;
  },
  emits: {
    switchFromLanguageHub(language: Language): boolean {
      return !!language;
    },
    deleteLanguage(): boolean {
      return true;
    },
  },
  methods: {
    getSelectedLanguageClass(language: Language): string {
      return language === this.language ? "bg-purple text-white" : "";
    },
    switchFromLanguageHub(language: Language): void {
      this.$emit("switchFromLanguageHub", language);
    },
    deleteLanguage(language: Language): void {
      const accepted = confirm(
        this.$t("views.languages.confirmDeletion", { lang: language }),
      );
      if (!accepted) {
        return;
      }
      this.$store.commit("removeLanguage", language);
      if (this.language === language) {
        this.language = this.getLanguage;
        this.$emit("deleteLanguage");
      }
    },
    getUnusedLanguages(): Language[] {
      return languages.filter((lang) => !this.getUsedLanguages.includes(lang));
    },
    addLanguage(language: Language): void {
      this.$store.commit("addLanguage", language);
    },
    addAndSwitchFromLanguageHub(language: Language): void {
      this.addLanguage(language);
      this.switchFromLanguageHub(language);
    },
  },
  computed: {
    ...mapGetters(["getUsedLanguages", "getLanguage"]),
  },
});
</script>
