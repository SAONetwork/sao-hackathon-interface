<template>
	<div>
	<div class="bigone" @click="onClick" :style="btnstyle" v-if="btnSize=='big'">
		<img src="@/assets/images/Common/largehollowbtn.png" alt="">
		<div slot="btncontent" class="btncontent">
			<slot name="btncontent">
	
			</slot>
		</div>
		
	</div>
	<div class="smallone" @click="onClick" :style="btnstyle" v-if="btnSize=='small'">
		<img src="@/assets/images/Common/hollowbtn.png" alt="">
		<div slot="btncontent" class="btncontent">
			<slot name="btncontent">
	
			</slot>
		</div>
		
	</div>
	</div>
</template>

<script>
	export default {
		props: {
			btnstyle: {
				type: Object,
				default: () => {}
			},
			btnSize: {
				type: String,
				default: ''
			},
		},

		methods: {
			onClick() {
				this.$emit("BHoBtn");
			}
		}
	};
</script>

<style lang="less" scoped>
	.smallone {
		height: 27px;
		width: 102px;
		position: relative;
		font-size: 12px;
		cursor: pointer;
		background: transparent;
		img{
			width: 102px;
			height: 27px;
			
		}
		
	}
	.smallone:hover{
		filter: drop-shadow(0px 4px 14px #0D7852)
	}
	.btncontent {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		width: 100%;
		height: 100%;
		font-size: 12px !important;
	}
	.bigone{
		width: 226px;
		height: 28px;
		position: relative;
		font-size: 12px;
		cursor: pointer;
		background: transparent;
		img{
			width: 226px;
			height: 28px;
			
		}
		
	}
	.bigone:hover{
		filter: drop-shadow(0px 4px 14px #0D7852)
	}
</style>
