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
                :disable="prop.node.disabled"
              >
                <div
                  class="row items-center justify-between"
                  style="width: 100%; height: 6px"
                  @dragover="onDragOver"
                  @dragleave="onDragLeave"
                  @drop="onDrop"
                  :id="'_' + prop.node.__internalID"
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
                    <q-badge
                      label="GECCO"
                      color="red"
                      v-if="hasGeccoExtension(prop.node)"
                      ><q-tooltip
                        >This item will be mapped to the corresponding FHIR
                        resource</q-tooltip
                      ></q-badge
                    >
                    <div v-if="!prop.node.disabled">
                      <q-toggle
                        size="xs"
                        v-model="prop.node.__active"
                        :disable="prop.node.disabled"
                        @click="onToggle(prop.node.__internalID)"
                        ><q-tooltip>
                          {{
                            prop.node.__active
                              ? $t("views.editor.disableItem")
                              : $t("views.editor.enableItem")
                          }}
                        </q-tooltip></q-toggle
                      >
                    </div>
                    <!-- @click="deleteItem(prop)" -->
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
                <div
                  class="row items-center justify-between text-caption text-grey-8 non-selectable"
                  style="width: 100%"
                >
                  <span>
                    {{ prop.node.type }}:{{ prop.node.linkId }}
                    <q-tooltip>
                      {{ $t("components.linkId") }}
                    </q-tooltip>
                  </span>
                </div>
              </div>
            </template>
          </q-tree>

          <!-- Change language button -->
          <div
            v-if="
              selected === null ||
              selectedItem === undefined ||
              Object.keys(selectedItem).length === 0
            "
          >
            <q-page-sticky position="bottom-left" :offset="[240, 18]">
              <q-fab
                vertical-actions-align="left"
                color="purple"
                push
                icon="keyboard_arrow_up"
                direction="up"
                padding="none xl"
                :label="
                  $t('views.editor.changeLanguage', { language: language })
                "
              >
                <q-fab-action
                  v-for="lang in languages.filter((l) => l !== language)"
                  :key="lang"
                  label-position="right"
                  color="purple"
                  @click="onLanguageChoice(lang)"
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
              Object.keys(selectedItem).length === 0 ||
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
                  @click="onAddQuestion(questionTypeIcon)"
                  :icon="questionTypeIcon.icon"
                  :label="questionTypeIcon.label"
                />
                <q-fab-action
                  key="Import GECCO item..."
                  label-position="right"
                  color="red"
                  @click="onAddGECCOQuestion"
                  icon="coronavirus"
                  label="Import GECCO item(s)..."
                />
              </q-fab>
            </q-page-sticky>
          </div>
        </div>
      </template>

      <!-- Edtion question selected -->
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
              <!-- Show Depedence Condition -->
              <q-btn
                flat
                round
                color="primary"
                icon="device_hub"
                @click="alert = true"
                v-if="selectedItem?.__dependeceCondition"
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
              v-if="hasGeccoExtension(selectedItem)"
            >
              <q-input
                :model-value="getGeccoExtensionValue(selectedItem)"
                label="GECCO-Mapping"
                disable
                dense
                class="col-8"
                color="black"
              >
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
                selectedItem?.__icon === 'toc' || //choice
                selectedItem?.__icon === 'horizontal_split' //open-choice
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
                  (selectedItem.__icon === 'toc' || //choice
                    selectedItem.__icon === 'horizontal_split') //open-choice
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
                      selectedItem.__icon === 'toc' || //choice
                      selectedItem.__icon === 'horizontal_split' //open-choice
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
                                  :disable="
                                    !selectedItem.__active ||
                                    hasGeccoExtension(selectedItem)
                                  "
                                  :label="$t('views.editor.code')"
                                  outlined
                                  dense
                                  class="col-5"
                                  v-model="answerOption.valueCoding.code"
                                ></q-input
                                ><q-input
                                  :disable="
                                    !selectedItem.__active ||
                                    hasGeccoExtension(selectedItem)
                                  "
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
                                  :disable="
                                    !selectedItem.__active ||
                                    hasGeccoExtension(selectedItem)
                                  "
                                  @click="onRemoveAnswer(answerOption)"
                                  ><q-tooltip>
                                    {{ $t("components.remove") }}
                                  </q-tooltip></q-btn
                                >
                              </div>
                            </div>
                          </q-item-section>
                        </q-item></q-list
                      >

                      <!--  button add new Answer -->
                      <!--<q-page-sticky
                        position="bottom-right"
                        :offset="[18, 35]"
                        v-if="selectedItem.__active"
                      > -->
                      <q-fab
                        padding="none xl"
                        fab
                        icon="add"
                        :label="$t('views.editor.addAnswer')"
                        direction="right"
                        color="primary"
                        v-if="!selectedItem.__answerValueSetCheck"
                      >
                        <template v-if="!hasGeccoExtension(selectedItem)">
                          <q-fab-action
                            v-for="answerType in answerTypeButton"
                            :key="answerType.name"
                            color="primary"
                            :icon="answerType.icon"
                            :label="answerType.label"
                            @click="onClickAddAnswer(answerType)"
                          />
                        </template>
                        <template v-else>
                          <q-fab-action
                            label="Not available for GECCO items"
                            disable
                          ></q-fab-action>
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
                            <!-- Go to question Item  -->
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
                          <!-- TODO: type conversion correct? enableWhen integer -->
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
                          <!-- FIXME: what is default type of enableWhen? -->
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
                    <!--<q-page-sticky position="bottom-right" :offset="[18, 10]">-->
                    <q-btn
                      padding="none xl"
                      v-if="selectedItem.__active"
                      fab
                      icon="add"
                      color="primary"
                      :label="$t('views.editor.addNewCondition')"
                      @click="onAddCondition"
                    />
                    <!--</q-page-sticky>-->
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
            v-for="(question, index) in selectedItem?.__dependeceCondition
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
    <q-dialog v-model="geccoLayout">
      <cx-add-gecco-item v-on:question="onSelectedGECCOQuestion">
      </cx-add-gecco-item>
    </q-dialog>
  </div>
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
} from "../utils/constants";
import { useQuasar } from "quasar";
import { defineComponent, Ref, ref } from "vue";
import { editorTools } from "../utils/editor";
import { mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";
import cxEnableWhen from "../components/cxEnableWhen.vue";
import cxAddGeccoItem from "../components/cxAddGeccoItem.vue";
import { i18n, usedLocale } from "@/i18n";
import {
  AnswerOption,
  EnableWhen,
  Item,
  SelectedQuestion,
  operators,
  Questionnaire,
} from "@/types";
import { Language, languages } from "@/store";
import { deepCopyObject } from "@/utils/exportJson";

// TODO: Replace with KeyboardEvent
type CustomEvent = {
  keyCode: number;
  which: number;
  preventDefault: () => void;
};

export default defineComponent({
  components: {
    cxAddGeccoItem,
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
    // TODO: InternalID or LinkID? Is used to generate LinkID in onSelectedGECCOQuestion
    const selected: Ref<string | null> = ref(null);
    const lastSelected: Ref<string | null> = ref(null);
    const enableWhen: EnableWhen = { question: "", operator: "" };
    const enableWhenItem = ref(enableWhen);
    const setDisplayToOld = (answerOption: AnswerOption) => {
      if (answerOption.valueCoding !== undefined) {
        answerOption.valueCoding.display =
          answerOption.valueCoding.__oldDisplay || "";
      }
    };
    const language: Ref<Language> = ref(usedLocale);
    const item: Ref<Item[]> = ref([]);
    return {
      triggerNegative,
      questionaireGUI,
      item,
      selected,
      selectedItem,
      lastSelected,
      lastSelectedItem,
      enableWhenItem,
      setDisplayToOld,
      enableWhenLayout: ref(false),
      geccoLayout: ref(false),
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
    onLanguageChoice(language: Language): void {
      // language is filtered at button and always != to current language
      this.$store.commit("switchQuestionnaireByLang", language);
      this.item = this.getQuestionnaireImportedJSON.item;
      this.language = this.getLanguage;
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
      const itemSelected = this.editorTools.getCurrentQuestionNodeByLinkId(
        $event,
        this.item,
      );
      if (itemSelected !== undefined) {
        this.lastSelected = this.selected;
        this.lastSelectedItem = this.selectedItem;

        this.selectedItem = itemSelected;
        this.selected = itemSelected.__internalID;
      } else {
        this.triggerNegative();
      }
    },
    onlyNumberDec($event: CustomEvent) {
      //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46 && keyCode !== 44) {
        // 46 is dot
        $event.preventDefault();
      }
    },
    onlyNumber($event: CustomEvent) {
      //keyCodes value
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode < 48 || keyCode > 57) {
        $event.preventDefault();
      }
    },
    onSelectedQuestionsAnswer(e: AnswerOption) {
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
      // TODO: is it type or __type?
      this.enableWhenItem.type = e.type;
      this.enableWhenLayout = false;
    },
    // TODO: Should it be GeccoItem instead of Item?
    onSelectedGECCOQuestion(input: Item | undefined): void {
      this.geccoLayout = false;
      if (input === undefined) {
        return; // No question was selected
      }
      const item = deepCopyObject(input);
      if (this.selected !== null && this.selectedItem !== undefined) {
        // only add questions in items type group
        const selectedLevel = this.editorTools.getLevelFromLinkID(
          this.selectedItem.linkId,
        );
        if (
          this.selectedItem.type !== "group" ||
          selectedLevel >= MAX_ALLOWED_LEVELS
        ) {
          return;
        }
        // only add group if there are enough levels (recursively)
        if (item.type === "group") {
          const countGroupLevels = this.editorTools.getNumberOfGroupLevel(item);
          if (
            selectedLevel + countGroupLevels >
            MAX_ALLOWED_LEVELS_FOR_GROUPS
          ) {
            return;
          }
        }
        // Add new item at correct place
        if (
          this.selectedItem.item !== undefined &&
          this.selectedItem.item.length > 0
        ) {
          const lastItem = this.selectedItem.item.at(-1) as Item; // undefined should never happen
          item.__linkId = this.editorTools.getNextID(lastItem.__linkId);
          item.linkId = this.editorTools.getNextID(lastItem.linkId);
        } else {
          this.selectedItem.item ??= [];
          // TODO: extract generating of ID
          item.__linkId = this.selected + "." + 1;
          item.linkId = item.__linkId;
        }
        this.selectedItem.item.push(item);
      } else {
        // Add to root item
        item.__linkId = this.item.length + 1 + "";
        this.item.push(item);
      }
      let changedIdMap = this.editorTools.regenerateLinkIds(this.item);
      this.editorTools.regenerateConditionWhenIds(this.item, changedIdMap);
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
        e.dataTransfer.setData("text", node.__internalID);
      } else {
        console.error(`DataTransfer is null: ${node.__internalID}`);
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
    onDrop(e: DragEvent): void {
      e.preventDefault();
      if (e.currentTarget === null || e.dataTransfer === null) return;
      // TODO: check how styling of currentTarget is needed/works
      const currentTarget = e.currentTarget as HTMLInputElement;
      currentTarget.style.backgroundColor = "";
      currentTarget.style.cursor = "default";
      const draggedId = e.dataTransfer.getData("text");

      const itemSource = this.editorTools.getCurrentQuestionNodeByID(
        draggedId,
        this.item,
      );

      if (itemSource === undefined || Object.keys(itemSource).length === 0) {
        //No valid source Item
        return;
      }

      const internalIDTarget = this.editorTools.getInternalIDFromEhandler(e);

      if (draggedId === internalIDTarget) return; //No allow drag it in same Item

      const itemTarget = this.editorTools.getCurrentQuestionNodeByID(
        internalIDTarget,
        this.item,
      );

      if (
        itemTarget === undefined ||
        itemTarget.linkId === "" ||
        itemSource.linkId === ""
      ) {
        return;
      }

      //check if source Item Is the parent for target-> Not Allow
      const itemNodeChild = this.editorTools.getCurrentQuestionNodeByID(
        itemTarget.__internalID,
        itemSource.item,
      );
      if (itemNodeChild !== undefined) {
        return;
      }

      if (Object.keys(itemTarget).length === 0) {
        //No valid target Item
        return;
      }

      if (!itemTarget.__active && !this.editorTools.isPreviousQuestion(e)) {
        return; //No allow  drag it in items inactives
      }

      if (
        itemTarget.__icon !== "article" &&
        !this.editorTools.isPreviousQuestion(e)
      ) {
        return; //only question can be drag in group questions
      }

      const aitemParentSource = this.editorTools.getArraySource(
        draggedId,
        this.item,
      );

      const itemToBeMoved = this.editorTools.getCurrentQuestionNodeByID(
        draggedId,
        this.item,
      );

      if (itemToBeMoved === undefined) {
        console.error("Moved item was not found by id");
        return;
      }

      if (itemToBeMoved.item) {
        //no allow more than 5 levels of items, nested Items
        const numLevel =
          this.editorTools.getNumbersMaxOfLevels(itemToBeMoved.item) + 1; //count parent
        const totalOfLevelts =
          this.editorTools.getLevelFromLinkID(itemTarget.linkId) + numLevel;
        if (totalOfLevelts > MAX_ALLOWED_LEVELS) {
          return;
        }
      }

      const level = this.editorTools.getLevelFromLinkID(itemTarget.linkId);
      if (level >= MAX_ALLOWED_LEVELS && itemToBeMoved.__icon === "article") {
        return; //no allow more than 5 levels of items
      }

      const aitemParentTarget = this.editorTools.getArraySource(
        internalIDTarget,
        this.item,
      );

      const indexOfItemtoBeInsert = this.editorTools.getIndexItem(
        internalIDTarget,
        aitemParentTarget,
      );

      let indexOfItemtoBeRemoved = this.editorTools.getIndexItem(
        draggedId,
        aitemParentSource,
      );

      //Insert Inside Group Item: at the end
      // if (e.currentTarget.id.split("_").length === 1) {
      if (currentTarget.id.split("_").length === 1) {
        if (!itemTarget.item) {
          itemTarget.item = [];
        }
        itemTarget.item.push(itemToBeMoved);
      } else {
        //Insert before Item
        aitemParentTarget.splice(indexOfItemtoBeInsert, 0, itemToBeMoved);

        if (aitemParentSource === aitemParentTarget) {
          if (indexOfItemtoBeInsert < indexOfItemtoBeRemoved) {
            indexOfItemtoBeRemoved++;
          }
        }
      }
      aitemParentSource.splice(indexOfItemtoBeRemoved, 1);
      let changedIdMap = this.editorTools.regenerateLinkIds(this.item);
      this.editorTools.regenerateInternalIDs(this.item);
      this.editorTools.regenerateConditionWhenIds(this.item, changedIdMap);
    },
    onToggle(id: string) {
      const currentNode = this.editorTools.getCurrentQuestionNodeByID(
        id,
        this.item,
      );
      if (currentNode === undefined) {
        console.error("Toggled node was not found by id");
        return;
      }
      const linkId = currentNode.linkId;

      if (this.editorTools.isEnableWhenCondition(this.item, linkId)) {
        alert(
          "There are one or more question that depend on the one you deactivated. " +
            "Keeping the LinkID on these conditions would harm the logical integrety of the questionnaire. " +
            "They were therefore removed. \n" +
            "Please be aware that if you reactivate the question you have to relink these conditions.",
        );
      }

      this.editorTools.disableEntireItemQuestion(id, this.item);
      let changedIdMap = this.editorTools.regenerateLinkIds(this.item);
      this.editorTools.regenerateConditionWhenIds(this.item, changedIdMap);
    },
    isCondition(id: string) {
      return this.editorTools.isEnableWhenCondition(
        this.item,
        this.editorTools.getCurrentQuestionNodeByID(id, this.item)?.linkId ||
          "",
      );
    },
    onAddQuestion(e: QuestionIcon) {
      //No Add Question on Items disabled
      if (
        // this.selectedItem === undefined ||
        this.selectedItem?.__active === false
      ) {
        return;
      }
      //No allow add question more than 5 levels
      if (
        this.selectedItem !== undefined &&
        this.editorTools.getLevelFromLinkID(this.selectedItem.linkId) >=
          MAX_ALLOWED_LEVELS_FOR_GROUPS &&
        e.name === this.questionTypes.group
      ) {
        return;
      }
      const item = this.editorTools.getTypeObjQuestion(e.name);
      item.text = this.$t("views.editor.newQuestion");
      if (this.selected !== null && this.selectedItem !== undefined) {
        //only add questions in items type group
        if (this.selectedItem.__icon !== "article") return;
        // if (this.selectedItem.type !== this.questionTypes.group) return;
        if (
          this.selectedItem.item !== undefined &&
          this.selectedItem.item.length > 0
        ) {
          const lastItem = this.selectedItem.item.at(-1) as Item;
          item.__linkId = this.editorTools.getNextID(lastItem.__linkId);
          item.linkId = this.editorTools.getNextID(lastItem.linkId);
        } else {
          this.selectedItem.item = [];
          item.__linkId = this.selected + "." + 1;
          item.linkId = item.__linkId;
        }
        this.selectedItem.item.push(item);
      } else {
        item.__linkId = this.item.length + 1 + "";
        this.item.push(item);
      }
      const changedIdMap = this.editorTools.regenerateLinkIds(this.item);
      this.editorTools.regenerateConditionWhenIds(this.item, changedIdMap);
    },
    onAddGECCOQuestion(): void {
      //No Add Question on Items disabled
      if (this.selectedItem?.__active === false) {
        return;
      }
      //No allow add question more than 5 levels
      if (
        this.selectedItem !== undefined &&
        this.editorTools.getLevelFromLinkID(this.selectedItem.linkId) >=
          MAX_ALLOWED_LEVELS
      ) {
        return;
      }
      this.geccoLayout = true;
    },
    // TODO: Is this method needed?
    onClickAddAnswerOpenChoice(e: any): void {
      if (this.selectedItem === undefined) {
        console.error("Selected item should not be undefined");
        return;
      }
      //only choise answer are allowed to open-choise questions
      let answerOption: AnswerOption = {};
      if (e.type === "choice") {
        answerOption = this.editorTools.getNewAnswerValueCoding(
          { text: "", type: e.type },
          this.selectedItem.answerOption,
        );
      }
      if (e.type === "open-choice") {
        answerOption = this.editorTools.getNewAnswerValueString(
          { text: "Answer", type: e.type },
          this.selectedItem.answerOption,
        );
      }
      if (!this.selectedItem.answerOption) {
        this.selectedItem.answerOption = [];
      }
      this.selectedItem.answerOption.push(answerOption);
    },
    hasGeccoExtension(e: Item | undefined) {
      return (
        e?.extension &&
        e.extension.some(
          (it) =>
            it.url ===
            "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
        )
      );
    },
    getGeccoExtensionValue(e: Item | undefined) {
      let extension = e?.extension?.find(
        (it) =>
          it.url ===
          "https://num-compass.science/fhir/StructureDefinition/CompassGeccoItem",
      );
      return extension?.valueCoding?.code;
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
      if (!internalID) {
        console.error("Empty internalID can't be deleted");
        return;
      }
      const answer = confirm(i18n.global.t("views.editor.deleteItemDialogue"));
      if (!answer) {
        return;
      }
      const branchWithPosition = this.editorTools.getBranchContainingInternalID(
        internalID,
        this.item,
      );
      if (branchWithPosition === undefined) {
        console.error(
          `InternalID ${internalID} doesn't exist in Questionnaire`,
        );
        return;
      }
      const [branch, position] = branchWithPosition;
      const linkIDs = this.editorTools.getAllLinkIDs(branch[position]);
      branch.splice(position, 1); // Delete item
      this.deleteEnableWhenWithQuestionID(this.item, linkIDs);
      const changedIdMap = this.editorTools.regenerateLinkIds(this.item);
      this.editorTools.regenerateInternalIDs(this.item);
      this.editorTools.regenerateConditionWhenIds(this.item, changedIdMap);
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
      "getQuestionnaireGECCO",
      "getAnswerValueSet",
      "getOpenChoice",
      "getChoice",
      "getLanguage",
    ]),
    // TODO: Is this method needed?
    aAddAnswerButtonOptions() {
      const that = this;
      let optionsAnswers: any[] = [];
      if (this.answerType.open_choice.name === this.selectedItem?.type) {
        optionsAnswers = [
          {
            text: that.$t("views.editor.optionsAnswers.open"),
            __icon: that.answerType.open_choice.icon,
            type: that.answerType.open_choice.name,
          },
          {
            text: that.$t("views.editor.optionsAnswers.choice"),
            __icon: that.answerType.choice.icon,
            type: that.answerType.choice.name,
          },
        ];
      }
      return optionsAnswers;
    },
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
    enabledQuestionTypes() {
      // const allowedQuestions = (q) =>
      //   !(!this.getChoice && q.name == "choice") &&
      //   !(!this.getOpenChoice && q.name == "open-choice");
      const allowedQuestions = (q: QuestionIcon) =>
        !(
          (!this.getChoice && q.name === "choice") ||
          (!this.getOpenChoice && q.name === "open-choice")
        );
      const result = questionTypesIcons.filter(allowedQuestions);
      return result;
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
      this.selectedItem = this.editorTools.getCurrentQuestionNodeByID(
        val,
        this.item,
      );
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
