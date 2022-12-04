export default function roleMiddleware ({to, next, store }){
    const permissions = store.getters['auth/user'].permissions
    if (!permissions.includes(to.name+'.read')) {
        return next({
            path: '/access'
        })
    }
    return next();
}