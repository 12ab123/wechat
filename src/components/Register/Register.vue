<template>
    <div class="registerContainer">
        <div class="title">注册</div>
        <div class="inputContainer">
            <i class="iconfont icon-user"></i>
            <input type="text" placeholder="用户名" v-model="username" />
        </div>
        <div class="inputContainer">
            <i class="iconfont icon-password"></i>
            <input type="password" placeholder="密码" v-model="password" />
        </div>
        <div class="selectHeadImg">
            <label for="image">选择头像</label>
            <input @change="changeImg" type="file" name="image" id="image" accept="image/*">
            <img :src="headImgSrc" alt="">
        </div>
        <el-button @click="verification" class="login" type="primary" round>注册</el-button>
    </div>
</template>

<script>
    import { reqRegister } from '@/api/api.js'
    import md5 from 'js-md5'
    import axios from 'axios'
    export default {
        data () {
            return {
                headImgSrc: 'http://localhost:3000/img/userHeader.png',
                username: '',
                password: '',
                fileInfo: {}
            }
        },

        props: {
            changeLogin: {
                type: Function
            }
        },

        methods: {
            changeImg (e) {
                if(!e.target.files[0]) return
                let img = e.target.files[0]
                this.headImgSrc = URL.createObjectURL(img)
                console.log(e.target.files[0])
                this.fileInfo ={
                    name: e.target.files[0].name,
                    type: e.target.files[0].type
                } 
            },

            async verification () {
                let { username, password, headImgSrc } = this
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

                let headImgFile = new FormData()

                // 将objectUrl转换为blob
                if(!(headImgSrc === 'http://localhost:3000/img/userHeader.png')) {
                    axios.get(this.headImgSrc,{
                        responseType: 'blob',
                    }).then((response) => {
                        console.log(1)
                        // 将blob转换为file
                        headImgFile.append('img',new window.File([response.data],this.fileInfo.name,{ type: this.fileInfo.name }))
                        headImgFile.append('username',username)
                        headImgFile.append('password',md5(password))
                        this.register(headImgFile)
                        
                    })
                }else{
                    headImgFile.append('username',username)
                    headImgFile.append('password',md5(password))
                    this.register(headImgFile)
                }
            },


            async register (info) {
                let result = await reqRegister(info)
                let { status, msg, data } = result
                if(!status){
                    this.$message({
                        message: data,
                        type: 'success'
                    });
                    this.changeLogin(true)
                }else{
                    this.$message.error(msg)
                }
            }

        }
    }
</script>

<style lang="less" scoped>
    .registerContainer{
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
        .selectHeadImg{
            margin-top: 30px;
            display: flex;
            justify-content: left;
            label{
                width: 80px;
                height: 40px;
                background-color: #ccc;
                text-align: center;
                line-height: 40px;
                color: white;
                border-radius: 20px;
                margin-left: 20px;
            }
            #image{
                display: none;
            }
            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-left: 50px;
            }
        }
        
    }
</style>