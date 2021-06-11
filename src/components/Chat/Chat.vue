<template>
    <div class="chatMessageScroll">
        <div class="chatMessageContainer" v-if="allUserMessage.length > 1">
            <div class="messageItem" v-for="messageItem in this.allUserMessage.find( user => user.username === nowChatUserName).message"  :key="messageItem.time">

                <div class="loginMessage" v-if="messageItem.type === 0">
                    {{messageItem.user}}于{{messageItem.time | formatTime}}进入聊天室
                </div>

                <div 
                class="chatMessage" 
                v-else-if="messageItem.type === 1"
                :class="{yourChatMessage: messageItem.user === $store.state.user.user.username}" 
                >
                    <div class="headerImg" :style="{backgroundImage:`url(${messageItem.user_avatar})`}"></div>
                    <div class="messageTitle" :class="[messageItem.user === $store.state.user.user.username ? 'myMessage' : 'yourMessage']">
                        <p>{{messageItem.message}}</p>
                    </div>
                    <div class="time">{{messageItem.time | formatTime}}</div>
                </div>

                <div class="outputMessage" v-else-if="messageItem.type === 2">
                    {{messageItem.user}}于{{messageItem.time | formatTime}}离开聊天室
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import dayjs from 'dayjs'
    import BScroll from '@better-scroll/core'
    import MouseWheel from '@better-scroll/mouse-wheel'
    BScroll.use(MouseWheel)
    export default {
        data () {
            return {
                messageInfo: []
            }
        },

        mounted () {         

            
        },

        props: {
            allUserMessage: {
                type: Array,
            }
        },

        filters: {
			formatTime (value) {
				return dayjs(value).format('h:mm a')
			}
		},

        computed: {
            
            nowChatUserName : {
                get () {
                    return this.$store.state.user.nowChatUserName
                }
            }
        },

        watch: {
            allUserMessage :{    
                    deep:true,         
                    handler: function (value) {
                        if(value.length > 1){
                            this.$nextTick(()=>{
                                this.scroll = BScroll('.chatMessageScroll',{
                                    scrollY: true,
                                    stopPropagation: true,      // 事件冒泡.默认为false
                                    click: true,
                                    mouseWheel: true,
                                    bounce:false
                                })
                            })
                        }
                        this.scroll && this.scroll.refresh()
                        this.scroll && this.scroll.scrollTo(0, this.scroll.maxScrollY)
                    }
            }
        }
    }
</script>

<style lang="less" scoped>
    .chatMessageScroll{
        overflow: hidden;
        height: 100%;
        .chatMessageContainer{
            .messageItem{
                & > div{
                    width: 100%;
                    margin-bottom: 20px;
                }
                .loginMessage{
                    width: 100%;
                    text-align: center;
                    color: green;
                    letter-spacing: 2px;
                }
                .chatMessage{
                    display: flex;
                    align-items: center;
                    .headerImg{
                        border-radius: 5px;
                        background-size: cover;
                        width: 35px;
                        height: 35px;
                        
                    }
                    .messageTitle{
                        height: 35px;
                        padding: 0 10px;
                        position: relative;
                        margin-left: 30px;
                        line-height: 35px;
                        color: black;
                        letter-spacing: 2px;
                        font-weight: 900;
                        border-radius: 5px;
                        &::after{
                            content: '';
                            width: 10px;
                            height: 10px;
                            background-color: red;
                            position: absolute;
                            left: -4px;top: 0;bottom: 0;
                            margin: auto;
                            transform: rotateZ(45deg);
                            border-radius: 3px;
                        }
                    }
                    .myMessage{
                        background-color: #75E361;
                        &::after,&::before{
                            background-color: #75E361;
                        }
                    }
                    .yourMessage{
                        background-color: white;
                        &::after,&::before{
                            background-color: white;
                        }
                    }
                    .time{
                        margin-left: 30px;
                        color: #615c58;
                    }
                }
                .yourChatMessage{
                    transform: rotateY(180deg);
                    p{
                        transform: rotateY(180deg);
                    }
                    .time{
                        transform: rotateY(180deg);
                    }
                }
                .outputMessage{
                    width: 100%;
                    text-align: center;
                    color: red;
                    letter-spacing: 2px;									
                }
            }
        }
    }
</style>