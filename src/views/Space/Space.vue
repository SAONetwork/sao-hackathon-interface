<template>
	<div class="filemarket">
		<div class="filters">
			<div class="filterstitle">
				<img src="@/assets/images/Market/refine.png" alt="">
				<span class='filterby'>Filter by</span>
			</div>
			<div v-for="(item,index) in selcectTab" :key="index">
				<el-radio-group class="radioGroup" v-model="selcectedValue[index].selcectTabValue"
					@change="changeSelect(index)" fill="#63a78f" text-color='#63a78f'>
					<div class="selectedstatus">
						<el-radio class="firstGroup" :label="item.first.name">{{item.first.name}}
						</el-radio>
						<!-- <div v-if="selcectedValue[index].selcectTabValue==item.first.name" class="selectedstatus1">
								<img src="@/assets/images/Market/Vector.png" alt="">

							</div> -->
					</div>
					<div class="secStatus" v-for="(v,i) in item.secend" :key="i">
						<el-radio class="secGroup" :label="v.name">{{v.name}}</el-radio>
						<!-- <div v-if="selcectedValue[index].selcectTabValue==v.name" class="selectedstatus1">
								<img src="@/assets/images/Market/Vector.png" alt="">

							</div> -->

					</div>

				</el-radio-group>
				<div class="gap" v-if="index != selcectTab.length-1"></div>
			</div>

		</div>

		<div class="markets" ref="markets">

			<div class="finem">
				<span>Space</span>
				<img v-show="!showlist" @click="changefiletype(1)" class="changtypeicon"
					src="@/assets/images/Market/changtype.png" alt="">
				<img v-show="showlist" @click="changefiletype(2)" class="changtypeicon"
					src="@/assets/images/Market/changetype1.png" alt="">
			</div>

			<el-scrollbar v-show="showlist">
				<DocList :cancelloading='cancelloading' :FileList='FileMarketList' @loginwallet='getlogin'
					@buyItem='buyprofile' @loadMore='loadMores'>
				</DocList>
			</el-scrollbar>


			<el-scrollbar v-show="!showlist">
				<FileList :FileList='FileMarketList' @loginwallet='getlogin' @buyItem='buyprofile'
					@loadMore='loadMores'>
				</FileList>
			</el-scrollbar>
			<div class="loadingdialog" v-show="showMarket">
				<div class="loading-box">

					<div>
						<img class="loadinggif" src="@/assets/images/Common/saoloading.gif" alt="">
					</div>
					<span class="loading-txt">Loading</span>
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
	</div>
</template>

