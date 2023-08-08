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
              <q-toolbar-title>
                {{ $t("views.editor.questions") }}
              </q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md">
              <q-tree
                :nodes="item"
                :filter="filter"
                :filter-method="filterItemToBeShown"
                node-key="__internalID"
                selected-color="primary"
                v-model:selected="selected"
                @update:selected="
                  (target) => {
                    selected = target !== internalID ? target : null;
                  }
                "
                children-key="item"
              >
                <template v-slot:default-header="prop">
                  <div class="row justify-between" style="width: 100%">
                    <div class="row">
                      <q-icon
                        :name="prop.node.__icon"
                        size="20px"
                        class="q-mr-sm text-grey-8"
                      >
                        <q-tooltip>
                          {{ prop.node.type }}
                        </q-tooltip>
                      </q-icon>
                      <div class="text-bold q-pr-sm">
                        {{ prop.node.linkId }}
                        <q-tooltip> {{ $t("components.linkId") }} </q-tooltip>
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
              <q-toolbar-title>
                {{ $t("views.editor.answerSelected") }}
              </q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md" v-if="selected && selectedItem">
              <div class="text-h5 text-bold q-mb-md">
                {{ selectedItem.text }}
                <div class="text-caption">{{ selectedItem.type }}</div>
                <div class="text-subtitle1">
                  LinkID:
                  <span class="text-italic q-mb-md">
                    {{ selectedItem.linkId }}
                  </span>
                </div>
                <div
                  class="text-subtitle1"
                  v-if="
                    allowsAnswerValueSet(selectedItem.type) &&
                    selectedItem.__answerValueSetCheck &&
                    selectedItem.answerValueSet
                  "
                >
                  {{ $t("views.editor.AnswerValueSet") }}:
                  <span class="text-italic q-mb-md">
                    {{ selectedItem.answerValueSet }}
                  </span>
                </div>
              </div>

              <!-- AnswerOption values -->
              <div
                v-if="
                  allowsAnswerOption(selectedItem.type) &&
                  !selectedItem.__answerValueSetCheck &&
                  itemTools.definedAnswerOption(selectedItem)
                "
              >
                <q-toolbar class="text-primary" bordered separator>
                  <q-toolbar-title>
                    {{ $t("views.editor.AnswerOptions") }}
                  </q-toolbar-title>
                </q-toolbar>
                <div class="q-pl-sm text-caption text-grey-8 text-italic">
                  {{ $t("views.editor.toSelectOneAnswer") }}
                </div>
                <q-list bordered separator>
                  <q-item
                    v-for="answerOption in selectedItem.answerOption"
                    :key="answerOption.__id"
                    clickable
                    @dblclick="
                      onSelectAnswer({
                        ...answerOption,
                        __linkId: selectedItem?.linkId,
                      })
                    "
                  >
                    <q-item-section v-if="answerOption.__type === 'coding'">
                      <q-item-label>
                        {{ answerOption.__formattedValueCoding }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        valueCoding
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      v-else-if="answerOption.__type === 'decimal'"
                    >
                      <q-item-label>
                        {{ answerOption.valueDecimal }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        valueDecimal
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      v-else-if="answerOption.__type === 'integer'"
                    >
                      <q-item-label>
                        {{ answerOption.valueInteger }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        valueInteger
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-else-if="answerOption.__type === 'date'">
                      <q-item-label>{{ answerOption.valueDate }}</q-item-label>
                      <q-item-label caption lines="2"> valueDate </q-item-label>
                    </q-item-section>
                    <q-item-section
                      v-else-if="answerOption.__type === 'dateTime'"
                    >
                      <q-item-label>
                        {{ answerOption.valueDateTime }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        valueDateTime
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-else-if="answerOption.__type === 'time'">
                      <q-item-label>{{ answerOption.valueTime }}</q-item-label>
                      <q-item-label caption lines="2"> valueTime </q-item-label>
                    </q-item-section>
                    <q-item-section
                      v-else-if="
                        answerOption.__type === 'string' ||
                        answerOption.__type === 'text'
                      "
                    >
                      <q-item-label>
                        {{ answerOption.valueString }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        valueString
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-else-if="answerOption.__type === 'url'">
                      <q-item-label>
                        {{ answerOption.valueUri }}
                      </q-item-label>
                      <q-item-label caption lines="2"> valueUri </q-item-label>
                    </q-item-section>
                    <q-item-section
                      v-else-if="answerOption.__type === 'quantity'"
                    >
                      <q-item-label>
                        {{ answerOption.__formattedValueQuantity }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        valueQuantity
                      </q-item-label>
                    </q-item-section>
                    <q-item-section
                      v-else-if="answerOption.__type === 'reference'"
                    >
                      <q-item-label>
                        {{ answerOption.__formattedValueReference }}
                      </q-item-label>
                      <q-item-label caption lines="2">
                        valueReference
                      </q-item-label>
                    </q-item-section>
                    <div v-else>{{ unreachableCode(answerOption.__type) }}</div>
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
          selected &&
          selectedItem !== undefined &&
          isSelectableItem(selectedItem)
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
              type: selectedItem?.type as SelectableItem,
            })
          "
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from "vue";
import { editorTools, UnreachableError } from "../utils/editor";
import {
  AnswerOption,
  EnableWhen,
  Item,
  Questionnaire,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SelectableItem,
  SelectedItem,
} from "@/types";
import { defaultLanguage } from "@/i18n";
import {
  allowsAnswerOption,
  allowsAnswerValueSet,
  isSelectableItem,
} from "@/utils/constants";
import { questionnaireTools } from "@/utils/questionnaire";
import { itemTools } from "@/utils/item";

export default defineComponent({
  props: {
    questionnaire: {
      type: Object as PropType<Questionnaire>,
      required: true,
    },
    internalID: {
      type: String,
      required: true,
    },
    enableWhenItem: {
      type: Object as PropType<EnableWhen>,
      required: true,
    },
  },
  setup(prop) {
    const filter = ref(defaultLanguage);
    const { questionnaire, enableWhenItem } = toRefs(prop);
    const item = ref<Item[]>(questionnaire.value.item);
    const linkId = ref(enableWhenItem.value.question);
    const selected = ref<string | null>(null);
    const linkedItem = questionnaireTools.getItemByLinkId(
      questionnaire.value,
      linkId.value,
    );
    const selectedItem = ref<Item | undefined>(linkedItem);
    // If LinkId was already in question-field of enableWhen
    if (selectedItem.value !== undefined) {
      selected.value = selectedItem.value.__internalID;
    }
    return {
      allowsAnswerOption,
      allowsAnswerValueSet,
      splitterModel: ref(50), // start at 50%
      editorTools,
      itemTools,
      questionnaireTools,
      filter,
      linkedItem,
      selectedItem,
      selected,
      item,
      isSelectableItem,
    };
  },
  watch: {
    selected(val: string | null): void {
      if (val === null) {
        this.selectedItem = undefined;
        return;
      }
      const item = this.questionnaireTools.getItemByInternalId(
        this.questionnaire,
        val,
      );
      if (item === undefined) {
        console.error(`InternalId ${val} is not on an available Node`);
        return;
      }
      this.selectedItem = item;
    },
  },
  methods: {
    onSelectQuestion(questionSelected: SelectedItem): void {
      this.$emit("question", questionSelected);
    },
    filterItemToBeShown(item: Item): boolean {
      return (
        item.__active &&
        item.type !== "display" &&
        item.__internalID !== this.internalID
      );
    },
    onSelectAnswer(answerOption: AnswerOption): void {
      this.$emit("choiceQuestion", answerOption);
    },
    unreachableCode(n: never) {
      throw new UnreachableError(n);
    },
  },
});
</script>
