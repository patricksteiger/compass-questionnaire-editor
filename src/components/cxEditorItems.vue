<template>
  <div>
    <!-- Question Editor -->
    <q-splitter
      v-model="splitterModel"
      :limits="limitsSpliter"
      style="height: calc(100vh - 140px)"
    >
      <template v-slot:before>
        <div>
          <q-tree
            :nodes="item"
            node-key="__internalID"
            selected-color="primary"
            v-model:selected.sync="selected"
            default-expand-all
            q-tree
            children-key="item"
          >
            <template v-slot:default-header="prop">
              <div
                class="col items-center justify-between"
                style="width: 100%"
                :disable="prop.node.__disabled"
              >
                <div
                  class="row items-center justify-between"
                  style="width: 100%; height: 6px"
                  @dragover="onDragOver"
                  @dragleave="onDragLeave"
                  @drop="onDrop($event, false)"
                  :id="prop.node.__internalID"
                ></div>
                <div
                  class="row items-center justify-between"
                  style="width: 100%; flex-wrap: nowrap"
                  @dragover="onDragOver"
                  @dragleave="onDragLeave"
                  @drop="onDrop"
                  @dragstart="onDragStart($event, prop.node)"
                  :id="prop.node.__internalID"
                  draggable="true"
                >
                  <div class="row items-center" style="min-width: 150px">
                    <q-icon
                      :name="prop.node.__icon"
                      size="15px"
                      class="q-mr-sm text-grey-8"
                      ><q-tooltip>
                        {{ prop.node.type }}
                      </q-tooltip></q-icon
                    >
                    <div class="col-12 q-body-1 text-weight-bold">
                      {{ prop.node.text }}
                    </div>
                  </div>
                  <div
                    class="row items-center justify-end"
                    style="width: 190px; min-width: 190px"
                  >
                    <!-- reverse original text question -->
                    <div style="width: 30px">
                      <q-btn
                        :disable="!prop.node.__active"
                        flat
                        round
                        size="xs"
                        icon="history"
                        class="q-mr-sm text-grey-8"
                        v-if="
                          prop.node.text !== prop.node.__oldText &&
                          !prop.node.__newQuestion
                        "
                        @click="prop.node.text = prop.node.__oldText"
                        ><q-tooltip>
                          {{ $t("views.editor.reverseText") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div v-if="!prop.node.__disabled">
                      <q-toggle
                        size="xs"
                        v-model="prop.node.__active"
                        :disable="prop.node.__disabled"
                        @click="toggleItem(prop.node.__internalID)"
                        ><q-tooltip>
                          {{
                            prop.node.__active
                              ? $t("views.editor.disableItem")
                              : $t("views.editor.enableItem")
                          }}
                        </q-tooltip></q-toggle
                      >
                    </div>
                    <div style="width: 30px">
                      <q-btn
                        flat
                        round
                        size="xs"
                        icon="delete"
                        class="q-mr-sm text-grey-8"
                        @click="deleteItem(prop.key)"
                      >
                        <q-tooltip>{{
                          $t("views.editor.deleteItem")
                        }}</q-tooltip>
                      </q-btn>
                    </div>
                    <div class="q-body-1">
                      <q-icon
                        name="drag_indicator"
                        size="20px"
                        class="q-mr-sm text-grey-5"
                        ><q-tooltip>
                          {{ $t("views.editor.dragItem") }}
                        </q-tooltip></q-icon
                      >
                    </div>
                  </div>
                </div>
                <!-- FIXME: remove internal linkId -->
                <div
                  class="row items-center justify-between text-caption text-grey-8 non-selectable"
                  style="width: 100%"
                >
                  <span>
                    {{ prop.node.type }}:{{ prop.node.linkId }} | __{{
                      prop.node.__linkId
                    }}
                    <q-tooltip>
                      {{ $t("components.linkId") }}
                    </q-tooltip>
                  </span>
                </div>
              </div>
            </template>
          </q-tree>

          <!-- Change language button -->
          <div>
            <q-page-sticky position="bottom-left" :offset="[240, 18]">
              <q-fab
                vertical-actions-align="left"
                color="purple"
                push
                icon="keyboard_arrow_up"
                direction="up"
                padding="none xl"
                :hide-icon="getUsedLanguages.length <= 1"
                :label="
                  $t('views.editor.changeLanguage', { language: language })
                "
              >
                <q-fab-action
                  v-for="lang in getUsedLanguages.filter((l: Language) => l !== language)"
                  :key="lang"
                  label-position="right"
                  color="purple"
                  @click="switchLanguage(lang)"
                  :label="lang"
                />
              </q-fab>
            </q-page-sticky>
          </div>

          <!-- Button new question first Item -->
          <div
            v-if="
              selected === null ||
              selectedItem === undefined ||
              (selectedItem.__active && selectedItem.type === 'group')
            "
          >
            <q-page-sticky position="bottom-left" :offset="[18, 18]">
              <q-fab
                v-model="fabLeft"
                vertical-actions-align="left"
                color="primary"
                push
                icon="keyboard_arrow_up"
                direction="up"
                padding="none xl"
                :label="$t('views.editor.addItem')"
              >
                <q-fab-action
                  v-for="questionTypeIcon in enabledQuestionTypes"
                  :key="questionTypeIcon.name"
                  label-position="right"
                  color="primary"
                  @click="onAddQuestion(questionTypeIcon.name)"
                  :icon="questionTypeIcon.icon"
                  :label="questionTypeIcon.label"
                />
              </q-fab>
            </q-page-sticky>
          </div>
        </div>
      </template>

      <!-- Editor: question selected -->
      <template v-slot:after>
        <q-tab-panels v-model="selected">
          <q-tab-panel :name="selected">
            <div>
              <!-- back Las selected Item -->
              <q-btn
                color="primary"
                v-if="lastSelected"
                icon="arrow_back"
                @click="onBackLastSelectedItem"
                :label="$t('views.editor.backLastItem')"
              />
            </div>
            <div
              class="row items-center justify-between text-caption text-grey-8 non-selectable"
              style="width: 100%"
            >
              <span>{{ selectedItem?.type || "empty type" }}</span>
            </div>
            <div
              class="row items-center justify-between text-bold text-h5 q-mb-md"
            >
              <!-- Question text -->
              <!-- TODO: properly support resetting to old text -->
              <q-input
                autogrow
                v-if="selectedItem !== undefined"
                v-model="selectedItem.text"
                class="col-10"
                input-class="text-h5 text-bold"
                :disable="!selectedItem.__active"
                :error="!selectedItem.text"
                :label="
                  selectedItem.text !== selectedItem.__oldText &&
                  !selectedItem.__newQuestion
                    ? `${$t('views.editor.originalText')}: ${
                        selectedItem.__oldText
                      }`
                    : ''
                "
                ><template v-slot:error>
                  {{ $t("components.fieldEmpty") }}
                </template></q-input
              >
              <!-- Show Dependence Condition -->
              <q-btn
                flat
                round
                color="primary"
                icon="device_hub"
                @click="alert = true"
                v-if="selectedItem?.__dependenceCondition"
                ><q-tooltip>
                  {{ $t("views.editor.conditionFulfilled") }}
                </q-tooltip></q-btn
              >
              <!-- Question linkId text -->
              <span class="text-grey-6"
                >{{ selectedItem?.linkId || "empty linkID"
                }}<q-tooltip> {{ $t("components.linkId") }} </q-tooltip></span
              >
            </div>
            <div
              v-if="selectedItem !== undefined"
              class="row items-center text-bold text-h5 q-mb-md"
            >
              <!-- required toggle -->
              <q-toggle
                left-label
                label="required"
                color="purple"
                keep-color
                v-model="requiredItem"
              />
              <!-- repeats toggle -->
              <q-toggle
                left-label
                label="repeats"
                color="purple"
                keep-color
                v-model="repeatedItem"
              />
            </div>
            <div
              class="row items-center justify-between text-bold text-h5 q-mb-md"
            >
              <!-- UUID -->
              <q-input
                :disable="!selectedItem.__active"
                v-if="selectedItem !== undefined"
                v-model="selectedItem.definition"
                :label="$t('views.editor.UUID')"
                dense
                class="col-8"
              >
                <template v-slot:after>
                  <q-btn
                    :disable="!selectedItem.__active"
                    dense
                    flat
                    icon="autorenew"
                    @click="newUUID"
                    >{{ $t("views.editor.newUUID")
                    }}<q-tooltip>
                      {{ $t("views.editor.regenerateUUID") }}
                    </q-tooltip></q-btn
                  >
                </template>
              </q-input>
            </div>
            <div
              class="row items-center justify-between text-bold text-h5 q-mb-md"
            >
              <!-- Max Length-->
              <q-input
                v-if="selectedItem?.type === 'string'"
                :disable="!selectedItem.__active"
                :label="$t('views.editor.maxLength')"
                dense
                type="number"
                @keypress="onlyNumber"
                v-model="selectedItem.maxLength"
              ></q-input>
            </div>
            <!-- AnswerValueSet -->
            <div
              class="row"
              v-if="
                selectedItem?.type === 'choice' ||
                selectedItem?.type === 'open-choice'
              "
            >
              <div v-if="getAnswerValueSet">
                <q-checkbox
                  :label="
                    selectedItem.__answerValueSetCheck
                      ? ''
                      : $t('views.editor.AnswerValueSet')
                  "
                  v-model="selectedItem.__answerValueSetCheck"
                  :disable="!selectedItem.__active"
                  @click="answerValueSet()"
                ></q-checkbox
                ><q-input
                  v-if="selectedItem.__answerValueSetCheck"
                  :label="$t('views.editor.AnswerValueSet')"
                  class="col-5"
                  dense
                  v-model="selectedItem.answerValueSet"
                  :disable="!selectedItem.__active"
                  :error="
                    selectedItem.__active && selectedItem.answerValueSet === ''
                  "
                  ><template v-slot:error>
                    {{ $t("components.fieldEmpty") }}
                  </template></q-input
                >
              </div>
            </div>
            <!-- Answers/Conditions -->
            <q-list padding bordered>
              <!-- Answers -->
              <q-expansion-item
                v-if="
                  selectedItem !== undefined &&
                  !selectedItem.__answerValueSetCheck &&
                  (selectedItem.type === 'choice' ||
                    selectedItem.type === 'open-choice')
                "
                :disable="!selectedItem.__active"
                expand-separator
                icon="question_answer"
                :label="$t('views.editor.answers')"
              >
                <q-separator />
                <q-card>
                  <!-- Multiple asnwers -->
                  <div
                    v-if="
                      selectedItem.type === 'choice' ||
                      selectedItem.type === 'open-choice'
                    "
                  >
                    <div class="q-pa-md" style="width: 100%">
                      <q-list dense v-if="!selectedItem.__answerValueSetCheck"
                        ><q-item
                          v-for="answerOption in selectedItem.answerOption"
                          :key="answerOption.__id"
                        >
                          <!-- Open Choice and Choice-->
                          <q-item-section v-if="answerOption">
                            <!-- coding input answer -->
                            <div
                              class="row"
                              v-if="
                                answerOption.__type === 'coding' &&
                                answerOption.valueCoding !== undefined
                              "
                            >
                              <q-input
                                class="col-12"
                                autogrow
                                v-model="answerOption.valueCoding.display"
                                :disable="!selectedItem.__active"
                                :error="!answerOption.valueCoding.display"
                                :label="
                                  answerOption.valueCoding.display !==
                                    answerOption.valueCoding.__oldDisplay &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.valueCoding.__oldDisplay
                                      }`
                                    : ''
                                "
                                ><template v-slot:error>
                                  {{ $t("components.fieldEmpty") }} </template
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer  -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="
                                    answerOption.valueCoding !== undefined &&
                                    answerOption.valueCoding.display !==
                                      answerOption.valueCoding.__oldDisplay &&
                                    answerOption.__newAnswer !== true
                                  "
                                  @click="setDisplayToOld(answerOption)"
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>
                            <!-- integer input answer -->
                            <div
                              class="row"
                              v-if="answerOption.__type === 'integer'"
                            >
                              <q-input
                                class="col-12"
                                @keypress="onlyNumber"
                                autogrow
                                v-model="answerOption.valueInteger"
                                :disable="!selectedItem.__active"
                                :label="
                                  answerOption.valueInteger !==
                                    answerOption.__oldValueInteger &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldValueInteger
                                      }`
                                    : ''
                                "
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer  -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="
                                    answerOption.valueInteger !==
                                      answerOption.__oldValueInteger &&
                                    !answerOption.__newAnswer
                                  "
                                  @click="
                                    answerOption.valueInteger =
                                      answerOption.__oldValueInteger
                                  "
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>

                            <!-- date input answer -->
                            <div
                              class="row"
                              v-if="answerOption.__type === 'date'"
                            >
                              <q-input
                                type="date"
                                stack-label
                                class="col-12"
                                v-model="answerOption.valueDate"
                                :disable="!selectedItem.__active"
                                :label="
                                  answerOption.valueDate !==
                                    answerOption.__oldValueDate &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldValueDate
                                      }`
                                    : ''
                                "
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer  -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="
                                    answerOption.valueDate !==
                                      answerOption.__oldValueDate &&
                                    !answerOption.__newAnswer
                                  "
                                  @click="
                                    answerOption.valueDate =
                                      answerOption.__oldValueDate
                                  "
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>

                            <!-- string input answer -->
                            <div
                              class="row"
                              v-if="answerOption.__type === 'string'"
                            >
                              <q-input
                                class="col-12"
                                autogrow
                                v-model="answerOption.valueString"
                                :disable="!selectedItem.__active"
                                :label="
                                  answerOption.valueString !==
                                    answerOption.__oldValueString &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldValueString
                                      }`
                                    : ''
                                "
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer  -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="
                                    answerOption.valueString !==
                                      answerOption.__oldValueString &&
                                    !answerOption.__newAnswer
                                  "
                                  @click="
                                    answerOption.valueString =
                                      answerOption.__oldValueString
                                  "
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>
                          </q-item-section>
                          <q-item-section top side class="justify-center">
                            <div class="row items-center">
                              <!--  If answer Item is Coding Display Code and System input-->
                              <div
                                class="row"
                                v-if="
                                  answerOption.__type === 'coding' &&
                                  answerOption.valueCoding !== undefined
                                "
                              >
                                <q-input
                                  :disable="!selectedItem.__active"
                                  :label="$t('views.editor.code')"
                                  outlined
                                  dense
                                  class="col-5"
                                  v-model="answerOption.valueCoding.code"
                                ></q-input
                                ><q-input
                                  :disable="!selectedItem.__active"
                                  :label="$t('views.editor.system')"
                                  outlined
                                  dense
                                  class="col-5"
                                  v-model="answerOption.valueCoding.system"
                                ></q-input>
                              </div>
                              <div class="text-grey-8">
                                <!-- Remove answer  -->
                                <q-btn
                                  flat
                                  round
                                  color="grey-6"
                                  icon="highlight_off"
                                  :disable="!selectedItem.__active"
                                  @click="onRemoveAnswer(answerOption)"
                                  ><q-tooltip>
                                    {{ $t("components.remove") }}
                                  </q-tooltip></q-btn
                                >
                              </div>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <!--  button add new Answer -->
                      <q-fab
                        padding="none xl"
                        fab
                        icon="add"
                        :label="$t('views.editor.addAnswer')"
                        direction="right"
                        color="primary"
                        v-if="!selectedItem.__answerValueSetCheck"
                      >
                        <template>
                          <q-fab-action
                            v-for="answerType in answerTypeButton"
                            :key="answerType.name"
                            color="primary"
                            :icon="answerType.icon"
                            :label="answerType.label"
                            @click="onClickAddAnswer(answerType)"
                          />
                        </template>
                      </q-fab>
                      <!--</q-page-sticky> -->
                    </div>
                  </div>
                </q-card>
              </q-expansion-item>
              <!-- Item Condition -->
              <q-expansion-item
                v-if="selectedItem !== undefined"
                :disable="!selectedItem.__active"
                expand-separator
                icon="account_tree"
                :label="$t('views.editor.itemConditions')"
                default-opened
              >
                <q-separator />
                <!-- FIXME: Changed key from enableWhen to index correct? -->
                <q-card>
                  <q-list
                    dense
                    bordered
                    padding
                    class="rounded-borders"
                    v-for="(enableWhen, index) in selectedItem.enableWhen"
                    :key="index"
                  >
                    <q-item-section>
                      <q-card-section>
                        <div class="row">
                          <div class="col-1">
                            <!-- Go to question Item -->
                            <q-btn
                              :disable="!selectedItem.__active"
                              v-if="enableWhen.question !== ''"
                              flat
                              color="primary"
                              icon="subdirectory_arrow_left"
                              @click="onGotoItem(enableWhen.question)"
                              ><q-tooltip>
                                {{ $t("views.editor.navigateToItem") }}
                              </q-tooltip></q-btn
                            >
                          </div>
                          <q-input
                            :disable="!selectedItem.__active"
                            :label="`${$t('views.editor.question')}: ${
                              enableWhen.type || ''
                            }`"
                            dense
                            v-model="enableWhen.question"
                            @click="onShowQuestionsItems(enableWhen)"
                          >
                          </q-input>
                          <q-select
                            :disable="!selectedItem.__active"
                            class="col-2"
                            v-model="enableWhen.operator"
                            :options="operators"
                            :label="$t('views.editor.operator')"
                            dense
                          />
                          <!-- enableWhen boolean -->
                          <!-- TODO: EnableWhen answer and operator is set through v-model? How to duplicate? -->
                          <q-select
                            v-if="
                              enableWhen.type === 'boolean' ||
                              enableWhen.operator === 'exists'
                            "
                            :disable="!selectedItem.__active"
                            class="col-4"
                            v-model="enableWhen.answer"
                            :options="['true', 'false']"
                            :label="$t('views.editor.answer')"
                            dense
                          />
                          <q-input
                            v-else-if="enableWhen.type === 'integer'"
                            @keypress="onlyNumber"
                            :disable="!selectedItem.__active"
                            :label="$t('views.editor.answer')"
                            class="col-4"
                            v-model="enableWhen.answer"
                            :type="'number'"
                            dense
                          />
                          <!-- enableWhen decimal -->
                          <q-input
                            v-else-if="enableWhen.type === 'decimal'"
                            :disable="!selectedItem.__active"
                            @keypress="onlyNumberDec"
                            :label="$t('views.editor.answer')"
                            class="col-4"
                            v-model="enableWhen.answer"
                            type="number"
                            dense
                          />
                          <!-- TODO: Allow only year/month to be selected -->
                          <!-- <q-input -->
                          <!--   v-else-if="enableWhen.type === 'date'" -->
                          <!--   :disable="!selectedItem.__active" -->
                          <!--   :label="$t('views.editor.answer')" -->
                          <!--   :stack-label="true" -->
                          <!--   class="col-4" -->
                          <!--   v-model="enableWhen.answer" -->
                          <!--   mask="'YYYY-MM-DD'" -->
                          <!--   :type="'date'" -->
                          <!--   dense -->
                          <!-- /> -->
                          <q-input
                            v-else
                            :disable="!selectedItem.__active"
                            :label="$t('views.editor.answer')"
                            class="col-4"
                            v-model="enableWhen.answer"
                            :type="'text'"
                            dense
                          />
                          <!--  remove item enable when -->
                          <q-btn
                            :disable="!selectedItem.__active"
                            flat
                            color="grey-6"
                            icon="highlight_off"
                            @click="onRemoveCondition(index)"
                          >
                            <q-tooltip>
                              {{ $t("components.remove") }}
                            </q-tooltip>
                          </q-btn>
                        </div>
                        <!-- add new Condition -->
                      </q-card-section>
                    </q-item-section>
                  </q-list>
                  <div class="q-pa-sm">
                    <q-btn
                      padding="none xl"
                      v-if="selectedItem.__active"
                      fab
                      icon="add"
                      color="primary"
                      :label="$t('views.editor.addNewCondition')"
                      @click="onAddCondition"
                    />
                    <!-- enableWhen behavior -->
                    <q-fab
                      v-if="selectedItem.__active"
                      vertical-actions-align="left"
                      color="purple"
                      push
                      icon="keyboard_arrow_up"
                      direction="up"
                      padding="none xl"
                      :label="
                        selectedItem.enableBehavior
                          ? `Behavior: ${selectedItem.enableBehavior}`
                          : 'Select Behavior'
                      "
                    >
                      <q-fab-action
                        v-if="
                          selectedItem.enableBehavior &&
                          (!selectedItem.enableWhen ||
                            selectedItem.enableWhen.length <= 1)
                        "
                        key="clear"
                        icon="delete"
                        label-position="right"
                        label="Behavior"
                        color="red"
                        @click="onChangeConditionBehavior(undefined)"
                      />
                      <q-fab-action
                        v-for="behavior in enableBehaviors.filter(
                          (b) => b !== selectedItem?.enableBehavior,
                        )"
                        :key="behavior"
                        label-position="right"
                        color="purple"
                        @click="onChangeConditionBehavior(behavior)"
                        :label="behavior"
                      />
                    </q-fab>
                  </div>
                </q-card>
              </q-expansion-item>
              <!-- Extensions -->
              <q-expansion-item
                v-if="selectedItem?.type === 'integer'"
                :disable="!selectedItem.__active"
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
                    <q-item-section>
                      <q-card-section>
                        <q-input
                          v-if="
                            selectedItem.type === 'integer' &&
                            selectedItem.extension !== undefined
                          "
                          :disable="!selectedItem.__active"
                          :label="$t('views.editor.sliderStepValue')"
                          dense
                          type="number"
                          @keypress="onlyNumber"
                          v-model="selectedItem.extension[0].valueInteger"
                        ></q-input>
                      </q-card-section>
                    </q-item-section>
                    <q-item-section>
                      <q-card-section>
                        <q-input
                          v-if="
                            selectedItem.type === 'integer' &&
                            selectedItem.extension !== undefined
                          "
                          :disable="!selectedItem.__active"
                          :label="$t('views.editor.minValue')"
                          dense
                          type="number"
                          @keypress="onlyNumber"
                          v-model="selectedItem.extension[1].valueInteger"
                        ></q-input>
                      </q-card-section>
                    </q-item-section>
                    <q-item-section>
                      <q-card-section>
                        <q-input
                          v-if="
                            selectedItem.type === 'integer' &&
                            selectedItem.extension !== undefined
                          "
                          :disable="!selectedItem.__active"
                          :label="$t('views.editor.lowRangeLabel')"
                          dense
                          v-model="selectedItem.extension[2].valueString"
                        ></q-input>
                      </q-card-section>
                    </q-item-section>
                    <q-item-section>
                      <q-card-section>
                        <q-input
                          v-if="
                            selectedItem.type === 'integer' &&
                            selectedItem.extension !== undefined
                          "
                          :disable="!selectedItem.__active"
                          :label="$t('views.editor.maxValue')"
                          dense
                          type="number"
                          @keypress="onlyNumber"
                          v-model="selectedItem.extension[3].valueInteger"
                        ></q-input>
                      </q-card-section>
                    </q-item-section>
                    <q-item-section>
                      <q-card-section>
                        <q-input
                          v-if="
                            selectedItem.type === 'integer' &&
                            selectedItem.extension !== undefined
                          "
                          :disable="!selectedItem.__active"
                          :label="$t('views.editor.highRangeLabel')"
                          dense
                          v-model="selectedItem.extension[4].valueString"
                        ></q-input>
                      </q-card-section>
                    </q-item-section>
                  </q-list>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
    <!-- Alert condition -->
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div
            v-for="(question, index) in selectedItem?.__dependenceCondition
              ?.__questions"
            :key="index"
          >
            <div class="q-pb-sm">
              <span class="text-red q-pr-xs">{{ question.__linkId }}</span
              >{{ question.__text }}
            </div>
            <div class="text-bold q-pb-sm">
              {{ $t("views.editor.enableWhenCondition") }}
            </div>
            <div class="row">
              <div class="q-pr-xs">{{ index + 1 }}</div>
              <div class="column" style="width: 250px">
                <div class="row justify-between">
                  <div>{{ $t("views.editor.question") }}:</div>
                  <div>{{ question.__question }}</div>
                </div>
                <div class="row justify-between">
                  <div>{{ $t("views.editor.operator") }}:</div>
                  <div>{{ question.__operator }}</div>
                </div>
                <div class="row justify-between">
                  <div>
                    {{ $t("views.editor.answer") }}{{ question.__type }}:
                  </div>
                  <div>{{ question.__answer }}</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Condition Item Dialog -->
    <q-dialog v-model="enableWhenLayout">
      <cx-enable-When
        v-if="selected !== null"
        :internalID="selected"
        v-on:choiceQuestion="onSelectedQuestionsAnswer"
        v-on:question="onSelectedQuestion"
      >
      </cx-enable-When>
    </q-dialog>
  </div>

  <!-- LanguageHub -->
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        icon="language"
        color="purple"
        @click="() => (languageLayout = !languageLayout)"
      >
        <q-tooltip>{{ $t("views.languages.buttonTooltip") }}</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>

  <q-dialog v-model="languageLayout">
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
  </q-dialog>
</template>
<script lang="ts">
import {
  questionTypesIcons,
  questionTypes,
  answerType,
  answerTypeButton,
  COLORS,
  MAX_ALLOWED_LEVELS,
  AnswerButtonType,
  QuestionIcon,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  DRAG_KEY_INTERNAL_ID,
} from "../utils/constants";
import { useQuasar } from "quasar";
import { defineComponent, Ref, ref } from "vue";
import { editorTools } from "../utils/editor";
import { mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";
import cxEnableWhen from "@/components/cxEnableWhen.vue";
import { i18n, defaultLanguage } from "@/i18n";
import {
  AnswerOption,
  EnableWhen,
  Item,
  SelectedQuestion,
  operators,
  Questionnaire,
  QuestionType,
  EnableBehavior,
  enableBehaviors,
} from "@/types";
import { Language, languages } from "@/store";

export default defineComponent({
  components: {
    cxEnableWhen,
  },
  setup() {
    const triggerNegative = () => {
      const $q = useQuasar();
      $q.notify({
        type: "negative",
        message: i18n.global.t("views.editor.questionDontexist"),
      });
    };
    const questionaireGUI: Ref<Questionnaire | undefined> = ref(undefined);
    const selectedItem: Ref<Item | undefined> = ref(undefined);
    const lastSelectedItem: Ref<Item | undefined> = ref(undefined);
    const selected: Ref<string | null> = ref(null);
    const lastSelected: Ref<string | null> = ref(null);
    const language: Ref<Language> = ref(defaultLanguage);
    const item: Ref<Item[]> = ref([]);
    const enableWhen: EnableWhen = { question: "", operator: "" };
    const enableWhenItem: Ref<EnableWhen> = ref(enableWhen);
    const setDisplayToOld = (answerOption: AnswerOption) => {
      if (answerOption.valueCoding !== undefined) {
        answerOption.valueCoding.display =
          answerOption.valueCoding.__oldDisplay || "";
      }
    };
    // const clearableEnableBehaviors = ["", ...enableBehaviors] as const;
    return {
      languageLayout: ref(false),
      languageSplitter: ref(40),
      languageSplitterLimits: ref([30, 60]),
      triggerNegative,
      questionaireGUI,
      item,
      selected,
      selectedItem,
      lastSelected,
      lastSelectedItem,
      enableWhenItem,
      enableBehaviors,
      setDisplayToOld,
      enableWhenLayout: ref(false),
      alert: ref(false),
      itemsAnwers: ref(""),
      editorTools,
      questionTypesIcons,
      questionTypes,
      answerType,
      COLORS,
      uuidv4,
      answerTypeButton,
      operators,
      languages,
      language,
    };
  },
  created() {
    this.language = this.getLanguage;
    this.questionaireGUI = this.getQuestionnaireImportedJSON as Questionnaire;
    this.questionaireGUI.item ??= [];
    this.item = this.questionaireGUI.item;
  },
  data() {
    return {
      fabLeft: true,
      splitterModel: 40,
      limitsSpliter: [35, 100],
    };
  },
  methods: {
    deleteLanguage(language: Language): void {
      const accepted = confirm(
        this.$t("views.languages.confirmDeletion", { language }),
      );
      if (!accepted) {
        return;
      }
      this.$store.commit("removeLanguage", language);
      const deletedCurrentQRE = this.language === language;
      if (deletedCurrentQRE) {
        this.refreshQuestionnaire();
      }
    },
    addLanguage(language: Language): void {
      this.$store.commit("addLanguage", language);
    },
    addAndSwitchFromLanguageHub(language: Language): void {
      this.addLanguage(language);
      this.switchFromLanguageHub(language);
    },
    switchLanguage(language: Language): void {
      // language is filtered at button and always != to current language
      this.$store.commit("switchQuestionnaireByLang", language);
      this.refreshQuestionnaire();
    },
    switchFromLanguageHub(language: Language): void {
      if (this.language !== language) {
        this.switchLanguage(language);
      }
      this.languageLayout = false;
    },
    refreshQuestionnaire(): void {
      this.questionaireGUI = this.getQuestionnaireImportedJSON;
      this.item = this.getQuestionnaireImportedJSON.item;
      this.language = this.getLanguage;
      if (this.selectedItem !== undefined) {
        const internalLinkId = this.selectedItem.__linkId;
        const newItem = this.editorTools.getItemByInternalLinkId(
          internalLinkId,
          this.item,
        );
        if (newItem !== undefined) {
          this.selectedItem = newItem;
          this.selected = newItem.__internalID;
        } else {
          console.error(
            `Internal LinkId ${internalLinkId} of selected does not exist in selected questionnaire!`,
          );
        }
      }
      if (this.lastSelectedItem !== undefined) {
        const internalLinkId = this.lastSelectedItem.__linkId;
        const newItem = this.editorTools.getItemByInternalLinkId(
          internalLinkId,
          this.item,
        );
        if (newItem !== undefined) {
          this.lastSelectedItem = newItem;
          this.lastSelected = newItem.__internalID;
        } else {
          console.error(
            `Internal LinkId ${internalLinkId} of last selected does not exist in selected questionnaire!`,
          );
        }
      }
    },
    getUnusedLanguages(): Language[] {
      return languages.filter((lang) => !this.getUsedLanguages.includes(lang));
    },
    onBackLastSelectedItem(): void {
      if (this.lastSelected) {
        this.selectedItem = this.lastSelectedItem;
        this.selected = this.lastSelected;
        this.lastSelectedItem = undefined;
        this.lastSelected = null;
      }
    },
    onGotoItem($event: string | null) {
      if ($event === "" || $event === null) {
        //no value Item to go
        return;
      }
      const itemSelected = this.editorTools.getItemByLinkId($event, this.item);
      if (itemSelected !== undefined) {
        this.lastSelected = this.selected;
        this.lastSelectedItem = this.selectedItem;

        this.selectedItem = itemSelected;
        this.selected = itemSelected.__internalID;
      } else {
        this.triggerNegative();
      }
    },
    onlyNumberDec($event: KeyboardEvent): void {
      if (this.editorTools.isNotDecimalKey($event.code)) {
        $event.preventDefault();
      }
    },
    onlyNumber($event: KeyboardEvent): void {
      if (this.editorTools.isNotIntegerKey($event.code)) {
        $event.preventDefault();
      }
    },
    onSelectedQuestionsAnswer(e: AnswerOption): void {
      this.enableWhenItem.question = e.linkId || "";
      this.enableWhenItem.type = e.__type;
      if (e.__type === "coding") {
        this.enableWhenItem.answer = e.valueCoding?.code;
        this.enableWhenItem.system = e.valueCoding?.system;
        this.enableWhenItem.display = e.valueCoding?.display;
      } else if (e.__type === "integer") {
        if (typeof e.valueInteger === "number") {
          this.enableWhenItem.answer = e.valueInteger.toString();
        } else {
          this.enableWhenItem.answer = e.valueInteger;
        }
      } else if (e.__type === "date") {
        this.enableWhenItem.answer = e.valueDate;
      } else if (e.__type === "string") {
        this.enableWhenItem.answer = e.valueString;
      }
      this.enableWhenLayout = false;
    },
    onSelectedQuestion(e: SelectedQuestion): void {
      this.enableWhenItem.question = e.linkId || "";
      this.enableWhenItem.answer = "";
      this.enableWhenItem.type = e.type;
      this.enableWhenLayout = false;
    },
    onChangeConditionBehavior(behavior: EnableBehavior | undefined): void {
      if (this.selectedItem === undefined) {
        console.error("Can't change enableWhen behavior of no selected item");
        return;
      }
      this.selectedItem.enableBehavior = behavior;
    },
    onAddCondition() {
      if (this.selectedItem === undefined) {
        console.error("Can't add condition with selecting an item.");
        return;
      }
      this.selectedItem.enableWhen ??= [];
      this.selectedItem.enableWhen.push({
        question: "",
        operator: "",
        answer: "",
      });
      if (this.selectedItem.enableWhen.length > 1) {
        this.selectedItem.enableBehavior ??= "any";
      }
    },
    onRemoveCondition(index: number): void {
      if (
        this.selectedItem === undefined ||
        this.selectedItem.enableWhen === undefined
      ) {
        throw new Error("Remove can't be used with no conditions!");
      }
      if (index < 0 || index >= this.selectedItem.enableWhen.length) {
        throw new Error(
          `Out of bounds index removing condition! Size: ${this.selectedItem.enableWhen.length}, index: ${index}.`,
        );
      }
      this.selectedItem.enableWhen.splice(index, 1);
    },
    onShowQuestionsItems(enableWhen: EnableWhen): void {
      this.enableWhenItem = enableWhen;
      this.enableWhenLayout = true;
    },
    answerValueSet(): void {
      if (this.selectedItem !== undefined) {
        if (this.selectedItem.__answerValueSetCheck) {
          this.selectedItem.answerOption = [];
        } else {
          this.selectedItem.answerValueSet = "";
        }
      }
    },
    newUUID(): void {
      if (this.selectedItem === undefined) {
        throw new Error("Can't change UUID, if no item is selected");
      }
      this.selectedItem.definition = uuidv4();
    },
    onDragStart(e: DragEvent, node: Item): void {
      if (e.dataTransfer !== null) {
        e.dataTransfer.setData(DRAG_KEY_INTERNAL_ID, node.__internalID);
      } else {
        console.error(`DataTransfer is null: ${node.linkId}`);
      }
    },
    onDragOver(e: DragEvent): void {
      e.preventDefault();
      const currentTarget = e.currentTarget as HTMLInputElement;
      currentTarget.style.backgroundColor = this.COLORS.itemDragOver;
    },
    onDragLeave(e: DragEvent): void {
      e.preventDefault();
      const currentTarget = e.currentTarget as HTMLInputElement;
      currentTarget.style.backgroundColor = "";
    },
    onDrop(e: DragEvent, droppedOnItemNode: boolean = true): void {
      e.preventDefault();
      if (e.currentTarget === null || e.dataTransfer === null) return;
      const currentTarget = e.currentTarget as HTMLInputElement;
      currentTarget.style.backgroundColor = "";
      currentTarget.style.cursor = "default";

      const sourceInternalId = e.dataTransfer.getData(DRAG_KEY_INTERNAL_ID);
      const targetInternalId = currentTarget.id;

      if (sourceInternalId === targetInternalId) {
        return; //No allow drag it in same Item
      }

      const sourceItem = this.editorTools.getItemByInternalId(
        sourceInternalId,
        this.item,
      );
      if (sourceItem === undefined || !sourceItem.__active) {
        return;
      }

      const targetItem = this.editorTools.getItemByInternalId(
        targetInternalId,
        this.item,
      );
      if (targetItem === undefined || !targetItem.__active) {
        return;
      }

      // Check if sourceItem is the parent for target -> Not allowed
      const itemNodeChild = this.editorTools.getItemByInternalId(
        targetItem.__internalID,
        sourceItem.item,
      );
      if (itemNodeChild !== undefined) {
        return;
      }

      // Can only drag on active items that are groups
      if (
        droppedOnItemNode &&
        (!targetItem.__active || targetItem.type !== "group")
      ) {
        return;
      }

      // Don't allow more than 5 levels of nested items
      const targetLevel = this.editorTools.getLevelFromLinkID(
        targetItem.__linkId,
      );
      const sourceLevel = this.editorTools.getMaxLevel(sourceItem);
      const totalLevels = targetLevel + sourceLevel;
      if (totalLevels > MAX_ALLOWED_LEVELS) {
        return;
      }

      const targetInternalLinkId = targetItem.__linkId;
      const sourceInternalLinkId = sourceItem.__linkId;

      for (const questionnaire of this.getQuestionnaires) {
        this.dragItem(
          questionnaire,
          sourceInternalLinkId,
          targetInternalLinkId,
          droppedOnItemNode,
        );
      }
    },
    dragItem(
      questionnaire: Questionnaire,
      sourceInternalLinkId: string,
      targetInternalLinkId: string,
      droppedOnGroupNode: boolean,
    ) {
      const sourceBranchWithIndex =
        this.editorTools.getBranchContainingInternalLinkID(
          sourceInternalLinkId,
          questionnaire.item,
        );
      if (sourceBranchWithIndex === undefined) {
        console.error(
          `Internal LinkId ${sourceInternalLinkId} is not part of questionnaire`,
        );
        return;
      }
      const targetBranchWithIndex =
        this.editorTools.getBranchContainingInternalLinkID(
          targetInternalLinkId,
          questionnaire.item,
        );
      if (targetBranchWithIndex === undefined) {
        console.error(
          `Internal LinkId ${targetInternalLinkId} is not part of questionnaire`,
        );
        return;
      }
      let [sourceBranch, sourceIndex] = sourceBranchWithIndex;
      const sourceItem = sourceBranch[sourceIndex];
      const [targetBranch, targetIndex] = targetBranchWithIndex;
      const targetItem = targetBranch[targetIndex];

      //Insert Inside Group Item: at the end
      if (droppedOnGroupNode) {
        sourceBranch.splice(sourceIndex, 1);
        targetItem.item ??= [];
        targetItem.item.push(sourceItem);
      } else {
        // Insert above targetItem (is small box above node in editor)
        targetBranch.splice(targetIndex, 0, sourceItem);
        if (
          this.editorTools.itemsInSameBranch(sourceItem, targetItem) &&
          targetIndex < sourceIndex
        ) {
          sourceIndex++;
        }
        sourceBranch.splice(sourceIndex, 1);
      }

      const changedIdMap = this.editorTools.regenerateLinkIds(
        questionnaire.item,
      );
      this.editorTools.regenerateInternalLinkIDs(questionnaire.item);
      this.editorTools.regenerateConditionWhenIds(
        questionnaire.item,
        changedIdMap,
      );
    },
    toggleItem(internalId: string) {
      const currentNode = this.editorTools.getItemByInternalId(
        internalId,
        this.item,
      );
      if (currentNode === undefined) {
        console.error(
          `InternalId ${internalId} does not exist in questionnaire`,
        );
        return;
      }
      const questionnaires: Questionnaire[] = this.getQuestionnaires;

      if (!currentNode.__active) {
        const linkIDs = this.editorTools.getAllLinkIDs(currentNode);
        const errorLangs: Language[] = [];
        for (const questionnaire of questionnaires) {
          if (this.editorTools.enableWhenDependsOn(questionnaire, linkIDs)) {
            errorLangs.push(questionnaire.language);
          }
        }
        if (errorLangs.length > 0) {
          const answer = confirm(
            `Questionnaires with languages [${errorLangs}] have questions that depend on at least one of the questions you want to deactivate. ` +
              "Keeping the LinkId on these conditions would harm the logical integrity of the questionnaire. " +
              "They will therefore be removed. \n" +
              "Please be aware that if you reactivate the question you have to relink these conditions.",
          );
          if (!answer) {
            currentNode.__active = true;
            currentNode.__disabled = false;
            return;
          }
          for (const questionnaire of questionnaires) {
            this.deleteEnableWhenWithQuestionID(questionnaire.item, linkIDs);
          }
        }
      }
      const internalLinkId = currentNode.__linkId;
      const toggle = currentNode.__active;
      for (const questionnaire of questionnaires) {
        this.editorTools.toggleEntireItem(
          internalLinkId,
          questionnaire.item,
          toggle,
        );
        const changedIdMap = this.editorTools.regenerateLinkIds(
          questionnaire.item,
        );
        this.editorTools.regenerateConditionWhenIds(
          questionnaire.item,
          changedIdMap,
        );
      }
    },
    isCondition(id: string) {
      return this.editorTools.isEnableWhenCondition(
        this.item,
        this.editorTools.getItemByInternalId(id, this.item)?.linkId || "",
      );
    },
    onAddQuestion(questionType: QuestionType): void {
      if (this.selectedItem === undefined) {
        for (const questionnaire of this.getQuestionnaires) {
          this.addQuestionToRootItem(questionnaire, questionType);
        }
        return;
      }
      if (!this.selectedItem.__active || this.selectedItem.type !== "group") {
        return;
      }
      // Don't add group question to lowest level to avoid empty groups
      if (questionType === "group") {
        const currentLevel = this.editorTools.getLevelFromLinkID(
          this.selectedItem.linkId,
        );
        if (currentLevel >= MAX_ALLOWED_LEVELS_FOR_GROUPS) {
          return;
        }
      }
      const selectedLinkId = this.selectedItem.__linkId;
      for (const questionnaire of this.getQuestionnaires) {
        this.addQuestionToItem(questionnaire, selectedLinkId, questionType);
      }
    },
    addQuestionToItem(
      questionnaire: Questionnaire,
      internalLinkId: string,
      type: QuestionType,
    ): void {
      const item = this.editorTools.getItemByInternalLinkId(
        internalLinkId,
        questionnaire.item,
      );
      if (item === undefined) {
        console.error(
          `LinkID ${internalLinkId} is not part of Questionnaire ${questionnaire.language}`,
        );
        return;
      }
      const newItem = this.editorTools.createItemWithType(type);
      this.editorTools.addItemAndSetLinkIDs(newItem, item);
    },
    addQuestionToRootItem(
      questionnaire: Questionnaire,
      type: QuestionType,
    ): void {
      const newItem = this.editorTools.createItemWithType(type);
      const rootItems = questionnaire.item;
      this.editorTools.addItemToRootAndSetLinkIDs(newItem, rootItems);
    },
    onClickAddAnswer(e: AnswerButtonType) {
      if (this.selectedItem === undefined) {
        console.error("Selected item should not be undefined");
        return;
      }
      let newItemAnswer: AnswerOption;

      if (!this.selectedItem.answerOption) {
        this.selectedItem.answerOption = [];
      }

      if (e.name === "coding") {
        newItemAnswer = this.editorTools.getNewAnswerValueCoding(
          // { text: "", type: this.selectedItem.type },
          { text: "", type: e.name },
          this.selectedItem.answerOption,
        );
      } else {
        newItemAnswer = {
          __icon: e.icon,
          __id: this.selectedItem.answerOption.length,
          __newAnswer: true,
          __type: e.name,
        };
      }
      if (e.name === "integer") {
        newItemAnswer.valueInteger = "";
      }
      if (e.name === "date") {
        newItemAnswer.valueDate = "";
      }
      if (e.name === "string") {
        newItemAnswer.valueString = "";
      }

      this.selectedItem.answerOption.push(newItemAnswer);
    },
    onRemoveAnswer(e: AnswerOption) {
      if (this.selectedItem === undefined) {
        console.error("Can't remove answer from not selected item");
        return;
      }
      if (this.selectedItem.answerOption === undefined) {
        console.error("Selected item has undefined/empty answer option");
        return;
      }
      if (e.__id === undefined) {
        console.error("AnswerOption has undefined id");
        return;
      }
      const indexOfItemtoBeRemoved = this.selectedItem.answerOption.findIndex(
        (answer) => answer.__id === e.__id,
      );
      if (indexOfItemtoBeRemoved === -1) {
        console.error(`ID '${e.__id}' does not exist on any answer`);
        return;
      }
      this.selectedItem.answerOption.splice(indexOfItemtoBeRemoved, 1);
    },
    deleteItem(internalID: string) {
      const answer = confirm(i18n.global.t("views.editor.deleteItemDialogue"));
      if (!answer) {
        return;
      }
      const item = this.editorTools.getItemByInternalId(internalID, this.item);
      if (item === undefined) {
        console.error(`InternalId '${internalID}' does not exist`);
        return;
      }
      if (this.selectedItem?.__internalID === internalID) {
        this.selected = null;
        this.selectedItem = undefined;
        this.lastSelected = null;
        this.lastSelectedItem = undefined;
      }
      for (const questionnaire of this.getQuestionnaires) {
        this.deleteItemWithInternalLinkId(questionnaire, item.__linkId);
      }
    },
    deleteItemWithInternalLinkId(
      questionnaire: Questionnaire,
      internalLinkId: string,
    ) {
      const branchWithIndex =
        this.editorTools.getBranchContainingInternalLinkID(
          internalLinkId,
          questionnaire.item,
        );
      if (branchWithIndex === undefined) {
        console.error(
          `LinkId ${internalLinkId} does not exist in questionnaire ${questionnaire.language}`,
        );
        return;
      }
      const [branch, index] = branchWithIndex;
      const linkIDs = this.editorTools.getAllLinkIDs(branch[index]);
      branch.splice(index, 1); // Delete item
      if (linkIDs.size > 0) {
        this.deleteEnableWhenWithQuestionID(questionnaire.item, linkIDs);
      }
      const changedIdMap = this.editorTools.regenerateLinkIds(
        questionnaire.item,
      );
      this.editorTools.regenerateInternalLinkIDs(questionnaire.item);
      this.editorTools.regenerateConditionWhenIds(
        questionnaire.item,
        changedIdMap,
      );
    },
    deleteEnableWhenWithQuestionID(items: Item[], linkIDs: Set<string>) {
      for (const item of items) {
        if (item.enableWhen !== undefined) {
          for (let i = item.enableWhen.length - 1; i >= 0; i--) {
            const enableWhen = item.enableWhen[i];
            if (linkIDs.has(enableWhen.question)) {
              item.enableWhen.splice(i, 1);
            }
          }
        }
        if (item.item !== undefined) {
          this.deleteEnableWhenWithQuestionID(item.item, linkIDs);
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      "getQuestionnaireImportedJSON",
      "getAnswerValueSet",
      "getOpenChoice",
      "getChoice",
      "getLanguage",
      "getQuestionnaires",
      "getUsedLanguages",
    ]),
    answerTypeField() {
      let type = "";
      if (this.selectedItem === undefined) {
        return type;
      }
      if (this.selectedItem.type === "date") {
        type = "date";
      }
      if (
        this.selectedItem.type === "decimal" ||
        this.selectedItem.type === "integer"
      ) {
        type = "number";
      }
      return type;
    },
    requiredItem: {
      get(): boolean | null {
        if (this.selectedItem === undefined) {
          return null;
        }
        return this.selectedItem.required;
      },
      set(val: boolean): void {
        if (this.selectedItem === undefined) {
          return;
        }
        this.selectedItem.required = val;
      },
    },
    repeatedItem: {
      get(): boolean | null {
        if (this.selectedItem === undefined) {
          return null;
        }
        return this.selectedItem.repeats;
      },
      set(val: boolean): void {
        if (this.selectedItem === undefined) {
          return;
        }
        this.selectedItem.repeats = val;
      },
    },
    enabledQuestionTypes(): QuestionIcon[] {
      const allowedQuestion = (q: QuestionIcon): boolean =>
        (this.getChoice || q.name !== "choice") &&
        (this.getOpenChoice || q.name !== "open-choice");
      return questionTypesIcons.filter(allowedQuestion);
    },
  },
  watch: {
    selected(val: string | undefined) {
      this.editorTools.removeConditionDependence(this.item);
      this.editorTools.setConditionDependence(this.item, this.item);
      if (val === undefined) {
        this.selectedItem = undefined;
        return;
      }
      this.selectedItem = this.editorTools.getItemByInternalId(val, this.item);
    },
    lastSelected(val: string | undefined) {
      if (val !== undefined && val !== "") {
        this.limitsSpliter = [0, 100];
        this.splitterModel = 0;
      } else {
        this.limitsSpliter = [35, 100];
        this.splitterModel = 35;
      }
    },
  },
});
</script>
