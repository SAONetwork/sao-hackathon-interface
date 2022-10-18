<template>
	<!-- <el-scrollbar> -->
	<ul class="filelist" v-infinite-scroll="load">
		<li class="file" v-for="(item,index) in FileList" :key="index">
			<div class="fileleft">
				
			<!-- left -->
			<div class="filecover" @click="checkinfo(item)">
				<img class="filecoverimg" :src="item.Preview" alt="">
			</div>
			<!-- middles -->
			<div class="fileinfo">
				<!-- top -->
				<div class="filename">
					<img class="videoicon" v-if="item.FileCategory=='Video'" src="@/assets/images/Market/videoicon.png"
						alt="">
					<img class="musicicon" v-if="item.FileCategory=='Music'" src="@/assets/images/Market/musicicon.png"
						alt="">
					<img class="imgicon" v-if="item.FileCategory=='Image'" src="@/assets/images/Market/imgicon.png"
						alt="">
					<img class="fileicon" v-if="item.FileCategory=='Document'" src="@/assets/images/Market/txticon.png"
						alt="">
					<img class="othericon" v-if="item.FileCategory=='Other'"
						src="@/assets/images/Market/otherfileicon.png" alt="">
					<span class="filetitle" @click="checkinfo(item)">{{item.Title}}</span>
					<div class="nopayed" v-if="item.AlreadyPaid==false && item.Price>0 && islogin==true">
						<img src="@/assets/images/Market/wallet1.png" alt="">
					</div>
					<div class="nopayed"
						v-if="item.AlreadyPaid==true && item.Price>0 && islogin==true&&item.EthAddr.toLowerCase()==address">
						<img src=" @/assets/images/Market/wallet1.png" alt="">
					</div>
					<div class="alreadypay"
						v-if="item.AlreadyPaid==true && item.Price>0 && islogin==true&&item.EthAddr.toLowerCase() !=address">
						<img src="@/assets/images/Market/buyed.png" alt="">
						<img class="padedtxt" src="@/assets/images/Market/padedtxt.png" alt="">
					</div>
					<div class="nopayed" v-if="item.Price>0 && islogin==false">
						<img src="@/assets/images/Market/wallet1.png" alt="">
					</div>
				</div>
				<!-- meddle -->
				<div class="filemiddle">
					<div class="filedesc">
						<span>{{item.Description}}</span>
					</div>

				</div>
				<!-- btm -->
				<div class="filetigs" v-if='item.Labels.length>0'>
					<span class="singletig" v-for="(v,i) in splitArr(item.Labels).slice(0,6)" :key="i">{{v}}</span>

					<el-popover placement="right" width="300" trigger="hover" popper-class="popoverBackB"
						v-if="splitArr( item.Labels).length>6">
						<el-scrollbar>
						<div class="showtigs">
							<span class="showmoretigs" v-for="(v,i) in splitArr( item.Labels)" :key="i">{{v}}</span>
						</div>
						</el-scrollbar>
						<img slot="reference" class="tigmoreicon" src="@/assets/images/Market/moreicon.png" alt="">
					</el-popover>
				</div>
			</div>
			</div>
			<!-- right -->
			<div class="finebtns">
				<div v-if="islogin==true">

					
					<div class="nobuy hasPrice" v-if="item.Price>0 && item.AlreadyPaid==false">
						<el-tooltip :content="item.Price+''" placement="top">
							<div class="price">{{item.Price | numRounding}} BNB</div>
						</el-tooltip>
						<HollowBtn class="shadow" @BHoBtn='Download(item)' v-if="item.EthAddr.toLowerCase()==address" :btnSize='btnSize'>
							<div slot="btncontent" class="HollowBtn">
								
								<span>Download</span>
							</div>
						</HollowBtn>
						<HollowBtn class="shadow" @BHoBtn='buyItem(item)' v-else :btnSize='btnSize'>
							<div slot="btncontent" class="HollowBtn">
								
								<span>Buy Now</span>
							</div>
						</HollowBtn>
						<!-- <div @click="buyItem(item)" class="paybtn" v-else>
							<img src="../assets/images/Common/hollowbtn.png" alt="">
							<span class="paybtntext">
								 Buy now
							</span>
						</div> -->
					</div>
					<div class="nobuy" v-if="item.Price>0 && item.AlreadyPaid==true">
						<HollowBtn class="shadow" @BHoBtn='checkinfo(item)' :btnSize='btnSize'  v-if="item.FileCategory == 'Video' || item.FileCategory == 'Music'">
							<div slot="btncontent" class="HollowBtn">
								
								<span>Play</span>
							</div>
						</HollowBtn>
						<HollowBtn class="shadow" :btnSize='btnSize' @BHoBtn='Download(item)' v-else>
							<div slot="btncontent" class="HollowBtn">
								
								<span>Download</span>
							</div>
						</HollowBtn>
						
					</div>
					<div class="nobuy" v-if="item.Price==0 ">
						<HollowBtn class="shadow" :btnSize='btnSize' @BHoBtn='checkinfo(item)' v-if="item.FileCategory == 'Video' || item.FileCategory == 'Music'">
							<div slot="btncontent" class="HollowBtn">
								<div slot="btncontent" class="HollowBtn">
									
									<span>Play</span>
								</div>
							</div>
						</HollowBtn>
						<HollowBtn class="shadow" :btnSize='btnSize' @BHoBtn='Download(item)' v-else>
							<div slot="btncontent" class="HollowBtn">
								
								<span>Download</span>
							</div>
						</HollowBtn>
					</div>
				</div>
				<div class="nofilebord" v-if="islogin==false">
					<!-- <ActiveBtn @onClickBtn="login" :btnText='btnText' :btnstyle='btnstyles'></ActiveBtn> -->
					<div class="smallbtn" @click="login">
						<img class="btn-img" src="@/assets/images/Common/bigbtn.png" alt="">
						<span class="btn-text">{{btnText}}</span>
					</div>
				</div>
			</div>
			
			<img class="iscoll" @click.stop="cancelcol(item,index)" v-if="item.iscol==true && islogin==true" src="@/assets/images/Market/col.png"
				alt="">
			<img class="iscoll" @click.stop="colthisFile(item,index)" v-if="item.iscol==false  && islogin==true" src="@/assets/images/Market/nocol.png"
				alt="">
			<img class="iscoll" v-if="islogin==false"   src="@/assets/images/Market/nocol.png" alt="">
		</li>
		<li class="loading" v-show="showloading">
			<div class="circle1"></div>
			<div class="circle2"></div>
			<div class="circle3"></div>
		</li>
	</ul>
	<!-- </el-scrollbar> -->


