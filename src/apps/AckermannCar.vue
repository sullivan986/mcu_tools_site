<script setup lang="ts">
import { NFlex, NButton, NDivider, NCard, NLog, useMessage, LogInst, MessageReactive, NButtonGroup } from 'naive-ui'
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Log Tools
const logMessageRef = ref('')
const logInstRef = ref<LogInst | null>(null)

// NMessage Tips
const message = useMessage()
let messageReactive: MessageReactive | null = null

// ble device
let device: BluetoothDevice
let control_characteristics: BluetoothRemoteGATTCharacteristic | undefined

// test loop data
let loopTaskID: number
let stateMachine = 0
let isTesting = false

async function logString(str: string) {
    logMessageRef.value += ('\n' + str)
}


async function checkDevice() {
    navigator.bluetooth.getAvailability().then((available) => {
        if (available) {
            message.success(
                "你的浏览器支持蓝牙"
            )
        } else {
            message.error(
                "你的浏览器不支持蓝牙"
            )
        }
    });
}

async function connectDevice() {
    message.loading(
        "正在连接小车"
    )

    let options = {
        filters: [
            { name: "BT04-A" }
        ],
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
    };
    try {
        device = await navigator.bluetooth.requestDevice(options)
        await device.gatt?.connect()
    } catch (error) {
        message.error("连接失败:" + error)
        return
    }

    let control_service = await device.gatt?.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb')
    control_characteristics = await control_service?.getCharacteristic('0000ffe2-0000-1000-8000-00805f9b34fb')
    message.success(
        "连接成功！"
    )
}

async function disconnectDevice() {
    device.gatt?.disconnect();
}

async function sendDataLoop() {
    console.log(stateMachine);
    if (stateMachine == 1) {
        await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x41))
        stateMachine++
    } else if (stateMachine == 2) {
        await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x42))
        stateMachine++
    } else if (stateMachine == 3) {
        await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x48))
        stateMachine++
    } else if (stateMachine == 4) {
        await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x41))
        stateMachine++
    } else if (stateMachine == 5) {
        await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x5A))
        stateMachine = 0
        clearInterval(loopTaskID);
        isTesting = false
        if (messageReactive) {
            messageReactive.destroy()
            messageReactive = null
        }
    }
}

async function sendData() {
    stateMachine = 1
    if (isTesting == false) {
        isTesting = true
        loopTaskID = setInterval(sendDataLoop, 5000)
    }
}

async function stopSendData() {
    if (isTesting == true) {
        clearInterval(loopTaskID);
    }
    await carStop()
}


async function carForward() {
    await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x41))
}

async function carLeft() {
    await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x47))
}

async function carRight() {
    await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x43))
}

async function carBack() {
    await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x45))
}

async function carStop() {
    await control_characteristics?.writeValueWithoutResponse(Uint8Array.of(0x5A))
}


onBeforeUnmount(() => {
    if (messageReactive) {
        messageReactive.destroy()
        messageReactive = null
    }
})

</script>

<template>
    <n-flex vertical>
        <n-divider title-placement="left">
            状态
        </n-divider>
        <n-card embedded hoverable class="log-card">
            <n-log :rows="12" ref="logInst" :log="logMessageRef" class="log-area">
            </n-log>
        </n-card>

        <n-divider title-placement="left">
            控制
        </n-divider>
        <n-flex justify="space-around" class="the-flex">
            <n-button type="primary" @click="checkDevice">手机检查</n-button>
            <n-button type="primary" @click="connectDevice">连接设备</n-button>
            <n-button type="error" @click="disconnectDevice">取消连接设备</n-button>
            <n-button type="info" @click="sendData">开始测试</n-button>
            <n-button type="info" @click="stopSendData">停止测试</n-button>
        </n-flex>

        <n-flex justify="space-around">
            <n-button-group size="large">
                <n-button type="default" @click="carLeft" round>
                    左转
                </n-button>
                <n-button type="default" @click="carForward">
                    前进
                </n-button>
                <n-button type="error" @click="carStop">
                    停止
                </n-button>
                <n-button type="default" @click="carBack">
                    后退
                </n-button>
                <n-button type="default" @click="carRight" round>
                    右转
                </n-button>
            </n-button-group>
            <n-button-group size="large">
                <n-button type="default" round>
                    加速
                </n-button>
                <n-button type="default" round>
                    减速
                </n-button>
            </n-button-group>
        </n-flex>
    </n-flex>
</template>

<style scoped>
.log-card {
    padding-left: 30px;
}
</style>