<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton } from 'naive-ui'
import SerialDebug from '../apps/SerialDebug.vue'

defineProps<{ msg: string }>()

const count = ref(0)

let newVariable: any;

newVariable = window.navigator;

async function openSerialPort() {
  if ("serial" in navigator) {
    console.log("The Web Serial API is supported.")
    try {
      const port = await (navigator as any).serial.requestPort()
      console.log(port)
    } catch (err) {
      window.confirm("err:" + err)
    }
  } else {
    console.warn("The Web Serial API is not supported.")
  }
}

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <n-button @click="openSerialPort">Connect</n-button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
