<template>
  	<div id="app" @click="Interval">
    	<router-view></router-view>
  	</div>
</template>

<script>
	import { reqOutPut, a } from '@/api/api'
	export default {
		data () {
			return {
				// 上一次点击时间
				lastTime: new Date().getTime() ,
				// 当前时间
				currentTime: new Date().getTime(),
				// 超时时间, 如果半个小时都没有点击页面就算超时
				sys_timeout: 20* 1000,
				// 检查的时间，每隔5分钟检查一次有没有超时
				check_time: 1000,
				// 计时器
				whole_timer: null
			}
		},

		mounted () {
			this.exceedOutPut()
		},



		methods: {
			Interval () {
				clearInterval(this.whole_timer)
				this.lastTime =  new Date().getTime() 
				this.currentTime = new Date().getTime()
				this.exceedOutPut()
			},

			async exceedOutPut () {
				this.whole_timer = setInterval(()=>{
					this.currentTime +=  this.check_time
					if(this.currentTime - this.lastTime >= this.sys_timeout){
						this.output()
						clearInterval(this.whole_timer)
					}
				},this.check_time)
			},

			async output  () {
				let result = await reqOutPut(this.$store.state.user.user.username)
				let {status , msg} = result
				if(status){
					this.$message.error(msg)
				}
			},
		},

	
	}
</script>

<style lang="less" scoped>
  #app{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
