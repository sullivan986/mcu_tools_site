<script setup lang="ts">
import { NCard, NGridItem, NGrid } from 'naive-ui'
import { RouterLink } from 'vue-router'

interface Props {
    title: string
    imgsrc: string
    content: string
    routerlink: string
}

const props = defineProps<Props>()

</script>

<template>
    <router-link :to="props.routerlink">
        <n-card :title="props.title" hoverable embedded:bordered="true">
            <template #cover>
                <img :src="imgsrc">
            </template>
            {{ props.content }}
        </n-card>
    </router-link>
</template>

<style scoped>
.home-indexcard {
    padding: 20px;
}
</style>