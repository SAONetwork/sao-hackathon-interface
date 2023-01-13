<template>
	<!-- <el-scrollbar> -->
	<ul class="filelist" v-infinite-scroll="load">
		<li class="file" v-for="(item,index) in FileList" :key="index">
			<div class="fileinfo" @click="checkinfo(item)">
				<div class="filecover">
					<img class="filecoverimg" :src="item.Preview" alt="">
					<div class="nopayed" v-if="item.AlreadyPaid==false && item.Price>0 && islogin==true">
						<img src="@/assets/images/Market/wallet1.png" alt="">
					</div>

					<div class="nopayed"
						v-if="item.AlreadyPaid==true && item.Price>0 && islogin==true&&item.EthAddr.toLowerCase()==address">
						<img src="@/assets/images/Market/wallet1.png" alt="">
					</div>
					<div class="alreadypay"
						v-if="item.AlreadyPaid==true && item.Price>0 && islogin==true&&item.EthAddr.toLowerCase() !=address">
						<img src="@/assets/images/Market/buyed.png" alt="">
						<span>Already paid!</span>
					</div>
					<div class="nopayed" v-if="item.Price>0 && islogin==false">
						<img src="@/assets/images/Market/wallet1.png" alt="">
					</div>
				</div>
				<img class="iscoll" @click.stop="cancelcol(item,index)" v-if="item.Star==true && islogin==true" src="@/assets/images/Market/col.png"
					alt="">
				<img class="iscoll" @click.stop="colthisFile(item,index)" v-if="item.Star==false  && islogin==true" src="@/assets/images/Market/nocol.png"
					alt="">
				<img class="iscoll" v-if="islogin==false" @click.stop="login"  src="@/assets/images/Market/nocol.png" alt="">

				<div class="filetextinfo">
					<div class="filename">
						<img class="videoicon" v-if="item.FileCategory=='Video'"
							src="@/assets/images/Market/videoicon.png" alt="">
						<img class="musicicon" v-if="item.FileCategory=='Music'"
							src="@/assets/images/Market/musicicon.png" alt="">
						<img class="imgicon" v-if="item.FileCategory=='Image'" src="@/assets/images/Market/imgicon.png"
							alt="">
						<img class="fileicon" v-if="item.FileCategory=='Document'"
							src="@/assets/images/Market/txticon.png" alt="">
						<img class="othericon" v-if="item.FileCategory=='Other'"
							src="@/assets/images/Market/otherfileicon.png" alt="">
						<span class="filetitle">{{item.Title}}</span>
					</div>

					<span class="filedesc">{{item.Description}}</span>

				</div>
				<div class="filetigs" v-if='item.Labels.length>0'>
					<span class="singletig">{{splitArr( item.Labels)[0]}}</span>
					<span class="singletig" v-if="splitArr( item.Labels).length>1">{{splitArr( item.Labels)[1]}}</span>
					<el-popover placement="right" width="300"  trigger="hover" popper-class="popoverBackB"
						v-if="splitArr( item.Labels).length>2">
						<el-scrollbar> 
						<div class="showtigs">
							<span class="showmoretigs" v-for="(v,i) in splitArr( item.Labels)" :key="i">{{v}}</span>
						</div>
						</el-scrollbar>
						<img slot="reference" class="tigmoreicon" src="@/assets/images/Market/moreicon.png" alt="">
					</el-popover>
				</div>


			</div>
			<div class="filebord" v-if="islogin==true">

				<div class="nobuy" v-if="item.Price>0 && item.AlreadyPaid==false">
					<el-tooltip :content="item.Price+''" placement="top">
						<div class="price">{{item.Price | numRounding}} ETH</div>
					</el-tooltip>
					<HollowBtn class="shadow" @BHoBtn='Download(item)' v-if="item.EthAddr.toLowerCase()==address" :btnSize='smallbtnSize'>
						<div slot="btncontent" class="HollowBtn">
							<img class="loadicon" src="../assets/images/Common/loadicon.png" alt="">
							<span>Download</span>
						</div>
					</HollowBtn>
					<div @click="buyItem(item)" class="paybtn" v-else>
						<img src="../assets/images/Common/hollowbtn.png" alt="">
						<span class="paybtntext">
							 Buy Now
						</span>
					</div>
				</div>
				<div class="nobuy" v-if="item.Price>0 && item.AlreadyPaid==true">
					<HollowBtn class="shadow" @BHoBtn='checkinfo(item)' :btnSize='btnSize'  v-if="item.FileCategory == 'Video' || item.FileCategory == 'Music'">
						<div slot="btncontent" class="HollowBtn">
							<img class="loadicon" src="../assets/images/Common/playicon.png" alt="">
							<span>Play</span>
						</div>
					</HollowBtn>
					<HollowBtn class="shadow" :btnSize='btnSize' @BHoBtn='Download(item)' v-else>
						<div slot="btncontent" class="HollowBtn">
							<img class="loadicon" src="../assets/images/Common/loadicon.png" alt="">
							<span>Download</span>
						</div>
					</HollowBtn>
					
				</div>
				<div class="nobuy" v-if="item.Price==0 ">
					<HollowBtn class="shadow" :btnSize='btnSize' @BHoBtn='checkinfo(item)' v-if="item.FileCategory == 'Video' || item.FileCategory == 'Music'">
						<div slot="btncontent" class="HollowBtn">
							<div slot="btncontent" class="HollowBtn">
								<img class="loadicon" src="../assets/images/Common/playicon.png" alt="">
								<span>Play</span>
							</div>
						</div>
					</HollowBtn>
					<HollowBtn class="shadow" :btnSize='btnSize' @BHoBtn='Download(item)' v-else>
						<div slot="btncontent" class="HollowBtn">
							<img class="loadicon" src="../assets/images/Common/loadicon.png" alt="">
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
		</li>
		
