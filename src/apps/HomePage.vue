<script setup lang="ts">
import { ref } from 'vue'
import { NGrid, NGi, useMessage } from 'naive-ui';
import IndexCard from '../components/IndexCard.vue';

const message = useMessage()

const gridItemList = ref(
    [
        {
            title: "串口调试工具",
            imgsrc: "/ch340c.jpg",
            content: "谁还没用过ch340呢",
            routerlink: "/serialdebug",
        },
        {
            title: "蓝牙调试工具",
            imgsrc: "/wch-logo.png",
            content: "或许Chrome自带蓝牙调试功能?",
            routerlink: "/bledebug",
        },
    ]
)

function goToBleDebug() {
    message.warning("还没建设好,以后也大概率鸽子(雾")
}

</script>

<template>
    <n-grid cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen">
        <n-gi v-for="Item in gridItemList" class="home-indexcard">
            <IndexCard v-bind="Item" />
        </n-gi>
    </n-grid>
</template>

<style scoped>
.home-indexcard {
    padding: 20px;
}
</style>