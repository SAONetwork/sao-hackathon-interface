<template>
	<div>
		<transition name="dialog-fade">
			<div class="dialog" v-if="visible" @click.self="cancleDialog">
				<div class="dialoginfo">
					<img class="dialogback" src="@/assets/images/Common/dialogback.png" alt="" />
					<div class="dialogmess">
						<div class="dialoghead">
							<span>{{ title }}</span>
							<i class="el-icon-close" @click="cancleDialog"></i>
						</div>
					</div>
					<div class="dialogmain">
						<div class="profileinfo">
							<div class="profileinfo-cover"><img :src="profileInfo.Preview" alt="" /></div>
							<div class="profileinfo-details">
								<div class="profilename">{{ profileInfo.Title }}</div>
								<div class="profiledesc">{{ profileInfo.Description }}</div>
								<div class="profilebuying">
									<div class="profilebuyinfo">
										<span class="pricetitile">Price</span>
										<span class="pricenum">{{ profileInfo.Price }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div  class="buybtn">
						<ActiveBtn @onClickBtn="buynow" :btnText="SolidbtnText" :btnstyle="uploadbtnstyle"></ActiveBtn>
					</div>
				</div>
			</div>
		</transition>
		<ChangeRinkeby :visible.sync="ChangeRinkebyVisible" :title="DiaLogtitle"></ChangeRinkeby>
	</div>
	
</template>

<script>
import { getUserProfile, update, getUserDashboard } from '../api/UserApi.js';
import { fileInfos, download, cancelUpload, addFileWithPreview } from '../api/FileApi.js';
import ChangeRinkeby from '@/components/ChangeRinkeby.vue';

import config from '../libs/config.js';
import utils from '../libs/utils.js';
import ActiveBtn from './ActiveBtn';
export default {
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ''
		},
		profileInfo: {
			type: Object,
			default: () => {}
		}
	},
	components: {
		ActiveBtn,
		ChangeRinkeby
	},
	data() {
		return {
			// visible:true
			uploadbtnstyle: 'middle',
			SolidbtnText: 'BUY NOW',
			DiaLogtitle: 'Connect wallet',
			ChangeRinkebyVisible: false
		};
	},
	created() {
		console.log(this.profileInfo);
	},
	methods: {
		cancleDialog() {
			this.$emit('update:visible', false);
		},
		buynow() {
			this.$checkConnectedAndNetwork().then(({ network, connected }) => {
				this.ChangeRinkebyVisible = !network && network !== undefined;

				if (network) {
					this.$getWalletAddress().then(address => {
						if (address) {
							this.$saoloading.show('Loading', 'ball');
							this.$emit('update:visible', false);

							let currentSign = utils.getCurrentSign(address);
							if (!currentSign) {
								let signaturemessage = config.signMessage + address;
								this.$sign(signaturemessage, address)
									.then(signature => {
										let sign = {
											address,
											signaturemessage,
											signature
										};
										localStorage.setItem(config.localStorageSignKey, JSON.stringify(sign));
										utils.setSignList(sign);
										this.buy(address);
										this.$emit("successbuy", this.profileInfo);
									})
									.catch(() => {
										this.$saoloading.hide();
										this.$emit('buyingFall', this.profileInfo);
									});
							} else {
								this.buy(address);
							}
						} else {
							this.$message.error('please connect wallet');
						}
					});
				}
			});
		},
		buy(address) {
			this.$contractBuy(this.profileInfo.NftTokenId, this.profileInfo.Price * 1, address, res => {
				console.log(res);
				if (res === 4) {
					this.$saoloading.hide();
					// this.$emit("update:visible", false);
					this.$emit('successbuy', this.profileInfo);
				}
				if (res == 'error') {
					this.$saoloading.hide();
					// this.$emit("update:visible", false);
					this.$emit('buyingFall', this.profileInfo);
				}
			});
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
		.buybtn{
			position: absolute;
			right: 50px;
			bottom: 100px;
		}
		.dialogback {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}

		.dialogmess {
			position: relative;
			font-size: 16px;
			.dialoghead {
				display: flex;
				width: 100%;
				align-items: center;
				justify-content: space-between;
				color: #58ffc3;
				box-sizing: border-box;
				padding: 2px 15px;
				padding-bottom: 30px;
				font-size: 16px !important;
				.el-icon-close {
					font-weight: bold;
					cursor: pointer;
					font-size: 16px !important;
				}
			}
		}

		.dialogmain {
			// width: 100%;
			// height: 90%;
			box-sizing: border-box;
			position: relative;
			padding: 10px;
		}

		.profileinfo {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.profileinfo-cover {
			width: 120px;
			height: 120px;
			border: 2px solid #58ffc3;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.profileinfo-details {
			flex: 1;
			overflow: hidden;
			height: 120px;
			margin-left: 15px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.profilename {
				font-size: 16px;
				color: #58ffc3;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-weight: bold;
			}

			.profiledesc {
				width: 100%;
				height: 25%;
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
				position: relative;
			}
			
			.profilebuyinfo {
				display: flex;
				// align-items: center;
				flex-direction: column;
				padding-bottom: 10px;
				.pricetitile {
					font-size: 12px;
					line-height: 2em;
				}

				.pricenum {
					font-size: 18px;
					color: #58ffc3;
					font-weight: bold;
				}
			}
		}
	}
}
</style>
