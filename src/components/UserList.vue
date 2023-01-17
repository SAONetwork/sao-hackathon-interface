<template>
	
		<div class="userlist">
			<div  v-for="(item,index) in userlist" :key="item.id">
				<div class="user-outside" @click='gotoOtherProfile(item)'>
					<div class="userinfo">
						<div class="user-left">
							<img class="Avatar" :src="item.Avatar?item.Avatar:avatar" alt="">
						</div>
						<div class="user-right">
							<div class="username">
								{{item.Username}}
							</div>
							<div>
								<p>{{item.TotalUploads}} files</p>
								<p>{{item.TotalCollections}} Collection</p>
								<p></p>
							</div>
						</div>
					</div>
				</div>
				
			</div>
			
		</div>
</template>

<script>
	import utils from '../libs/utils.js'
	export default{
		props: {
			userlist: {
				type: Array,
				default: () => []
			},
			
		},
		data(){
			return{
				avatar:require("../../src/assets/images/Profile/avatar.png")
			}
		},
		methods:{
			gotoOtherProfile(item){
				
				let address=utils.getUser().EthAddr.toLowerCase()
				if(address!==item.EthAddr.toLowerCase()){
					let routeData = this.$router.resolve({
						path: 'OtherProfile',
						query: {
							address: item.EthAddr
						}
					})
					window.open(routeData.href, '_blank');
				}else{
					let routeData = this.$router.resolve({
						path: 'Profile'
					})
					window.open(routeData.href, '_blank');
					
				}
				
				
				// this.$router.push('/OtherProfile')
			}
		}
	}
</script>

<style scoped lang="less">
	.userlist{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	.user-outside{
		width: 300px;
		height: 150px;
		background: #0E2C1E;
		border: 1px solid #164D39;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 17px;
		cursor: pointer;
	}
	.user-outside:hover{
		border: 1px solid #58FFC3;
	}
	.userinfo{
		width: 292px;
		height: 142px;
		background: linear-gradient(180deg, #0B2418 0%, #030F0A 100%);
		border: 1px solid #68B096;
		padding: 20px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		.user-left{
			width: 100px;
			height: 100px;
			border: 1px solid #68B096;
			.Avatar{
				width: 100px;
				height: 100px;
			}
		}
		.user-right{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
			height: 100px;
			margin-left: 18px;
			font-weight: 700;
			font-size: 12px;
			line-height: 16px;
			
			color: #58FFC3;
			.username{
				width: 130px;
				font-weight: 700;
				font-size: 16px;
				line-height: 21px;
				color: #58FFC3;
				word-break: break-all;
				// overflow: hidden;
				// text-overflow:ellipsis;
				// white-space: nowrap;
			}
		}
	}
	
	
</style>