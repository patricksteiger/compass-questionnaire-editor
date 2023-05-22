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
                  </q-list>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
  <div class="row justify-center">
    <q-input
      class="col-12"
      label="Copyright"
      v-model="questionnaire.copyright"
      type="textarea"
      autogrow
      clearable
    />
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { Questionnaire } from "@/types";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const questionnaire = ref<Questionnaire>(
      computed(() => store.getters.getQuestionnaireImportedJSON).value,
    );
    return {
      questionnaire,
    };
  },
  computed: {
    answerValueset: {
      get() {
        return this.$store.state.settings.answers.answerValueSet;
      },
      set(value: Boolean) {
        this.$store.commit("setAnswerValueSet", value);
      },
    },
  },
});
</script>
