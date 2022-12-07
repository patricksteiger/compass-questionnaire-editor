<template>
  <div class="row justify-center">
    <div class="col-6">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          :label="$t('views.tabs.settings.Answers.title')"
        >
          <q-card>
            <q-card-section>
              <div class="row">
                <div class="col-12">
                  <q-list>
                    <q-item tag="label" v-ripple>
                      <q-item-section>
                        <q-item-label>{{
                          $t("views.tabs.settings.Answers.AnswerValueset")
                        }}</q-item-label>
                      </q-item-section>
                      <q-item-section avatar>
                        <q-toggle color="red" v-model="answerValueset" />
                      </q-item-section>
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-item-section>
                        <q-item-label>{{
                          $t("views.tabs.settings.Answers.OpenChoice")
                        }}</q-item-label>
                      </q-item-section>
                      <q-item-section avatar>
                        <q-toggle color="red" v-model="openChoice" />
                      </q-item-section>
                    </q-item>
                    <q-item tag="label" v-ripple>
                      <q-item-section>
                        <q-item-label>{{
                          $t("views.tabs.settings.Answers.Choice")
                        }}</q-item-label>
                      </q-item-section>
                      <q-item-section avatar>
                        <q-toggle color="red" v-model="choice" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
</template>
<script>
// import { I18n } from "vue-i18n";
// import i18n from "./i18n";
//import { useI18n } from "vue-i18n";
import { computed, defineComponent } from "vue";
import store from "../store";

export default defineComponent({
  setup() {
    const answerValueset = computed({
      get: () => store.state.settings.answers.answersValueset,
      set: (value) => store.commit("setAnswerValueSet", value),
    });
    const openChoice = computed({
      get: () => store.state.settings.answers.openChoice,
      set: (value) => store.commit("setOpenChoice", value),
    });
    const choice = computed({
      get: () => store.state.settings.answers.choice,
      set: (value) => store.commit("setChoice", value),
    });
    return { answerValueset, openChoice, choice };
  },
  /*computed: {
    answerValueset: {
      get: function () {
        return this.$store.state.settings.answers.answersValueset;
      },
      set: function (value) {
        this.$store.commit("setAnswerValueSet", value);
      },
    },
    openChoice: {
      get: function () {
        return this.$store.state.settings.answers.openChoice;
      },
      set: function (value) {
        this.$store.commit("setOpenChoice", value);
      },
    },
    choice: {
      get: function () {
        return this.$store.state.settings.answers.choice;
      },
      set: function (value) {
        this.$store.commit("setChoice", value);
      },
    },
  },*/
});
</script>
