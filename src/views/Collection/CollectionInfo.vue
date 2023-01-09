<template>
	<el-scrollbar>
		<div class="otherfile">
			<DeleteDialog :visible.sync='showDelete' :title="deleteTitle"></DeleteDialog>
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
							<img style="width: 30px;height: 24px;margin-right: 10px;" src="@/assets/images/Common/Subtract.png" alt="">
							<!-- <img style="width: 24px;height: 29px;margin-right: 10px;" src="@/assets/images/Market/col.png" alt=""> -->
							
							<span>{{fileParams.Title}}</span>
							
						</div>
						<div class="filemessage">
							<span class="fileEthAddr infostyle">{{testfile(fileParams.EthAddr)}}</span>
							<div class="gap"></div>
							<span class="infostyle"> Uploaded at&nbsp;{{fileParams.CreatedAt}}</span>
							<div class="gap"></div>
							<span class="infostyle">{{fileParams.TotalFiles}} Files</span>
							<!-- <div class="gap"></div> -->
							<!-- <span class="infostyle">{{fileParams.fileType}}</span> -->
							
							<!-- <div class="gap"></div> -->
							<!-- <span class="infostyle">{{fileParams.fileSize}}</span> -->
						</div>
						<span class="filedesc">
							{{fileParams.Description}}</span>
						<!-- <div class="ipfsandcointitle">
							<span> Ipfs Pinned:&nbsp;</span> <span class="ipfsandcoin"> {{fileParams.IpfsHash}}</span>
						</div> -->
						
						<div class="filelabels">
							<span class="tagstyle" v-for="(v,i) in fileParams.Labels" :key="i">{{v}}</span>
						</div>
						<div class="buyinginfo">
						
							
							

							<div class="leftboard">
								<div class="boardicon" @click="addlike(true)" v-if="fileParams.Liked == false"><img class="leftboardicon" src="@/assets/images/Common/cancellike.png"
										alt="">
									<span>{{fileParams.TotalLikes}}</span>
								</div>
								<div class="boardicon" @click="addlike(false)" v-if="fileParams.Liked == true"><img class="leftboardicon" src="@/assets/images/Common/likeicon.png"
										alt="">
									<span>{{fileParams.TotalLikes}}</span>
								</div>
								<div class="boardicon"><img class="commenticon" src="@/assets/images/Common/comment.png"
										alt="">
									<span>{{fileParams.TotalComments}}</span>
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
						<span>Files({{fileParams.TotalFiles}})</span>
						<div v-if="tabNumber==1" class="activeBar"></div>
					</div>
					<div :class="tabNumber==2?'tabActive singletab':'singletab'" @click="showtabs(2)">
						<span>Comments({{fileParams.TotalComments}})</span>
						<div v-if="tabNumber==2" class="activeBar"></div>
					</div>
				</div>
			</div>
			<!--  -->
			<div class="Comments" v-show="tabNumber==2">
				<Comment :commentList='commentList' @replyComment='replyComment' @deleteComment='deleteFileComments' @likeComment='likeComments'></Comment>
			</div>
			<div class="Collection" v-show="tabNumber==1">
				<!-- <Favorites></Favorites> -->
				<div class="Collection-list">
					<FileList :FileList='CollectionList'
						@loginwallet='getlogin'>
					</FileList>
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
		getCollectionList,deleteCollectionLike,likeCollection,getCollectionFilelist,
		UnlikeCollComment,
		CollCommentLike,
		deleteCollComment,
		addCollComment,
		getCollComment
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
	import FileList from "@/components/FileList.vue";
	export default {
		data() {
			return {
				showDelete:false,
				deleteTitle:'Delete file',
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
				 CollectionList:[],
				 fileinfoParams: {
				 	offset: 0,
				 	limit: 0,
				 	collectionId:0
				 },
				 islogin: false,
				 bigSize:'big',
				 btnText:'CONNECT WALLET',
				 
				fileParams: {
					Preview:'',
					Title:'Collection 20220507',
					EthAddr:'0x5344...2D3846',
					CreatedAt:"2022/6/27 08:11 ",
					FileCategory:"jpg1",
					fileType:"jpg",
					fileSize:"3.4M",
					Description:"The Fed: more rate pain awaits Alibaba and 40 officials, The Fed: more rate pain awaits Alibaba and 40 officials The Fed: more rate pain awaits Alibaba and 40 officials,The Fed: more rate pain awaits Alibaba and 40 officials",
					Labels:['a','b']
				},
				SolidbtnText: 'Download',
				paynowbtnText: 'BUY NOW',
				middleSize: 'middle',
				tabNumber: 1,
				fileId: '',
				address:'',
				collectionId:0,
				commentList:[]
			}
		},
		components: {
			ActiveBtn,
			Comment,
			Favorites,
			DiaLog,
			BuyDiaLog,
			SuccessDiaLog,
			FallDiaLog,
			FileList
		},
		created() {
			this.$saoloading.show('Loading', 'ball');
			this.collectionId = this.$route.query.id
			// this.getfiledetails()
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
			this.getCollectiondetails()
			this.getAboutComment()
		},
		mounted() {
			
		},
		methods: {
			getaddCollectionList(val){
				let owner = utils.getUser().EthAddr
				this.intoFileId=this.fileParams.Id
				getCollectionList(this.addCollParams).then(res=>{
					if(res.data.Count>0){
						this.intoCollectionList.push(...res.data.Collections)
					}
					this.addcollTotal=res.data.Count
					
					console.log(res);
				})
				
			},
			checkAleadyStar(val){
				this.fileParams.Star=val
				this.collectionParams.offset=0
				this.collections=[]
				this.getCollectionLists()
				
			},
			replyComment(data,val){
				
				var arr = Object.keys(data);
				console.log('data',data);
				console.log('val',val);
				if(this.islogin){
					
				if(arr.length==0){
					// yiji
					addCollComment({
						"comment": val,
						"collectionId": Number(this.collectionId),
						"parentId": 0
					}).then(res=>{
						console.log(res);
						this.commentList.unshift(res.data)
						this.fileParams.TotalComments++
					})
				}else{
					// erji
					addCollComment({
						"comment": val,
						"collectionId": Number(this.collectionId),
						"parentId": data.Id
					}).then(res=>{
						console.log(res);
						let arr=res.data
						arr.ParentComment={}
						arr.ParentComment=data
						this.fileParams.TotalComments++
						this.commentList.unshift(arr)
						
					})
				}
				}else{
					this.login()
				}
			},
			deleteFileComments(val,index){
				console.log(val);
				console.log(index);
				deleteCollComment(val.Id).then(res=>{
					console.log(res);
					this.commentList.splice(index,1)
					this.fileParams.TotalComments--
				})
			},
			getCollectionLists(){
				
				getCollectionList(this.collectionParams).then(res=>{
					this.cancelloading=false
					if(res.data.Count>0){
						this.collections.push(...res.data.Collections)
						this.fileParams.TotalCollections=res.data.Count
					}
					
					
				})
			},
			getAboutComment(){
				getCollComment({
					collectionId:this.collectionId
				}).then(res=>{
					if(res.data){
						
					this.commentList=res.data
					}else{
						this.commentList=[]
					}
					console.log(res);
				})
			},
			likeComments(val,index){
				console.log(val);
				if(this.islogin){
					if(val.Liked==true){
						
						UnlikeCollComment(val.Id).then(res=>{
							val.Liked=false
							val.TotalLikes--
						})
					}else{
						CollCommentLike(val.Id).then(res=>{
							console.log(res);
							val.Liked=true
							val.TotalLikes++
						})
					
					}
				}else{
					this.login()
				}
				
			},
			
			
			
			addlike(boolean){
				if(this.islogin){
					this.fileParams.Liked = !this.fileParams.Liked
					if(boolean){
						this.fileParams.TotalLikes++
						likeCollection(this.fileParams.Id).then(res=>{
							console.log(res);
						})
						
					}else{
						deleteCollectionLike(this.fileParams.Id).then(res=>{
							console.log(res);
						})
						this.fileParams.TotalLikes--
					}
				}else{
					this.login()
				}
				
			},
			getCollectiondetails(){
				getCollectionList({
					collectionId:this.collectionId
				}).then(res=>{
					this.fileParams=res.data.Collections[0]
					this.fileParams.CreatedAt = moment(new Date(res.data.Collections[0].CreatedAt)).format('YYYY-MM-DD')
					this.fileParams.Labels = res.data.Collections[0].Labels.split(',')
					this.$saoloading.hide();
					this.getFileList()
					console.log(res);
				})
			},
			getFileList() {
				// if (this.showlist == false) {
				// 	this.showMarket = true
			
				// } else {
				// 	this.showMarket = false
				// }
				this.fileinfoParams.collectionId=this.fileParams.Id
				getCollectionFilelist(this.fileinfoParams).then(res => {
					console.log(res);
					this.CollectionList.push(...res.data)
				}).catch()
			},
			getlogin(){},
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
					display: flex;
					align-items: center;
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
				width: 16px;
				height: 16px;
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
			display: flex;
			align-items: center;
			justify-content: center;
			background: #070707;
			padding-top: 24px;
			.Collection-list{
				max-width: 1072px;
			}
		}
	}
</style>
