<template>

	<transition name="dialog-fade">
		<div class="dialog" v-if="visible" @click.self="cancleDialog">
			<div class="dialoginfo">
				<img class="dialogback" src="@/assets/images/Common/addcollBg.png" alt="">
				<div class="dialogmess">
					<div class="dialoghead">
						<span>Add to collection</span>
						<i class="el-icon-close" @click="cancleDialog"></i>
					</div>
				</div>
				<div class="dialogmain">
					<div class="dialog-content">
						<div class="create-collection" @click="CreateCollection">
							+ Create Collection
						</div>
						<div>
							<el-scrollbar>
								
								<ul  v-infinite-scroll="load">
									<li  :class="item.FileIncluded?'ischeckedList collectionlist':'collectionlist'" v-for="(item,index) in checkList" :key="index" @click="changeCheck(item,index)">
										
										<div class="nocheck" v-show="!item.FileIncluded">
											<img src="../assets/images/Market/notcol.png" alt="">
										</div>
										<div class="ischecked" v-show="item.FileIncluded">
											<img src="../assets/images/Market/iscol.png" alt="">
										</div>
										<div class="coll-info">
											<img :class="item.FileIncluded?'ischeckecoll-preview coll-preview':'coll-preview'" :src="item.Preview" alt="">
											<img v-if="item.Type==1" class="favopriicon" src="@/assets/images/Common/collprivacy.png" alt="">
											<span>{{item.Title | ellipsis}}</span>
										</div>
										<div class="userdspace">
											{{item.TotalFiles}}/{{item.MaxFiles}}
										</div>
									</li>
									
								</ul>
							</el-scrollbar>
						</div>
					</div>
					<div class="btn">
						<BorderBtn class="padingstyle" @onClickBtn="cancleDialog" :btnText='BorderbtnText' :btnstyle='uploadbtnstyle'>
						</BorderBtn>
						<ActiveBtn  class="padingstyle" @onClickBtn="confirmInto" :btnText='SolidbtnText' :btnstyle='uploadbtnstyle'>
						</ActiveBtn>
					</div>
				</div>
				
			</div>
			<AddCollection  :visible.sync="AddCollectionVisible" @getlistagain='cancleDialog'></AddCollection>
		</div>
	</transition>
</template>

<script>
	// import { getUserProfile, update, getUserDashboard } from "@/api/UserApi.js";
	import {joinCollection} from "@/api/FileApi.js";
import ActiveBtn from "./ActiveBtn";
	import AddCollection from '@/components/AddCollection.vue'
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
				default: ''
			},
			checkList:{
				type:Array,
				default:()=>[]
			},
			fileId:{
				type:Number,
				default:0
			}
		},
		components:{
			ActiveBtn,BorderBtn,AddCollection
		},
		  
		  filters: {
		    
		    ellipsis(value) {
		      if (!value) return "";
		      if (value.length > 30) {
		        
		        return (
		          value
		            .replace(/&nbsp;/g, "")
		            .replace("<br>", "")
		            .replace(/\s/g, "")
		            .slice(0, 30) + "..."
		        );
		      }
		      return value.replace(/\n/g, "<br>");
		    }
		  },

		data() {
			return {
				chekced:[],
				
				// visible:true
				BorderbtnText:"CLOSE",
				uploadbtnstyle:"middle",
				SolidbtnText:'CONFIRM',
				AddCollectionVisible:false,
			};
		},
		methods: {
			load(){
				this.$emit('loadMoreColl')
			},
			CreateCollection(){
				this.AddCollectionVisible=true
			},
			changeCheck(item,index){
				
				item.FileIncluded = !item.FileIncluded
			},
			confirmInto(){
				let checkArr=this.checkList.filter(item=>{
					if(item.FileIncluded==true){
						return item.Id
					}
				}).map(value=>{
					return value.Id
				})
				joinCollection({
					collectionIds:checkArr,
					fileId:this.fileId
				}).then(res=>{
					
					this.$emit('aleadyStar',res.data)
					this.cancleDialog()
				})
			
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
			height: 580px;
			position: absolute;
			left: 50%;
			top: 50%;
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
				margin-bottom: 10px;
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
				// padding: 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				.dialog-content{
					width: 460px;
					height: 435px;
					text-align: center;
					color: #58FFC3;
					.create-collection{
						width: 100%;
						height: 40px;
						background: rgba(88, 255, 195, 0.1);
						border: 1px solid #68B096;
						text-align: center;
						line-height: 40px;
						cursor: pointer;
						margin-bottom: 10px;
					}
					.el-scrollbar ::v-deep .el-scrollbar__wrap {
							overflow-y: scroll;
							overflow-x: hidden;
						}
					.el-scrollbar {
							// height:  e("calc(100% - 120px)");
							min-width: 250px;
							height: 350px;
						}
						
						.collectionlist{
							width: 460px;
							height: 60px;
							padding:0 16px;
							box-sizing: border-box;
							display: flex;
							align-items: center;
							justify-content: space-between;
							cursor: pointer;
							/deep/.el-checkbox__input{
								width: 14px;
								height: 14px;
								border: 1px solid #68B096;
								
								// box-sizing: border-box;
							}
							/deep/.el-checkbox__inner{
								background-color: transparent;
								border: none;
								// border: 1px solid #68B096;
							}
							
							/deep/.is-checked{
								.el-checkbox__inner{
									background-color: #58FFC3;
									border-radius: 0;
								}
								.el-checkbox__inner::after{
									    border: 2px solid #000;
										    box-sizing: content-box;
										    content: "";
										    border-left: 0;
										    border-top: 0;
										    height: 7px;
										    left: 4px;
										    position: absolute;
										    top: 1px;
										    width: 3px;
								}
							}
							
							.coll-info{
								width: 330px;
								display: flex;
								align-items: center;
								justify-content: flex-start;
								font-size: 14px;
								.coll-preview{
									border: 1px solid #68B096;
									width: 32px;
									height: 32px;
									margin-right: 20px;
								}
								.favopriicon{
									width: 15px;
									height: 15px;
									margin-right: 6px;
								}
								.ischeckecoll-preview{
									border: 2px solid #58FFC3;
								}
							}
							.userdspace{
								font-size: 12px;
								color:  #68B096;
							}
							.nocheck{
								width: 14px;
								height: 14px;
								
								img{
									width: 14px;
									height: 14px;
								}
							}
							.ischecked{
								width: 14px;
								height: 14px;
								img{
									width: 14px;
									height: 14px;
								}
							}
						}
						.ischeckedList{
								background: rgba(88, 255, 195, 0.1);
						}
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
