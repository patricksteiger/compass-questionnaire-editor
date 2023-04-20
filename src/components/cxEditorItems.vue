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
                <!-- display linkId in tree -->
                <div
                  class="row items-center justify-between text-caption text-grey-8 non-selectable"
                  style="width: 100%"
                >
                  <span>
                    {{ prop.node.type }}: {{ prop.node.linkId }}
                    <q-tooltip>
                      {{ $t("components.linkId") }}
                    </q-tooltip>
                  </span>
                </div>
              </div>
            </template>
          </q-tree>

          <!-- Add new item buttons -->
          <div v-if="addItemIsAllowed()">
            <q-page-sticky position="bottom-left" :offset="[18, 18]">
              <q-fab
                v-model="fabLeft"
                vertical-actions-align="left"
                color="primary"
                push
                icon="keyboard_arrow_up"
                direction="up"
                padding="none xl"
                :label="$t('views.editor.addComplexItem')"
              >
                <q-fab-action
                  v-for="questionTypeIcon in noChoiceItemTypeIcons"
                  :key="questionTypeIcon.name"
                  label-position="right"
                  color="primary"
                  @click="addItemWithType(questionTypeIcon.name)"
                  :icon="questionTypeIcon.icon"
                  :label="questionTypeIcon.label"
                />
              </q-fab>
            </q-page-sticky>
          </div>
          <div v-if="addItemIsAllowed()">
            <q-page-sticky position="bottom-left" :offset="[250, 18]">
              <q-fab
                v-model="fabSimple"
                vertical-actions-align="left"
                color="primary"
                push
                icon="keyboard_arrow_up"
                direction="up"
                padding="none xl"
                :label="$t('views.editor.addChoiceItem')"
              >
                <q-fab-action
                  v-for="questionTypeIcon in choiceItemTypeIcons"
                  :key="questionTypeIcon.name"
                  label-position="right"
                  color="primary"
                  @click="addItemWithType(questionTypeIcon.name)"
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
            <!-- LinkId field -->
            <div
              class="row items-center justify-between text-bold text-h5 q-mb-md"
            >
              <q-input
                v-if="selectedItem !== undefined"
                v-model="selectedItem.linkId"
                autogrow
                readonly
                clickable
                class="col-10"
                input-class="text-h5 text-bold"
                :disable="!selectedItem.__active"
                label="LinkId"
              />
              <!-- Change LinkId button -->
              <div>
                <q-btn
                  v-if="selectedItem !== undefined"
                  flat
                  round
                  color="primary"
                  icon="update"
                  @click="changeLinkId(selectedItem!)"
                />
                <q-tooltip>Change LinkId</q-tooltip>
              </div>
              <!-- Swap LinkId button -->
              <div>
                <q-btn
                  v-if="selectedItem !== undefined"
                  flat
                  round
                  color="primary"
                  icon="swap_vert"
                  :disable="questionnaireTools.hasNotMultipleItems(questionaireGUI!)"
                  @click="swapLinkId(selectedItem!)"
                >
                </q-btn>
                <q-tooltip
                  v-if="questionnaireTools.hasNotMultipleItems(questionaireGUI!)"
                >
                  Multiple items needed
                </q-tooltip>
                <q-tooltip v-else>Swap LinkId</q-tooltip>
              </div>
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
              <div>
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="device_hub"
                  @click="alert = true"
                  v-if="selectedItem !== undefined"
                  :disable="!selectedItem.__dependenceCondition"
                />
                <q-tooltip v-if="selectedItem?.__dependenceCondition">
                  {{ $t("views.editor.conditionFulfilled") }}
                </q-tooltip>
                <q-tooltip v-else-if="selectedItem !== undefined">
                  No other item depends on this item
                </q-tooltip>
              </div>
            </div>
            <div
              v-if="
                selectedItem !== undefined && selectedItem.type !== 'display'
              "
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
              <!-- definition -->
              <q-input
                :disable="!selectedItem.__active"
                v-if="selectedItem !== undefined"
                v-model="selectedItem.definition"
                label="definition"
                dense
                class="col-8"
              />
            </div>
            <div
              class="row items-center justify-between text-bold text-h5 q-mb-md"
            >
              <!-- Max Length-->
              <q-input
                v-if="
                  selectedItem !== undefined && allowsMaxLength(selectedItem)
                "
                :disable="!selectedItem.__active"
                :label="$t('views.editor.maxLength')"
                dense
                type="number"
                @keypress="onlyNumber"
                v-model.number="selectedItem.maxLength"
              />
            </div>
            <!-- answerConstraint -->
            <div>
              <q-select
                v-if="
                  selectedItem !== undefined &&
                  allowsAnswerChoice(selectedItem.type)
                "
                v-model="selectedItem.answerConstraint"
                label="answerConstraint"
                :options="answerConstraints"
                :clearable="itemTools.undefinedAnswerChoices(selectedItem)"
                :error="
                  (!selectedItem.answerConstraint &&
                    itemTools.definedAnswerChoices(selectedItem)) ||
                  (!!selectedItem.answerConstraint &&
                    itemTools.undefinedAnswerChoices(selectedItem))
                "
                :disable="
                  !selectedItem.answerConstraint &&
                  itemTools.undefinedAnswerChoices(selectedItem)
                "
              />
            </div>
            <!-- answerValueSet -->
            <div
              class="row"
              v-if="
                selectedItem !== undefined &&
                itemTools.undefinedAnswerOption(selectedItem) &&
                allowsAnswerChoice(selectedItem.type)
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
                />
                <q-input
                  v-if="selectedItem.__answerValueSetCheck"
                  :label="$t('views.editor.AnswerValueSet')"
                  class="col-5"
                  dense
                  v-model="selectedItem.answerValueSet"
                  :disable="!selectedItem.__active"
                  :error="selectedItem.__active && !selectedItem.answerValueSet"
                >
                  <template v-slot:error>
                    {{ $t("components.fieldEmpty") }}
                  </template>
                </q-input>
              </div>
            </div>
            <!-- Answers/Conditions -->
            <q-list padding bordered>
              <!-- AnswersOption section -->
              <q-expansion-item
                v-if="
                  selectedItem !== undefined &&
                  itemTools.undefinedAnswerValueSet(selectedItem) &&
                  allowsAnswerChoice(selectedItem.type)
                "
                :disable="!selectedItem.__active"
                expand-separator
                icon="question_answer"
                :label="$t('views.editor.answers')"
              >
                <q-separator />
                <q-card>
                  <!-- Multiple answers -->
                  <div>
                    <div class="q-pa-md" style="width: 100%">
                      <q-list
                        dense
                        v-if="
                          !selectedItem.__answerValueSetCheck &&
                          selectedItem.answerOption
                        "
                      >
                        <q-item
                          v-for="answerOption in selectedItem.answerOption"
                          :key="answerOption.__id"
                        >
                          <!-- answerOption -->
                          <q-item-section>
                            <!-- answerOption coding -->
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
                                readonly
                                v-model="answerOption.__formattedValueCoding"
                                :disable="!selectedItem.__active"
                                :error="!answerOption.__formattedValueCoding"
                                clickable
                                @click="handleAnswerOptionCoding(answerOption)"
                                :label="
                                  changedCoding(answerOption)
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldFormattedValueCoding
                                      }`
                                    : answerOption.__type
                                "
                                ><template v-slot:error>
                                  {{ $t("components.fieldEmpty") }} </template
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="changedCoding(answerOption)"
                                  @click="setDisplayToOld(answerOption)"
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>
                            <!-- answerOption decimal -->
                            <div
                              class="row"
                              v-else-if="answerOption.__type === 'decimal'"
                            >
                              <q-input
                                class="col-12"
                                @keypress="onlyNumberDec"
                                autogrow
                                v-model="answerOption.valueDecimal"
                                :disable="!selectedItem.__active"
                                :label="
                                  answerOption.valueDecimal !==
                                    answerOption.__oldValueDecimal &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldValueDecimal
                                      }`
                                    : answerOption.__type
                                "
                              >
                                <template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
                                <div>
                                  <q-btn
                                    flat
                                    round
                                    icon="history"
                                    :disable="!selectedItem.__active"
                                    class="q-mr-sm text-grey-8"
                                    v-if="
                                      answerOption.valueDecimal !==
                                        answerOption.__oldValueDecimal &&
                                      !answerOption.__newAnswer
                                    "
                                    @click="
                                      answerOption.valueDecimal =
                                        answerOption.__oldValueDecimal
                                    "
                                  />
                                  <q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip>
                                </div>
                              </q-input>
                            </div>
                            <!-- answerOption integer -->
                            <div
                              class="row"
                              v-else-if="answerOption.__type === 'integer'"
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
                                    : answerOption.__type
                                "
                              >
                                <template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
                                <div>
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
                                  />
                                  <q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip>
                                </div>
                              </q-input>
                            </div>
                            <!-- answerOption date -->
                            <div
                              class="row"
                              v-else-if="answerOption.__type === 'date'"
                            >
                              <q-input
                                stack-label
                                class="col-12"
                                v-model="answerOption.valueDate"
                                :rules="[dateTools.isDate]"
                                :disable="!selectedItem.__active"
                                :label="
                                  answerOption.valueDate !==
                                    answerOption.__oldValueDate &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldValueDate
                                      }`
                                    : answerOption.__type
                                "
                              >
                                <q-tooltip>
                                  Valid examples: 2000, 2000-01, 2000-12-30
                                </q-tooltip>
                                <template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
                                <div>
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
                                  />
                                  <q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip>
                                </div>
                              </q-input>
                            </div>
                            <!-- answerOption dateTime -->
                            <div
                              class="row"
                              v-else-if="answerOption.__type === 'dateTime'"
                            >
                              <q-input
                                stack-label
                                class="col-12"
                                v-model="answerOption.valueDateTime"
                                :disable="!selectedItem.__active"
                                :rules="[dateTools.isDateTime]"
                                :label="
                                  answerOption.valueDateTime !==
                                    answerOption.__oldValueDateTime &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldValueDateTime
                                      }`
                                    : answerOption.__type
                                "
                              >
                                <q-tooltip>
                                  Valid examples: 2000, 2000-01, 2000-12-30,
                                  2000-12-30T12:33:59+01:00
                                </q-tooltip>
                                <template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
                                <div>
                                  <q-btn
                                    flat
                                    round
                                    icon="history"
                                    :disable="!selectedItem.__active"
                                    class="q-mr-sm text-grey-8"
                                    v-if="
                                      answerOption.valueDateTime !==
                                        answerOption.__oldValueDateTime &&
                                      !answerOption.__newAnswer
                                    "
                                    @click="
                                      answerOption.valueDateTime =
                                        answerOption.__oldValueDateTime
                                    "
                                  />
                                  <q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip>
                                </div>
                              </q-input>
                            </div>
                            <!-- answerOption time -->
                            <div
                              class="row"
                              v-else-if="answerOption.__type === 'time'"
                            >
                              <q-input
                                class="col-12"
                                autogrow
                                v-model="answerOption.valueTime"
                                :disable="!selectedItem.__active"
                                mask="fulltime"
                                fill-mask
                                :rules="[dateTools.isTime]"
                                :label="
                                  answerOption.valueTime !==
                                    answerOption.__oldValueTime &&
                                  !answerOption.__newAnswer
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldValueTime
                                      }`
                                    : answerOption.__type
                                "
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original time answer -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="
                                    answerOption.valueTime !==
                                      answerOption.__oldValueTime &&
                                    !answerOption.__newAnswer
                                  "
                                  @click="
                                    answerOption.valueTime =
                                      answerOption.__oldValueTime
                                  "
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>
                            <!-- answerOption string -->
                            <div
                              class="row"
                              v-else-if="answerOption.__type === 'string'"
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
                                    : answerOption.__type
                                "
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
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
                            <!-- answerOption quantity -->
                            <div
                              class="row"
                              v-else-if="
                                answerOption.__type === 'quantity' &&
                                answerOption.valueQuantity !== undefined
                              "
                            >
                              <q-input
                                class="col-12"
                                autogrow
                                readonly
                                v-model="answerOption.__formattedValueQuantity"
                                :disable="!selectedItem.__active"
                                :error="!answerOption.__formattedValueQuantity"
                                clickable
                                @click="
                                  handleAnswerOptionQuantity(answerOption)
                                "
                                :label="
                                  changedQuantity(answerOption)
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldFormattedValueQuantity
                                      }`
                                    : answerOption.__type
                                "
                                ><template v-slot:error>
                                  {{ $t("components.fieldEmpty") }} </template
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="changedQuantity(answerOption)"
                                  @click="setDisplayToOld(answerOption)"
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>
                            <!-- answerOption reference -->
                            <div
                              class="row"
                              v-else-if="
                                answerOption.__type === 'reference' &&
                                answerOption.valueReference !== undefined
                              "
                            >
                              <q-input
                                class="col-12"
                                autogrow
                                readonly
                                v-model="answerOption.__formattedValueReference"
                                :disable="!selectedItem.__active"
                                :error="!answerOption.__formattedValueReference"
                                clickable
                                @click="
                                  handleAnswerOptionReference(answerOption)
                                "
                                :label="
                                  changedReference(answerOption)
                                    ? `${$t('views.editor.originalText')}: ${
                                        answerOption.__oldFormattedValueReference
                                      }`
                                    : answerOption.__type
                                "
                                ><template v-slot:error>
                                  {{ $t("components.fieldEmpty") }} </template
                                ><template v-slot:prepend>
                                  <q-icon :name="answerOption.__icon" />
                                </template>
                                <!-- reverse original text answer -->
                                <q-btn
                                  flat
                                  round
                                  icon="history"
                                  :disable="!selectedItem.__active"
                                  class="q-mr-sm text-grey-8"
                                  v-if="changedReference(answerOption)"
                                  @click="setDisplayToOld(answerOption)"
                                  ><q-tooltip>
                                    {{ $t("components.reverseAnswer") }}
                                  </q-tooltip></q-btn
                                >
                              </q-input>
                            </div>
                          </q-item-section>
                          <q-item-section top side class="justify-center">
                            <div class="row items-center">
                              <div class="text-grey-8">
                                <!-- remove answerOption -->
                                <q-btn
                                  flat
                                  round
                                  color="grey-6"
                                  icon="highlight_off"
                                  :disable="!selectedItem.__active"
                                  @click="removeAnswerOption(answerOption)"
                                  ><q-tooltip>
                                    {{ $t("components.remove") }}
                                  </q-tooltip></q-btn
                                >
                              </div>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <!-- Add answerOption -->
                      <q-btn
                        padding="none xl"
                        fab
                        icon="add"
                        :label="$t('views.editor.addAnswer')"
                        direction="right"
                        color="primary"
                        v-if="!selectedItem.__answerValueSetCheck"
                        @click="
                          addAnswerOptionType(
                            selectedItem!.type as AnswerOptionType,
                          )
                        "
                      />
                    </div>
                  </div>
                </q-card>
              </q-expansion-item>
              <!-- enableWhen behavior -->
              <div>
                <q-select
                  v-if="selectedItem !== undefined"
                  v-model="selectedItem.enableBehavior"
                  label="enableBehavior"
                  :options="enableBehaviors"
                  :clearable="
                    !selectedItem.enableWhen ||
                    selectedItem.enableWhen.length <= 1
                  "
                  :error="
                    !selectedItem.enableBehavior &&
                    !!selectedItem.enableWhen &&
                    selectedItem.enableWhen.length > 1
                  "
                />
              </div>
              <!-- enableWhen -->
              <q-expansion-item
                v-if="selectedItem !== undefined"
                :disable="!selectedItem.__active"
                expand-separator
                icon="account_tree"
                :label="$t('views.editor.itemConditions')"
                default-opened
              >
                <q-separator />
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
                            <div>
                              <q-btn
                                :disable="!selectedItem.__active"
                                v-if="enableWhen.question !== ''"
                                flat
                                color="primary"
                                icon="subdirectory_arrow_left"
                                @click="onGotoItem(enableWhen.question)"
                              />
                              <q-tooltip>
                                {{ $t("views.editor.navigateToItem") }}
                              </q-tooltip>
                            </div>
                          </div>
                          <q-input
                            :disable="!selectedItem.__active"
                            :label="`${$t('views.editor.question')}: ${
                              enableWhen.__type ?? ''
                            }`"
                            dense
                            v-model="enableWhen.question"
                            @click="onShowQuestionsItems(enableWhen)"
                            :rules="[validItemId]"
                          >
                          </q-input>
                          <q-select
                            :disable="!selectedItem.__active"
                            class="col-2"
                            v-model="enableWhen.operator"
                            :options="operators"
                            :label="$t('views.editor.operator')"
                            dense
                            :rules="[validOperator]"
                          />
                          <!-- enableWhen exists/boolean -->
                          <q-select
                            v-if="
                              enableWhen.__type === 'boolean' ||
                              enableWhen.operator === 'exists'
                            "
                            :disable="!selectedItem.__active"
                            class="col-4"
                            v-model="enableWhen.__answer"
                            :options="['true', 'false']"
                            :label="$t('views.editor.answer')"
                            dense
                            :rules="[validExistsAnswer]"
                          />
                          <!-- enableWhen coding -->
                          <q-input
                            v-else-if="enableWhen.__type === 'coding'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString
                                ? ' (string)'
                                : ' (coding)')
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            :type="'text'"
                            readonly
                            clickable
                            @click="handleCodingAnswer(enableWhen)"
                            dense
                          />
                          <!-- enableWhen decimal -->
                          <q-input
                            v-else-if="enableWhen.__type === 'decimal'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString
                                ? ' (string)'
                                : ' (decimal)')
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            readonly
                            type="text"
                            clickable
                            @click="handleDecimalAnswer(enableWhen)"
                            dense
                          />
                          <!-- enableWhen integer -->
                          <q-input
                            v-else-if="enableWhen.__type === 'integer'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString
                                ? ' (string)'
                                : ' (integer)')
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            readonly
                            type="text"
                            clickable
                            @click="handleIntegerAnswer(enableWhen)"
                            dense
                          />
                          <!-- enableWhen date -->
                          <q-input
                            v-else-if="enableWhen.__type === 'date'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString ? ' (string)' : ' (date)')
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            type="text"
                            readonly
                            clickable
                            @click="handleDateAnswer(enableWhen)"
                            dense
                          />
                          <!-- enableWhen dateTime -->
                          <q-input
                            v-else-if="enableWhen.__type === 'dateTime'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString
                                ? ' (string)'
                                : ' (dateTime)')
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            type="text"
                            readonly
                            clickable
                            @click="handleDateTimeAnswer(enableWhen)"
                            dense
                          />
                          <!-- enableWhen time -->
                          <q-input
                            v-else-if="enableWhen.__type === 'time'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString ? ' (string)' : ' (time)')
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            type="text"
                            readonly
                            clickable
                            @click="handleTimeAnswer(enableWhen)"
                            dense
                          />
                          <!-- enableWhen string -->
                          <q-input
                            v-else-if="enableWhen.__type === 'string'"
                            :disable="!selectedItem.__active"
                            :label="$t('views.editor.answer') + ' (string)'"
                            class="col-4"
                            v-model="enableWhen.__answer"
                            type="text"
                            readonly
                            clickable
                            @click="handleStringAnswer(enableWhen)"
                            dense
                          />
                          <!-- enableWhen quantity -->
                          <q-input
                            v-else-if="enableWhen.__type === 'quantity'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString
                                ? ' (string)'
                                : ` (${enableWhen.__type})`)
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            type="text"
                            dense
                            readonly
                            clickable
                            @click="handleQuantityAnswer(enableWhen)"
                          />
                          <!-- enableWhen reference -->
                          <q-input
                            v-else-if="enableWhen.__type === 'reference'"
                            :disable="!selectedItem.__active"
                            :label="
                              $t('views.editor.answer') +
                              (enableWhen.__orString
                                ? ' (string)'
                                : ` (${enableWhen.__type})`)
                            "
                            class="col-4"
                            v-model="enableWhen.__answer"
                            type="text"
                            readonly
                            clickable
                            @click="handleReferenceAnswer(enableWhen)"
                            dense
                          />
                          <q-input
                            v-else
                            :disable="!selectedItem.__active"
                            :label="$t('views.editor.answer')"
                            class="col-4"
                            v-model="enableWhen.__answer"
                            type="text"
                            dense
                          />
                          <!-- remove enableWhen -->
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
                      </q-card-section>
                    </q-item-section>
                  </q-list>
                  <!-- add new Condition -->
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
                  </div>
                </q-card>
              </q-expansion-item>
              <!-- extension -->
              <!-- FIXME: rework extensions -->
              <q-expansion-item
                v-if="selectedItem?.extension !== undefined"
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
                    <q-item
                      v-for="(extension, index) in selectedItem.extension"
                      :key="index"
                    >
                      <q-item-section>
                        <q-card-section>
                          <q-input
                            v-if="extension.__type === 'decimal'"
                            :disable="!selectedItem.__active"
                            :label="extension.url"
                            dense
                            type="number"
                            @keypress="onlyNumberDec"
                            v-model.number="extension.valueDecimal"
                          />
                          <q-input
                            v-else-if="extension.__type === 'integer'"
                            :disable="!selectedItem.__active"
                            :label="extension.url"
                            dense
                            type="number"
                            @keypress="onlyNumber"
                            v-model.number="extension.valueInteger"
                          />
                          <q-input
                            v-else-if="extension.__type === 'string'"
                            :disable="!selectedItem.__active"
                            :label="extension.url"
                            dense
                            type="text"
                            v-model="extension.valueString"
                          />
                          <q-input
                            v-else-if="extension.__type === 'markdown'"
                            :disable="!selectedItem.__active"
                            :label="extension.url"
                            dense
                            autogrow
                            type="textarea"
                            v-model="extension.valueMarkdown"
                          />
                          <q-toggle
                            v-else-if="extension.__type === 'boolean'"
                            :disable="!selectedItem.__active"
                            :label="extension.url"
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
                  <!-- add predefined extension -->
                  <div class="q-pa-sm">
                    <q-btn
                      padding="none xl"
                      v-if="selectedItem.__active"
                      fab
                      icon="add"
                      color="primary"
                      label="Predefined extension"
                      @click="addPredefinedExtension"
                    />
                  </div>
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
    <!-- enableWhen dialog -->
    <q-dialog
      v-model="enableWhenLayout"
      v-if="selected !== null && questionaireGUI !== undefined"
    >
      <cx-enable-When
        :questionnaire="questionaireGUI"
        :internalID="selected"
        :enableWhenItem="enableWhenItem"
        v-on:choiceQuestion="onEnableWhenWithAnswerOption"
        v-on:question="onSelectedQuestion"
      />
    </q-dialog>
    <!-- extension dialog -->
    <q-dialog v-model="extensionLayout" v-if="selectedItem !== undefined">
      <cx-extension
        :extensions="selectedItem.extension ?? []"
        :predefinedExtensions="getExtensions(selectedItem)"
        v-on:predefinedExtensionAdded="onAddedPredefinedExtension"
      />
    </q-dialog>
  </div>

  <!-- LanguageHub -->
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        icon="language"
        color="purple"
        :label="language"
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
  </q-dialog>

  <!-- ValidationHub -->
  <div>
    <q-page-sticky position="bottom-right" :offset="[130, 18]">
      <q-btn icon="warning_amber" color="orange" @click="validateState">
        <q-tooltip>See warnings</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>

  <q-dialog v-model="validationLayout">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>Warnings</q-toolbar-title>
      </q-toolbar>
      <q-list separator>
        <q-item v-for="result in validationResult" :key="result.language">
          <div
            class="q-pa-md"
            v-if="result.metadata.length > 0 || result.items.length > 0"
          >
            <q-toolbar
              class="bg-secondary text-white shadow-2"
              clickable
              @click="switchLanguageFromValidationHub(result.language)"
            >
              <q-toolbar-title>{{ result.language }}</q-toolbar-title>
            </q-toolbar>
            <div class="q-pa-md" v-if="result.metadata.length > 0">
              Metadata:
              <q-list bordered separator>
                <q-item
                  v-for="warning in result.metadata"
                  :key="warning"
                  clickable
                  @click="switchLanguageFromValidationHub(result.language)"
                >
                  <q-item-section>
                    <q-item-label>{{ warning }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="q-pa-md" v-if="result.items.length > 0">
              Items:
              <q-list bordered separator>
                <q-item
                  v-for="item in result.items"
                  :key="item.linkId"
                  clickable
                  @click="
                    switchToItemFromValidationHub(
                      result.language,
                      item.internalId,
                    )
                  "
                >
                  {{ item.linkId }}
                  <q-list separator>
                    <q-item v-for="warning in item.warnings" :key="warning">
                      <q-item-section>
                        <q-item-label>{{ warning }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-item>
      </q-list>
      <div v-if="validationHasNoWarnings()">There are no warnings</div>
    </q-layout>
  </q-dialog>

  <!-- Choose answer for specific enableWhen types -->
  <q-dialog
    v-model="chosenEnableWhenAnswerLayout"
    v-if="chosenEnableWhenAnswerLayout && chosenEnableWhen !== undefined"
  >
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>{{
              `EnableWhen: ${chosenEnableWhen.__type}`
            }}</q-toolbar-title>
          </q-toolbar>
          <div v-if="linkedItem === undefined">
            No item with linkId "{{ chosenEnableWhen.question }}" exists!
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'coding' &&
              chosenEnableWhen.answerCoding !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerCoding = editorTools.clone(answerOption.valueCoding);
                    setCodingAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.__formattedValueCoding }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom coding</h6></div>
              <q-input
                label="Code"
                class="col-4"
                v-model="chosenEnableWhen.answerCoding.code"
                type="text"
                dense
              />
              <q-input
                label="Display"
                class="col-4"
                v-model="chosenEnableWhen.answerCoding.display"
                type="text"
                dense
              />
              <q-input
                label="System"
                class="col-4"
                v-model="chosenEnableWhen.answerCoding.system"
                type="text"
                dense
              />
              <q-input
                label="Version"
                class="col-4"
                v-model="chosenEnableWhen.answerCoding.version"
                type="text"
                dense
              />
              <q-toggle
                label="UserSelected"
                class="col-4"
                v-model.boolean="chosenEnableWhen.answerCoding.userSelected"
                toggle-indeterminate
                dense
              />
              <div>
                <q-btn icon="add" @click="setCodingAnswer(chosenEnableWhen)" />
              </div>
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'decimal' &&
              chosenEnableWhen.answerDecimal !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerDecimal = Number(answerOption.valueDecimal);
                    setDecimalAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.valueDecimal }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom decimal</h6></div>
              <q-input
                label="Decimal"
                @keypress="onlyNumberDec"
                class="col-4"
                v-model="chosenEnableWhen.answerDecimal"
                type="number"
                dense
              />
              <div>
                <q-btn icon="add" @click="setDecimalAnswer(chosenEnableWhen)" />
              </div>
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'integer' &&
              chosenEnableWhen.answerInteger !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerInteger = Number(answerOption.valueInteger);
                    setIntegerAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.valueInteger }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom integer</h6></div>
              <q-input
                label="Integer"
                @keypress="onlyNumber"
                class="col-4"
                v-model="chosenEnableWhen.answerInteger"
                type="number"
                dense
              />
              <div>
                <q-btn icon="add" @click="setIntegerAnswer(chosenEnableWhen)" />
              </div>
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'date' &&
              chosenEnableWhen.answerDate !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerDate = answerOption.valueDate;
                    setDateAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.valueDate }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom date</h6></div>
              <q-input
                label="Date"
                class="col-4"
                v-model="chosenEnableWhen.answerDate"
                type="text"
                :rules="[dateTools.isDate]"
                dense
              >
                <q-tooltip>
                  Valid examples: 2000, 2000-01, 2000-12-30
                </q-tooltip>
              </q-input>
              <div>
                <q-btn icon="add" @click="setDateAnswer(chosenEnableWhen)" />
              </div>
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'dateTime' &&
              chosenEnableWhen.answerDateTime !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerDateTime = answerOption.valueDateTime;
                    setDateTimeAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.valueDateTime }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom dateTime</h6></div>
              <q-input
                label="DateTime"
                class="col-4"
                v-model="chosenEnableWhen.answerDateTime"
                type="text"
                :rules="[dateTools.isDateTime]"
                dense
              >
                <q-tooltip>
                  Valid examples: 2000, 2000-01, 2000-12-30,
                  2000-12-30T12:33:59+01:00
                </q-tooltip>
              </q-input>
              <div>
                <q-btn
                  icon="add"
                  @click="setDateTimeAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'time' &&
              chosenEnableWhen.answerTime !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerTime = answerOption.valueTime;
                    setTimeAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.valueTime }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom time</h6></div>
              <q-input
                label="Time"
                class="col-4"
                v-model="chosenEnableWhen.answerTime"
                type="text"
                mask="fulltime"
                fill-mask
                :rules="[dateTools.isTime]"
                dense
              />
              <div>
                <q-btn icon="add" @click="setTimeAnswer(chosenEnableWhen)" />
              </div>
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'string' &&
              chosenEnableWhen.answerString !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerString = answerOption.valueString;
                    setStringAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.valueString }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                :error="!chosenEnableWhen?.answerString"
                dense
              />
              <div>
                <q-btn icon="add" @click="setStringAnswer(chosenEnableWhen)" />
              </div>
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'quantity' &&
              chosenEnableWhen.answerQuantity !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerQuantity = editorTools.clone(answerOption.valueQuantity);
                    setQuantityAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.__formattedValueQuantity }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom quantity</h6></div>
              <q-input
                :label="'Value'"
                class="col-4"
                v-model.number="chosenEnableWhen.answerQuantity.value"
                @keypress="onlyNumberDec"
                type="number"
                dense
              />
              <q-input
                :label="'Code'"
                class="col-4"
                v-model="chosenEnableWhen.answerQuantity.code"
                type="text"
                dense
              />
              <q-input
                :label="'Unit'"
                class="col-4"
                v-model="chosenEnableWhen.answerQuantity.unit"
                type="text"
                dense
              />
              <q-input
                :label="'System'"
                class="col-4"
                v-model="chosenEnableWhen.answerQuantity.system"
                type="text"
                dense
              />
              <q-select
                :label="'Comparator'"
                class="col-4"
                v-model="chosenEnableWhen.answerQuantity.comparator"
                :options="comparators"
                dense
              />
              <q-btn icon="add" @click="setQuantityAnswer(chosenEnableWhen)" />
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              chosenEnableWhen.__type === 'reference' &&
              chosenEnableWhen.answerReference !== undefined
            "
          >
            <div v-if="itemTools.definedAnswerOption(linkedItem)">
              <div><h6>AnswerOptions</h6></div>
              <q-list bordered separator>
                <q-item
                  v-for="answerOption in linkedItem.answerOption"
                  :key="answerOption.__id"
                  clickable
                  @dblclick="
                  () => {
                    chosenEnableWhen!.answerReference = editorTools.clone(answerOption.valueReference);
                    setReferenceAnswer(chosenEnableWhen);
                  }
                  "
                >
                  <q-item-section>
                    {{ answerOption.__formattedValueReference }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div
              v-if="
                itemTools.undefinedAnswerOption(linkedItem) ||
                linkedItem.answerConstraint === 'optionsOrType'
              "
            >
              <div><h6>Custom reference</h6></div>
              <q-input
                label="Reference"
                class="col-4"
                v-model="chosenEnableWhen.answerReference.reference"
                type="text"
                dense
              />
              <q-input
                label="Display"
                class="col-4"
                v-model="chosenEnableWhen.answerReference.display"
                type="text"
                dense
              />
              <q-input
                label="Type"
                class="col-4"
                v-model="chosenEnableWhen.answerReference.type"
                type="text"
                dense
              />
              <q-btn icon="add" @click="setReferenceAnswer(chosenEnableWhen)" />
            </div>
            <div v-if="linkedItem.answerConstraint === 'optionsOrString'">
              <div><h6>Custom string</h6></div>
              <q-input
                label="String"
                class="col-4"
                v-model="chosenEnableWhen.answerString"
                type="text"
                dense
              />
              <div>
                <q-btn
                  icon="add"
                  @click="setOrStringAnswer(chosenEnableWhen)"
                />
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>

  <!-- Add item with linkId and type -->
  <q-dialog v-model="newLinkIdLayout">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>Add new Item with LinkId</q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-md">
            <q-input
              label="LinkId"
              class="col-4"
              v-model="newLinkId"
              type="text"
              autofocus
              dense
            />
            <q-btn
              icon="add"
              @click="addItemWithLinkId(newLinkId, newLinkIdType)"
            />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>

  <!-- Change linkId of selectedItem -->
  <q-dialog v-model="addLinkIdLayout">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>Change LinkId</q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-md">
            <q-input
              label="LinkId"
              class="col-4"
              v-model="newLinkId"
              type="text"
              autofocus
              dense
            />
            <q-btn
              icon="update"
              @click="changeLinkIdForItem(selectedItem!.__linkId, newLinkId)"
            />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>

  <!-- Swap linkId of selectedItem -->
  <q-dialog v-model="swapLinkIdLayout">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>Swap LinkId</q-toolbar-title>
          </q-toolbar>
          <div class="q-pa-md">
            <q-input
              label="Current LinkId"
              class="col-4"
              v-model="newLinkId"
              type="text"
              readonly
              dense
            />
            <q-select
              v-model="otherLinkId"
              class="col-4"
              label="Other LinkId"
              :options="otherLinkIds"
            />
            <q-btn
              icon="swap_vert"
              :disable="newLinkId === otherLinkId"
              @click="swapLinkIdForItem(selectedItem!.__linkId)"
            />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>

  <!-- Handle complex answerOptions -->
  <q-dialog
    v-model="chosenAnswerOptionLayout"
    v-if="chosenAnswerOptionLayout && answerOptionItem !== undefined"
  >
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-toolbar class="bg-primary text-white shadow-2">
            <q-toolbar-title>{{
              `AnswerOption: ${answerOptionItem.__type}`
            }}</q-toolbar-title>
          </q-toolbar>
          <div
            class="q-pa-md"
            v-if="
              answerOptionItem.__type === 'coding' &&
              answerOptionItem.valueCoding !== undefined
            "
          >
            <q-input
              label="Code"
              class="col-4"
              v-model="answerOptionItem.valueCoding.code"
              type="text"
              dense
            />
            <q-input
              label="Display"
              class="col-4"
              v-model="answerOptionItem.valueCoding.display"
              type="text"
              dense
            />
            <q-input
              label="System"
              class="col-4"
              v-model="answerOptionItem.valueCoding.system"
              type="text"
              dense
            />
            <q-input
              label="Version"
              class="col-4"
              v-model="answerOptionItem.valueCoding.version"
              type="text"
              dense
            />
            <q-toggle
              label="UserSelected"
              class="col-4"
              v-model.boolean="answerOptionItem.valueCoding.userSelected"
              toggle-indeterminate
              dense
            />
            <q-separator />
            <q-btn
              class="col-4"
              icon="add"
              @click="setValueCodingAnswer(answerOptionItem)"
            />
          </div>
          <div
            class="q-pa-md"
            v-else-if="
              answerOptionItem.__type === 'quantity' &&
              answerOptionItem.valueQuantity !== undefined
            "
          >
            <q-input
              :label="'Value'"
              class="col-4"
              v-model.number="answerOptionItem.valueQuantity.value"
              type="number"
              dense
            />
            <q-input
              :label="'Code'"
              class="col-4"
              v-model="answerOptionItem.valueQuantity.code"
              type="text"
              dense
            />
            <q-input
              :label="'Unit'"
              class="col-4"
              v-model="answerOptionItem.valueQuantity.unit"
              type="text"
              dense
            />
            <q-input
              :label="'System'"
              class="col-4"
              v-model="answerOptionItem.valueQuantity.system"
              type="text"
              dense
            />
            <q-select
              :label="'Comparator'"
              class="col-4"
              v-model.boolean="answerOptionItem.valueQuantity.comparator"
              :options="comparators"
              dense
            />
            <q-separator />
            <q-btn
              class="col-4"
              icon="add"
              @click="setValueQuantityAnswer(answerOptionItem)"
            />
          </div>
          <!-- FIXME: Add identifier for reference -->
          <div
            class="q-pa-md"
            v-else-if="
              answerOptionItem.__type === 'reference' &&
              answerOptionItem.valueReference !== undefined
            "
          >
            <q-input
              label="Reference"
              class="col-4"
              v-model="answerOptionItem.valueReference.reference"
              type="text"
              dense
            />
            <q-input
              label="Type"
              class="col-4"
              v-model="answerOptionItem.valueReference.type"
              type="text"
              dense
            />
            <q-input
              label="Display"
              class="col-4"
              v-model="answerOptionItem.valueReference.display"
              type="text"
              dense
            />
            <q-separator />
            <q-btn
              class="col-4"
              icon="add"
              @click="setValueReferenceAnswer(answerOptionItem)"
            />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import {
  COLORS,
  MAX_ALLOWED_LEVELS,
  AnswerOptionButton,
  MAX_ALLOWED_LEVELS_FOR_GROUPS,
  DRAG_KEY_INTERNAL_ID,
  ItemType,
  allowsMaxLength,
  noChoiceItemTypeIcons,
  choiceItemTypeIcons,
  MAX_LENGTH_LINKID,
  allowsAnswerChoice,
  AnswerOptionType,
} from "@/utils/constants";
import { useQuasar } from "quasar";
import { defineComponent, Ref, ref } from "vue";
import { editorTools, UnreachableError } from "@/utils/editor";
import { dateTools } from "@/utils/date";
import { questionnaireTools } from "@/utils/questionnaire";
import { mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";
import cxEnableWhen from "@/components/cxEnableWhen.vue";
import cxExtension from "@/components/cxExtension.vue";
import { i18n, defaultLanguage } from "@/i18n";
import {
  AnswerOption,
  Item,
  SelectedItem,
  operators,
  Questionnaire,
  EnableWhen,
  EnableBehavior,
  enableBehaviors,
  comparators,
  answerConstraints,
  Extension,
} from "@/types";
import { Language, languages } from "@/store";
import { itemTools } from "@/utils/item";
import { Validator } from "@/utils/validation/Validator";
import { Warning } from "@/utils/validation/QuestionnaireValidator";
import { getExtensions } from "@/utils/extension";

export default defineComponent({
  components: {
    cxEnableWhen,
    cxExtension,
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
    const chosenEnableWhen: Ref<EnableWhen | undefined> = ref(undefined);
    const setDisplayToOld = (answerOption: AnswerOption): void => {
      if (answerOption.valueCoding !== undefined) {
        answerOption.valueCoding = editorTools.clone(
          answerOption.__oldValueCoding,
        );
        answerOption.__formattedValueCoding =
          answerOption.__oldFormattedValueCoding;
      }
    };
    const changedCoding = (answerOption: AnswerOption): boolean => {
      if (answerOption.__newAnswer) return false;
      const old = answerOption.__oldValueCoding;
      if (old === undefined) return false;
      const current = answerOption.valueCoding;
      if (current === undefined) return true;
      return (
        current.code !== old.code ||
        current.system !== old.system ||
        current.display !== old.display ||
        current.version !== old.version ||
        current.userSelected !== old.userSelected
      );
    };
    const changedQuantity = (answerOption: AnswerOption): boolean => {
      if (answerOption.__newAnswer) return false;
      const old = answerOption.__oldValueQuantity;
      if (old === undefined) return false;
      const current = answerOption.valueQuantity;
      if (current === undefined) return true;
      return (
        current.code !== old.code ||
        current.system !== old.system ||
        current.unit !== old.unit ||
        current.value !== old.value ||
        current.comparator !== old.comparator
      );
    };
    const changedReference = (answerOption: AnswerOption): boolean => {
      if (answerOption.__newAnswer) return false;
      const old = answerOption.__oldValueReference;
      if (old === undefined) return false;
      const current = answerOption.valueReference;
      if (current === undefined) return true;
      // FIXME: Implement identifier equality
      return (
        current.type !== old.type ||
        current.display !== old.display ||
        current.reference !== old.reference
      );
    };
    const answerOptionItem: Ref<AnswerOption | undefined> = ref(undefined);
    const validationResult: Ref<Warning[]> = ref([]);
    const newLinkId: Ref<string> = ref("");
    const newLinkIdType: Ref<ItemType> = ref("integer");
    const otherLinkIds: Ref<string[]> = ref([]);
    const otherLinkId: Ref<string> = ref("");
    const linkedItem: Ref<Item | undefined> = ref(undefined);
    return {
      getExtensions,
      addLinkIdLayout: ref(false),
      swapLinkIdLayout: ref(false),
      newLinkIdLayout: ref(false),
      newLinkId,
      newLinkIdType,
      otherLinkIds,
      otherLinkId,
      languageLayout: ref(false),
      languageSplitter: ref(40),
      languageSplitterLimits: ref([30, 60]),
      validationLayout: ref(false),
      validationResult,
      answerConstraints,
      allowsAnswerChoice,
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
      changedCoding,
      changedQuantity,
      changedReference,
      enableWhenLayout: ref(false),
      chosenEnableWhenAnswerLayout: ref(false),
      extensionLayout: ref(false),
      comparators,
      chosenEnableWhen,
      linkedItem,
      noChoiceItemTypeIcons,
      choiceItemTypeIcons,
      alert: ref(false),
      itemsAnwers: ref(""),
      editorTools,
      itemTools,
      questionnaireTools,
      COLORS,
      uuidv4,
      chosenAnswerOptionLayout: ref(false),
      answerOptionItem,
      operators,
      languages,
      language,
      allowsMaxLength,
      dateTools,
    };
  },
  created() {
    this.language = this.getLanguage;
    this.questionaireGUI = this.getQuestionnaireImportedJSON as Questionnaire;
    this.item = this.questionaireGUI.item;
  },
  data() {
    return {
      fabLeft: true,
      fabSimple: true,
      splitterModel: 40,
      limitsSpliter: [35, 100],
    };
  },
  methods: {
    changeLinkId(item: Item): void {
      this.newLinkId = item.linkId;
      this.addLinkIdLayout = true;
    },
    changeLinkIdForItem(internalLinkId: string, newLinkId: string): void {
      const invalidLinkIdError = this.validateLinkId(newLinkId);
      if (invalidLinkIdError !== undefined) {
        alert(invalidLinkIdError);
        return;
      }
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      for (const qre of questionnaires) {
        const item = this.questionnaireTools.getItemByInternalLinkId(
          internalLinkId,
          qre,
        );
        this.updateEnableWhen(qre, item.linkId, newLinkId);
        item.linkId = newLinkId;
      }
      this.addLinkIdLayout = false;
    },
    updateEnableWhen(
      qre: Questionnaire,
      oldLinkId: string,
      newLinkId: string,
    ): void {
      const enableWhen = this.questionnaireTools.getEnableWhenWithLinkId(
        qre,
        oldLinkId,
      );
      for (const e of enableWhen) {
        e.question = newLinkId;
      }
    },
    swapLinkId(item: Item): void {
      this.newLinkId = item.linkId;
      const qre = this.questionaireGUI!;
      this.otherLinkIds = this.questionnaireTools.getLinkIdsExcept(
        qre,
        item.linkId,
      );
      this.otherLinkId = this.otherLinkIds[0];
      this.swapLinkIdLayout = true;
    },
    swapLinkIdForItem(internalLinkId: string): void {
      const selectedLinkId = this.newLinkId;
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      for (const qre of questionnaires) {
        const selectedItem = this.questionnaireTools.getItemByInternalLinkId(
          internalLinkId,
          qre,
        );
        const otherItem = this.questionnaireTools.getItemByLinkId(
          qre,
          this.otherLinkId,
        )!;
        const selectedEnableWhen =
          this.questionnaireTools.getEnableWhenWithLinkId(qre, selectedLinkId);
        const otherEnableWhen = this.questionnaireTools.getEnableWhenWithLinkId(
          qre,
          this.otherLinkId,
        );
        selectedItem.linkId = this.otherLinkId;
        otherItem.linkId = selectedLinkId;
        for (const e of selectedEnableWhen) {
          e.question = selectedItem.linkId;
        }
        for (const e of otherEnableWhen) {
          e.question = otherItem.linkId;
        }
      }
      this.swapLinkIdLayout = false;
    },
    addItemWithLinkId(linkId: string, type: ItemType): void {
      const invalidLinkId = this.validateLinkId(linkId);
      if (invalidLinkId !== undefined) {
        alert(invalidLinkId);
        return;
      }
      this.onAddQuestion(linkId, type);
      this.newLinkIdLayout = false;
    },
    addItemWithType(type: ItemType): void {
      this.newLinkIdType = type;
      this.newLinkIdLayout = true;
    },
    validateLinkId(linkId: string): string | undefined {
      if (linkId === "") {
        return "LinkId must not be empty";
      }
      if (linkId.length > MAX_LENGTH_LINKID) {
        return `LinkId must not exceed max length of ${MAX_LENGTH_LINKID}`;
      }
      const qre = this.questionaireGUI!;
      if (this.questionnaireTools.linkIdExistsInQuestionnaire(qre, linkId)) {
        return "LinkId must be unique in questionnaire.";
      }
      return undefined;
    },
    handleQuantityAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerQuantity ??= {};
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setQuantityAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerQuantity !== undefined) {
        enableWhen.__answer = this.editorTools.formatQuantity(
          enableWhen.answerQuantity,
        );
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleReferenceAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerReference ??= {};
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setReferenceAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerReference !== undefined) {
        enableWhen.__answer = this.editorTools.formatReference(
          enableWhen.answerReference,
        );
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleCodingAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerCoding ??= {};
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setCodingAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerCoding !== undefined) {
        enableWhen.__orString = false;
        enableWhen.__answer = this.editorTools.formatCoding(
          enableWhen.answerCoding,
        );
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    setOrStringAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen !== undefined) {
        enableWhen.__orString = true;
        enableWhen.__answer = enableWhen.answerString;
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleDecimalAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerDecimal ??= 0.0;
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setDecimalAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerDecimal !== undefined) {
        enableWhen.__orString = false;
        enableWhen.__answer = enableWhen.answerDecimal.toString();
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleIntegerAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerInteger ??= 0;
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setIntegerAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerInteger !== undefined) {
        enableWhen.__orString = false;
        enableWhen.__answer = enableWhen.answerInteger.toString();
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleDateAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerDate ??= "";
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setDateAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerDate !== undefined) {
        enableWhen.__orString = false;
        enableWhen.__answer = enableWhen.answerDate;
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleDateTimeAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerDateTime ??= "";
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setDateTimeAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerDateTime !== undefined) {
        enableWhen.__orString = false;
        enableWhen.__answer = enableWhen.answerDateTime;
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleTimeAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerTime ??= "";
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setTimeAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerTime !== undefined) {
        enableWhen.__orString = false;
        enableWhen.__answer = enableWhen.answerTime;
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleStringAnswer(enableWhen: EnableWhen): void {
      enableWhen.answerString ??= "";
      this.chosenEnableWhen = enableWhen;
      this.linkedItem = questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        this.chosenEnableWhen.question,
      );
      this.chosenEnableWhenAnswerLayout = true;
    },
    setStringAnswer(enableWhen: EnableWhen | undefined): void {
      if (enableWhen?.answerString !== undefined) {
        enableWhen.__orString = false;
        enableWhen.__answer = enableWhen.answerString;
      }
      this.chosenEnableWhenAnswerLayout = false;
    },
    handleAnswerOptionCoding(answerOption: AnswerOption): void {
      answerOption.valueCoding ??= {};
      answerOption.__formattedValueCoding ??= "";
      this.answerOptionItem = answerOption;
      this.chosenAnswerOptionLayout = true;
    },
    setValueCodingAnswer(answerOption: AnswerOption | undefined): void {
      if (answerOption?.valueCoding !== undefined) {
        answerOption.__formattedValueCoding = this.editorTools.formatCoding(
          answerOption.valueCoding,
        );
      }
      this.chosenAnswerOptionLayout = false;
    },
    handleAnswerOptionQuantity(answerOption: AnswerOption): void {
      answerOption.valueQuantity ??= {};
      answerOption.__formattedValueQuantity ??= "";
      this.answerOptionItem = answerOption;
      this.chosenAnswerOptionLayout = true;
    },
    setValueQuantityAnswer(answerOption: AnswerOption | undefined): void {
      if (answerOption?.valueQuantity !== undefined) {
        answerOption.__formattedValueQuantity = this.editorTools.formatQuantity(
          answerOption.valueQuantity,
        );
      }
      this.chosenAnswerOptionLayout = false;
    },
    handleAnswerOptionReference(answerOption: AnswerOption): void {
      answerOption.valueReference ??= {};
      answerOption.__formattedValueReference ??= "";
      this.answerOptionItem = answerOption;
      this.chosenAnswerOptionLayout = true;
    },
    setValueReferenceAnswer(answerOption: AnswerOption | undefined): void {
      if (answerOption?.valueReference !== undefined) {
        answerOption.__formattedValueReference =
          this.editorTools.formatReference(answerOption.valueReference);
      }
      this.chosenAnswerOptionLayout = false;
    },
    addItemIsAllowed(): boolean {
      return (
        this.selectedItem === undefined ||
        (this.selectedItem.__active && this.selectedItem.type !== "display")
      );
    },
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
      if (this.language !== language) {
        this.$store.commit("switchQuestionnaireByLang", language);
        this.refreshQuestionnaire();
      }
    },
    switchFromLanguageHub(language: Language): void {
      this.switchLanguage(language);
      this.languageLayout = false;
    },
    switchLanguageFromValidationHub(language: Language): void {
      this.switchLanguage(language);
      this.validationLayout = false;
    },
    switchToItemFromValidationHub(
      language: Language,
      internalId: string,
    ): void {
      if (internalId !== this.selected) {
        this.selected = null;
        this.lastSelectedItem = undefined;
        this.lastSelected = null;
        this.switchLanguage(language);
        this.selected = internalId;
      }
      this.validationLayout = false;
    },
    getSelectedLanguageClass(lang: Language): string {
      return lang === this.language ? "bg-purple text-white" : "";
    },
    refreshQuestionnaire(): void {
      this.questionaireGUI = this.getQuestionnaireImportedJSON;
      this.item = this.getQuestionnaireImportedJSON.item;
      this.language = this.getLanguage;
      if (this.selectedItem !== undefined) {
        const internalLinkId = this.selectedItem.__linkId;
        const newItem = this.questionnaireTools.getItemByInternalLinkId(
          internalLinkId,
          this.questionaireGUI!,
        );
        this.selectedItem = newItem;
        this.selected = newItem.__internalID;
      }
      if (this.lastSelectedItem !== undefined) {
        const internalLinkId = this.lastSelectedItem.__linkId;
        const newItem = this.questionnaireTools.getItemByInternalLinkId(
          internalLinkId,
          this.questionaireGUI!,
        );
        this.lastSelectedItem = newItem;
        this.lastSelected = newItem.__internalID;
      }
    },
    getUnusedLanguages(): Language[] {
      return languages.filter((lang) => !this.getUsedLanguages.includes(lang));
    },
    validateState(): void {
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      this.validationResult = Validator.check(questionnaires);
      this.validationLayout = true;
    },
    validationHasNoWarnings(): boolean {
      for (const result of this.validationResult) {
        if (result.metadata.length > 0 || result.items.length > 0) {
          return false;
        }
      }
      return true;
    },
    validItemId(s: string): true | string {
      return s.length > 0 || "Selected linkId has to be non-empty";
    },
    validOperator(s: string): true | string {
      return s.length > 0 || "operator has to be non-empty";
    },
    validExistsAnswer(answer: string): true | string {
      const validAnswer = answer === "true" || answer === "false";
      return validAnswer || "answer has to be 'true' or 'false'";
    },
    onBackLastSelectedItem(): void {
      if (this.lastSelected) {
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
      const itemSelected = this.questionnaireTools.getItemByLinkId(
        this.questionaireGUI!,
        $event,
      );
      if (itemSelected === undefined) {
        this.triggerNegative();
        return;
      }
      this.lastSelected = this.selected;
      this.lastSelectedItem = this.selectedItem;
      this.selected = itemSelected.__internalID;
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
    addPredefinedExtension(): void {
      this.selectedItem!.extension ??= [];
      this.extensionLayout = true;
    },
    onAddedPredefinedExtension(e: Extension): void {
      this.selectedItem!.extension!.push(e);
      this.extensionLayout = false;
    },
    removeExtension(index: number): void {
      this.selectedItem!.extension!.splice(index, 1);
    },
    // Called for answers from answerOption-item
    onEnableWhenWithAnswerOption(e: AnswerOption): void {
      if (e.__type === undefined) {
        console.error("AnswerOption always needs a type");
        return;
      }
      this.enableWhenItem.question = e.__linkId ?? "";
      this.enableWhenItem.__type = e.__type;
      this.enableWhenItem.__answerOption = true;
      if (!this.enableWhenItem.operator) {
        this.enableWhenItem.operator = "=";
      }
      switch (e.__type) {
        case "coding":
          this.enableWhenItem.__answer = e.__formattedValueCoding;
          this.enableWhenItem.answerCoding = editorTools.clone(e.valueCoding);
          break;
        case "decimal":
          if (typeof e.valueDecimal === "number") {
            this.enableWhenItem.__answer = e.valueDecimal.toString();
          } else {
            this.enableWhenItem.__answer = e.valueDecimal;
          }
          break;
        case "integer":
          if (typeof e.valueInteger === "number") {
            this.enableWhenItem.__answer = e.valueInteger.toString();
          } else {
            this.enableWhenItem.__answer = e.valueInteger;
          }
          break;
        case "date":
          this.enableWhenItem.__answer = e.valueDate;
          break;
        case "dateTime":
          this.enableWhenItem.__answer = e.valueDateTime;
          break;
        case "time":
          this.enableWhenItem.__answer = e.valueTime;
          break;
        case "string":
          this.enableWhenItem.__answer = e.valueString;
          break;
        case "quantity":
          this.enableWhenItem.__answer = e.__formattedValueQuantity;
          this.enableWhenItem.answerQuantity = editorTools.clone(
            e.valueQuantity,
          );
          break;
        case "reference":
          this.enableWhenItem.__answer = e.__formattedValueReference;
          this.enableWhenItem.answerReference = editorTools.clone(
            e.valueReference,
          );
          break;
        default:
          throw new UnreachableError(e.__type);
      }
      this.enableWhenLayout = false;
    },
    onSelectedQuestion(e: SelectedItem): void {
      this.enableWhenItem.question = e.linkId ?? "";
      this.enableWhenItem.__answer = "";
      this.enableWhenItem.__type = e.type;
      if (e.linkId !== undefined) {
        this.enableWhenItem.operator ||= "=";
      }
      this.enableWhenItem.__answerOption = false;
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
        __answer: "",
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
    onDragStart(e: DragEvent, node: Item): void {
      if (e.dataTransfer !== null) {
        e.dataTransfer.setData(DRAG_KEY_INTERNAL_ID, node.__internalID);
      } else {
        console.error(`DataTransfer is null: ${node.__linkId}`);
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
        return; // Don't allow to drag on itself
      }

      const sourceItem = this.questionnaireTools.getItemByInternalId(
        this.questionaireGUI!,
        sourceInternalId,
      );
      if (sourceItem === undefined || !sourceItem.__active) {
        return;
      }

      const targetItem = this.questionnaireTools.getItemByInternalId(
        this.questionaireGUI!,
        targetInternalId,
      );
      if (targetItem === undefined || !targetItem.__active) {
        return;
      }

      // Check if sourceItem is the parent for target -> Not allowed
      const itemNodeChild = this.itemTools.getItemByInternalId(
        targetItem.__internalID,
        sourceItem.item,
      );
      if (itemNodeChild !== undefined) {
        return;
      }

      // Can only drag on active items that aren't of type display
      if (
        droppedOnItemNode &&
        (!targetItem.__active || targetItem.type === "display")
      ) {
        return;
      }

      // Don't allow more than 5 levels of nested items
      let targetLevel = this.editorTools.getLevelFromLinkID(
        targetItem.__linkId,
      );
      // If dropped above target, source has same level as parent of target.
      if (!droppedOnItemNode) {
        targetLevel--;
      }
      const sourceLevel = this.editorTools.getMaxLevel(sourceItem);
      const totalLevels = targetLevel + sourceLevel;
      const sourceGroupLevel = this.editorTools.getMaxLevelOfGroup(sourceItem);
      const totalGroupLevels = targetLevel + sourceGroupLevel;
      if (
        totalLevels > MAX_ALLOWED_LEVELS ||
        totalGroupLevels > MAX_ALLOWED_LEVELS_FOR_GROUPS
      ) {
        return;
      }
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      for (const qre of questionnaires) {
        this.dragItem(
          qre,
          sourceItem.__linkId,
          targetItem.__linkId,
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
        this.questionnaireTools.getBranchContainingInternalLinkID(
          questionnaire,
          sourceInternalLinkId,
        );
      if (sourceBranchWithIndex === undefined) {
        console.error(
          `Internal LinkId ${sourceInternalLinkId} is not part of questionnaire`,
        );
        return;
      }
      const targetBranchWithIndex =
        this.questionnaireTools.getBranchContainingInternalLinkID(
          questionnaire,
          targetInternalLinkId,
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

      this.editorTools.regenerateInternalLinkIDs(questionnaire);
    },
    toggleItem(internalId: string) {
      const currentNode = this.questionnaireTools.getItemByInternalId(
        this.questionaireGUI!,
        internalId,
      );
      if (currentNode === undefined) {
        console.error(
          `InternalId ${internalId} does not exist in questionnaire`,
        );
        return;
      }
      const questionnaires: Questionnaire[] = this.getQuestionnaires;

      if (!currentNode.__active) {
        const errorLangs: Language[] = [];
        for (const questionnaire of questionnaires) {
          if (
            this.questionnaireTools.enableWhenDependsOn(
              questionnaire,
              currentNode,
            )
          ) {
            errorLangs.push(questionnaire.language);
          }
        }
        if (errorLangs.length !== 0) {
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
          const linkIDs = this.itemTools.getAllLinkIDs(currentNode);
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
          questionnaire,
          toggle,
        );
      }
    },
    isCondition(internalId: string): boolean {
      const item = this.questionnaireTools.getItemByInternalId(
        this.questionaireGUI!,
        internalId,
      );
      const linkId = item?.linkId;
      if (!linkId) return false;
      return this.questionnaireTools.isEnableWhenCondition(
        this.questionaireGUI!,
        linkId,
      );
    },
    onAddQuestion(linkId: string, questionType: ItemType): void {
      if (this.selectedItem === undefined) {
        const questionnaires: Questionnaire[] = this.getQuestionnaires;
        for (const qre of questionnaires) {
          this.addQuestionToRootItem(qre, linkId, questionType);
        }
        return;
      }
      const currentLevel = this.editorTools.getLevelFromLinkID(
        this.selectedItem.__linkId,
      );
      // Don't add group question to lowest level to avoid empty groups
      if (currentLevel >= MAX_ALLOWED_LEVELS) {
        return;
      } else if (
        questionType === "group" &&
        currentLevel >= MAX_ALLOWED_LEVELS_FOR_GROUPS
      ) {
        return;
      }
      const selectedLinkId = this.selectedItem.__linkId;
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      for (const qre of questionnaires) {
        this.addQuestionToItem(qre, selectedLinkId, linkId, questionType);
      }
    },
    addQuestionToItem(
      questionnaire: Questionnaire,
      internalLinkId: string,
      linkId: string,
      type: ItemType,
    ): void {
      const item = this.questionnaireTools.getItemByInternalLinkId(
        internalLinkId,
        questionnaire,
      );
      const newItem = this.itemTools.createItemWithType(linkId, type);
      this.editorTools.addItemAndSetLinkIDs(newItem, item);
    },
    addQuestionToRootItem(
      questionnaire: Questionnaire,
      linkId: string,
      type: ItemType,
    ): void {
      const newItem = this.itemTools.createItemWithType(linkId, type);
      const rootItems = questionnaire.item;
      this.editorTools.addItemToRootAndSetLinkIDs(newItem, rootItems);
    },
    addAnswerOptionType(type: AnswerOptionType): void {
      const answerOption = choiceItemTypeIcons.find((a) => a.name === type);
      if (answerOption === undefined) {
        console.error(`Type ${type} does not support AnswerOption!`);
        return;
      }
      this.addAnswerOption(answerOption);
    },
    addAnswerOption(e: AnswerOptionButton): void {
      if (this.selectedItem === undefined) {
        console.error("Can't add answerOption if no item is selected!");
        return;
      }
      this.selectedItem.answerOption ??= [];

      const answerOption: AnswerOption = {
        __icon: e.icon,
        __id: itemTools.createAnswerOptionId(),
        __newAnswer: true,
        __type: e.name,
      };
      switch (e.name) {
        case "coding":
          answerOption.valueCoding = { code: "", display: "", system: "" };
          break;
        case "decimal":
          answerOption.valueDecimal = "";
          break;
        case "integer":
          answerOption.valueInteger = "";
          break;
        case "date":
          answerOption.valueDate = "";
          break;
        case "dateTime":
          answerOption.valueDateTime = "";
          break;
        case "time":
          answerOption.valueTime = "";
          break;
        case "string":
          answerOption.valueString = "";
          break;
        case "quantity":
          answerOption.valueQuantity = {};
          break;
        case "reference":
          answerOption.valueReference = {};
          break;
        default:
          throw new UnreachableError(e);
      }
      this.selectedItem.answerOption.push(answerOption);
    },
    removeAnswerOption(e: AnswerOption) {
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
        console.error(`ID "${e.__id}" does not exist on any answer`);
        return;
      }
      this.selectedItem.answerOption.splice(indexOfItemtoBeRemoved, 1);
    },
    deleteItem(internalID: string) {
      const answer = confirm(i18n.global.t("views.editor.deleteItemDialogue"));
      if (!answer) {
        return;
      }
      const item = this.questionnaireTools.getItemByInternalId(
        this.questionaireGUI!,
        internalID,
      );
      if (item === undefined) {
        console.error(`InternalId '${internalID}' does not exist`);
        return;
      }
      if (this.selectedItem?.__internalID === internalID) {
        this.selected = null;
        this.lastSelected = null;
        this.lastSelectedItem = undefined;
      }
      const questionnaires: Questionnaire[] = this.getQuestionnaires;
      for (const qre of questionnaires) {
        this.deleteItemWithInternalLinkId(qre, item.__linkId);
      }
    },
    deleteItemWithInternalLinkId(
      questionnaire: Questionnaire,
      internalLinkId: string,
    ) {
      const branchWithIndex =
        this.questionnaireTools.getBranchContainingInternalLinkID(
          questionnaire,
          internalLinkId,
        );
      if (branchWithIndex === undefined) {
        console.error(
          `LinkId ${internalLinkId} does not exist in questionnaire ${questionnaire.language}`,
        );
        return;
      }
      const [branch, index] = branchWithIndex;
      const linkIDs = this.itemTools.getAllLinkIDs(branch[index]);
      branch.splice(index, 1); // Delete item
      if (linkIDs.size > 0) {
        this.deleteEnableWhenWithQuestionID(questionnaire.item, linkIDs);
      }
      this.editorTools.regenerateInternalLinkIDs(questionnaire);
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
        if (this.selectedItem.required === undefined) {
          console.error("Required should not be undefined.");
          return false;
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
        if (this.selectedItem.repeats === undefined) {
          console.error("Required should not be undefined.");
          return false;
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
  },
  watch: {
    selected(internalId: string | null) {
      this.editorTools.removeConditionDependence(this.item);
      this.editorTools.setConditionDependence(this.item, this.item);
      if (internalId === null) {
        this.selectedItem = undefined;
        return;
      }
      this.selectedItem = this.questionnaireTools.getItemByInternalId(
        this.questionaireGUI!,
        internalId,
      );
    },
    // TODO: How should switching to last selected change splitter?
    lastSelected(val: string | null) {
      if (val) {
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
