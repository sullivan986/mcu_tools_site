<script setup lang="ts">
import { NDivider, NGrid, NGi } from 'naive-ui'
import { Scene } from 'three'

let s = Scene();

</script> 

<template>
    <n-divider>3D界面</n-divider>
    <n-grid cols="4" item-responsive>
        <n-gi span="0 400:1 600:2 800:3">
            <div class="light-green">
                1
            </div>
        </n-gi>
        <n-gi>
            <div class="green">
                1
            </div>
        </n-gi>
    </n-grid>
</template>

<style>
.light-green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
}

.green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.24);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>