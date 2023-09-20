<template>
  <div class="row justify-center">
    <div class="col-7">
      <q-list class="q-mt-md" padding bordered>
        <cxInfoText />
        <q-expansion-item>
          <template v-slot:header>
            <cxExpansionItemHeader
              icon="description"
              title="Text"
              :tooltip="$t('tutorial.Text')"
            />
          </template>
          <q-separator />
          <q-list bordered separator dense padding class="rounded-borders">
            <div class="row justify-between">
              <q-select
                label="Status"
                v-model="textStatus"
                :options="narrativeStatuses"
              />
              <q-btn
                icon="update"
                label="Generate Text"
                @click="generateText"
              />
            </div>
            <code>
              <q-input
                label="Div"
                v-model="textDiv"
                :rules="[questionnaireTools.containsNonWhitespace]"
                type="textarea"
                autogrow
                clearable
                @clear="textDiv = ''"
              />
            </code>
          </q-list>
        </q-expansion-item>
      </q-list>

      <q-dialog v-model="confirmTextLayout">
        <cxConfirmDialog
          :message="$t('tutorial.generatedText')"
          v-on:confirmation="setGeneratedText"
        />
      </q-dialog>

      <!-- Contact -->
      <div class="q-my-md">
        <q-list bordered padding>
          <q-expansion-item expand-separator>
            <template v-slot:header>
              <cxExpansionItemHeader
                icon="contacts"
                title="Contact"
                :tooltip="$t('tutorial.contact')"
              />
            </template>
            <q-list bordered separator dense padding class="rounded-borders">
              <q-item
                v-for="(contactDetail, index) in contact"
                :key="`set_${index}`"
              >
                <q-item-section>
                  <q-input
                    label="Name"
                    v-model="contactDetail.name"
                    clearable
                  />
                  <cxContactDetail
                    :contactDetail="contactDetail"
                    v-on:addContactPoint="
                      (p: ContactPoint) => contactDetail.telecom.push(p)
                    "
                    v-on:removeContactPoint="
                      (i: number) => contactDetail.telecom.splice(i, 1)
                    "
                  />
                </q-item-section>
                <q-btn
                  flat
                  icon="highlight_off"
                  color="grey-6"
                  @click="$store.commit('removeContactDetail', index)"
                />
              </q-item>
            </q-list>
            <q-btn
              icon="add"
              padding="none xl"
              color="primary"
              fab
              label="ContactDetail"
              @click="
                $store.commit('addContactDetail', { name: '', telecom: [] })
              "
            />
          </q-expansion-item>
        </q-list>
      </div>

      <q-list class="q-mt-md" padding bordered>
        <div class="text-h6">FHIR Resource metadata:</div>
        <div>
          <q-input
            label="ID"
            v-model="id"
            :rules="[questionnaireTools.isIdOrEmpty]"
            clearable
            @clear="() => (id = '')"
          >
            <cxTooltip :text="$t('tutorial.id')" />
          </q-input>
        </div>

        <div>
          <q-input
            label="ImplicitRules"
            v-model="implicitRules"
            :rules="[questionnaireTools.isUriOrEmpty]"
            clearable
            @clear="() => (implicitRules = '')"
          >
            <cxTooltip :text="$t('tutorial.implicitRules')" />
          </q-input>
        </div>

        <div>
          <q-list padding bordered>
            <q-expansion-item expand-separator>
              <template v-slot:header>
                <cxExpansionItemHeader
                  icon="info"
                  title="Meta"
                  :tooltip="$t('tutorial.meta')"
                />
              </template>
              <q-separator />
              <q-list separator dense padding>
                <div>
                  <q-input
                    label="VersionId"
                    v-model="versionId"
                    :rules="[questionnaireTools.isIdOrEmpty]"
                    clearable
                    @clear="() => (versionId = '')"
                  />
                </div>
                <div class="row justify-between">
                  <q-input
                    class="col-10"
                    label="Last updated"
                    v-model="lastUpdated"
                    :rules="[dateTools.isInstantOrEmpty]"
                    clearable
                    @clear="() => (lastUpdated = '')"
                  />
                  <q-btn
                    flat
                    dense
                    label="Now"
                    @click="() => (lastUpdated = dateTools.getInstant())"
                  />
                </div>
                <div>
                  <q-input
                    label="Source"
                    v-model="source"
                    :rules="[questionnaireTools.isUriOrEmpty]"
                    clearable
                    @clear="() => (source = '')"
                  />
                </div>

                <div>
                  <q-list padding bordered>
                    <q-expansion-item icon="information" label="Profiles">
                      <q-list
                        bordered
                        separator
                        dense
                        padding
                        class="rounded-borders"
                      >
                        <q-item
                          v-for="(_, index) in questionnaire.meta.profile"
                          :key="index"
                        >
                          <q-item-section>
                            <q-input
                              label="CANONICAL"
                              v-model="questionnaire.meta.profile[index]"
                              :rules="[questionnaireTools.isCanonicalOrEmpty]"
                              clearable
                              @clear="
                                () => $store.commit('clearProfileAt', index)
                              "
                            >
                              <template v-slot:prepend>
                                <div>{{ index + 1 }}</div>
                              </template>
                            </q-input>
                          </q-item-section>
                          <q-btn
                            flat
                            icon="highlight_off"
                            color="grey-6"
                            @click="
                              () => $store.commit('removeProfileAt', index)
                            "
                          />
                        </q-item>
                      </q-list>
                      <q-btn
                        icon="add"
                        label="Profile"
                        padding="none xl"
                        color="primary"
                        fab
                        @click="() => $store.commit('addProfile', '')"
                      />
                    </q-expansion-item>
                  </q-list>
                </div>
                <div>
                  <q-list padding bordered>
                    <q-expansion-item
                      label="Security"
                      expand-separator
                      icon="security"
                    >
                      <q-list
                        dense
                        bordered
                        separator
                        padding
                        class="rounded-borders"
                        key="Security"
                      >
                        <q-item
                          v-for="(code, index) in questionnaire.meta.security"
                          :key="index"
                        >
                          <q-item-section>
                            <div clickable @click="showSecurityDialog(code)">
                              <q-field
                                label="CODING"
                                stack-label
                                :error="editorTools.isEmptyObject(code)"
                                error-message="Coding must be non-empty"
                                dense
                              >
                                <template v-slot:control>
                                  <div>
                                    {{ editorTools.formatCoding(code) }}
                                  </div>
                                </template>
                                <template v-slot:prepend>
                                  <div>
                                    {{ index + 1 }}
                                  </div>
                                </template>
                              </q-field>
                            </div>
                          </q-item-section>
                          <q-btn
                            icon="highlight_off"
                            flat
                            color="grey-6"
                            @click="
                              () => $store.commit('removeSecurityAt', index)
                            "
                          />
                        </q-item>
                      </q-list>
                      <q-btn
                        label="Security"
                        icon="add"
                        padding="none xl"
                        color="primary"
                        fab
                        @click="() => $store.commit('addSecurity', {})"
                      />
                    </q-expansion-item>
                  </q-list>
                </div>
                <div>
                  <q-list padding bordered>
                    <q-expansion-item
                      label="Tag"
                      expand-separator
                      icon="webhook"
                    >
                      <q-list
                        dense
                        bordered
                        separator
                        padding
                        class="rounded-borders"
                        key="Tags"
                      >
                        <q-item
                          v-for="(code, index) in questionnaire.meta.tag"
                          :key="index"
                        >
                          <q-item-section>
                            <div clickable @click="showTagDialog(code)">
                              <q-field
                                label="CODING"
                                stack-label
                                :error="editorTools.isEmptyObject(code)"
                                error-message="Coding must be non-empty"
                                dense
                              >
                                <template v-slot:control>
                                  <div>
                                    {{ editorTools.formatCoding(code) }}
                                  </div>
                                </template>
                                <template v-slot:prepend>
                                  <div>
                                    {{ index + 1 }}
                                  </div>
                                </template>
                              </q-field>
                            </div>
                          </q-item-section>
                          <q-btn
                            icon="highlight_off"
                            flat
                            color="grey-6"
                            @click="() => $store.commit('removeTagAt', index)"
                          />
                        </q-item>
                      </q-list>
                      <q-btn
                        label="Tag"
                        icon="add"
                        padding="none xl"
                        color="primary"
                        fab
                        @click="() => $store.commit('addTag', {})"
                      />
                    </q-expansion-item>
                  </q-list>
                </div>
              </q-list>
            </q-expansion-item>
          </q-list>
        </div>

        <q-dialog v-model="securityLayout" v-if="selectedCoding !== undefined">
          <q-layout view="Lhh lpR fff" container class="bg-white">
            <q-page-container>
              <q-page padding>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-toolbar-title> Security Coding </q-toolbar-title>
                </q-toolbar>
                <cxCoding
                  :coding="selectedCoding"
                  v-on:addCoding="(_coding: Coding) => (securityLayout = false)"
                />
              </q-page>
            </q-page-container>
          </q-layout>
        </q-dialog>

        <q-dialog v-model="tagLayout" v-if="selectedCoding !== undefined">
          <q-layout view="Lhh lpR fff" container class="bg-white">
            <q-page-container>
              <q-page padding>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-toolbar-title> Tag Coding </q-toolbar-title>
                </q-toolbar>
                <cxCoding
                  :coding="selectedCoding"
                  v-on:addCoding="(_coding: Coding) => (tagLayout = false)"
                />
              </q-page>
            </q-page-container>
          </q-layout>
        </q-dialog>
      </q-list>

      <!-- extension -->
      <q-list class="q-my-md" padding bordered>
        <cxInfoExtension />
        <cxExtension
          :title="$t('views.editor.extensions')"
          v-if="questionnaire !== undefined"
          :extensions="questionnaire.extension"
          :predefinedExtensions="getQuestionnaireExtensions()"
          v-on:addExtension="addExtension"
          v-on:removeExtension="removeExtension"
        />
      </q-list>

      <!-- modifierExtension -->
      <q-list class="q-my-md" padding bordered>
        <cxInfoModifierExtension />
        <cxExtension
          title="ModifierExtension"
          v-if="questionnaire !== undefined"
          :extensions="questionnaire.modifierExtension"
          :predefinedExtensions="[]"
          v-on:addExtension="addModifierExtension"
          v-on:removeExtension="removeModifierExtension"
        />
      </q-list>

      <!-- identifier -->
      <q-list class="q-my-md" padding bordered>
        <q-expansion-item expand-separator>
          <template v-slot:header>
            <cxExpansionItemHeader
              icon="fingerprint"
              :title="$t('components.navigationBar.metadataItems.identifier')"
              :tooltip="$t('tutorial.identifier')"
            />
          </template>
          <q-separator />
          <q-card>
            <!-- identifier -->
            <q-list
              dense
              bordered
              padding
              class="rounded-borders"
              v-for="(id, index) in identifier"
              :key="index"
            >
              <q-item-section>
                <q-card-section>
                  <cxIdentifier
                    :identifier="id"
                    :header="index + 1 + '. Identifier'"
                  />
                </q-card-section>
              </q-item-section>
              <!-- Btn Remove Identifier -->
              <div class="row justify-end">
                <q-btn
                  class="q-ma-sm"
                  unelevated
                  color="negative"
                  size="sm"
                  @click="removeID(index)"
                >
                  <q-icon left name="add" />
                  <div>{{ $t("views.tabs.metadata.removeId") }}</div>
                </q-btn>
              </div>
            </q-list>
            <!-- Btn Add Identifier -->
            <div class="row">
              <q-btn
                class="q-ma-sm"
                outline
                color="primary"
                size="sm"
                @click="addEmptyId"
              >
                <q-icon left name="add" />
                <div>{{ $t("views.tabs.metadata.addNewId") }}</div>
              </q-btn>
            </div>
          </q-card>
        </q-expansion-item>
      </q-list>

      <!-- derivedFrom -->
      <div class="q-my-md">
        <q-list padding bordered>
          <q-expansion-item expand-separator>
            <template v-slot:header>
              <cxExpansionItemHeader
                icon="upgrade"
                title="DerivedFrom"
                :tooltip="$t('tutorial.derivedFrom')"
              />
            </template>
            <q-list
              v-if="$route.name !== 'Import' && questionnaire !== undefined"
              bordered
              separator
              dense
              padding
              class="rounded-borders"
            >
              <q-item
                v-for="(derivedFrom, index) in questionnaire.derivedFrom"
                :key="index"
              >
                <q-item-section>
                  <div class="row justify-between">
                    <q-select
                      label="DerivationType"
                      class="col-4"
                      :options="derivedFromExtensionValues"
                      v-model="questionnaire._derivedFrom[index].__value"
                      clearable
                      @clear="questionnaire._derivedFrom[index].__value = null"
                    >
                      <template v-slot:prepend>
                        <div>{{ index + 1 }}</div>
                      </template>
                    </q-select>
                    <q-input
                      label="URL of Questionnaire"
                      class="col-8"
                      :model-value="derivedFrom"
                      @update:model-value="
                        (v) => {
                          if (v === null) {
                            questionnaire!.derivedFrom[index] = '';
                          } else if (typeof v === 'string') {
                            questionnaire!.derivedFrom[index] = v;
                          }
                        }
                      "
                      clearable
                    />
                  </div>
                </q-item-section>
                <q-btn
                  flat
                  icon="highlight_off"
                  color="grey-6"
                  @click="$store.commit('removeDerivedFrom', index)"
                />
              </q-item>
            </q-list>
            <q-btn
              icon="add"
              label="DerivedFrom"
              padding="none xl"
              color="primary"
              fab
              @click="$store.commit('addEmptyDerivedFrom')"
            />
          </q-expansion-item>
        </q-list>
      </div>

      <!-- subjectType -->
      <div class="q-my-md">
        <q-list padding bordered>
          <q-expansion-item expand-separator>
            <template v-slot:header>
              <cxExpansionItemHeader
                icon="quickreply"
                title="SubjectType"
                :tooltip="$t('tutorial.subjectType')"
              />
            </template>
            <q-list
              v-if="$route.name !== 'Import' && questionnaire !== undefined"
              bordered
              separator
              dense
              padding
              class="rounded-borders"
            >
              <q-item
                v-for="(subjectType, index) in questionnaire.subjectType"
                :key="index"
              >
                <q-item-section>
                  <div class="row">
                    <q-select
                      :options="resourceTypes"
                      :model-value="subjectType"
                      @update:model-value="
                        (v) => (questionnaire!.subjectType[index] = v)
                      "
                    >
                      <template v-slot:prepend>
                        <div>{{ index + 1 }}</div>
                      </template>
                    </q-select>
                  </div>
                </q-item-section>
                <q-btn
                  flat
                  icon="highlight_off"
                  color="grey-6"
                  @click="() => $store.commit('removeSubjectType', index)"
                />
              </q-item>
            </q-list>
            <q-btn
              icon="add"
              label="SubjectType"
              padding="none xl"
              color="primary"
              fab
              @click="() => $store.commit('addPatientSubjectType')"
            />
          </q-expansion-item>
        </q-list>
      </div>

      <!-- UseContext -->
      <div class="q-my-md">
        <q-list padding bordered>
          <q-expansion-item expand-separator>
            <template v-slot:header>
              <cxExpansionItemHeader
                icon="unfold_more"
                title="UseContext"
                :tooltip="$t('tutorial.useContext')"
              />
            </template>
            <q-list bordered separator dense padding class="rounded-borders">
              <q-item
                v-for="(usageContext, index) in questionnaire.useContext"
                :key="index"
              >
                <q-item-section>
                  <div clickable @click="showUseContextDialog(usageContext)">
                    <q-field
                      label="CODE"
                      stack-label
                      :error="editorTools.isEmptyObject(usageContext.code)"
                      error-message="Coding must be non-empty"
                      dense
                    >
                      <template v-slot:control>
                        <div>
                          {{ editorTools.formatCoding(usageContext.code) }}
                        </div>
                      </template>
                      <template v-slot:prepend>
                        <div>
                          {{ index + 1 }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                  <div v-if="usageContext.__type === 'codeableConcept'">
                    <div clickable @click="showUseContextDialog(usageContext)">
                      <q-input
                        label="Text"
                        autogrow
                        readonly
                        type="textarea"
                        v-model="usageContext.valueCodeableConcept.text"
                      />
                    </div>
                    <q-expansion-item icon="code" label="Coding">
                      <q-list
                        bordered
                        separator
                        dense
                        padding
                        class="rounded-borders"
                      >
                        <q-item
                          v-for="(coding, cIndex) in usageContext
                            .valueCodeableConcept.coding"
                          :key="cIndex"
                        >
                          <q-item-section
                            clickable
                            @click="showUseContextDialog(usageContext)"
                          >
                            <q-field
                              label="CODING"
                              stack-label
                              :error="editorTools.isEmptyObject(coding)"
                              error-message="Coding must be non-empty"
                              dense
                            >
                              <template v-slot:control>
                                <div>
                                  {{ editorTools.formatCoding(coding) }}
                                </div>
                              </template>
                            </q-field>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-expansion-item>
                  </div>
                  <div
                    v-else-if="usageContext.__type === 'quantity'"
                    clickable
                    @click="showUseContextDialog(usageContext)"
                  >
                    <q-field
                      :label="usageContext.__type.toUpperCase()"
                      stack-label
                      :error="
                        editorTools.isEmptyObject(usageContext.valueQuantity)
                      "
                      error-message="Quantity must be non-empty"
                      dense
                    >
                      <template v-slot:control>
                        <div>
                          {{
                            editorTools.formatQuantity(
                              usageContext.valueQuantity,
                            )
                          }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                  <div
                    v-else-if="usageContext.__type === 'range'"
                    clickable
                    @click="showUseContextDialog(usageContext)"
                  >
                    <q-field label="LOW" stack-label dense>
                      <template v-slot:control>
                        <div>
                          {{
                            editorTools.formatSimpleQuantity(
                              usageContext.valueRange.low ?? {},
                            )
                          }}
                        </div>
                      </template>
                    </q-field>
                    <q-field label="HIGH" stack-label dense>
                      <template v-slot:control>
                        <div>
                          {{
                            editorTools.formatSimpleQuantity(
                              usageContext.valueRange.high ?? {},
                            )
                          }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                  <div
                    v-else-if="usageContext.__type === 'reference'"
                    clickable
                    @click="showUseContextDialog(usageContext)"
                  >
                    <q-field
                      :label="usageContext.__type.toUpperCase()"
                      stack-label
                      :error="
                        editorTools.isEmptyObject(usageContext.valueReference)
                      "
                      error-message="Reference must be non-empty"
                      dense
                    >
                      <template v-slot:control>
                        <div>
                          {{
                            editorTools.formatReference(
                              usageContext.valueReference,
                            )
                          }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                </q-item-section>
                <q-btn
                  flat
                  icon="highlight_off"
                  color="grey-6"
                  @click="() => $store.commit('removeUseContext', index)"
                />
              </q-item>
            </q-list>
            <q-fab
              v-model="fabUseContext"
              vertical-actions-align="center"
              color="primary"
              push
              icon="keyboard_arrow_right"
              direction="right"
              padding="none xl"
              label="Add UseContext"
            >
              <q-fab-action
                v-for="useContextType in useContextTypes"
                :key="useContextType"
                label-position="right"
                color="primary"
                @click="addNewToUseContext(useContextType)"
                :label="useContextType.toUpperCase()"
              />
            </q-fab>
          </q-expansion-item>
        </q-list>
      </div>

      <q-dialog
        v-model="useContextLayout"
        v-if="currentUsageContext !== undefined"
      >
        <q-layout view="Lhh lpR fff" container class="bg-white">
          <q-page-container>
            <q-page padding>
              <q-toolbar class="bg-primary text-white shadow-2">
                <q-toolbar-title> UsageContext: CODE </q-toolbar-title>
              </q-toolbar>
              <div>
                <cxCoding
                  :coding="currentUsageContext.code"
                  v-on:addCoding="
                    (_coding: Coding) => (useContextLayout = false)
                  "
                />
              </div>
              <q-toolbar class="bg-primary text-white shadow-2">
                <q-toolbar-title>
                  UsageContext: {{ currentUsageContext.__type.toUpperCase() }}
                </q-toolbar-title>
              </q-toolbar>
              <div v-if="currentUsageContext.__type === 'codeableConcept'">
                <q-input
                  label="Text"
                  autogrow
                  type="textarea"
                  v-model="currentUsageContext.valueCodeableConcept.text"
                />
                <q-separator />
                Coding:
                <q-list
                  bordered
                  separator
                  dense
                  padding
                  class="rounded-borders"
                >
                  <q-item
                    v-for="(coding, cIndex) in currentUsageContext
                      .valueCodeableConcept.coding"
                    :key="cIndex"
                  >
                    <q-item-section>
                      {{ cIndex + 1 }}
                      <div class="q-pa-md">
                        <q-input
                          label="Code"
                          class="col-4"
                          v-model="coding.code"
                          type="text"
                          dense
                        />
                        <q-input
                          label="Display"
                          class="col-4"
                          v-model="coding.display"
                          type="text"
                          dense
                        />
                        <q-input
                          label="System"
                          class="col-4"
                          v-model="coding.system"
                          type="text"
                          dense
                        />
                        <q-input
                          label="Version"
                          class="col-4"
                          v-model="coding.version"
                          type="text"
                          dense
                        />
                        <q-toggle
                          label="UserSelected"
                          class="col-4"
                          v-model.boolean="coding.userSelected"
                          toggle-indeterminate
                          dense
                        />
                      </div>
                    </q-item-section>
                    <q-btn
                      flat
                      icon="highlight_off"
                      color="grey-6"
                      @click="removeCodingFrom(currentUsageContext, cIndex)"
                    />
                  </q-item>
                  <q-btn
                    icon="add"
                    padding="none xl"
                    color="primary"
                    fab
                    label="Coding"
                    @click="addCodingTo(currentUsageContext)"
                  />
                </q-list>
                <q-btn icon="add" @click="() => (useContextLayout = false)" />
              </div>
              <div v-else-if="currentUsageContext.__type === 'quantity'">
                <cxQuantity
                  :quantity="currentUsageContext.valueQuantity"
                  v-on:addQuantity="
                    (_quantity: Quantity) => (useContextLayout = false)
                  "
                />
              </div>
              <div v-else-if="currentUsageContext.__type === 'range'">
                Low:
                <cxSimpleQuantity
                  :simpleQuantity="(currentUsageContext.valueRange.low ??= {})"
                  v-on:addSimpleQuantity="
                    (_quantity: Quantity) => (useContextLayout = false)
                  "
                />
                High:
                <cxSimpleQuantity
                  :simpleQuantity="(currentUsageContext.valueRange.high ??= {})"
                  v-on:addSimpleQuantity="
                    (_quantity: Quantity) => (useContextLayout = false)
                  "
                />
              </div>
              <div v-else-if="currentUsageContext.__type === 'reference'">
                <cxReference
                  :reference="currentUsageContext.valueReference"
                  v-on:addReference="
                    (_reference: Reference) => (useContextLayout = false)
                  "
                />
              </div>
              <div v-else>
                {{ unreachableCode(currentUsageContext) }}
              </div>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

      <!-- code -->
      <div class="q-my-md">
        <q-list padding bordered>
          <cxCode :codes="questionnaire.code" />
        </q-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getQuestionnaireExtensions } from "@/utils/extension";
import { store } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { editorTools, UnreachableError } from "@/utils/editor";
import { dateTools } from "@/utils/date";
import { resourceTypes } from "@/utils/resourceType";
import cxCode from "@/components/cxCode.vue";
import cxExtension from "@/components/cxExtension.vue";
import cxCoding from "@/components/datatypes/cxCoding.vue";
import cxContactDetail from "@/components/datatypes/cxContactDetail.vue";
import cxIdentifier from "@/components/datatypes/cxIdentifier.vue";
import cxQuantity from "@/components/datatypes/cxQuantity.vue";
import cxSimpleQuantity from "@/components/datatypes/cxSimpleQuantity.vue";
import cxReference from "@/components/datatypes/cxReference.vue";
import cxExpansionItemHeader from "@/components/helper/cxExpansionItemHeader.vue";
import cxTooltip from "@/components/helper/cxTooltip.vue";
import cxInfoExtension from "@/components/helper/cxInfoExtension.vue";
import cxInfoModifierExtension from "@/components/helper/cxInfoExtension.vue";
import cxInfoText from "@/components/helper/cxInfoText.vue";
import cxConfirmDialog from "@/components/cxConfirmDialog.vue";
import {
  Coding,
  DerivedFromExtension,
  DerivedFromExtensionValue,
  derivedFromExtensionValues,
  Extension,
  Identifier,
  narrativeStatuses,
  NarrativeStatus,
  Questionnaire,
  UsageContext,
  UseContextType,
  useContextTypes,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Quantity,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Reference,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ContactPoint,
  ContactDetail,
} from "@/types";
import { questionnaireTools } from "@/utils/questionnaire";

export default defineComponent({
  components: {
    cxCode,
    cxExtension,
    cxCoding,
    cxContactDetail,
    cxIdentifier,
    cxQuantity,
    cxSimpleQuantity,
    cxReference,
    cxExpansionItemHeader,
    cxTooltip,
    cxInfoExtension,
    cxInfoModifierExtension,
    cxInfoText,
    cxConfirmDialog,
  },
  setup() {
    const questionnaire = computed<Questionnaire>(
      () => store.getters.getQuestionnaireImportedJSON,
    );
    const currentUsageContext = ref<UsageContext | undefined>(undefined);
    const selectedCoding = ref<Coding | undefined>(undefined);
    const contact = ref<ContactDetail[]>(questionnaire.value.contact);
    return {
      contact,
      dateTools,
      editorTools,
      questionnaireTools,
      questionnaire,
      resourceTypes,
      currentUsageContext,
      selectedCoding,
      securityLayout: ref(false),
      tagLayout: ref(false),
      useContextLayout: ref(false),
      fabUseContext: ref(true),
      useContextTypes,
      derivedFromExtensionValues,
      getQuestionnaireExtensions,
      narrativeStatuses,
      confirmTextLayout: ref(false),
    };
  },
  methods: {
    generateText(): void {
      if (!this.questionnaire.text.div) {
        this.setGeneratedText();
      } else {
        this.confirmTextLayout = true;
      }
    },
    setGeneratedText() {
      const { status, div } = questionnaireTools.generateText(
        this.questionnaire,
      );
      this.textStatus = status;
      this.textDiv = div;
    },
    addEmptyId() {
      const newID: Identifier = {
        system: "",
        value: "",
        period: {
          start: "",
          end: "",
        },
        type: {
          coding: [],
          text: "",
        },
      };
      this.$store.commit("addIdentifier", newID);
    },
    removeID(indexID: number) {
      this.$store.commit("removeIdentifier", indexID);
    },
    addExtension(extension: Extension): void {
      this.$store.commit("addExtension", extension);
    },
    removeExtension(index: number): void {
      this.$store.commit("removeExtension", index);
    },
    addModifierExtension(extension: Extension): void {
      this.$store.commit("addModifierExtension", extension);
    },
    removeModifierExtension(index: number): void {
      this.$store.commit("removeModifierExtension", index);
    },
    showSecurityDialog(coding: Coding) {
      this.selectedCoding = coding;
      this.securityLayout = true;
    },
    showTagDialog(coding: Coding) {
      this.selectedCoding = coding;
      this.tagLayout = true;
    },
    getDerivedFromExtension(
      type: DerivedFromExtensionValue | null,
    ): DerivedFromExtension {
      return questionnaireTools.getDerivedFromExtension(type);
    },
    showUseContextDialog(usageContext: UsageContext) {
      this.currentUsageContext = usageContext;
      this.useContextLayout = true;
    },
    removeCodingFrom(usageContext: UsageContext, index: number) {
      if (usageContext.__type === "codeableConcept") {
        usageContext.valueCodeableConcept.coding.splice(index, 1);
      }
    },
    addCodingTo(usageContext: UsageContext) {
      if (usageContext.__type === "codeableConcept") {
        usageContext.valueCodeableConcept.coding.push({});
      }
    },
    addNewToUseContext(type: UseContextType) {
      const usageContext = questionnaireTools.getUsageContextFrom(type);
      this.$store.commit("addUseContext", usageContext);
    },
    unreachableCode(n: never) {
      throw new UnreachableError(n);
    },
  },
  computed: {
    textStatus: {
      get() {
        return this.$store.state.questionnaire.text.status;
      },
      set(value: NarrativeStatus) {
        this.$store.commit("setTextStatus", value);
      },
    },
    textDiv: {
      get() {
        return this.$store.state.questionnaire.text.div;
      },
      set(value: string) {
        this.$store.commit("setTextDiv", value);
      },
    },
    id: {
      get(): string | undefined {
        return this.$store.state.questionnaire.id;
      },
      set(value: string) {
        this.$store.commit("setId", value);
      },
    },
    versionId: {
      get(): string | undefined {
        return this.$store.state.questionnaire.meta.versionId;
      },
      set(value: string) {
        this.$store.commit("setVersionId", value);
      },
    },
    lastUpdated: {
      get(): string | undefined {
        return this.$store.state.questionnaire.meta.lastUpdated;
      },
      set(value: string) {
        this.$store.commit("setLastUpdated", value);
      },
    },
    identifier: {
      get() {
        return this.$store.state.questionnaire.identifier;
      },
      set(value: Identifier[]) {
        this.$store.commit("setIdentifier", value);
      },
    },
    source: {
      get(): string | undefined {
        return this.$store.state.questionnaire.meta.source;
      },
      set(value: string) {
        this.$store.commit("setSource", value);
      },
    },
    implicitRules: {
      get(): string | undefined {
        return this.$store.state.questionnaire.implicitRules;
      },
      set(value: string) {
        this.$store.commit("setImplicitRules", value);
      },
    },
  },
});
</script>
