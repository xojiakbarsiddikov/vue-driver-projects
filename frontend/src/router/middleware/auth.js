import {adminRoleId, driverRoleId} from "../../helper";

export default function authMiddleware ({to, next, store }){
    const user = store.getters['auth/user']
    if(!store.getters['auth/loggedIn']){
        return next({
            name: 'Login'
        })
    }
    if (to.path === '/') {
        let routerName = 'Access'
        switch (user.roleId) {
            case adminRoleId: {
                routerName = 'AdminIndex'
                break
            }
            case driverRoleId: {
                routerName = 'DriverIndex'
                break
            }
        }

        return next({
            name: routerName
        })
    }
    return next()
}