<script>
	import {
		fileInfos,
		download,
		cancelUpload,
		addFileWithPreview
	} from "../../api/FileApi.js"

	import config from "../../libs/config.js"
	import utils from "../../libs/utils.js"
	import FileList from "@/components/FileList.vue";
	import DocList from "@/components/DocList.vue";
	import DiaLog from "@/components/DiaLog.vue";
	import BuyDiaLog from "@/components/BuyDiaLog.vue";
	import SuccessDiaLog from "@/components/SuccessDiaLog.vue";
	import FallDiaLog from "@/components/FallDiaLog.vue";

	export default {
		created() {},
		components: {
			FileList,
			DocList,
			DiaLog,
			BuyDiaLog,
			SuccessDiaLog,
			FallDiaLog
		},
		data() {
			return {
				cancelloading: false,
				showMarket: false,
				showlist: false,
				DiaLogtitle: "Connect wallet",
				BuyDiaLogtitle: "Checkout",
				dialogVisible: false,
				buyDialogVisible: false,
				successVisible: false,
				fallVisible: false,
				SolidbtnText: "UPLOAD",
				BuySuccesstitle: "Congratulations, purchase success!",
				buyinginfo: {},
				successBuyinginfo: {},
				fallBuyinginfo: {},

				FileMarketList: [

				],
				selcectTab: [{
						first: {
							name: "All Pricing"
						},
						secend: [{
							name: "Free"
						}, {
							name: "Premium"
						}],
						selcectTabValue: ""
					},
					{
						first: {
							name: "All Types"
						},
						secend: [{
							name: "Video"
						}, {
							name: "Music"
						}, {
							name: "Document"
						}, {
							name: "Other"
						}],
						selcectTabValue: ""
					},
					{
						first: {
							name: "All Formats"
						},
						secend: [{
								name: "MP4"
							},
							{
								name: "MP3"
							},
							{
								name: "JPG"
							}
						],
						selcectTabValue: ""
					}
				],
				selcectedValue: [{
						selcectTabValue: "All Pricing"
					},
					{
						selcectTabValue: "All Types"
					},
					{
						selcectTabValue: "All Formats"
					}
				],
			
				fileTotal: 0,

				fileParams: {
					offset: 0,
					limit: 0,
					pricing: '',
					type: '',
					format: ''
				}
			};
		},
		created() {
			this.$nextTick(()=>{
				var eWidth = this.$refs.markets.clientWidth
				this.fileParams.limit=Math.floor(eWidth/250)*3
			})
			this.showMarket = true
			this.getFileList()
		},
		methods: {

			loadMores() {
				
				if (this.fileTotal > this.FileMarketList.length) {
					this.fileParams.offset = this.fileParams.offset + this.fileParams.limit
					this.getFileList()
					this.cancelloading = false
				} else {
					this.cancelloading = true
				}

			},
			getFileList() {
				// if (this.showlist == false) {
				// 	this.showMarket = true

				// } else {
				// 	this.showMarket = false
				// }
				fileInfos(this.fileParams).then(res => {
					console.log(res);
					this.fileTotal = res.data.Total
					this.showMarket = false
					// this.cancelloading=true
					if (res.data.FileInfoInMarkets != null) {
						res.data.FileInfoInMarkets.forEach(item => {
							item.iscol = false
						})
						this.FileMarketList.push(...res.data.FileInfoInMarkets)
					}
				}).catch()
			},
			changeSelect(index) {
				this.showMarket = true
				console.log(this.selcectedValue);
				console.log(this.selcectedValue[index]);
				console.log(this.selcectedValue);
				// price
				if (index == 0) {
					this.fileParams.offset = 0
					if (this.selcectedValue[index].selcectTabValue == 'Free') {
						this.fileParams.pricing = false
						this.FileMarketList = []
						this.getFileList()
					} else if (this.selcectedValue[index].selcectTabValue == "Premium") {
						this.fileParams.pricing = true
						this.FileMarketList = []
						this.getFileList()
					} else {
						this.fileParams.pricing = ''
						this.FileMarketList = []
						this.getFileList()
					}
				}
				if (index == 1) {
					if(this.selcectedValue[index].selcectTabValue == 'All Types'){
						this.fileParams.offset = 0
						this.fileParams.type = ''
						this.FileMarketList = []
						this.getFileList()
					}else{
						this.fileParams.offset = 0
						this.fileParams.type = this.selcectedValue[index].selcectTabValue
						this.FileMarketList = []
						this.getFileList()
					}
					

				}
				if (index == 2) {
					if(this.selcectedValue[index].selcectTabValue == 'All Formats'){
						this.fileParams.offset = 0
						this.fileParams.format = ''
						this.FileMarketList = []
						this.getFileList()
					}else{
						this.fileParams.offset = 0
						this.fileParams.format = this.selcectedValue[index].selcectTabValue
						this.FileMarketList = []
						this.getFileList()
					}
					

				}
			},
			getlogin() {
				this.dialogVisible = true;
			},
			buyprofile(item) {
				console.log(item);
				this.buyDialogVisible = true;
				this.buyinginfo = item;
			},
			successbuy(item) {
				console.log("success:", item);
				this.successVisible = true;
				this.successBuyinginfo = item;
				// this.FileMarketList.forEach(item => {
				//   if(item){

				//   }
				// });
			},
			buyingFall(item) {
				this.fallVisible = true
				this.fallBuyinginfo = item
			},
			changefiletype(val) {
				if (val == 1) {
					this.showlist = true
				} else {
					this.showlist = false
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	.el-scrollbar {
		height: 100%;
		min-width: 250px;


	}

	.el-scrollbar ::v-deep .el-scrollbar__wrap {
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.filemarket {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;

		box-sizing: border-box;

		.filters {
			width: 250px;
			height: 100%;
			background: rgba(0, 0, 0, 0.4);
			display: flex;
			flex-direction: column;
			font-size: 15px;
			min-width: 150px;

			.filterstitle {
				display: flex;
				align-items: center;
				padding: 1em 2em;
				color: #58ffc3;
				background: rgb(0, 0, 0);

				img {
					width: 16px;
					height: 16px;
					margin-right: 8px;
				}

				.filterby {
					font-size: 14px;
					font-weight: bold
				}
			}

			.gap {
				width: 100%;
				height: 1px;
				background: #1a3e2c;
			}

			.radioGroup {
				width: 100%;

				//   height: 100%;
				.selectedstatus {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					position: relative;

					.selectedstatus1 {
						width: 20px;
						height: 20px;
						display: block;
						// z-index: 5;
						position: absolute;
						display: flex;
						align-items: center;
						justify-content: center;
						// background: #54f2b9;
						right: 10px;
						top: 50%;
						transform: translateY(-50%);

						img {
							width: 22px;
							height: 12px;
						}
					}
				}

				.secStatus {
					width: 100%;
					height: 100%;
					position: relative;

					.selectedstatus1 {
						width: 20px;
						height: 20px;
						display: block;
						// z-index: 5;
						position: absolute;
						display: flex;
						align-items: center;
						justify-content: center;
						// background: #54f2b9;
						right: 10px;
						top: 50%;
						transform: translateY(-50%);

						img {
							width: 22px;
							height: 12px;
						}
					}
				}

				.is-checked {
					background: rgba(88, 255, 195, 0.1);

					/deep/.el-radio__label {
						color: #54f2b9;
						font-size: 14px
					}
				}

				.firstGroup {
					width: 100%;
					padding: 14px 0;
					padding-left: 30px;
					color: #4f8873;
					box-sizing: border-box;
					margin: 0;

					/deep/.el-radio__inner {
						background: #07100c;
						border-color: #43c395;
					}

					/deep/ .el-radio__inner::after {
						background-color: #43c395;
						width: 6px;
						height: 6px;
					}
				}

				.secGroup {
					width: 100%;
					padding: 12px 0;
					padding-left: 50px;
					box-sizing: border-box;
					color: #4f8873;
					margin: 0;

					/deep/.el-radio__inner {
						background: #07100c;
						border-color: #43c395;
					}

					/deep/ .el-radio__inner::after {
						background-color: #43c395;
						width: 6px;
						height: 6px;
					}
				}
			}
		}

		.markets {
			flex: 1;
			height: 100%;
			width: 100%;
			box-sizing: border-box;
			padding: 15px 0;
			padding-left: 32px;
			overflow: hidden;

			/deep/.filelist {
				padding-bottom: 50px;
			}

			// padding-bottom: 50px;
			// position: relative;
			.finem {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 24px;
				color: #58FFC3;
				padding-left: 8px;
				padding-bottom: 13px;
				z-index: 88;
				box-sizing: border-box;
				padding-right: 20px;

				.changtypeicon {
					width: 73px;
					height: 36px;
					cursor: pointer;
				}

			}

			.loadingdialog {
				position: absolute;
				width: calc(100% - 250px);
				height: calc(100% - 70px);
				z-index: 99;
				top: 70px;
				left: 250px;
				background-color: rgba(0, 0, 0, 0.7);

				.loading-box {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 180px;
					height: 180px;
					position: absolute;
					left: 50%;
					top: 40%;
					transform: translate(-50%, -50%);
					// background: linear-gradient(45deg, rgba(0, 0, 0, 1), rgba(0, 49, 28, 0.4));
					// border: 1px solid #68B096;
				}

				.loadinggif {
					width: 60px;
					height: 60px;
				}

				.loading-txt {
					font-size: 16px;
					font-weight: bold;
					color: #58FFC3;
					margin-top: 6px;
					font-family: 'RobotoMono'
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
