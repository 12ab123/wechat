const path = require('path')
function resolve (src) {
    return path.join(__dirname,src)
}


module.exports = {
    runtimeCompiler: true,
    lintOnSave: false,          //关闭eslint语法检查

    

    chainWebpack: (config)=>{
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
    },

    devServer: {
        proxy: {
            //匹配处理以/api开头语的请求
            "/api": {
              target: "http://localhost:3000",          //转发的目标地址
              pathRewrite: {"^/api" : ""},              //在转发请求前去除路径中的/api
              changeOrigin: true                        //支持协议名的跨域
            }
        }
    }

}