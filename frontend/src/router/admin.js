import adminMiddleware from "./middleware/admin";
import User from "@/components/admin/user/Index"
import UserCard from "@/components/admin/user/UserCard"
import AdminIndex from "@/components/admin/Index"

const adminRoutes = [
    {
        path: '/admin',
        name: 'AdminIndex',
        component: AdminIndex,
        meta: {middleware: [adminMiddleware]},
        children: [
            {
                path: 'users',
                name: 'User',
                component: User,
            },
            {
                path: 'users/:id',
                name: 'UserCard',
                component: UserCard,
            }
        ]
    },
]


export default adminRoutes