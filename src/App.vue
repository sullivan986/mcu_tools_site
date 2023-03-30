<script setup lang="ts">
import { NMessageProvider } from 'naive-ui';
import WebHeader from './components/WebHeader.vue'
import { RouterView } from 'vue-router';

</script>

<template>
  <n-message-provider>
    <WebHeader />
    <router-view />
  </n-message-provider>
</template>

<style></style>
