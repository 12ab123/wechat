import Axios from 'axios'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'

const axios = Axios.create({
    baseURL: '/api',
    timeout: 50000,
   
})


axios.interceptors.request.use(
    function (config) {
        Nprogress.start()
        if(!config.headers.isHaveToken){
            config.headers.Authorization = store.state.user.token
        }
        return config
    },
    function (error) {
        // return Promise.reject(error)
        console.log(error)
    }
)

axios.interceptors.response.use(
    response => {
        Nprogress.done()
        return Promise.resolve(response.data)
    },
    error => {
        Nprogress.done()
        return Promise.reject(error)
    }
)

export default axios