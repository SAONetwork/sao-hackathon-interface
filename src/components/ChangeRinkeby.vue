<template>

	<transition name="dialog-fade">
		<div class="dialog" v-if="visible" @click.self="cancleDialog">
			<div class="dialoginfo">
				<div class="title">Please switch to a supported
					network (Rinkeby)</div>
					<div class="btn">
						<BorderBtn class="padingstyle" @onClickBtn="cancleDialog" :btnText='BorderbtnText' :btnstyle='uploadbtnstyle'>
						</BorderBtn>
						<ActiveBtn  class="padingstyle" @onClickBtn="changeRinkeby" :btnText='SolidbtnText' :btnstyle='uploadbtnstyle'>
						</ActiveBtn>
					</div>
			</div>
		</div>

	</transition>
</template>

<script>
	import config from "@/libs/config.js";
	import utils from "@/libs/utils.js";
	import ActiveBtn from "./ActiveBtn";
	import BorderBtn from "./BorderBtn.vue";
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			}
		},
		components:{
			ActiveBtn,BorderBtn
		},
		data() {
			return {
				BorderbtnText:"NO,THANKS",
				uploadbtnstyle:"middle",
				SolidbtnText:'SWITCH'
			};
		},
		methods: {
			cancleDialog() {
				this.$emit('update:visible', false)
			},
			changeRinkeby(){
				this.$switchNetwork();
			}
		}
	};
</script>

<style lang="less" scoped>
	.dialog {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(54px);

		.dialoginfo {
			
			width: 441px;
			height: 180px;
			display: flex;
			flex-direction: column;
			// align-items: center;
			// justify-content: center;
			position: absolute;
			left: 50%;
			top: 40%;
			border: 1px solid #68B096;
			box-sizing: border-box;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 40, 23, 0.455) 100%);
		
			transform: translate(-50%, -50%);
			.title{
				padding: 33px 86px 20PX 86px;
				width: 100%;
				box-sizing: border-box;
				text-align: center;
				line-height: 1.8em;
				color: #58FFC3;
			}
			.btn{
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.padingstyle{
				padding: 0 10px;
			}
		}
	}
</style>
