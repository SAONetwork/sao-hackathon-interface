<template>
	<div class="main">
		<header class="head">
			<!-- left icon&search -->
			<div class="head-left">
				<img @click="gotomarket" class="head-icon" src="../assets/images/Common/logo.png" alt="" />

				<div class="inputback">
					<img class="searchimg" src="@/assets/images/Market/Group630.png" alt="" />
					<el-input placeholder="Search by filename, tags, description, etc." v-model="input"></el-input>
				</div>
			</div>
			<!-- right userinfo&upload -->
			<div class="head-right">

				<div v-if="!isLogin">
					<ActiveBtn @onClickBtn="login" :btnText="btnText" :btnstyle="bigSize"></ActiveBtn>
				</div>
				<div class="loged" v-else>
					<!-- upload -->
					<div class="upload">
						<ActiveBtn @onClickBtn="gotoupload" :btnText="SolidbtnText" :btnstyle="middleSize"></ActiveBtn>
					</div>

					<div class="hollowwalletBtn" @click="checkMine">
						<img class="hollowwalletBtnback" src="../assets/images/Common/walletinfo.png" alt="" />
						<div class="mywalletinfo">
							<div class="userinfoavatar">
								<img class="walletPic" v-if='userinfo.Avatar' :src="userinfo.Avatar" alt="">
								<img class="walletPic" v-else src="@/assets/images/Profile/avatar.png" alt="">
							</div>
							<span class="walletname" v-if="userinfo.Username">{{userinfo.Username}}</span>
							<span class="walletname" v-else>{{testfile(address)}}</span>
						</div>
					</div>

				</div>
			</div>
		</header>
		<main class="content">
			<!-- <transition name="fade" mode="out-in"> -->

			<router-view />
			<!-- </transition> -->
		</main>
		<img class="backtop" src="@/assets/images/Common/bg-1.png" alt="" />
		<img class="backbtm" src="@/assets/images/Common/bg-2.png" alt="" />

		<DiaLog :visible.sync="dialogVisible" :title="DiaLogtitle"></DiaLog>
		<!-- ChangeRinkeby -->
		<ChangeRinkeby :visible.sync="ChangeRinkebyVisible" :title="DiaLogtitle"></ChangeRinkeby>
	</div>
</template>

<script>
	import {
		getUserProfile,
		update,
		getUserDashboard
	} from '@/api/UserApi.js';
	import {
		fileInfos,
		download,
		cancelUpload,
		addFileWithPreview
	} from '@/api/FileApi.js';

	import config from '@/libs/config.js';
	import utils from '@/libs/utils.js';
	import ActiveBtn from '@/components/ActiveBtn.vue';
	import HollowBtn from '@/components/HollowBtn.vue';
	import DiaLog from '@/components/DiaLog.vue';
	import ChangeRinkeby from '@/components/ChangeRinkeby.vue';

	export default {
		data() {
			return {
				input: '',
				btnText: 'CONNECT WALLET',
				bigSize: 'big',
				middleSize: 'middle',
				dialogVisible: false,
				DiaLogtitle: 'Connect wallet',
				ChangeRinkebyVisible: false,
				SolidbtnText: 'UPLOAD',
				address: '',
				isLogin: false,
				userinfo: {}
			};
		},

		components: {
			ActiveBtn,
			HollowBtn,
			DiaLog,
			ChangeRinkeby
		},
		created() {
			this.$changeWalletAddress(address => {
                if (this.$adddress != "" && address != this.$address)
                    location.reload();
			});

			this.$changeNetwork(res => {
                let currentChainId = localStorage.getItem("chainId")
                if (!currentChainId || parseInt(currentChainId) != _chainId) {
                    localStorage.setItem("chainId", _chainId + '')
                    window.location.reload()
                }
			});


		},
		filters:{
			ellipsis(value,num){
				const nums = num || '16';
				if (!value) return '';
				if (value.length > nums) {
				  return value.slice(0, nums) + '...';
				}
				return value;
			}
			
		},
		mounted() {
			this.$checkConnectedAndNetwork().then(({
				network,
				connected
			}) => {
				this.ChangeRinkebyVisible = !network && network !== undefined;

				if (connected) {
					this.$getWalletAddress().then(address => {
						this.address = address;
						this.isLogin = this.address ? true : false;

						if (address) {
							let currentSign = utils.getCurrentSign(address);
							if (!currentSign) {
								this.sign(address);
							} else {
								this.getUserInfo();
							}
						}

					});
				}
			})
		},
		methods: {
			getUserInfo() {
				getUserProfile()
					.then(res => {
						console.log(res);
						this.userinfo = res.data
					})
					.catch(response => {
						console.log(response);
					});

			},
			sign(address) {
				let signaturemessage = config.signMessage + address;
				this.$sign(signaturemessage, address).then(signature => {
					let sign = {
						address,
						signaturemessage,
						signature
					};
					localStorage.setItem(config.localStorageSignKey, JSON.stringify(sign));
					utils.setSignList(sign);
					this.getUserInfo();
				})
			},
			testfile(value) {
				const start = value.slice(0, 6);
				const end = value.slice(-6);
				return `${start}...${end}`;
			},
			login() {
				this.dialogVisible = true;
			},
			closedia(value) {
				console.log(value);

				this.dialogVisible = value;
			},
			gotoupload() {
				this.$router.push('/UpLoad');
			},
			checkMine() {
				this.$router.push('/Profile');
			},
			gotomarket() {
				this.$router.push('/Space');
			}
		}
	};
