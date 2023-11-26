import 'vfonts/Lato.css'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { RouteRecordRaw, createWebHistory, createRouter } from 'vue-router'
declare module 'three';

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
    {
        path: "/robotconnect",
        component: () => import("./apps/RobotConnect.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App)
app.use(router)
app.mount('#app')
