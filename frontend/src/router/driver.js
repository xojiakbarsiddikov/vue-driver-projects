import DriverIndex from "@/components/driver/DriverIndex"
import vCity from '@/components/driver/vCity'

const driverRoutes = [
    {
        path: '/driver',
        name: 'DriverIndex',
        component: DriverIndex,
    },
    {
        path: '/city/:id',
        name: 'vCity',
        component: vCity,
    },
]


export default driverRoutes