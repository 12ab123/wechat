

## 账号持久化存储和唯一登录的思路
```

当用户登录时
    服务器: 将账号的登录状态该为true,往nowloginurl存入当前req.headers.origin,返回用户信息
    客户端: 将用户信息存入到vuex中(token存入localstorage中),跳转至home页面,


当用户退出登录时
    服务器: 将账号的登录状态该为false,清空nowloginurl的信息
    客户端: 清空用户信息(vuex)和token(localstorage),跳转至login页面


当用户长时间无操作页面或者关闭页面时
    客户端: 发送请求退出登录
    服务器: 将账号的登录状态该为false,情空nowloginurl的信息


当用户进入非登录页面时
    判断用户是否进入登录路由,进入就不判断,如果进入其他路由,就需要验证
        验证:
            1. 判断vuex是否存在用户信息,存在就说明已经登录,不需要再登录,可以直接进入
            2. 判断localstorage是否存在token,不存在就要登录(跳转到登录页面),存在就发送请求验证token
            3. 如果token没有过期,判断账号现在是否登录
            4. 登录了就判断nowloginurl的信息和req.headers.origin是否相同,相同就返回用户信息,不相同返回用户已经在别处登录
            5. 没有登录就将登录状态改为true,将req.headers.origin存入到nowloginurl中









## 聊天逻辑
```
用户登录后
    给全局发送一个信息,信息内容为: xxx上线了








消息的格式为:
    type: 
        0: 用户登录
        1: 用户发送的信息
        2: 用户登出
    messgae:
        消息的内容
    user:
        谁发的信息
    time:
        时间
    user_avatar
        用户的头像