import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import("@views/Home/Home.vue"),
        meta: {
            requireAuth: true,
        },
    },
    {
        path: "/home",
        component: () => import("@views/Home/Home.vue"),
        meta: {
            requireAuth: true,
        },
    },
    {
        path: "/home2",
        component: () => import("@views/Home/Home2.vue"),
        meta: {
            requireAuth: true,
        },
    },

    {
        path: "/webgl",
        component: () => import("@views/WebGL/WebGL.vue"),
        meta: {
            requireAuth: true,
        },
    },
];


export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