<IntoCollection :visible.sync='showIntoCollection' @aleadyStar='checkAleadyStar' :checkList='intoCollectionList' :fileId='intoFileId' @loadMoreColl='loadMoreColl'></IntoCollection>
	</ul>
	
	<!-- </el-scrollbar> -->


</template>

<script>
	import {
		fileInfos,
		download,
		cancelUpload,
		addFileWithPreview,
		getCollectionList
	} from "../api/FileApi.js"

	import config from "../libs/config.js"
	import utils from "../libs/utils.js"
	import HollowBtn from "@/components/HollowBtn.vue";
	import ActiveBtn from "@/components/ActiveBtn.vue";
	import AddCollection from '@/components/AddCollection.vue'
	
	export default {
		components: {
			HollowBtn,
			ActiveBtn,
			AddCollection,
			
		},
		props: {
			FileList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				btnText: "CONNECT WALLET",
				
				btnstyles: 'small',
				userDetilas: {},
				islogin: false,
				address: '',
				btnSize:'big',
				smallbtnSize:'small',
				showIntoCollection:false,
				intoCollectionList:[],
				intoFileId:0,
				alreadyStarIndex:0,
				addCollParams:{
					offset:0,
					limit:10,
					fileId:0,
					owner:''
				},
				intoCount:0
			};
		},
		watch:{
			// showIntoCollection(old,news){
			// 	if(old==false){
			// 		this.intoCollectionList=[]
			// 		this.addCollParams.offset=0
			// 	}
			// }
		},
		filters: {
			numRounding(num) {
				num = parseFloat(num)
				if (!isNaN(num)) {
					return parseFloat(((num + '').indexOf('.') == -1) ? num : num.toFixed(4));
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
						
							this.addCollParams.owner= utils.getUser().EthAddr
						
						this.address = address;
						this.islogin = this.address ? true : false;
					});
				}
			})
		},
		created() {
			
			
		},
		methods: {
			loadMoreColl(){
				if (this.intoCount > this.intoCollectionList.length) {
					
					this.addCollParams.offset = this.addCollParams.offset + this.addCollParams.limit
					this.getCollectionLists(this.intoFileId,this.alreadyStarIndex)
				} 
			},
			checkAleadyStar(starStatus){
				this.FileList[this.alreadyStarIndex].Star= starStatus
			},
			getCollectionLists(val,index){
				this.intoFileId=val
				this.addCollParams.fileId=val
				getCollectionList(this.addCollParams).then(res=>{
					this.intoCount=res.data.Count
					
					if(res.data.Count>0 || res.data.Collections != null){
						this.intoCollectionList.push(...res.data.Collections)
						// let arr=res.data.Collections
						// this.intoCollectionList=this.intoCollectionList.concat(arr)
					}
				})
				this.alreadyStarIndex=index
				// this.$emit("loginwallet", true);
			},
			colthisFile(item,index){
				if(this.islogin){
					this.intoFileId=item.Id
					this.showIntoCollection=true
					this.intoCollectionList=[]
					this.addCollParams.offset=0
					this.getCollectionLists(item.Id,index)
				}else{
					this.$emit("loginwallet", true);
				}
				
				// item.Star=true
			},
			cancelcol(item,index){
				if(this.islogin){
					
				this.intoFileId=item.Id
				// item.Star=false
				this.showIntoCollection=true
				this.intoCollectionList=[]
				this.addCollParams.offset=0
				this.getCollectionLists(item.Id,index)
				}else{
					this.dialogVisible = true;
				}
			},
			extraPrice(str) {
				return str.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/)
			},
			splitArr(str) {
				if (str.length > 0) {
					return str.split(",");
				}
			},
			load() {
				this.$emit("loadMore");

			},
			login() {
				this.$emit("loginwallet", true);
			},
			checkinfo(item) {
				
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
		/* overflow: scroll; */
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
		/* justify-content: space-between; */
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
		// height: 100%;
		display: flex;
		// justify-content: space-between;
		justify-content: flex-start;
		box-sizing: border-box;
		flex-wrap: wrap;

		.file {
			width: 250px;
			height: 400px;
			// width: 24%;
			margin: 0 9px;
			margin-bottom: 10px;
			// height: 30em;
			overflow: hidden;

			.fileinfo {
				width: 250px;
				height: 350px;
				display: flex;
				// align-items: center;
				flex-direction: column;
				// align-items: center;
				box-sizing: border-box;
				justify-content: space-between;
				padding: 10px;
				background: #070707;
				border: 1px solid #68b096;
				position: relative;
				cursor: pointer;

				.iscoll {
					position: absolute;
					right: -1px;
					top: -1px;
					width: 30px;
					height: 36px;
					cursor: pointer;
				}

				.filecover {
					width: 228px;
					height: 238px;
					// width: 100%;
					// height: 65%;
					// min-height: 200px;
					// max-height: 300px;
					position: relative;

					.filecoverimg {
						width: 228px;
						height: 228px;
						object-fit: cover
					}

					.nopayed {
						position: absolute;
						bottom: 5px;
						left: 5px;
						background: #000;
						box-sizing: border-box;
						border-radius: 50%;
						width: 35px;
						height: 35px;
						border: 1px solid #695c42;

						img {
							width: 22px;
							height: 14px;
							position: absolute;
							left: 50%;
							top: 50%;
							transform: translate(-50%, -50%);
						}
					}

					.alreadypay {
						position: absolute;
						bottom: 5px;
						left: 5px;
						height: 35px;

						padding: 5px 8px;
						background: #000;
						box-sizing: border-box;
						border: 1px solid #695c42;
						display: flex;
						align-items: center;
						border-radius: 25px;

						img {
							width: 22px;
							height: 14px;
						}

						span {
							font-size: 14px;
							color: #e6e04f;
							padding-left: 10px;
						}
					}
				}

				.filetextinfo {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					box-sizing: border-box;
					justify-content: flex-start;

					// padding: 5px;
					.filename {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						
						color: #58ffc3;
						padding: 8px 0;
						font-size: 14px;
						line-height: 18px;
						.filetitle {
							width: 210px;
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
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
					}

					.filedesc {
						width: 220px;
						color: #57b196;
						font-size: 12px;
						line-height: 16px;
						word-break: break-all;

						text-overflow: ellipsis;

						display: -webkit-box;

						-webkit-box-orient: vertical;

						-webkit-line-clamp: 2;

						overflow: hidden;
					}
				}

				.filetigs {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					margin-bottom: 4px;

					.singletig {
						line-height: 16px;
						padding: 2px 10px;
						background: #d6df68;
						margin-right: 6px;
						border-radius: 20px;
						color: #001e13;
						font-size: 12px;
						max-width: 80px;
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
			}

			.fileinfo:hover {
				border: 2px solid #58ffc3;
			}

			.filebord {
				width: 100%;
				height: 12%;
				background: #174436;
				display: flex;
				align-items: center;

				.nobuy {
					display: flex;
					align-items: center;
					justify-content: space-around;
					width: 100%;
					box-sizing: border-box;

					// padding: 20px;
					.price {
						width: 50%;
						color: #ffffff;
						font-size: 1.2em;
						font-size: 16px;
						text-shadow: 2px 2px #000;
						text-align: center;
						font-weight: bold;
					}

					.shadow {
						// width: 50%;
						// // box-shadow: 5px 10px 20px 5px rgba(88, 255, 195, 0.1);
						// box-shadow: 0 3px 22px rgba(88, 255, 195, 0.3),
						//   0 0 10px rgba(88, 255, 195, 0.3);
					}

					.HollowBtn {
						width: 100%;
						height: 100%;
						line-height: 27px;
						text-align: center;
						font-size: 12px;
						color: #58ffc3;
						display: flex;
						align-items: center;
						justify-content: center;
						.loadicon{
							width: 12px;
							height: 12px;
							margin-right: 4px;
						}
						
					}

					.HollowBtn:hover {
						// box-shadow: 0px 3px 22px rgba(88, 255, 195, 0.3),
						//   0 0 10px rgba(88, 255, 195, 0.3);
					}

					.btn {
						width: 50%;
						height: 100%;
						position: relative;

						img {
							width: 100%;
							height: 100%;
						}

						.btnText {
							width: 100%;
							font-size: 0.8em;
							text-align: center;
							position: absolute;
							left: 50%;
							top: 40%;

							transform: translate(-50%, -50%);
						}
					}
				}
			}

			.nofilebord {
				width: 100%;
				height: 12%;
				background: #174436;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.smallbtn {
			box-sizing: border-box;
			position: relative;
			font-size: 12px;
			cursor: pointer;
			width: 227px;
			height: 30px;

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
			height: 28px;
			width: 134px;
			position: relative;
			font-size: 12px;
			cursor: pointer;
			margin-right: 10px;
			background: transparent;
			img {
				width: 134px;
				height: 28px;

			}
		}

		.paybtn:hover {
			filter: drop-shadow(0px 4px 14px #0D7852)
		}

		.paybtntext {
			position: absolute;
			left: 50%;
			top: 50%;
			font-size: 12px;
			line-height: 28px;
			transform: translate(-50%, -50%);
			color: #58FFC3;
		}
	}
</style>
