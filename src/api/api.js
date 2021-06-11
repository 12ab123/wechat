import axios from './index'


export const reqLogin = (username,password) => axios.post('/login',{ 
    username,
    password
},{
    headers: {
        isHaveToken:true
    }
})

// 传入formdata参数
export const reqRegister = (file) => axios.post('/register',file,{
    headers:{'Content-Type':'multipart/form-data',isHaveToken:true}
})



// 自动登录
export const reqAutoLogin = () => axios.post('/autoLogin')


// 退出登录
export const reqOutPut = (username) => axios.post('/output',{username})


//  获取用户所有信息
export const reqAllUser = () => axios.post('/allUser')
 
