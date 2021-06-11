<template>
	<div class="homeContainer">
		
		<main>

			<div class="left">
				<div class="userInfoBar">
					<div class="imgBar" :style="{backgroundImage:`url(${$store.state.user.user.user_avatar})`}">
					</div>
					<div class="name">{{$store.state.user.user.username}}</div>
				</div>
				<div class="userList">
					<div class="list">
						<div @click="goChat('world')" :class="{active: 'world' === $store.state.user.nowChatUserName}" class="userItem world">世界窗口</div>
						<div 
						@click="goChat(user.username)" 
						:class="{active: user.username === $store.state.user.nowChatUserName}" 
						class="userItem" 
						v-for="user in allUserInfo" 
						:key="user._id" 
						v-show="user.username !== username">
							<div class="headerImg" :style="{backgroundImage:`url(${user.user_avatar})`}"></div>
							<div class="name">{{user.username}}</div>
						</div>
					</div>	
				</div>
				<div class="foldBar"></div>
			</div>
			<div class="right">
				<div class="output">
					<el-tooltip class="item" effect="dark" content="退出登录" placement="top-start">
						<i @click="output" class="iconfont icon-UIsheji_menjinxitong-32"></i>
					</el-tooltip>
				</div>
				<div class="content">
					<!-- 聊天记录显示区域  -->
					<Chat :allUserMessage=allUserMessage />
				</div>
				<div class="input">
					<div class="inputContainer">
						<input type="text" v-model="inputMessage" placeholder="Type your message here...">
						<el-button @click="sendMessage" type="primary" class="button">SEND</el-button>
					</div>
				</div>
			</div>

		</main>
		
	</div>
</template>

<script>
	import BScroll from '@better-scroll/core'
	import ScrollBar from '@better-scroll/scroll-bar'
	import MouseWheel from '@better-scroll/mouse-wheel'
	import { reqOutPut, reqAllUser } from '@/api/api'
	import Chat from '@/components/Chat/Chat.vue'

	BScroll.use(ScrollBar)
	BScroll.use(MouseWheel)

    export default {
		components: {
			Chat
		},

		data () {
			return {
				inputMessage: '',
				allUserInfo: [],
				allUserMessage: [
					{
						username: 'world',
						message: []
					}
				]
			}
		},




		mounted () {
			// 实例出列表滚动条
			BScroll('.userList',{
				scrollY: true,
				stopPropagation: true,      // 事件冒泡.默认为false
				click: true,
				mouseWheel: true,
				scrollbar: {
					fade: true,
					interactive: true,
					scrollbarTrackClickable: true,
					scrollbarTrackOffsetType: 'clickedPoint' // can use 'step'
				}
			})
			// 获取用户所有数据
			this.getAllUser()
			// 发送ws请求,登录
			// this.$socket.emit('login',username)

			this.$socket.on('world',data => {
				let {addressee, type, time, message, user_avatar, user} = data
				this.allUserMessage.find(item => {
					if(item.username === data.addressee){
						item.message.push({
							type, time, message, user_avatar, user
						})
					}
				})
			})

			this.$socket.on('myMessage',data => {
				let {addressee, type, time, message, user_avatar, user} = data
				this.allUserMessage.find(item => {
					if(item.username === data.addressee){
						item.message.push({
							type, time, message, user_avatar, user
						})
					}
				})
			})

			this.$socket.on('yourMessage',data => {
				let {addressee, type, time, message, user_avatar, user} = data
				this.allUserMessage.find(item => {
					if(item.username === data.user){
						item.message.push({
							type, time, message, user_avatar, user
						})
					}
				})
			})

			this.$socket.on('successLogin', data => {
				this.allUserMessage[0].message.push({
					type: 0,
					user:data,
					time: Date.now()
				})
			})

			this.$socket.on('output', data => {
				this.allUserMessage[0].message.push({
					type: 2,
					user:data,
					time: Date.now()
				})
			})
			

		},

		computed: {
			username: {
				get : function () {
					return this.$store.state.user.user.username
				}
			}
		},

		methods: {
			output () {
				this.$confirm('是否退出当前账号?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then( async () => {
					// 发送请求更新用户的登录状态
					let result = await reqOutPut(this.$store.state.user.user.username)
					let {status,msg} = result
					if(!status){
						// 情空localstorage中的token和vuex中的数据
						localStorage.removeItem('token')
						this.$store.commit('User',{})
						this.$store.commit('Token','')											
						// 切换到login页面
						this.$router.replace('/')
					}else{
						this.$message.error(msg)
					}
				}).catch(()=>{

				})
			},

			sendMessage () {
				let { inputMessage } = this
				if(!inputMessage.trim()) return

				this.$socket.emit('sendMessage',{
					user: this.username,
					addressee: this.$store.state.user.nowChatUserName,
					type: 1,
					message: inputMessage,
					time: Date.now(),
					user_avatar: this.$store.state.user.user.user_avatar
				})
				this.inputMessage = ''
			},

			async getAllUser () {
				let result = await reqAllUser()
				let {status,data} = result
				if(!status){
					this.allUserInfo = data
					let allUserMessage = []
					data.forEach(user => {
						if(!this.allUserMessage.find(element => element === user.username)){
							allUserMessage.push({
								username: user.username,
								message: []
							})
						}
					});
					allUserMessage = this.allUserMessage.concat(allUserMessage)
					this.allUserMessage = allUserMessage
				}
			},

			goChat (username) {
				this.$store.commit('NowChatUserName',username)
			}
		},

		watch: {
			username (value) {
				if(value){
					this.$socket.emit('login',{username: this.$store.state.user.user.username})
					
				}
			}
		}
    }
