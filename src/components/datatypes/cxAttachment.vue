<template>
  <div class="q-pa-md">
    <q-file
      outlined
      v-model="uploadedFile"
      label="Choose file"
      @update:model-value="(file) => handleFileUpload(file, attachmentValue)"
      @rejected="(errors) => handleFileUploadRejected(errors)"
    />
    <q-input
      label="Title"
      class="col-4"
      v-model="attachmentValue.title"
      type="text"
      dense
    />
    <q-input
      label="ContenType"
      class="col-4"
      v-model="attachmentValue.contentType"
      type="text"
      :error="!attachmentValue.contentType && !!attachmentValue.data"
      error-message="ContentType has to be defined if data is present"
      dense
    />
    <q-input
      label="Language"
      class="col-4"
      v-model="attachmentValue.language"
      type="text"
      dense
    />
    <q-input
      label="URI"
      class="col-4"
      v-model="attachmentValue.url"
      type="text"
      dense
    />
    <div class="row justify-between">
      <q-input
        label="Shortened data"
        class="col-8"
        v-model="shortData"
        type="text"
        readonly
        dense
      />
      <q-btn
        label="Clear data"
        :disable="!shortData"
        dense
        @click="
          () => {
            attachmentValue.data = undefined;
            shortData = undefined;
          }
        "
      />
    </div>
    <q-input
      label="Size (in bytes)"
      class="col-4"
      v-model.number="attachmentValue.size"
      type="number"
      @keypress="onlyPositiveInteger"
      dense
    />
    <q-input
      label="SHA-1 Hash"
      class="col-4"
      v-model="attachmentValue.hash"
      type="text"
      dense
    />
    <div class="row justify-between">
      <cxDateTime
        inputClass="col-8"
        label="Creation"
        :value="(attachmentValue.creation ??= '')"
        v-on:update="
          (value) => {
            attachmentValue.creation = value;
            $store.commit('saveState');
          }
        "
      />
    </div>
    <q-input
      label="Height"
      class="col-4"
      v-model.number="attachmentValue.height"
      type="number"
      @keypress="onlyPositiveInteger"
      dense
    />
    <q-input
      label="Width"
      class="col-4"
      v-model.number="attachmentValue.width"
      type="number"
      @keypress="onlyPositiveInteger"
      dense
    />
    <q-input
      label="Frames"
      class="col-4"
      v-model.number="attachmentValue.frames"
      type="number"
      @keypress="onlyPositiveInteger"
      dense
    />
    <q-input
      label="Duration"
      class="col-4"
      v-model.number="attachmentValue.duration"
      type="number"
      @keypress="onlyDecimal"
      dense
    />
    <q-input
      label="Pages"
      class="col-4"
      v-model.number="attachmentValue.pages"
      type="number"
      @keypress="onlyPositiveInteger"
      dense
    />
    <q-separator />
    <q-btn class="col-4" icon="add" @click="addAttachment(attachmentValue)" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import { Attachment } from "@/types";
import { dateTools } from "@/utils/date";
import { editorTools } from "@/utils/editor";
import { useQuasar } from "quasar";
import cxDateTime from "@/components/datatypes/cxDateTime.vue";

const uploadedFile = ref<File | null | undefined>(null);

const props = defineProps<{
  attachment: Attachment;
}>();

const attachmentValue = toRef(props, "attachment");
const shortData = ref(getShortenedData(attachmentValue.value.data));

function getShortenedData(data: string | undefined): string | undefined {
  if (data === undefined || data.length < 20) {
    return data;
  } else {
    return `${data.slice(0, 15)}...`;
  }
}

function handleFileUpload(
  file: File | null | undefined,
  attachment: Attachment,
) {
  if (!file) {
    alertError("File could not be uploaded");
    return;
  }
  const reader = new FileReader();
  reader.onerror = (e) => {
    const errorMsg = JSON.stringify(e);
    alertError(`Error while reading the file: ${errorMsg}`);
  };
  reader.onload = async () => {
    const fileBuffer = reader.result as ArrayBuffer;
    const size = fileBuffer.byteLength;
    const data = base64From(fileBuffer);
    const hashBuffer = await crypto.subtle.digest("SHA-1", fileBuffer);
    const hash = base64From(hashBuffer);
    attachment.creation = dateTools.getCurrentDateTime();
    attachment.title = file.name;
    attachment.contentType = file.type;
    attachment.size = size;
    attachment.hash = hash;
    attachment.data = data;
    shortData.value = getShortenedData(data);
  };
  reader.readAsArrayBuffer(file);
}

function base64From(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let result = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return window.btoa(result);
}

function handleFileUploadRejected(
  err: { failedPropValidation: string; file: File }[],
) {
  if (err.length === 0) {
    alertError("File upload was rejected");
  } else {
    const errorMsgs = err.map((e) => e.failedPropValidation).join(",");
    alertError(`Rejected: ${errorMsgs}`);
  }
}

const emit = defineEmits<{
  (e: "addAttachment", _attachment: Attachment): void;
}>();

function addAttachment(attachment: Attachment): void {
  emit("addAttachment", attachment);
}

function onlyDecimal($event: KeyboardEvent): void {
  editorTools.onlyDecimal($event);
}

function onlyPositiveInteger($event: KeyboardEvent): void {
  editorTools.onlyPositiveInteger($event);
}

const $q = useQuasar();

function alertError(message: string): void {
  $q.notify({
    message,
    position: "top",
    type: "negative",
    progress: true,
    actions: [{ label: "Dismiss", color: "white" }],
  });
}
</script>
