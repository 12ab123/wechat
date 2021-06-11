import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import animated from 'animate.css'
import socketio from 'socket.io-client'



import { Button, Message,Tooltip,MessageBox } from 'element-ui'
Vue.use(Button)
Vue.use(Tooltip)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm;


Vue.use(animated)


Vue.prototype.$socket = socketio('http://localhost:3000', {
  transports: ['websocket'],
})



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
