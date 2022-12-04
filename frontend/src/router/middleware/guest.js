export default function guestMiddleware ({ next, store }){

    if(store.getters['auth/loggedIn']){
        return next({
            path: '/'
        })
    }

    return next()
}