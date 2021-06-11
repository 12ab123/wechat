<template>
    <div class="container">
        <header>聊天室</header>
        <main class=" animate__animated  animate__fadeIn">
            <transition enter-active-class="animate__animated  animate__fadeIn">
                <!-- 登录页面 -->
                <Login :changeLogin=changeLogin  v-if="showLogin"/>
            </transition>
            <transition enter-active-class="animate__animated  animate__fadeIn">
                <!-- 注册页面 -->
                <Register :changeLogin=changeLogin  v-if="!showLogin"/>
            </transition>
            <button class="changeLoginState" @click="changeLogin(!showLogin)">
                {{showLogin ? '跳转至注册' : '跳转至登录'}}
            </button>
        </main>

    </div>
</template>

<script>
    import Login from '@/components/Login/Login.vue'
    import Register from '@/components/Register/Register.vue'

    export default {
        data () {
            return {
                showLogin: true
            }
        },

        components: {
            Login,
            Register
        },

        methods: {
            changeLogin (isLogin) {
                this.showLogin = isLogin
            }
        }
    }
</script>

<style lang="less" scoped>
    .container{
        width: 100%;
        height: 100%;
        position: absolute;
        overflow: hidden;
        background-image: url('../../public/img/bg2.jpg');
        background-size: cover;
        z-index: 1;
        &::after{
            content: '';
            position: absolute;
            // left: 0;bottom: 0;right: 0;top: 0;margin: auto;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            filter: blur(5px);
            background: inherit;
            z-index: 2;
        }
        header{
            position: absolute;
            width: 100%;
            text-align: center;
            margin: 50px auto;
            display: block;
            z-index: 13;
            font-size: 50px;
            letter-spacing: 2px;
            font-weight: 900;
            color: white;
            font-style: oblique 90deg;
        }
        main{
            width: 520px;
            height: 380px;
            position: absolute;
            left: 0;top: 0;bottom: 0;right: 0;margin: auto;
            background-color: rgba(160,179,207,0.6);
            border-radius: 50px;
            z-index: 13;
            animation-duration: 1.5s;
            box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);

            .changeLoginState{
                position: absolute;
                right: 20px;
                top: 20px;
                font-size: 15px;
                letter-spacing: 2px;
                color: white;
                border: none;
                outline: none;
                background-color: transparent;
            }        
        }
        
    }
</style>