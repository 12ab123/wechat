import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import store from '../store'
import { reqAutoLogin } from '../api/api'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress'

Vue.use(VueRouter)




let router = new VueRouter({
    routes
})

let reqautoLogin = async () => {
    let  result = await reqAutoLogin()
    let {status,data,msg} = result
    if(status){
        // 用户token过期或者用户已经注销账号了
        NProgress.done()
        router.push('/login').catch(err => err)
        localStorage.removeItem('token')
        Message.error(msg)
    }else{
        // 验证token成功,返回信息
        NProgress.done()
        store.commit('User',data)
    }
}

router.beforeEach((to,from,next) => {
    NProgress.start()
    // 如果是跳转至登录页面或者本身就在登录页面,不需要判断是否含有token
    if(to.path === '/login'){
        next()
    }else{
        // 判断是否含有用户信息,如果没有,说明没有登录了
        if(JSON.stringify(store.state.user.user) === '{}'){
            // 如果本地存储中有token,就说明已经登录过了,发送请求自动登录
            if(store.state.user.token){
                reqautoLogin()
                next()
            }else{
                NProgress.done()
                Message.error('请登录')
                router.replace('/login').catch(err => err)
                next()
            }
        }else{
            next()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})


export default router


