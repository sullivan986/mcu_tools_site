<script setup lang="ts">
import XtermShell from '../components/XtermShell.vue'
import { NButton, useMessage } from 'naive-ui'

async function openSerialPort() {
    if ("serial" in navigator) {
        // console.log("The Web Serial API is supported.")
        try {
            const port = await (navigator as any).serial.requestPort()
        } catch (err) {
            message.error("err:" + err)
        }
    } else {
        message.warning("The Web Serial API is not supported.")
    }
}


</script>

<template>
    <XtermShell />
    <n-button type="info" @click="openSerialPort">
        open port
    </n-button>
</template>

<style></style>