<template>
  <q-splitter
    v-model="splitterModel"
    :limits="[35, 100]"
    style="height: 600px"
    after-class="bg-white"
  >
    <template v-slot:before>
      <div class="q-mb-md">
        <main-item v-bind:item="getMainItem"></main-item>
      </div>
    </template>
    <template v-slot:after>
      <div class="q-pa-md">
        <div class="text-h4 q-mb-md"><slot></slot></div>
      </div>
    </template>
  </q-splitter>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import MainItem from "./MainItem.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "MainItems",
  components: {
    MainItem,
  },
  computed: {
    ...mapGetters(["getMainItem"]),
  },
  setup() {
    return {
      splitterModel: ref(35),
    };
  },
});
</script>
