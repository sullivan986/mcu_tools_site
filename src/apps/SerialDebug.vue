<script setup lang="ts">
import { NButton, useMessage, NLog, NSpace, NSelect, NDivider, NGrid, NGi, NCard } from 'naive-ui'
import { onMounted, ref, watchEffect, nextTick } from 'vue';
import { Terminal } from 'xterm'


import 'xterm/css/xterm.css'


// NMessage Tips
const message = useMessage()

// Xterm
const term = new Terminal()

// Encoder 
// sconst decoder = new TextDecoder();

// Log Tools
const logMessageRef = ref('')

// Serial Ports Data
const baudrateRef = ref(0)
var portLock = false
var nowSerialPortsRef: SerialPort

var serialReader: ReadableStreamDefaultReader<Uint8Array> | undefined
// var serialWriter: WritableStreamDefaultWriter<Uint8Array> | undefined


const baudrateOptions = [
    {
        label: "9600",
        value: 9600
    },
    {
        label: "115200",
        value: 115200
    },
    {
        label: "2000000",
        value: 2000000
    }
]

async function choiceSerialPort() {
    try {
        nowSerialPortsRef = await navigator.serial.requestPort()
        let info = nowSerialPortsRef.getInfo()
        if (('usbProductId' in info) && ('usbVendorId' in info)) {
            logString("成功打开串口, usbProductId:" + info.usbProductId + "," + " usbVendorId:" + info.usbVendorId)
        } else {
            message.error("这是一个无效的串口设备")
            logString("打开串口失败,这是一个无效的串口,请重新选择")
        }
    } catch (err) {
        message.error("err:" + err)
    }
}

function logString(str: string) {
    logMessageRef.value += ('\n' + str)
}

async function connectSerialPort() {
    if (portLock == false) {
        portLock = true

        await nowSerialPortsRef.open({ baudRate: baudrateRef.value })
        serialReader = nowSerialPortsRef.readable?.getReader()
        // serialWriter = nowSerialPortsRef.writable?.getWriter()


        while (portLock) {
            let flow = await serialReader?.read();
            if (flow?.done) {
                serialReader?.releaseLock();
                // 允许稍后关闭串口。
                break;
            }
            // value 是一个 Uint8Array
            term.write(flow?.value as any)
        }

        logString("串口已断开")
    } else {
        logString("串口已经打开,请勿重复操作")
    }
}


async function disConnectSerialPort() {
    portLock = false
    await serialReader?.cancel()
    await nowSerialPortsRef.close()
}

async function testFunc() {

}

async function testFunc1() {
    console.log('sfsadfgjksegfUILE');
}


onMounted(() => {
    if ("serial" in navigator) {
        // Serial Event 
        navigator.serial.addEventListener("connect", () => {
            logString("与串口建立连接")
        })

        navigator.serial.addEventListener("disconnect", () => {
            logString("与串口失去连接")
        });

        // Log Auto Scroll 
        watchEffect(() => {
            nextTick(() => {
            })

        })

    } else {
        message.warning("你的浏览器暂时不支持该功能,请换成 Chrome 或者 Edge 试一试.")
    }


    // xTerm
    setTimeout(() => {
        term.open(document.getElementById('terminal') as any)
    }, 60)

})

</script>
<template>
    <n-space vertical>
        <n-divider>串口输出</n-divider>
        <n-grid cols="4" item-responsive>
            <n-gi span="0 400:1 600:2 800:3" class="terminal-area">
                <div>
                    <div id="terminal"></div>
                </div>
            </n-gi>
            <n-gi class="terminal-setting">
                <n-space vertical>
                    <n-space>
                        <n-button type="info" @click="choiceSerialPort" class="choice-port">
                            选择串口
                        </n-button>
                    </n-space>
                    <n-space>
                        <n-select v-model:value="baudrateRef" placeholder="选择一个波特率" filterable tag
                            :options="baudrateOptions" />
                        <n-button type="info" @click="connectSerialPort">
                            开始连接
                        </n-button>
                    </n-space>
                    <n-space>
                        <n-card embedded hoverable>
                            <n-log :rows="12" ref="logInst" :log="logMessageRef" class="log-area">
                            </n-log>
                        </n-card>
                    </n-space>
                    <n-space>
                        <n-button type="warning" @click="disConnectSerialPort">
                            断开连接
                        </n-button>
                    </n-space>
                </n-space>
            </n-gi>
        </n-grid>
        <n-divider>可视化工具</n-divider>
        <n-space>

        </n-space>
    </n-space>
    <n-button type="info" @click="testFunc">
        test
    </n-button>
    <n-button type="info" @click="testFunc1">
        test1
    </n-button>
</template>
<style scoped>
.terminal-area {
    margin-left: 20px;
}

.terminal-setting {
    margin-left: 20px;
    margin-right: 20px;
    /*text-align: right;*/
}

.choice-port {
    width: 305px;
}

.log-area {
    width: 300px;
    max-width: 500px;
}
</style>../types/types_serial../types/types_usb