</template>

<script>
	import {
		fileInfos,
		download,
		cancelUpload,
		addFileWithPreview
	} from "../api/FileApi.js"

	import config from "../libs/config.js"
	import utils from "../libs/utils.js"
	import HollowBtn from "@/components/HollowBtn.vue";
	import ActiveBtn from "@/components/ActiveBtn.vue";

	export default {
		components: {
			HollowBtn,
			ActiveBtn
		},
		props: {
			FileList: {
				type: Array,
				default: () => []
			},
			cancelloading: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showloading: true,
				btnText: "CONNECT WALLET",
				btnstyles: 'small',
				userDetilas: {},
				islogin: false,
				address: '',
				btnSize:'small'
				
			};
		},
		filters: {
			numRounding(num) {
				num = parseFloat(num)
				if (!isNaN(num)) {
					return ((num + '').indexOf('.') == -1) ? num : num.toFixed(4);
				}
			}
		},
		mounted() {
			this.$checkConnectedAndNetwork().then(({
				network,
				connected
			}) => {
				this.ChangeRinkebyVisible = !network;

				if (connected) {
					this.$getWalletAddress().then(address => {
						this.address = address;
						this.islogin = this.address ? true : false;
					});
				}
			})
		},
		methods: {
			colthisFile(item,index){
				item.iscol=true
			},
			cancelcol(item,index){
				item.iscol=false
			},
			splitArr(str) {
				if (str.length > 0) {
					return str.split(",");
				}
			},
			load() {
				this.$emit("loadMore");
				if (this.cancelloading == true) {
					this.showloading = false
				} else {
					this.showloading = true
				}
			},
			login() {
				this.$emit("loginwallet", true);
			},
			checkinfo(item) {
				console.log(item)
				if (item.FileCategory == "Video") {
					let routeData = this.$router.resolve({
						path: 'VideoFile',
						query: {
							id: item.Id
						}
					})
					window.open(routeData.href, '_blank');
				} else if (item.FileCategory == "Music") {
					let routeData = this.$router.resolve({
						path: 'MusicFile',
						query: {
							id: item.Id
						}
					})
					window.open(routeData.href, '_blank');
				} else {
					let routeData = this.$router.resolve({
						path: 'OtherFile',
						query: {
							id: item.Id
						}
					})
					window.open(routeData.href, '_blank');
				}
			},
			Download(item) {

				console.log(item);
				download(item.Id).then(res => {
					const url = window.URL.createObjectURL(new Blob([res.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', res.headers["content-disposition"].split("filename=")[1]);
					document.body.appendChild(link);
					link.click();
				})

			},
			buyItem(item) {
				this.$emit("buyItem", item);
			}
		}
	};
</script>
<style>
	.popoverBackB {
		height: 250px;
		padding: 12px;
		box-sizing: border-box;
		border: 1px solid #44c194 !important;
		background-color: #000000 !important;
	}

	.el-popper[x-placement^="right"] .popper__arrow::after {
		border-right-color: #000 !important;
	}

	.el-popper[x-placement^="right"] .popper__arrow {
		border-right-color: #44c194 !important;
	}

	.el-popper[x-placement^="left"] .popper__arrow::after {
		border-left-color: #000 !important;
	}

	.el-popper[x-placement^="left"] .popper__arrow {
		border-left-color: #44c194 !important;
	}

	.showtigs {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.showmoretigs {
		padding: 2px 10px;
		background: #d6df68;
		margin-right: 6px;
		border-radius: 20px;
		color: #001e13;
		font-size: 12px;
		margin-bottom: 12px;
		margin-right: 7px;
	}
</style>
<style lang="less" scoped>
	.el-scrollbar {
		height: 100%;

		/deep/.el-scrollbar__wrap {
			margin-right: -17px !important;
		}
	}

	.el-scrollbar ::v-deep .el-scrollbar__wrap {
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.filelist {
		width: 100%;
		height: 100%;
		display: flex;
		// justify-content: space-between;
		justify-content: flex-start;
		flex-direction: column;
		box-sizing: border-box;
		flex-wrap: wrap;
		.iscoll{
			position: absolute;
			right: 0px;
			top: 0px;
			width: 30px;
			height: 36px;
			cursor: pointer;
		}
		.loading {
			width: 98%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-top: 1px solid #3C715D;

			.circle1 {
				width: 7px;
				height: 7px;
				border-radius: 50%;
				background: #2C593D;
			}

			.circle2 {
				width: 7px;
				height: 7px;
				border-radius: 50%;
				background: #368353;
				margin: 0 8px;
			}

			.circle3 {
				width: 7px;
				height: 7px;
				border-radius: 50%;
				background: #3DA564;
			}
		}

		.file {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 98%;
			height: 120px;
			overflow: hidden;
			border-top: 1px solid #3C715D;
			.fileleft{
				width: 70%;
				display: flex;
				align-items: center;
			}
			.filecover {
				width: 80px;
				height: 80px;
				margin-right: 30px;
				border: 1px solid #68B096;
				cursor: pointer;

				.filecoverimg {
					width: 80px;
					height: 80px;
				}
			}

			.filecover:hover {
				border: 2px solid #58FFC3;
			}

			.fileinfo {
				width: 80%;
				height: 80px;
				display: flex;
				// align-items: center;
				flex-direction: column;
				justify-content: space-between;

				.filename {

					width: 100%;
					font-size: 16px;
					line-height: 21px;
					color: #58FFC3;
					display: flex;
					align-items: center;
					justify-content: flex-start;

					.filetitle {
						max-width: 90%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						cursor: pointer;
					}
					.filetitle:hover{
						border-bottom: 1px solid #58FFC3;
					}
					.videoicon {
						width: 17px;
						height: 12px;
						margin-right: 8px;
					}

					.imgicon {
						width: 12px;
						height: 12px;
						margin-right: 8px;
					}

					.musicicon {
						width: 12px;
						height: 12px;
						margin-right: 8px;
					}

					.fileicon {
						width: 10px;
						height: 12px;
						margin-right: 8px;
					}

					.othericon {
						width: 13px;
						height: 12px;
						margin-right: 8px;
					}

					.nopayed {
						position: relative;
						// background: #000;
						box-sizing: border-box;
						width: 21px;
						height: 14px;
						// border: 1px solid #695c42;
						margin:0 6px;

						img {
							width: 21px;
							height: 14px;
							position: absolute;
							left: 50%;
							top: 50%;
							transform: translate(-50%, -50%);
						}
					}

					.alreadypay {
						position: relative;
						height: 17px;
						padding: 5px 8px;
						// background: #000;
						box-sizing: border-box;
						// border: 1px solid #695c42;
						display: flex;
						align-items: center;
						border-radius: 25px;
						margin-left: 10px;

						img {
							width: 15px;
							height: 10px;
						}

						.padedtxt {
							padding-left: 5px;
							width: 86px;
							height: 11px;
						}

					}
				}

				.filetigs {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: flex-start;

					.singletig {
						line-height: 16px;
						padding: 2px 10px;
						background: #d6df68;
						margin-right: 6px;
						border-radius: 20px;
						color: #001e13;
						font-size: 12px;
						text-align: center;
						max-width: 80px;
						min-width: 20px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.tigmoreicon {
						width: 20px;
						height: 20px;
					}

					/deep/.el-popover__reference-wrapper {
						display: flex;
					}
				}

				.filemiddle {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.filedesc {
						width: 100%;
						color: #57b196;
						font-size: 12px;
						line-height: 16px;
						color: #58FFC3;
						word-break: break-all;

						text-overflow: ellipsis;

						display: -webkit-box;

						-webkit-box-orient: vertical;

						-webkit-line-clamp: 2;

						overflow: hidden;
					}


				}
			}

			.finebtns {
				width: 30%;
				margin-right: 20px;
				.nobuy {
					display: flex;
					align-items: center;
					box-sizing: border-box;
					padding-right: 50px;
					justify-content: flex-end;

					.shadow {
						margin-left: 10px;
					}

					.price {
						// width: 50%;
						color: #ffffff;
						font-size: 16px;
						text-shadow: 2px 2px #000;
						text-align: center;
						font-weight: bold;
						
						padding-bottom: 18px;
					}

					.HollowBtn {
						width: 100%;
						height: 100%;
						line-height: 27px;
						text-align: center;
						font-size: 12px;
						color: #58ffc3;

					}
				}

				.hasPrice {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					justify-content: flex-end;
				}
				.nofilebord{
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}
				.smallbtn {
					box-sizing: border-box;
					position: relative;
					font-size: 12px;
					cursor: pointer;
					width: 227px;
					height: 30px;
					margin-right: 50px;

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
						color: #001e13;
						user-select: none
					}
				}

				.smallbtn:hover {
					filter: drop-shadow(0px 4px 14px #0D7852)
				}

				.paybtn {
					height: 27px;
					width: 135px;
					position: relative;
					font-size: 12px;
					cursor: pointer;
					background: transparent;
					margin-left: 10px;

					img {
						width: 135px;
						height: 27px;

					}
				}

				.paybtn:hover {
					filter: drop-shadow(0px 4px 14px #0D7852)
				}

				.paybtntext {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					color: #58FFC3;
				}
			}

		}

	}
</style>
