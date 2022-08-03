<template>
	<el-scrollbar>
		<div class="musicfile">
			<div class="musicplayer">
				<div v-if="islogin==true">
					<div v-if="fileParams.AlreadyPaid==false && fileParams.Price*1>0">

						<div class="musiccover" v-if="fileParams.EthAddr.toLowerCase() == address">
							<audio ref="audio" id="music" @ended="finishMusic">

							</audio>
							<img class="musicpreview" :src="fileParams.Preview" alt="">
							<div class="pauseicon" v-show="musicPlay" @click="pauseMusic">
								<img class="playmusicicon" src="../../assets/images/Common/playing.png" alt="">
							</div>
							<div class="playicon" @click="playMusic" v-show="!musicPlay">
								<img class="playmusicicon" src="../../assets/images/Common/pause.png" alt="">
								</div>
					</div>
						<div class="musiccover" v-else>

							<img class="musicpreview" :src="fileParams.Preview" alt="">

						</div>
					</div>

					<div class="musiccover" v-else>
						<audio ref="audio" id="music" @ended="finishMusic">

						</audio>
						<img class="musicpreview" :src="fileParams.Preview" alt="">
						<div class="pauseicon" v-show="musicPlay" @click="pauseMusic">
							<img class="playmusicicon" src="../../assets/images/Common/playing.png" alt="">
						</div>
						<div class="playicon" @click="playMusic" v-show="!musicPlay">
							<img class="playmusicicon" src="../../assets/images/Common/pause.png" alt="">
						</div>
					</div>
				</div>
				<div v-if="islogin==false">
					<div class="musiccover">
					
						<img class="musicpreview" :src="fileParams.Preview" alt="">
					
					</div>
				</div>
				<div class="gaps">

				</div>
				<div class="musicinfo">
					<div class="musictitle">
						<img src="../../assets/images/Market/musicicon.png" class="musicicon" alt="">
						<span class="musicname">{{fileParams.Title}}</span>
					</div>
					<div class="filemessage">
						<span class="fileEthAddr infostyle">{{testfile(fileParams.EthAddr)}}</span>
						<div class="gap"></div>
						<span class="infostyle"> Uploaded at&nbsp;{{fileParams.CreatedAt}}</span>
						<div class="gap"></div>
						<span class="infostyle">{{fileParams.FileCategory}}</span>
						<div class="gap"></div>
						<span class="infostyle">{{fileParams.FileExtension.toUpperCase()}}</span>
						<div class="gap"></div>
						<span class="infostyle">{{fileParams.fileSize}}</span>
						<div class="gap" v-show="fileParams.fileTime != ''"></div>
						<span class="infostyle">{{fileParams.fileTime}}</span>
					</div>
				</div>
			</div>
			<div class="filedesc">
				{{fileParams.Description}}
			</div>
			<div class="ipfsandcointitle">
				<span> Ipfs Pinned:&nbsp;</span> <span class="ipfsandcoin">{{fileParams.IpfsHash}}</span>
			</div>
			<div class="filelabels">
				<span class="tagstyle" v-for="(v,i) in fileParams.Labels" :key="i">{{v}}</span>
			</div>
			<div class="btns">
				<div v-if="islogin==true">
					<div class="nobuy" v-if="fileParams.Price>0 && fileParams.AlreadyPaid==false">
						<div v-if="fileParams.EthAddr.toLowerCase() == address">
							<ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize">
							</ActiveBtn>
						</div>

						<ActiveBtn @onClickBtn="buyprofile" :btnText="paynowbtnText" :btnstyle="middleSize" v-else>
						</ActiveBtn>
						<div class="price">{{fileParams.Price}} ETH</div>

					</div>
					<div class="nobuy" v-if="fileParams.Price>0 && fileParams.AlreadyPaid==true">

						<!-- <ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize">
						</ActiveBtn> -->
						<div class="price"> paid {{fileParams.Price}} ETH</div>
					</div>
					<div class="nobuy" v-if="fileParams.Price==0">

						<ActiveBtn v-if="fileParams.EthAddr.toLowerCase() == address" @onClickBtn="gotodownload"
							:btnText="SolidbtnText" :btnstyle="middleSize">
						</ActiveBtn>
					</div>
				</div>
				<div class="nofilebord" v-if="islogin==false">
					<!-- <ActiveBtn v-if="islogin==false" @onClickBtn="login" :btnText='btnText' :btnstyle='bigSize'></ActiveBtn> -->

				</div>
				<div class="leftboard">
					<div class="boardicon"><img class="leftboardicon" src="@/assets/images/Common/star.png" alt="">
						<span>10</span>
					</div>
					<div class="boardicon"><img class="commenticon" src="@/assets/images/Common/comment.png" alt="">
						<span>10</span>
					</div>
					<div class="shareicon"><img class="leftshareicon" src="@/assets/images/Common/share.png" alt="">

					</div>
				</div>
			</div>
			<div class="changetab">
				<div :class="tabNumber==1?'tabActive singletab':'singletab'" @click="showtabs(1)">
					<span>Comments(210)</span>
					<div v-if="tabNumber==1" class="activeBar"></div>
				</div>
				<div :class="tabNumber==2?'tabActive singletab':'singletab'" @click="showtabs(2)">
					<span>Collection list(12)</span>
					<div v-if="tabNumber==2" class="activeBar"></div>
				</div>
			</div>
			<div class="Comments" v-show="tabNumber==1">
				<Comment></Comment>
			</div>
			<div class="Collection" v-show="tabNumber==2">
				<Favorites></Favorites>
			</div>
		</div>
		<DiaLog :visible.sync="dialogVisible" :title="DiaLogtitle">

		</DiaLog>

		<BuyDiaLog :visible.sync="buyDialogVisible" @successbuy='successbuy' @buyingFall='buyingFall'
			:title="BuyDiaLogtitle" :profileInfo='buyinginfo'></BuyDiaLog>
		<SuccessDiaLog :visible.sync="successVisible" :title="BuySuccesstitle" :successBuyinginfo='successBuyinginfo'>
		</SuccessDiaLog>
		<FallDiaLog :visible.sync="fallVisible" :fallBuyinginfo='fallBuyinginfo' @successbuy='successbuy'></FallDiaLog>
	</el-scrollbar>
