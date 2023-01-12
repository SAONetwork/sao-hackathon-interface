<template>

	<transition name="dialog-fade">
		<div class="dialog" v-if="visible" @click.self="cancleDialog">
			<div class="dialoginfo">
				<img class="dialogback" src="@/assets/images/Common/dialogback.png" alt="">
				<div class="dialogmess">
					<div class="dialoghead">
						<span>{{title}}</span>
						<i class="el-icon-close" @click="cancleDialog"></i>
					</div>
				</div>
				<div class="dialogmain">
					<div class="dialog-content">
						<p>You are deleting this {{isfile}}. Do you want to continue?</p>
					</div>
					<div class="btn">
						<BorderBtn class="padingstyle" @onClickBtn="cancleDialog" :btnText='BorderbtnText' :btnstyle='uploadbtnstyle'>
						</BorderBtn>
						<ActiveBtn  class="padingstyle" @onClickBtn="deleteFile" :btnText='SolidbtnText' :btnstyle='uploadbtnstyle'>
						</ActiveBtn>
					</div>
				</div>
				
			</div>
		</div>

	</transition>
</template>

<script>
	// import { getUserProfile, update, getUserDashboard } from "@/api/UserApi.js";
	// import {
	//   fileInfos,
	//   download,
	//   cancelUpload,
	//   addFileWithPreview
	// } from "@/api/FileApi.js";
import ActiveBtn from "./ActiveBtn";
	import BorderBtn from "./BorderBtn.vue";
	import config from "@/libs/config.js";
	import utils from "@/libs/utils.js";
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: 'Delete file'
			},
			isfile:{
				type: String,
				default: 'file'
			}
		},
		components:{
			ActiveBtn,BorderBtn
		},
		data() {
			return {
				// visible:true
				BorderbtnText:"CLOSE",
				uploadbtnstyle:"middle",
				SolidbtnText:'CONFIRM'
			};
		},
		methods: {
			deleteFile(){
				this.$emit('update:visible', false)
				this.$emit('confirmDelete')
			},
			cancleDialog() {
				this.$emit('update:visible', false)
			},
			userlogin() {
				this.$checkConnectedAndNetwork().then(res => {
					if (res) {
						this.$getWalletAddress().then(address => {
							this.walletAddress = address;
							let currentSign = utils.getCurrentSign(address);
							if (!currentSign) {
								     let signaturemessage = config.signMessage + address;
								this.$sign(signaturemessage, address).then(signature => {
									let sign = {
										address,
										signaturemessage,
										signature
									}
									localStorage.setItem(config.localStorageSignKey, JSON.stringify(sign));
									utils.setSignList(sign);
									location.reload();
								})
							}
							else {
								localStorage.setItem(config.localStorageSignKey, JSON.stringify(currentSign))
								location.reload();
							}
						});
					}
					else {
						window.open('https://metamask.io/download/', '_blank')
					}
				})
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
		// background: rgba(0, 0, 0, 0.5);
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(54px);

		// -webkit-backdrop-filter: blur(54px);
		.dialoginfo {
			// width: 35%;
			// height: 35%;
			width: 557px;
			height: 313px;
			position: absolute;
			left: 50%;
			top: 40%;
			box-sizing: border-box;
			padding: 35px 40px;
			transform: translate(-50%, -50%);

			.dialogback {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}

			.dialogmess {
				position: relative;

				.dialoghead {
					display: flex;
					width: 100%;
					align-items: center;
					justify-content: space-between;
					color: #58ffc3;
					box-sizing: border-box;
					padding: 2px 15px;

					.el-icon-close {
						font-weight: bold;
						cursor: pointer;
					}
				}
			}

			.dialogmain {
				width: 100%;
				height: 90%;
				box-sizing: border-box;
				position: relative;
				padding: 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				.dialog-content{
					width: 388px;
					font-weight: 700;
					font-size: 16px;
					line-height: 28px;
					text-align: center;
					color: #58FFC3;
					margin-top: 50px;
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
	}

	.walletinfos {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.walletdetails {
			width: 225px;
			height: 180px;
			border: 1px solid #68b096;
			cursor: pointer;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 10px;
			box-sizing: border-box;
			font-size: 14px;

			.walletbox {
				width: 58px;
				height: 58px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding-bottom: 18px;
			}

			.walleticon {
				width: 58px;
				height: 53px;
				padding-bottom: 15px;
			}

			.walleticons {
				width: 58px;
				height: 35px;
				padding-bottom: 15px;
			}
		}

		.walletdetails:hover {
			border: 1px solid #58ffc3;
			background: rgba(88, 255, 195, 0.3);
			color: #58ffc3;
		}
	}
</style>
