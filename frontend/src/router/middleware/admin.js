import {adminRoleId} from "../../helper";

export default function adminMiddleware ({ next, store }){
    if(!store.getters['auth/loggedIn']){
        return next({
            name: 'Login'
        })
    }

    const roleId = store.getters['auth/user'].roleId
    if (roleId !== adminRoleId) {
        return next({
            path: '/access'
        })
    }
    return next();
}