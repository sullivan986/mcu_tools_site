<script setup lang="ts">
import { NFlex, NButton, NDivider, NCard, NLog, useMessage, NSelect, NDynamicInput, MessageReactive, NButtonGroup, NInputNumber } from 'naive-ui'
import { element } from 'three/examples/jsm/nodes/Nodes.js';
import { onBeforeUnmount, ref } from 'vue';

// Log Tools
const logMessageRef = ref('')

// NMessage Tips
const message = useMessage()
let messageReactive: MessageReactive | null = null

// ble device
let device: BluetoothDevice
let control_characteristics: BluetoothRemoteGATTCharacteristic | undefined

// test loop data
let isTesting = false
let loopTaskIDgroup: number[] = []

let inputTimeMsLimit = (x: number) => x > 0
let inputOptionsValue = ref([
    {
        num1: 1,
        num2: 1000,
    }, {
        num1: 3,
        num2: 5000,
    }, {
        num1: 4,
        num2: 5000,
    },

])
let inputOptions = [
    {
        label: "前进",
        value: 1,
    },
    {
        label: "后退",
        value: 2,
    },
    {
        label: "前左转",
        value: 3,
    },
    {
        label: "前右转",
        value: 4,
    },
    {
        label: "后左转",
        value: 5,
    },
    {
        label: "后右转",
        value: 6,
    },
    {
        label: "静止",
        value: 7,
    },
]

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

async function selectDevice() {
    let options = {
        acceptAllDevices: true
        //   optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
    };
    try {
        device = await navigator.bluetooth.requestDevice(options)
        await device.gatt?.connect()
    } catch (error) {
        message.error("连接失败:" + error)
        return
    }
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

function funcSend(cmd: number) {
    console.log("cmd", cmd);
    control_characteristics?.writeValueWithoutResponse(Uint8Array.of(cmd))
}

function onNdiCreate() {
    return {
        num1: 1,
        num2: 5000
    }
}

async function sendDataEvent(state: number) {
    console.log("number:", state);
    if (state == 1) {
        carForward()
    } else if (state == 2) {
        carBack()
    } else if (state == 3) {
        carLeft()
    } else if (state == 4) {
        carRight()
    } else if (state == 5) {
        carLeftB()
    } else if (state == 6) {
        carRightB()
    } else if (state == 7) {
        carStop()
        isTesting = false
    }
}

async function sendData() {
    if (inputOptionsValue.value.length < 1) {
        message.error(
            "至少要有一个参数"
        )
        return
    }

    if (isTesting == false) {
        isTesting = true
        let sum = 0
        sendDataEvent(inputOptionsValue.value[0].num1)
        for (let index = 1; index < inputOptionsValue.value.length; index++) {
            sum = sum + inputOptionsValue.value[index - 1].num2
            loopTaskIDgroup.push(setTimeout(sendDataEvent, sum, inputOptionsValue.value[index].num1)
            )
        }
        sum = sum + inputOptionsValue.value[inputOptionsValue.value.length - 1].num2
        loopTaskIDgroup.push(setTimeout(sendDataEvent, sum, 7))
    }




    // stateMachine = 1
    // if (isTesting == false) {
    //     isTesting = true
    //     loopTaskID = setInterval(sendDataLoop, 5000)
    // }
}

async function stopSendData() {
    carStop()
    if (isTesting == true) {
        for (let index = 0; index < loopTaskIDgroup.length; index++) {
            clearTimeout(loopTaskIDgroup[index]);
        }
    }
    isTesting == false
}


async function carForward() {

    await funcSend(0x41)
}

async function carLeft() {
    await funcSend(0x48)
}

async function carRight() {
    await funcSend(0x42)
}

async function carLeftB() {
    await funcSend(0x46)
}

async function carRightB() {
    await funcSend(0x45)
}

async function carBack() {
    await funcSend(0x45)
}

async function carStop() {
    await funcSend(0x5A)
}

async function carAccelerate() {
    await funcSend(0x58)
}

async function carModerate() {
    await funcSend(0x59)
}

onBeforeUnmount(() => {
    if (messageReactive) {
        messageReactive.destroy()
        messageReactive = null
    }
})



async function testtest() {
    message.info("test")
    document.querySelector("#thisroot")?.requestFullscreen(document.documentElement); // 获取dom 
}
</script>

<template>
    <div id="thisroot">
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

            <n-flex justify="space-around">
                <n-button type="primary" @click="checkDevice">手机检查</n-button>
                <n-button type="primary" @click="selectDevice">选择设备</n-button>
                <n-button type="primary" @click="connectDevice">连接设备</n-button>
                <n-button type="error" @click="disconnectDevice">取消连接设备</n-button>
            </n-flex>
            <n-flex justify="space-around">
                <n-dynamic-input v-model:value="inputOptionsValue" :on-create="onNdiCreate">
                    <template #create-button-default>
                        添加行走参数
                    </template>
                    <template #default="{ value }">
                        <n-select v-model:value="value.num1" :options="inputOptions"
                            style="margin-right: 12px; width: 160px" />
                        <n-input-number v-model:value="value.num2" clearable :step="500" :validator="inputTimeMsLimit"
                            :precision="0">
                            <template #suffix>
                                ms
                            </template>
                        </n-input-number>
                    </template>
                </n-dynamic-input>

                <!-- <n-input-number v-model:value="inputTimeMs" clearable :step="500" :validator="inputTimeMsLimit" :precision="0">
                <template #suffix>
                    ms
                </template>
            </n-input-number> -->
            </n-flex>
            <n-flex justify=" space-around">
                <n-button type="info" @click="sendData">开始自动运行</n-button>
                <n-button type="info" @click="stopSendData">停止自动运行</n-button>
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
                    <n-button type="default" round @click="carAccelerate">
                        加速
                    </n-button>
                    <n-button type="default" round @click="carModerate">
                        减速
                    </n-button>
                </n-button-group>
                <n-button type="default" round @click="testtest">
                    测试
                </n-button>
            </n-flex>
        </n-flex>
    </div>
</template>

<style scoped>
.log-card {
    padding-left: 30px;
}

::backdrop {
    background-color: white;
}
</style>