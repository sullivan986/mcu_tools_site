<script setup lang="ts">
import { onMounted } from 'vue'
import { Terminal } from 'xterm'
import { NButton, useMessage } from 'naive-ui'

import 'xterm/css/xterm.css'

const message = useMessage()

onMounted(() => {
    const term = new Terminal()
    term.open(document.getElementById('terminal'))
})

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
    <div id="terminal"></div>
    <n-button type="info" @click="openSerialPort">
    </n-button>
</template>
<style scoped></style>