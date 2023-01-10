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
              <q-toolbar-title>{{
                $t("views.editor.questions")
              }}</q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md">
              <q-tree
                :nodes="item"
                :filter="filter"
                :filter-method="filterItemToBeShown"
                node-key="__internalID"
                selected-color="primary"
                v-model:selected="selected"
                children-key="item"
              >
                <template v-slot:default-header="prop">
                  <div class="row justify-between" style="width: 100%">
                    <div class="row">
                      <q-icon
                        :name="prop.node.__icon"
                        size="20px"
                        class="q-mr-sm text-grey-8"
                        ><q-tooltip>
                          {{ prop.node.type }}
                        </q-tooltip></q-icon
                      >
                      <div class="text-bold q-pr-sm">
                        {{ prop.node.linkId
                        }}<q-tooltip> {{ $t("components.linkId") }} </q-tooltip>
                      </div>
                      <div class="q-body-1">
                        {{ prop.node.text }}
                      </div>
                    </div>
                  </div>
                </template>
              </q-tree>
            </div>
          </template>
          <template v-slot:after>
            <q-toolbar
              v-if="selectedItem"
              class="bg-primary text-white shadow-2"
            >
              <q-toolbar-title>{{
                $t("views.editor.answerSelected")
              }}</q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md" v-if="selected && selectedItem">
              <div class="text-h5 text-bold q-mb-md">
                {{ selectedItem.text }}
                <div class="text-caption">{{ selectedItem.type }}</div>
                <div class="text-subtitle1">
                  {{ $t("views.editor.UUID") }}:
                  <span class="text-italic q-mb-md">
                    {{ selectedItem.definition }}
                  </span>
                </div>
                <div class="text-subtitle1" v-if="selectedItem.answerValueSet">
                  {{ $t("views.editor.AnswerValueSet") }}:
                  <span class="text-italic q-mb-md">
                    {{ selectedItem.answerValueSet }}
                  </span>
                </div>
              </div>

              <div
                v-if="
                  selectedItem.type === 'choice' ||
                  selectedItem.type === 'open-choice'
                "
              >
                <q-toolbar
                  class="text-primary"
                  bordered
                  separator
                  v-if="selectedItem.answerOption"
                >
                  <q-toolbar-title>{{
                    $t("views.editor.AnswerOptions")
                  }}</q-toolbar-title>
                </q-toolbar>
                <div class="q-pl-sm text-caption text-grey-8 text-italic">
                  {{ $t("views.editor.toSelectOneAnswer") }}
                </div>
                <q-list bordered separator v-if="selectedItem?.answerOption"
                  ><q-item
                    clickable
                    @dblclick="
                      onSelectAnswer({
                        ...answerOption,
                        linkId: selectedItem?.linkId,
                        type: selectedItem?.type,
                      })
                    "
                    v-for="answerOption in selectedItem.answerOption"
                    :key="answerOption.__id"
                  >
                    <!--Coding Answer type -->
                    <q-item-section
                      v-if="
                        answerOption.__type === 'coding' &&
                        answerOption.valueCoding
                      "
                      ><q-item-label>{{
                        answerOption.valueCoding.display
                      }}</q-item-label
                      ><q-item-label caption lines="2">{{
                        answerOption.valueCoding.system
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section
                      side
                      top
                      v-if="
                        answerOption.valueCoding &&
                        answerOption.__type === 'coding'
                      "
                    >
                      <q-item-label caption>{{
                        answerOption.valueCoding.code
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section v-if="answerOption.__type === 'integer'"
                      ><q-item-label>{{
                        answerOption.valueInteger
                      }}</q-item-label>
                      <q-item-label caption lines="2">
                        valueInteger
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="answerOption.__type === 'date'"
                      ><q-item-label>{{ answerOption.valueDate }}</q-item-label>
                      <q-item-label caption lines="2"> valueDate </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="answerOption.__type === 'string'"
                      ><q-item-label>{{
                        answerOption.valueString
                      }}</q-item-label>
                      <q-item-label caption lines="2">
                        valueString
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </template>
        </q-splitter>
      </q-page>
      <q-page-sticky
        position="bottom-right"
        :offset="[18, 18]"
        v-if="
          selectedItem !== undefined &&
          selectedItem.type !== 'group' &&
          selectedItem.type !== 'open-choice' &&
          selectedItem.type !== 'choice' &&
          selected
        "
      >
        <q-btn
          fab
          icon="done"
          color="primary"
          padding="none xl"
          :label="$t('views.editor.selectAnswer')"
          @click="
            onSelectQuestion({
              linkId: selectedItem?.linkId,
              type: selectedItem?.type as SelectableQuestion,
            })
          "
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent, Ref, ref } from "vue";
import { editorTools } from "../utils/editor";
import {
  AnswerOption,
  Questionnaire,
  // eslint-disable-next-line no-unused-vars
  SelectableQuestion,
  SelectedQuestion,
} from "@/types";

export default defineComponent({
  props: {
    internalID: {
      type: String,
      required: true,
    },
  },
  setup() {
    const filter = ref("de");
    const selectedItem: Ref<Questionnaire | undefined> = ref(undefined);
    const selected: Ref<string | undefined> = ref(undefined);
    const item: Ref<Questionnaire[]> = ref([]);
    return {
      splitterModel: ref(50), // start at 50%
      edtiorTools: editorTools,
      filter,
      selectedItem,
      selected,
      item,
    };
  },
  data() {
    return {
      questionnaireGUI: {
        item: [],
      },
    };
  },
  created(): void {
    this.questionnaireGUI = this.getQuestionnaireImportedJSON
      ? this.getQuestionnaireImportedJSON
      : {};
    this.item = this.questionnaireGUI.item || [];
  },
  computed: {
    ...mapGetters(["getQuestionnaireImportedJSON"]),
  },
  watch: {
    selected(val: string | undefined): void {
      if (val === undefined) {
        this.selectedItem = undefined;
        return;
      }
      const item = this.edtiorTools.getCurrentQuestionNodeByID(val, this.item);
      if (item === undefined) {
        console.error(`LinkId ${val} is not on an available Node`);
        return;
      }
      this.selectedItem = item;
    },
  },
  methods: {
    onSelectQuestion(questionSelected: SelectedQuestion): void {
      this.$emit("question", questionSelected);
    },
    filterItemToBeShown(node: Questionnaire): boolean {
      return node.__active && node.__internalID !== this.internalID;
    },
    onSelectAnswer(answerOption: AnswerOption): void {
      this.$emit("choiceQuestion", answerOption);
    },
  },
});
</script>
