<template>
	<div>
		<transition name="dialog-fade">
			<div class="dialog" v-if="visible" @click.self="cancleDialog">
				<div class="dialoginfo">
					<img class="dialogback" src="@/assets/images/Common/dialogback.png" alt="">
					<div class="dialogmess">
						<div class="dialoghead">
							<span>Operation failed.</span>
							<i class="el-icon-close" @click="cancleDialog"></i>
						</div>
					</div>
					<div class="dialogmain">
						<div class="dialogcontainer">
							<div class="profileinfo">
								<img class="profileinfopic" src="@/assets/images/Common/Frame.png" alt="">
								<div>You declined the action in your wallet.</div>
							</div>
							<div class="btns">
		
								<BorderBtn class="padingstyle" @onClickBtn="cancleDialog" :btnText='BorderbtnText' :btnstyle='uploadbtnstyle'>
								</BorderBtn>
								<ActiveBtn  class="padingstyle" @onClickBtn="buynow" :btnText='SolidbtnText' :btnstyle='uploadbtnstyle'>
								</ActiveBtn>
		
							</div>
						</div>
		
					</div>
				</div>
			</div>
		</transition>
		<ChangeRinkeby :visible.sync="ChangeRinkebyVisible" :title="DiaLogtitle"></ChangeRinkeby>
	</div>
	
</template>

<script>
	import {
		getUserProfile,
		update,
		getUserDashboard
	} from "../api/UserApi.js";
	import {
		fileInfos,
		download,
		cancelUpload,
		addFileWithPreview
	} from "../api/FileApi.js";

	import config from "../libs/config.js";
	import utils from "../libs/utils.js";
	import ActiveBtn from "./ActiveBtn";
	import BorderBtn from "./BorderBtn.vue";
	import ChangeRinkeby from '@/components/ChangeRinkeby.vue';

	export default {
		props: {
			visible: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: ""
			},
			fallBuyinginfo: {
				type: Object,
				default: () => {}
			}
		},
		components: {
			ActiveBtn,
			BorderBtn,
			ChangeRinkeby
		},
		data() {
			return {
				// visible:true
				uploadbtnstyle: 'middle',
				Randombtnstyle: {
					width: "167px",
					height: "40px",
					lineHeight: '40px',
					textAlign: 'center',
					fontSize: "14px"
				},
				SolidbtnText: "TRY AGAIN",
				BorderbtnText: 'CLOSE',
				DiaLogtitle: 'Connect wallet',
				ChangeRinkebyVisible: false,
			};
		},
		created() {
			console.log(this.successBuyinginfo);
		},
		methods: {
			cancleDialog() {
				this.$emit("update:visible", false);
			},

			buynow() {
				console.log(this.fallBuyinginfo);
				this.$checkConnectedAndNetwork().then(({network, connected}) => {
					this.ChangeRinkebyVisible = !network && network !== undefined;
					
					if (network) {
						this.$getWalletAddress().then(address => {
							if (address) {
								this.$saoloading.show('Loading', 'ball');
								this.$emit("update:visible", false);
								
								let currentSign = utils.getCurrentSign(address);
								if (!currentSign) {
									let signaturemessage = config.signMessage + address;
									this.$sign(signaturemessage, address).then(signature => {
										let sign = {
											address,
											signaturemessage,
											signature
										};
										localStorage.setItem(config.localStorageSignKey, JSON.stringify(sign));
										utils.setSignList(sign);
										this.buy(address)
										this.$emit("successbuy", this.fallBuyinginfo);
									}).catch(() => {
										this.$saoloading.hide();
										this.$emit("update:visible", true);
										this.$emit("buyingFall", this.fallBuyinginfo);
									});
								}
								else {
									this.buy(address)
								}
							}
							else {
								this.$saoloading.hide();
								this.$message.error("please connect wallet");
							}
						})
					}
				})
				
			},
			buy(address) {
				this.$contractBuy(
					this.fallBuyinginfo.NftTokenId,
					this.fallBuyinginfo.Price * 1,
					address,
					res => {
						console.log(res);
						if (res === 4) {
							this.$saoloading.hide();
							// this.$emit("update:visible", false);
							this.$emit("successbuy", this.fallBuyinginfo);
						}
						if (res == "error") {
							this.$saoloading.hide();
							this.$emit("update:visible", true);
							this.$emit("buyingFall", this.fallBuyinginfo);
						}
					}
				);
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
					font-size: 16px !important;

					// padding-bottom: 30px;
					.el-icon-close {
						font-weight: bold;
						cursor: pointer;
						font-size: 16px !important;
					}
				}
			}

			.dialogmain {
				width: 100%;
				height: 90%;
				box-sizing: border-box;
				position: relative;
				padding: 10px;
			}

			.dialogcontainer {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
			}

			.btns {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.padingstyle{
					padding: 0 10px;
				}
			}

			.Rectangle {
				width: 200px;
				height: 65px;
				position: relative;
				cursor: pointer;

				img {
					width: 100%;
					height: 100%;
				}

				span {
					position: absolute;
					top: 45%;
					left: 50%;
					font-size: 14px;
					transform: translate(-50%, -50%)
				}
			}

			.profileinfo {
				width: 100%;
				height: 150px;
				padding: 35px;
				margin: 10px 0;
				// margin-bottom: 10px;
				box-sizing: border-box;
				background: rgba(88, 255, 195, 0.1);
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-direction: column;
				font-size: 16px;
				color: #58ffc3
			}
			
			.profileinfopic {
				width: 40px;
				height: 40px;
			}

			.profileinfo-cover {
				width: 80px;
				height: 80px;
				border: 2px solid #58ffc3;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.profileinfo-details {
				flex: 1;
				overflow: hidden;
				height: 80px;
				margin-left: 15px;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;

				.profilename {
					font-size: 16px;
					color: #58ffc3;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.profiledesc {
					width: 100%;
					height: 35%;
					padding: 10px 0;
					color: #57b196;
					font-size: 14px;
					line-height: 1.3em;
					display: -webkit-box;
					overflow: hidden; 
					word-break: break-all; 
					text-overflow: ellipsis; 
					-webkit-box-orient: vertical; 
					-webkit-line-clamp: 2; 
					white-space: pre-line;
				}

				.profilebuying {
					display: flex;
					// align-items: center;
					align-items: flex-end;
					justify-content: space-between;
				}

				.profilebuyinfo {
					display: flex;
					// align-items: center;
					flex-direction: column;

					.pricetitile {
						font-size: 12px;
						line-height: 2em;
					}

					.pricenum {
						font-size: 18px;
						color: #58ffc3;
					}
				}
			}
		}

		.btn {
			width: 200px;
			height: 48px;
			box-sizing: border-box;
			// padding: 20px 100px;
			position: relative;
			font-size: 12px;
			cursor: pointer;

			.btn-img {
				position: absolute;
				width: 100%;
				height: 140%;
				left: 0;
				bottom: -10px;
				z-index: 1
			}

			.btn-text {
				z-index: 2;
				position: absolute;
				left: 50%;
				top: 40%;
				font-size: 14px;
				transform: translate(-50%, -50%);
				width: 100%;
				text-align: center;
				color: #001e13;
				font-weight: bold;
				user-select: none
			}
		}

		.btn :hover {
			color: #ffffff
		}
	}
</style>
