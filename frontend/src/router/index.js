import {createRouter, createWebHashHistory} from 'vue-router';
import Login from "@/components/auth/Login";
import authMiddleware from "@/router/middleware/auth";
import guestMiddleware from "@/router/middleware/guest";
import store from "../store";
import middlewarePipeline from "@/router/middlewarePipeline";
import App from '@/App.vue';

import Access from "@/pages/Access"
import adminRoutes from "./admin";
import {otherRoutes} from "./other";
import driverRoutes from "./driver";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {middleware: [guestMiddleware]}
    },
    {
        path: '/',
        name: '/',
        component: App,
        meta: {middleware: [authMiddleware]},
        children: [...adminRoutes, ...otherRoutes, ...driverRoutes]
    },
    {
        path: '/access',
        name: 'Access',
        component: Access
    },
    {
        path: "/:catchAll(.*)",
        redirect: '/404'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    linkActiveClass: "active",
    routes,
});

router.beforeEach((to, from, next) => {
    if (!to.meta.middleware) {
        return next()
    }
    const middleware = to.meta.middleware
    const context = {
        to,
        from,
        next,
        store
    }

    return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1)
    })
})

export default router;
