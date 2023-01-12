<template>
	<div>
		<div class="bigbtn" @click="onClick" v-if="btnstyle=='big'">
			<img class="btn-img" src="@/assets/images/Common/bigborderbtn.png" alt="">
			<span class="btn-text">{{btnText}}</span>
		</div>
		<div class="middlebtn" @click="onClick" v-if="btnstyle=='middle'">
			<img class="btn-img" src="@/assets/images/Common/bigborderbtn.png" alt="">
			<span class="btn-text">{{btnText}}</span>
		</div>
		<div class="smallbtn" @click="onClick" v-if="btnstyle=='small'">
			<img class="btn-img" src="@/assets/images/Common/bigborderbtn.png" alt="">
			<span class="btn-text">{{btnText}}</span>
		</div>
		<div class="otherbtn" @click="onClick" v-if="btnstyle=='other'">
			<img class="btn-img" src="@/assets/images/Common/othersbtn.png" alt="">
			<span class="btn-text">{{btnText}}</span>
		</div>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			btnstyle: {
				type: String,
				default: ''
			},
			btnText: {
				type: String,
				default: ''
			},

		},
		methods: {
			onClick() {
				this.$emit('onClickBtn')
			}
		}
	}
</script>

<style lang="less" scoped>
	.bigbtn {
		box-sizing: border-box;
		position: relative;
		font-size: 12px;
		cursor: pointer;
		width: 227px;
		height: 40px;

		.btn-img {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 1
		}

		.btn-text {
			z-index: 2;
			position: absolute;
			left: 50%;
			top: 50%;
			font-size: 14px;
			font-weight: bold;
			transform: translate(-50%, -50%);
			width: 100%;
			text-align: center;
			color: #58FFC3;
			user-select: none
		}
	}
.bigbtn:hover{
		filter: drop-shadow(0px 4px 14px #0D7852)
	}
	.middlebtn {
		box-sizing: border-box;
		position: relative;
		font-size: 12px;
		cursor: pointer;
		width: 167px;
		height: 40px;

		.btn-img {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 1
		}

		.btn-text {
			z-index: 2;
			position: absolute;
			left: 50%;
			top: 50%;
			font-size: 14px;
			font-weight: bold;
			transform: translate(-50%, -50%);
			width: 100%;
			text-align: center;
			color: #58FFC3;
			user-select: none
		}
	}
	.middlebtn:hover{
		filter: drop-shadow(0px 4px 14px #0D7852)
	}
	.smallbtn {
		box-sizing: border-box;
		position: relative;
		font-size: 12px;
		cursor: pointer;
		width: 107px;
		height: 28px;
	
		.btn-img {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 1
		}
	
		.btn-text {
			z-index: 2;
			position: absolute;
			left: 50%;
			top: 50%;
			font-size: 14px;
			font-weight: bold;
			transform: translate(-50%, -50%);
			width: 100%;
			text-align: center;
			color: #58FFC3;
			user-select: none
		}
	}
	.smallbtn:hover{
		filter: drop-shadow(0px 4px 14px #0D7852)
	}
	.otherbtn {
		box-sizing: border-box;
		position: relative;
		font-size: 12px;
		cursor: pointer;
		width: 146px;
		height: 40px;
	
		.btn-img {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 1
		}
	
		.btn-text {
			z-index: 2;
			position: absolute;
			left: 50%;
			top: 50%;
			font-size: 14px;
			transform: translate(-50%, -50%);
			width: 100%;
			text-align: center;
			color: #58FFC3;
			user-select: none
		}
	}
	.otherbtn:hover{
		filter: drop-shadow(0px 4px 14px #0D7852)
	}
</style>
