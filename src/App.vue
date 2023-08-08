<template>
  <q-layout view="hHh LpR lfr">
    <q-header class="text-black bg-white">
      <cx-navbar></cx-navbar>
    </q-header>
    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import cxNavbar from "@/components/cxNavbar.vue";
import { RouterView } from "vue-router";
</script>
