import Login from '@/page/Login.vue'
import Home from '@/page/Home.vue'

export default [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/',
        redirect: '/login'
    }
]