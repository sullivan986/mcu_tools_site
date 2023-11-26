<script setup lang="ts">
import { NAvatar, NButton, NPageHeader } from 'naive-ui';
import { RouterLink } from 'vue-router'


</script>

<template>
    <n-page-header title="Sullivan的工具小站" subtitle="一些简单的嵌入式调试工具" class="home-pageheader">
        <template #avatar>
            <router-link to="/">
                <n-avatar class="home-headavatar" src="/header-avatar.svg" size="large" />
            </router-link>
        </template>
        <template #extra>
            <n-button text tag="a" href="https://sullivan986.github.io/" target="_blank">
                博客首页
            </n-button>
        </template>
    </n-page-header>
</template>

<style scoped>
.home-pageheader {
    padding: 10px;
    background-color: whitesmoke;
}

.home-headavatar {
    background-color: transparent;
}
</style>