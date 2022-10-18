<template>
	<el-scrollbar>
		<div class="videofile">
			<div v-if="islogin==true">
				<div  v-if="fileParams.AlreadyPaid==false && fileParams.Price*1>0">
					
					<div class="videosize"  v-if="fileParams.EthAddr.toLowerCase() == address">
						<video width="900" height="500" class="video" id="movie" ref="movie" controls
							:poster="fileParams.Preview" @pause="handlePause" @play="handlePlay">
					
					
						</video>
						<img @click="handlePause" class="playicon" v-show="showPauseicon"
							src="../../assets/images/Common/playing.png" alt="">
						<img @click="handlePlay" class="pauseicon" v-show="showplayingicon"
							src="../../assets/images/Common/pause.png" alt="">
					</div>
					<div class="videosize" v-else>
						<video width="900" height="500" class="video" id="movie" ref="movie" 
							:poster="fileParams.Preview" >
					
					
						</video>
					
					</div>
				</div>
				
				<div class="videosize" v-else>
					<video width="900" height="500" class="video" id="movie" ref="movie" controls
						:poster="fileParams.Preview" @pause="handlePause" @play="handlePlay">
				
				
					</video>
					<img @click="handlePause" class="playicon" v-show="showPauseicon"
						src="../../assets/images/Common/playing.png" alt="">
					<img @click="handlePlay" class="pauseicon" v-show="showplayingicon"
						src="../../assets/images/Common/pause.png" alt="">
				</div>
			</div>
			<div v-if="islogin==false">
				<div class="videosize">
					<video width="900" height="500" class="video" id="movie" ref="movie" 
						:poster="fileParams.Preview" >
				
				
					</video>
				
				</div>
			</div>
		
			<!-- videoinfo -->
			<div class="videoinfo">
				<div class="filetitle">
					<img class="videoicon" src="../../assets/images/Market/videoicon.png" alt="">
					<div class="filename">{{fileParams.Title}}</div>
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
					<div class="gap" v-if="fileParams.fileTime != ''"></div>
					<span class="infostyle">{{fileParams.fileTime}}</span>
				</div>
				<div class="filedesc">
					{{fileParams.Description}}
				</div>
				<div class="ipfsandcointitle">
					<span> Ipfs Pinned:&nbsp;</span> <span class="ipfsandcoin"> {{fileParams.IpfsHash}}</span>
				</div>

				<div class="filelabels">
					<span class="tagstyle" v-for="(v,i) in fileParams.Labels" :key="i">{{v}}</span>
				</div>
				<div class="btns">
					<div v-if="islogin==true">
						<div class="nobuy" v-if="fileParams.Price>0 && fileParams.AlreadyPaid==false">
							<div v-if="fileParams.EthAddr.toLowerCase() == address">
								<ActiveBtn @onClickBtn="gotodownload" :btnText="gotodownloadbtn" :btnstyle="middleSize"
									></ActiveBtn>
									
							</div>
							
							<ActiveBtn @onClickBtn="buyprofile" :btnText="paynowbtnText" :btnstyle="middleSize" v-else>
							</ActiveBtn>
							
							<div class="price">{{fileParams.Price}} BNB</div>
				
						</div>
						
						<div class="nobuy" v-if="fileParams.Price>0 && fileParams.AlreadyPaid==true">
				
							<!-- <ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize">
							</ActiveBtn> -->
							<div class="price"> paid {{fileParams.Price}} BNB</div>
						</div>
						<div class="nobuy" v-if="fileParams.Price==0">
							
							<ActiveBtn v-if="fileParams.EthAddr.toLowerCase() == address" @onClickBtn="gotodownload" :btnText="gotodownloadbtn" :btnstyle="middleSize">
							</ActiveBtn>
						</div>
						
					</div>
					<div class="nofilebord">
						<!-- <ActiveBtn  v-if="islogin==false" @onClickBtn="login" :btnText='btnText' :btnstyle='bigSize'></ActiveBtn> -->
				
					</div>
					<div class="leftboard">
						<div class="boardicon"><img class="leftboardicon" src="@/assets/images/Common/star.png" alt="">
							<span>10</span>
						</div>
						<div class="boardicon"><img class="commenticon" src="@/assets/images/Common/comment.png" alt="">
							<span>1</span>
						</div>
						<div class="shareicon"><img class="leftshareicon" src="@/assets/images/Common/share.png" alt="">
				
						</div>
					</div>
				</div>
				<div class="changetab">
					<div :class="tabNumber==1?'tabActive singletab':'singletab'" @click="showtabs(1)">
						<span>Comments(1)</span>
						<div v-if="tabNumber==1" class="activeBar"></div>
					</div>
					<div :class="tabNumber==2?'tabActive singletab':'singletab'" @click="showtabs(2)">
						<span>Collection list(2)</span>
						<div v-if="tabNumber==2" class="activeBar"></div>
					</div>
				</div>
			</div>
			<div class="btminfo">
				
				<!-- tab -->
				
				<div class="Comments" v-show="tabNumber==1">
					<Comment></Comment>
				</div>
				<div class="Collection" v-show="tabNumber==2">
					<Favorites></Favorites>
				</div>
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

				showPauseicon: false,
				showplayingicon: true,
				fileParams: {},
				tabNumber: 1,
				SolidbtnText: 'PLAY',
				paynowbtnText: 'BUY NOW',
				gotodownloadbtn:'Download',
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
		mounted() {
			this.$refs.movie.addEventListener('play', this.handlePlay)
			this.$refs.movie.addEventListener('pause', this.handlePause)
		
		},
		created() {
			this.$saoloading.show('Loading', 'ball');
			this.fileId = this.$route.query.id
			this.getfiledetails()
			this.getVideoUrl()
			console.log(this.fileParams)
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
		methods: {
			getfileTime(val) {
				
				let total = parseInt(val)
				if(total>0){
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
				}else{
					return ''
				}
				

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
			getVideoUrl() {
				download(this.fileId).then(res => {
					console.log(res.headers);
					console.log(res.headers["content-disposition"]);

					const url = window.URL.createObjectURL(new Blob([res.data]));

					document.getElementById('movie').src = url;

				})
			},
			getfiledetails() {
				fileDetails(this.fileId).then(res => {
					if (res.code == 200) {
						this.$saoloading.hide();
						this.fileParams = res.data
						this.fileParams.CreatedAt = moment(
						new Date(res.data.CreatedAt)).format('YYYY-MM-DD')
						this.fileParams.Labels = res.data.Labels.split(',')
						this.fileParams.fileSize = utils.getFileSize(res.data.Size)
						this.fileParams.fileTime = this.getfileTime(res.data.AdditionalInfo)
					}
				})
			},
			showtabs(value) {
				this.tabNumber = value
			},
			gotoupload() {},
			testfile(value) {
				if (value) {
					const start = value.slice(0, 6);
					const end = value.slice(-6);
					return `${start}...${end}`;
				}
			},
			handlePlay() {
				let _this = this
				this.$refs.movie.play()
				this.showplayingicon = false
				this.showPauseicon = true
				setTimeout(() => {
					_this.showPauseicon = false
				}, 1000)
			},
			handlePause() {
				this.$refs.movie.pause()
				this.showPauseicon = false
				this.showplayingicon = true

			}
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

	.videofile {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-top: 30px;

		.videosize {
			width: 900px;
			height: 500px;
			position: relative;
			border: 1px solid #68B096;
				background-color: #000000;
			.pauseicon {
				width: 90px;
				height: 90px;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}

			.playicon {
				width: 90px;
				height: 90px;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.videoinfo {
			width: 900px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding-top: 20px;

			.filetitle {
				// display: flex;
				// align-items: center;
				// justify-content: flex-start;
				position: relative;
				font-weight: 700;
				font-size: 24px;
				// line-height: 32px;
				color: #58FFC3;
				width: 100%;
				.videoicon {
					float: left;
					width: 28px;
					height: 20px;
					padding-top: 6px;
					margin-right: 14px;
				}

				.filename {
					// text-indent:1.8em;
					width: 100%;
					word-break: break-all;
					line-height: 32px;
				}
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

			.filedesc {
				width: 900px;
				font-weight: 400;
				font-size: 12px;
				line-height: 16px;
				color: #58FFC3;
				word-break: break-all;
				padding-bottom: 13px;
			}

			.ipfsandcointitle {
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
				padding-top: 20px;
				padding-bottom: 40px;
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
					padding: 0 40px 10px 40px;
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
		}

		.btminfo {
			width: 100%;
			min-height: 500px;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: rgba(0, 0, 0, 0.7);


			.Collection {
				padding-top: 10px;
			}
		}
	}
</style>