</script>

<style lang="less" scoped>
	.main {
		width: 100%;
		height: 100%;
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
		color: #63a78f;
		background: linear-gradient(180deg, #0B2519 0%, #000000 100%);
		position: relative;
		overflow: hidden;

		.head {
			width: 100%;
			height: 70px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 10px 20px;
			background: rgba(0, 0, 0, 0.5);
			z-index: 9;

			.head-left {
				display: flex;
				align-items: center;

				.inputback {
					height: 40px;
					width: 350px;
					position: relative;

					.searchimg {
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						bottom: 0;
					}
				}

				/deep/.el-input__inner {
					background: none;
					border: none;
					color: #63a78f;
					height: 40px;

					&::placeholder {
						color: #68B096;
						font-size: 12px;
						font-family: 'RobotoMono';
					}

				}

				/deep/input::-webkit-input-placeholder {
					color: #63a78f;
					font-size: 14px;
				}

				/deep/input::-webkit-input-placeholder {
					/* WebKit, Blink, Edge */
					color: #63a78f;
					font-size: 14px;
				}

				/deep/:-moz-placeholder {
					/* Mozilla Firefox 4 to 18 */
					color: #63a78f;
					font-size: 14px;
				}

				/deep/::-moz-placeholder {
					/* Mozilla Firefox 19+ */
					color: #63a78f;
					font-size: 14px;
				}

				/deep/input:-ms-input-placeholder {
					/* Internet Explorer 10-11 */
					color: #63a78f;
					font-size: 14px;
				}

				/deep/input::-ms-input-placeholder {
					/* Microsoft Edge */
					color: #63a78f;
					font-size: 14px;
				}

				.head-icon {
					width: 164px;
					height: 36px;
					margin-right: 10px;
					cursor: pointer;
				}
			}

			.head-right {
				display: flex;
				align-items: center;

				.loged {
					display: flex;
					align-items: center;

					.walletcontent {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 30px;

						img {
							width: 20px;
							height: 20px;
							margin-right: 5px;
						}

						span {
							font-size: 14px;
							color: #ffffff;
						}
					}
				}

				.wallet {
					height: 30px;
					width: 180px;
					position: relative;

					.walletback {
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						bottom: 0;
					}

					.walletinfo {
						position: absolute;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						left: 10px;
						top: 50%;
						transform: translateY(-50%);

						.walleticon {
							width: 20px;
							height: 20px;
						}
					}
				}

				.hollowwalletBtn {
					position: relative;
					margin-left: 15px;
					width: 220px;
					height: 40px;
					cursor: pointer;

					.hollowwalletBtnback {
						width: 100%;
						height: 100%;
					}

					.mywalletinfo {
						width: 100%;
						padding-left: 40px;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						display: flex;
						font-size: 14px;
						align-items: center;
						color: #ffffff;
						.userinfoavatar{
							width: 24px;
							height: 24px;
							border: 1px solid #58FFC3;
							border-radius: 50%;
							overflow: hidden;
							// box-sizing: border-box;
							margin-right: 8px;
						}
						.walletPic {
							width: 24px;
							height: 24px;
							// object-fit: cover;
						}

						.walletname {
							line-height: 21px;
							width: 145px;
							text-align: center;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}

			}
		}

		.hollowwalletBtn:hover {
			filter: drop-shadow(0px 4px 14px #0D7852)
		}

		.content {
			flex: 1;
			z-index: 9;
			box-sizing: border-box;
			overflow: hidden;

			/deep/.el-icon-loading {
				color: #58fec3;
			}

			/deep/.el-loading-text {
				color: #58fec3;
			}
		}

		.backtop {
			position: absolute;
			width: 40%;
			height: 80%;
			right: 0;
			bottom: 0;
		}

		.backbtm {
			position: absolute;
			width: 40%;
			height: 70%;
			left: 0;
			top: 0;
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
	}
</style>