</script>

<style lang="less" scoped>

	.homeContainer{
		position: absolute;
		left: 0;
		top: 0;
		z-index: 100;
		width: 100%;
		height: 100%;
		background-image: url('../../public/img/bg1.jpg');
		background-size: cover;
		min-width: 1000px;
		min-height: 700px;
		main{
			position: absolute;
			left: 0;top: 0;bottom: 0;right: 0;margin: auto;
			width: 1000px;
			height: 700px;
			background-color: rgba(0, 0, 0, 0.6);
			display: flex;
			.left{
				width: calc(30% - 10px);
				height: 100%;
				position: relative;
				.userInfoBar{
					width: 100%;
					height: 15%;
					padding: 5px 15px;
					box-sizing: border-box;
					background-color: #3b393abb;
					display: flex;
					align-items: center;
					.imgBar{
						width: 55px;
						height: 55px;
						border-radius: 50%;
						border: 3px solid white;
						background-size: cover;
					}
					.name{
						margin-left: 10px;
						font-size:20px;
						color: white;
					}
				}
				.userList{
					position: absolute;
					height: 85%;
					width: 100%;
					overflow: hidden;
					.list{
						width: 100%;
						.userItem{
							width: 100%;
							height: 70px;
							border-bottom: 1px solid #ccc;
							display: flex;
							align-items: center;
							.headerImg{
								margin-left: 20px;
								width: 40px;
								height: 40px;
								border: 2px solid white;
								border-radius: 50%;
								background-size: cover;
							}
							.name{
								margin-left: 10px;
								color: white;
								font-size: 20px;
							}
						}
						.world{
							text-align: center;
							line-height: 70px;
							width: 100%;
							height: 70px;
							border-bottom: 1px solid #ccc;
							color: white;
							font-size: 30px;
						}
						.active{
							background-color: white;
							color: #000;
							.name{
								color: #000;
							}
						}
					}
					
				}
				.foldBar{
					width: 40px;
					height: 40px;
					position: absolute;
					bottom: 0;right: -40px;
					background-image: linear-gradient(to bottom,#31302e,#535250);
					&::after{
						content: '';
						position: absolute;
						border-width:20px;
						border-style: solid;
						left: 0;
						top: 0;
						border-color: transparent;
						border-left-color: #181715;
						border-bottom-color: #181715;
					}
				}
			}
			.right{
				width: 75%;
				height: 100%;
				background-color: rgba(255, 255, 255, 0.7);
				position: absolute;
				right: -40px;
				top: -40px;
				.output{
					width: 100%;
					height: 40px;
					position: relative;
					i{
						position: absolute;
						right: 20px;
						bottom: -7px;
						font-size: 24px;
						color: white;
					}
				}
				.content{
					height: 560px;
					width: 100%;
					padding: 10px 20px;
					box-sizing: border-box;

				}
				.input{
					height: 100px;
					width: 100%;
					position: relative;
					.inputContainer{
						position: absolute;
						left: 0;top: 0;bottom: 0;right: 0;margin: auto;
						width: 90%;
						height: 70%;
						background-color: white;
						border-radius: 10px;
						padding: 10px 20px;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						input{
							outline: none;
							border: none;
							width: 80%;
							height: 50px;
							font-size: 17px;
						}
						.button{
							background-color: #5f7290;
							border-color: #5f7290;
						}
					}
				}
			}
		}
	}



</style>