import 'vfonts/Lato.css'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { RouteRecordRaw, createWebHistory, createRouter } from 'vue-router'
import { useMessage } from 'naive-ui'


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: () => import("./apps/HomePage.vue"),
    },
    {
        path: "/serialdebug",
        component: () => import("./apps/SerialDebug.vue"),
    },
    {
        path: "/bledebug",
        component: () => import("./apps/BleDebug.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App)
app.use(router)
app.mount('#app')
