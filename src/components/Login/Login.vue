<template>
    <div class="loginContainer">
        <div class="title">登录</div>
        <div class="inputContainer">
            <i class="iconfont icon-user"></i>
            <input type="text" placeholder="用户名" v-model="username" />
        </div>
        <div class="inputContainer">
            <i class="iconfont icon-password"></i>
            <input type="password" placeholder="密码" v-model="password" />
        </div>
        <el-button @click="login" class="login" type="primary" round>登录</el-button>
    </div>
</template>

<script>
    import { reqLogin } from '@/api/api.js'
    import md5 from 'js-md5'
    export default {
        data () {
            return {
                username: '',
                password: '',
            }
        },

    

        methods: {
            async login () {
                let { username, password } = this
                // 前端验证
                if(!username.trim()){
                    this.$message.error('请输入用户名');
                    return
                }
                if(!password.trim()){
                    this.$message.error('请输入密码');
                    return
                }
                if(!(/^[\u4e00-\u9fa5]{2,4}$/.test(username))){
                    this.$message.error('用户名为中文,长度要大于2位小于5位');
                    return
                }
                if(!(/^[0-9]{8,16}$/).test(password)){
                    this.$message.error('密码长度要大于8位小于16位,并且都是数字')
                    return
                }


                // 后端验证
                let result = await reqLogin(username,md5(password))
                let { status, data, msg } = result
                if(!status){
                    this.$store.dispatch('setLocalAndToken',data.token)
                    this.$store.commit('User',data)
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    this.$router.push('/home')
                }else{
                    this.$message.error(msg)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .loginContainer{
        width: 100%;
        height: 100%;
        padding: 10px 20px;
        box-sizing: border-box;
        position: absolute;
        left: 0;top: 0;
        .title{
            text-align: center;
            font-size: 25px;
            margin-bottom: 70px;
        }
        .inputContainer{
            display: flex;
            justify-content: center;
            align-content: centerz;
            i{
                padding-top: 7px;
                font-size: 25px;
            }
            input{
                padding: 5px 10px;
                font-size: 25px;
                width: 80%;
                outline: none;
                border:none;
                background-color: transparent;
                &::placeholder{
                    font-size: 18px;
                    letter-spacing: 2px;
                    color: white;
                }
            }
        }
        .login{
            display: block;
            width: 70%;
            margin: 40px auto 0 auto;
        }
        
    }
</style>