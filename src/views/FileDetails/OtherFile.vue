<template>
	<el-scrollbar>
		<div class="otherfile">
			<!-- top -->
			<div class="filedetails">
				<!-- top1 -->
				<div class="fileinfo">
					<!-- left -->
					<div class="filecover">
						<img class="filePreview" :src="fileParams.Preview" alt="">
					</div>
					<!-- right -->
					<div class="filetext">
						<div class="filename">
							{{fileParams.Title}}
						</div>
						<div class="filemessage">
							<span class="fileEthAddr infostyle">{{testfile(fileParams.EthAddr)}}</span>
							<div class="gap"></div>
							<span class="infostyle"> Uploaded at&nbsp;{{fileParams.CreatedAt}}</span>
							<div class="gap"></div>
							<span class="infostyle">{{fileParams.FileCategory}}</span>
							<div class="gap"></div>
							<span class="infostyle">{{fileParams.fileType}}</span>
							
							<div class="gap"></div>
							<span class="infostyle">{{fileParams.fileSize}}</span>
						</div>
						<span class="filedesc">
							{{fileParams.Description}}</span>
						<div class="ipfsandcointitle">
							<span> Ipfs Pinned:&nbsp;</span> <span class="ipfsandcoin"> {{fileParams.IpfsHash}}</span>
						</div>
						
						<div class="filelabels">
							<span class="tagstyle" v-for="(v,i) in fileParams.Labels" :key="i">{{v}}</span>
						</div>
						<div class="buyinginfo">
						<div v-if="islogin==true">
							
							<div class="nobuy" v-if="fileParams.Price>0 && fileParams.AlreadyPaid==false">
							
								<ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize"
									v-if="fileParams.EthAddr.toLowerCase()==address"></ActiveBtn>
								<ActiveBtn @onClickBtn="buyprofile" :btnText="paynowbtnText" :btnstyle="middleSize"
									v-else></ActiveBtn>
								<div class="price">{{fileParams.Price}} BNB</div>
							
							</div>
							<div class="nobuy" v-if="fileParams.Price>0 && fileParams.AlreadyPaid==true">
							
								<ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize">
								</ActiveBtn>
								<div class="price"> paid {{fileParams.Price}} BNB</div>
							</div>
							<div class="nobuy" v-if="fileParams.Price==0">
							
								<ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize">
								</ActiveBtn>
							</div>
						</div>
							
							<div class="nofilebord"  v-if="islogin==false">
								<!-- <ActiveBtn  v-if="islogin==false" @onClickBtn="login" :btnText='btnText' :btnstyle='bigSize'></ActiveBtn>
								 -->
							</div>

							<div class="leftboard">
								<div class="boardicon"><img class="leftboardicon" src="@/assets/images/Common/star.png"
										alt="">
									<span>10</span>
								</div>
								<div class="boardicon"><img class="commenticon" src="@/assets/images/Common/comment.png"
										alt="">
									<span>1</span>
								</div>
								<div class="shareicon"><img class="leftshareicon" src="@/assets/images/Common/share.png"
										alt="">

								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- tab -->
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
			<!--  -->
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
		fileDetails,download
	} from '../../api/FileApi.js'
	import moment from 'moment'
	import ActiveBtn from '../../components/ActiveBtn.vue'
	import Comment from '../../components/Comment.vue'
	import Favorites from '../../components/Favorites.vue'
	import utils from '../../libs/utils.js'
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
				 bigSize:'big',
				 btnText:'CONNECT WALLET',
				 
				fileParams: {},
				SolidbtnText: 'Download',
				paynowbtnText: 'BUY NOW',
				middleSize: 'middle',
				tabNumber: 1,
				fileId: '',
				address:'',
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
			
		},
		methods: {
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
			
			gotodownload(){
				download(this.fileId).then(res => {
					const url = window.URL.createObjectURL(new Blob([res.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', res.headers["content-disposition"].split("filename=")[1]);
					document.body.appendChild(link);
					link.click();
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
						this.fileParams.fileType=res.data.ContentType.split('/')[1]
						this.fileParams.fileSize = utils.getFileSize(res.data.Size)
					}
				})
			},
			testfile(value) {
				if(value){
					const start = value.slice(0, 6);
					const end = value.slice(-6);
					return `${start}...${end}`;
				}
			},
			showtabs(value) {
				this.tabNumber = value
			},
			gotoupload() {},
			onClickBtn() {}
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

	.otherfile {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding-top: 35px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.filedetails {
			width: 900px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;

			.fileinfo {
				width: 100%;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				box-sizing: border-box;

				.filecover {
					width: 300px;
					height: 300px;
					background: #070707;
					border: 1px solid #68B096;
					padding: 10px;
					box-sizing: border-box;

					.filePreview {
						width: 280px;
						height: 280px;
					}
				}
			}

			.filetext {
				// height: 100%;
				width: 570px;
				min-height: 300px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-left: 30px;
				font-size: 12px;

				.filename {
					width: 570px;
					word-wrap: break-word;
					font-weight: 700;
					font-size: 24px;
					line-height: 32px;
					color: #58FFC3
				}

				.filemessage {
					display: flex;
					align-items: center;
					padding: 10px 0;
					font-size: 12px;
					line-height: 16px;

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
					font-size: 12px;
					line-height: 16px;
					color: #58FFC3;
					padding: 8px 0;
					width: 570px;
					word-wrap: break-word;
					// word-break: break-all;
					// text-overflow: ellipsis;
					// display: -webkit-box;
					// -webkit-box-orient: vertical;
					// -webkit-line-clamp: 6;
					// overflow: hidden;

				}

				.ipfsandcointitle {
					display: flex;
					align-items: flex-start;
					margin-top: 10px;
					// align-items: center;
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
					margin: 20px 0;
				}

				.tagstyle {
					padding: 2px 10px;
					line-height: 16px;
					background: #D6DF68;
					border-radius: 50px;
					color: #070707;
					margin-right: 6px;
					margin-top: 6px;
				}
			}

			.buyinginfo {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

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
			// width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 30px;

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
			min-height: 500px;
			background: #070707;
			padding-top: 24px;
		}
	}
</style>