</template>

<script>
	import {
		fileDetails,
		download
	} from '../../api/FileApi.js'
	import utils from '../../libs/utils.js'
	import ActiveBtn from '../../components/ActiveBtn.vue'
	import Comment from '../../components/Comment.vue'
	import Favorites from '../../components/Favorites.vue'
	import moment from 'moment'
	import DiaLog from "@/components/DiaLog.vue"
	import BuyDiaLog from "@/components/BuyDiaLog.vue"
	import SuccessDiaLog from "@/components/SuccessDiaLog.vue"
	import FallDiaLog from "@/components/FallDiaLog.vue"
	export default {
		data() {
			return {
				dialogVisible: false,
				DiaLogtitle: "Connect wallet",
				buyDialogVisible: false,
				BuyDiaLogtitle: "Checkout",
				fallVisible: false,
				buyinginfo: {},
				successBuyinginfo: {},
				fallBuyinginfo: {},
				BuySuccesstitle: "Congratulations, purchase success!",
				successVisible: false,

				islogin: false,
				bigSize: 'big',
				btnText: 'CONNECT WALLET',

				musicPlay: false,
				fileParams: {},
				tabNumber: 1,
				SolidbtnText: 'Download',
				paynowbtnText: 'BUY NOW',
				middleSize: 'middle',
				fileId: '',
				address: ''
			}
		},
		components: {
			ActiveBtn,
			Comment,
			Favorites,
			DiaLog,
			BuyDiaLog,
			SuccessDiaLog,
			FallDiaLog
		},
		created() {
			this.$saoloading.show('Loading', 'ball');
			this.fileId = this.$route.query.id
			this.getfiledetails()
			this.getMusicUrl()
			this.$checkConnectedAndNetwork().then(({
				network,
				connected
			}) => {

				if (connected) {
					this.$getWalletAddress().then(address => {
						this.address = address;
						this.islogin = this.address ? true : false;
					});
				}
			})
		},
		mounted() {
			// this.$checkConnectedAndNetwork().then(({
			// 	network,
			// 	connected
			// }) => {

			// 	if (connected) {
			// 		this.$getWalletAddress().then(address => {
			// 			this.address = address;
			// 			this.islogin = this.address ? true : false;
			// 		});
			// 	}
			// })
		},
		methods: {
			finishMusic() {
				this.musicPlay = false
			},
			login() {
				this.dialogVisible = true;
			},
			buyprofile() {
				this.buyDialogVisible = true;
				this.buyinginfo = this.fileParams;
			},
			successbuy() {
				this.successVisible = true;
				this.successBuyinginfo = this.fileParams;
			},
			buyingFall(item) {
				this.fallVisible = true
				this.fallBuyinginfo = this.fileParams
			},
			gotodownload() {
				download(this.fileId).then(res => {
					const url = window.URL.createObjectURL(new Blob([res.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', res.headers["content-disposition"].split("filename=")[1]);
					document.body.appendChild(link);
					link.click();
				})
			},
			getMusicUrl() {
				download(this.fileId).then(res => {

					const url = window.URL.createObjectURL(new Blob([res.data]));

					document.getElementById('music').src = url;

				})
			},
			canplaysong() {
				console.log(this.$refs.audio.duration)
				let total = parseInt(this.$refs.audio.duration)
				this.musictotaltimemode = total
				let minute = total % 60
				let seconds = (total - minute) / 60
				if (minute < 10) {
					minute = '0' + minute
				}
				if (seconds < 10) {
					seconds = '0' + seconds
				}
				this.fileParams.fileTime = minute + ':' + seconds
				this.$forceUpdate()
			},
			getfileTime(val) {
				let total = parseInt(val)
				if (total > 0) {
					this.musictotaltimemode = total
					let minute = total % 60
					let seconds = (total - minute) / 60
					if (minute < 10) {
						minute = '0' + minute
					}
					if (minute < 1) {
						minute = '00'
					}
					if (seconds < 10) {
						seconds = '0' + seconds
					}
					return seconds + ':' + minute
				} else {
					return ''
				}
			},
			getfiledetails() {
				fileDetails(this.fileId).then(res => {
					if (res.code == 200) {
						this.$saoloading.hide();
						this.fileParams = res.data
						this.fileParams.CreatedAt = moment(
							new Date(res.data.CreatedAt)).format('YYYY-MM-DD')
						this.fileParams.Labels = res.data.Labels.split(',')
						this.fileParams.fileType = res.data.ContentType.split('/')[1]
						this.fileParams.fileSize = utils.getFileSize(res.data.Size)
						this.fileParams.fileTime = this.getfileTime(res.data.AdditionalInfo)

					}
				})
			},
			gotoupload() {},
			playMusic() {
				this.$refs.audio.play()
				this.musicPlay = true
			},
			pauseMusic() {
				this.$refs.audio.pause()
				this.musicPlay = false
			},
			testfile(value) {
				if (value) {
					const start = value.slice(0, 6);
					const end = value.slice(-6);
					return `${start}...${end}`;
				}

			},
			showtabs(value) {
				this.tabNumber = value
			},
		}
	}
</script>

<style lang="less" scoped>
	.el-scrollbar {
		height: 100%;
		width: 100%;

		/deep/.el-scrollbar__wrap {
			margin-right: -17px !important;
			overflow: auto;
		}

	}


	.el-scrollbar ::v-deep .el-scrollbar__wrap {
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.musicfile {
		width: 100%;
		height: 100%;
		padding-top: 55px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.musicplayer {
			display: flex;
			align-items: center;
			width: 900px;
			height: 122px;
			padding: 13px;
			box-sizing: border-box;
			background: linear-gradient(180deg, rgba(88, 255, 195, 0.1) 0%, rgba(88, 255, 195, 0) 100%);
			border: 1px solid #68B096;

			.gaps {
				width: 1px;
				height: 85px;
				background: #68B096;
				margin-right: 20px
			}

			.musiccover {
				position: relative;
				width: 94px;
				height: 94px;
				padding: 1px;
				box-sizing: border-box;
				border: 1px solid #68B096;
				margin-right: 40px;

				.musicpreview {
					width: 90px;
					height: 90px;
					object-fit: cover;
				}

				.playicon {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;

					.playmusicicon {
						width: 42px;
						height: 42px;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}

				.pauseicon {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;

					.playmusicicon {
						width: 42px;
						height: 42px;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}

			.musicinfo {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.musictitle {
					width: 100%;
					
					font-weight: 700;
					font-size: 16px;
					line-height: 21px;
					word-break: break-all;
					color: #58FFC3;

					.musicicon {
						width: 12px;
						height: 12px;
						float: left;
						padding-top: 6px;
						margin-right: 9px;
					}
				}

				.musicname {
					width: 100%;
					word-break: break-all;
				}

				.filemessage {
					display: flex;
					align-items: center;
					padding: 10px 0;
					font-size: 12px;
					line-height: 16px;
					color: #58FFC3;

					.gap {
						width: 1px;
						height: 13px;
						background: #68B096;
						margin: 0 10px;
					}

					.fileEthAddr {
						background: rgba(88, 255, 195, 0.2);
						color: #58FFC3;
						padding: 2px 3px;
						margin: 0;
					}
				}
			}
		}

		.filedesc {
			width: 900px;
			font-weight: 400;
			font-size: 12px;
			line-height: 16px;
			color: #58FFC3;
			padding-bottom: 13px;
			margin-top: 20px;
			word-break: break-all;
		}

		.ipfsandcointitle {
			width: 900px;
			display: flex;
			align-items: flex-start;
			font-size: 12px;
			line-height: 16px;
			padding-bottom: 13px;
		}

		.ipfsandcoin {
			font-weight: 700;
			font-size: 12px;
			/* identical to box height */
			color: #58FFC3;
		}

		.filelabels {
			width: 900px;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		}

		.tagstyle {
			padding: 2px 10px;
			line-height: 16px;
			background: #D6DF68;
			border-radius: 50px;
			color: #070707;
			margin-right: 6px;
			margin-top: 6px;
			font-size: 12px;
		}

		.btns {
			width: 900px;
			padding-top: 30px;
			padding-bottom: 50px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.nobuy {
				display: flex;
				align-items: center;
				justify-content: flex-start;
			}

			.price {
				// width: 50%;
				font-weight: 700;
				font-size: 16px;
				line-height: 21px;
				color: #58FFC3;
				margin-left: 20px;
			}

			.leftboard {
				display: flex;
				align-items: center;
			}

			.boardicon {
				display: flex;
				align-items: center;
				color: #68B096;
				background: #0A3320;
				height: 28px;
				line-height: 28px;
				font-size: 12px;
				padding: 0 10px;
				margin-left: 5px;

				.commenticon {
					width: 18px;
					height: 16px;
					padding-right: 8px;
				}
			}

			.leftboardicon {
				width: 18px;
				height: 18px;
				padding-right: 8px;
			}

			.shareicon {
				width: 28px;
				height: 28px;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				color: #68B096;
				background: #0A3320;
				margin-left: 5px;
			}

			.leftshareicon {
				width: 16px;
				height: 16px;
			}

		}

		.changetab {
			width: 900px;
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.singletab {
				padding: 0 50px 10px 50px;
				cursor: pointer;
				color: #68b096;
				font-size: 14px;
			}

			.tabActive {
				color: #58ffc3;
				position: relative;
				font-weight: bold;
			}

			.activeBar {
				width: 100%;
				position: absolute;
				bottom: 0;
				left: 0;
				height: 2px;
				background-color: #58ffc3;
				z-index: 1;
				transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
				list-style: none;
			}
		}

		.Comments {
			width: 100%;
			height: 100%;
			background: #070707;
		}

		.Collection {
			width: 100%;
			height: 100%;
			// min-height: 500px;
			background: #070707;
			padding-top: 24px;
		}
	}
</style>
