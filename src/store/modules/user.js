export default {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: {},
        nowChatUserName: '张三'
    }),
    mutations: {
        Token (state,token) {
            state.token = token
        },

        User (state,user) {
            state.user = user
        },

        NowChatUserName (state,username) {
            state.nowChatUserName = username
        }

    },
    actions: {
        setLocalAndToken ({commit},token) {
            localStorage.setItem('token',token)
            commit('Token',token)
        },
    },
    getters: {

    }
}