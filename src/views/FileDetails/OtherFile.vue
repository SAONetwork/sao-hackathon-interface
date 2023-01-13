<template>
	<el-scrollbar  ref="scrollbar">
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
							<span class="fileEthAddr infostyle" @click="gotoProfile">{{testfile(fileParams.EthAddr)}}</span>
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
								<div class="price">{{fileParams.Price}} ETH</div>
								<div class="middlebtn"  @click="deletethisFile" v-if="fileParams.EthAddr.toLowerCase()==address">
									<img class="btn-img" src="@/assets/images/Profile/redbtn.png" alt="">
									<span  class="btn-text">Delete file</span>
								</div>
							</div>
							<div class="nobuy" v-if="fileParams.Price>0 && fileParams.AlreadyPaid==true">
							
								<ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize">
								</ActiveBtn>
								<div class="price"> paid {{fileParams.Price}} ETH</div>
								
							</div>
							<div class="nobuy" v-if="fileParams.Price==0">
							
								<ActiveBtn @onClickBtn="gotodownload" :btnText="SolidbtnText" :btnstyle="middleSize">
								</ActiveBtn>
								<div class="middlebtn"  @click="deletethisFile" v-if="fileParams.EthAddr.toLowerCase()==address">
									<img class="btn-img" src="@/assets/images/Profile/redbtn.png" alt="">
									<span  class="btn-text">Delete file</span>
								</div>
							</div>
						</div>
							
							<div class="nofilebord"  v-if="islogin==false">
								<!-- <ActiveBtn  v-if="islogin==false" @onClickBtn="login" :btnText='btnText' :btnstyle='bigSize'></ActiveBtn>
								 -->
							</div>

							<div class="leftboard">
								<div class="boardicon" @click="CollectionFile">
									<img class="leftboardicon" v-if="fileParams.Star" src="@/assets/images/Common/star1.png" alt="">
									<img class="leftboardicon" v-else src="@/assets/images/Common/star.png" alt="">
									<span>{{fileParams.TotalCollections}}</span>
								</div>
								<div class="boardicon"><img class="commenticon" src="@/assets/images/Common/comment.png"
										alt="">
									<span>{{fileParams.TotalComments}}</span>
								</div>
								<el-popover
								  placement="right-start"
								  width="210"
								  trigger="hover"
								   popper-class="popoverBackB"
								  >
									<div class="shareBroad">
										<div class="single-share">
											<a
											        href="javascript:window.open('http://twitter.com/home?status='+encodeURIComponent(document.location.href)+' '+encodeURIComponent(document.title),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350');void(0)">
											       <img class="twitter" src="@/assets/images/Market/twitter.png" alt=""> Share to Twitter </a>
											
										</div>
										<div class="single-share">
											
											 <a
											        href="javascript:window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(document.location.href),'_blank','toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=450,top=100,left=350');void(0)">
											        <img  class="facebook"  src="@/assets/images/Market/facebook.png" alt="">
													Share to Facebook
											
											</a>
										</div>
										<div class="single-share" @click="getCopyUrl">
											<img  class="sharelink" src="@/assets/images/Market/sharelink.png" alt="">
											<span v-show="!iscopy">Copy link</span>
											
											<span v-show="iscopy">Copied</span>
										</div>
									</div>
								  <div slot="reference" class="shareicon"><img class="leftshareicon" src="@/assets/images/Common/share.png" alt="">
								  </div>
								  
								</el-popover>
							</div>
						</div>
					</div>
				</div>
				<!-- tab -->
				<div class="changetab">
					<div :class="tabNumber==1?'tabActive singletab':'singletab'" @click="showtabs(1)">
						<span>Comments({{fileParams.TotalComments}})</span>
						<div v-if="tabNumber==1" class="activeBar"></div>
					</div>
					<div :class="tabNumber==2?'tabActive singletab':'singletab'" @click="showtabs(2)">
						<span>Collection list({{fileParams.TotalCollections}})</span>
						<div v-if="tabNumber==2" class="activeBar"></div>
					</div>
				</div>
			</div>
			<!--  -->
			<div class="Comments" v-show="tabNumber==1">
				<Comment :commentList='commentList' @replyComment='replyComment' @deleteComment='deleteFileComments' @likeComment='likeComments'></Comment>
				<div class='nofiles' v-if="commentList.length==0">
					<img class="nofilesicon" src="@/assets/images/Profile/nofiles.png" alt="">
					<span class="nofilestxt">
						No comments
					</span>
				</div>
			</div>
			<div class="Collection" v-show="tabNumber==2">
				<Favorites :favolist='collections'  v-if="collections.length>0"></Favorites>
				<div class='nofiles' v-else>
					<img class="nofilesicon" src="@/assets/images/Profile/nofiles.png" alt="">
					<span class="nofilestxt">
						No collections
					</span>
				</div>
				<div v-show="cancelloading" class="loading-box">
					<img class="loadinggif" src="@/assets/images/Common/saoloading.gif" alt="">
				</div>
			</div>
		</div>
		
		<DiaLog :visible.sync="dialogVisible" :title="DiaLogtitle">
		
		</DiaLog>
		<IntoCollection :visible.sync='showIntoCollection' @aleadyStar='checkAleadyStar' :checkList='intoCollectionList' :fileId='intoFileId' @loadMoreColl='loadMoreColl'></IntoCollection>
		
		<BuyDiaLog :visible.sync="buyDialogVisible" @successbuy='successbuy' @buyingFall='buyingFall'
			:title="BuyDiaLogtitle" :profileInfo='buyinginfo'></BuyDiaLog>
		<SuccessDiaLog :visible.sync="successVisible" :title="BuySuccesstitle" :successBuyinginfo='successBuyinginfo'>
		</SuccessDiaLog>
		<DeleteDialog :visible.sync='showDelete' :title="deleteTitle" @confirmDelete='confirmDelete'></DeleteDialog>
		<FallDiaLog :visible.sync="fallVisible" :fallBuyinginfo='fallBuyinginfo' @successbuy='successbuy'></FallDiaLog>
	</el-scrollbar>
</template>

<script>
	import {
		fileDetails,download,getCollectionList,getComment,addFileComment,deleteFileComment,CommentLike,UnlikeComment,deleteFile
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
				collections:[],
				commentList:[],
				showIntoCollection:false,
				intoCollectionList:[],
				intoFileId:0,
				alreadyStarIndex:0,
				collectionParams:{
					offset:0,
					limit:5,
					fileId:0
				},
				cancelloading:false,
				addCollParams:{
					offset:0,
					limit:6,
					fileId:0,
					owner:''
				},
				addcollTotal:0,
				deleteTitle:'Delete file',
				showDelete:false,
				iscopy: false,
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
			this.collectionParams.fileId= this.$route.query.id
			this.addCollParams.fileId= this.$route.query.id
			this.getfiledetails()
			this.getCollectionLists()
			this.getAboutComment()
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
			
			this.$refs.scrollbar.handleScroll=()=>{
			
			        var wrap = this.$refs.scrollbar.wrap;
			
			        this.$refs.scrollbar.moveY = wrap.scrollTop * 100 / wrap.clientHeight;
			
			        this.$refs.scrollbar.moveX = wrap.scrollLeft * 100 / wrap.clientWidth;
			
			        let poor = wrap.scrollHeight - wrap.clientHeight
			
			        if( poor == parseInt(wrap.scrollTop) || poor == Math.ceil(wrap.scrollTop) || poor == Math.floor(wrap.scrollTop) ){
			
			            
						if(this.tabNumber==2){
			            this.cancelloading?'':this.loadMores()
							
						}
			
			        }
			
			    }
		},
		methods: {
			gotoProfile(){
				if(this.address!==this.fileParams.EthAddr.toLowerCase()){
					let routeData = this.$router.resolve({
						path: 'OtherProfile',
						query: {
							address: this.fileParams.EthAddr
						}
					})
					window.open(routeData.href, '_blank');
				}else{
					let routeData = this.$router.resolve({
						path: 'Profile'
					})
					window.open(routeData.href, '_blank');
					
				}
			},
			getCopyUrl(){
				let url =window.location.href
				
				var cInput = document.createElement("input");
				cInput.value = url;
				document.body.appendChild(cInput);
				cInput.select();
				document.execCommand("copy");
				document.body.removeChild(cInput);
				this.iscopy = true;
				setTimeout(() => {
					this.iscopy = false;
				}, 3000);
			},
			deletethisFile(){
				this.showDelete=true
			},
			confirmDelete(){
				deleteFile(this.fileId).then(res=>{
					
					this.$router.push('/Space',)
				})
			},
			loadMoreColl(){
				
				if (this.addcollTotal > this.intoCollectionList.length) {
					
					this.addCollParams.offset = this.addCollParams.offset + this.addCollParams.limit
					this.getaddCollectionList()
				} 
			},
			loadMores() {
				
				if (this.fileParams.TotalCollections > this.collections.length) {
					this.cancelloading = true
					this.collectionParams.offset = this.collectionParams.offset + this.collectionParams.limit
					this.getCollectionLists()
				} else {
					this.cancelloading = false
				}
			
			},
			CollectionFile(){
				if(this.islogin){
					this.showIntoCollection=true
					this.getaddCollectionList()
				}else{
					this.login()
				}
			
			},
			getaddCollectionList(val){
				let owner = utils.getUser().EthAddr
				this.addCollParams.owner=owner
				this.intoFileId=this.fileParams.Id
				getCollectionList(this.addCollParams).then(res=>{
					if(res.data.Count>0){
						this.intoCollectionList.push(...res.data.Collections)
					}
					this.addcollTotal=res.data.Count
					
					
				})
				
			},
			checkAleadyStar(val){
				this.fileParams.Star=val
				this.getCollectionLists()
				
			},
			replyComment(data,val){
				
				var arr = Object.keys(data);
				if(this.islogin){
					
				
				if(arr.length==0){
					// yiji
					addFileComment({
						"comment": val,
						"fileId": this.fileParams.Id,
						"parentId": 0
					}).then(res=>{
						
						this.commentList.unshift(res.data)
						this.fileParams.TotalComments++
					})
				}else{
					// erji
					addFileComment({
						"comment": val,
						"fileId": this.fileParams.Id,
						"parentId": data.Id
					}).then(res=>{
						
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
				
				deleteFileComment(val.Id).then(res=>{
					
					this.commentList.splice(index,1)
					this.fileParams.TotalComments--
				})
			},
			getCollectionLists(){
				getCollectionList(this.collectionParams).then(res=>{
					
					this.cancelloading=false
					this.fileParams.TotalCollections=res.data.Count
					if(res.data.Count>0){
						this.collections.push(...res.data.Collections)
						
					}
					
				})
			},
			getAboutComment(){
				getComment({
					fileId:this.fileId
				}).then(res=>{
					if(res.data){
						
					this.commentList=res.data
					}else{
						this.commentList=[]
					}
					
				})
			},
			likeComments(val,index){
				
				if(this.islogin){
					if(val.Liked==true){
						
						UnlikeComment(val.Id).then(res=>{
							val.Liked=false
							val.TotalLikes--
						})
					}else{
						CommentLike(val.Id).then(res=>{
							
							val.Liked=true
							val.TotalLikes++
						})
					
					}
				}else{
					this.login()
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
<style>
	.popoverBackB {
		height: 144px;
		padding: 0px !important;
		box-sizing: border-box;
		/* overflow: scroll; */
		background: rgba(10, 51, 32, 0.7) !important;
		border: 1px solid #68B096 !important;
	}

	.el-popper[x-placement^="right"] .popper__arrow::after {
		border-right-color: #000 !important;
		display: none;
	}

	.el-popper[x-placement^="right"] .popper__arrow {
		border-right-color: #44c194 !important;
		display: none;
	}

	.el-popper[x-placement^="left"] .popper__arrow::after {
		border-left-color: #000 !important;
		display: none;
	}

	.el-popper[x-placement^="left"] .popper__arrow {
		border-left-color: #44c194 !important;
		display: none;
	}

	.showtigs {
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		flex-wrap: wrap;
	}

	
	.shareBroad{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.single-share{
		width: 100%;
		height: 47px;
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #68B096;
		border-bottom: 1px solid rgba(104, 176, 150, 0.15);
		padding-left: 20px ;
		box-sizing: border-box;
		cursor: pointer;
	}
	.single-share:nth-child(3){
		border: none;
	}
	.single-share:hover{
		color: #58FFC3;
	}
	.sharelink{
		width: 16px;
		height: 16px;
		margin-right: 8px;
	}
	.twitter{
		width: 17px;
		height: 14px;
		margin-right: 8px;
	}
	.facebook{
		width: 16px;
		height: 16px;
		margin-right: 8px;
	}
	
</style>
<style lang="less" scoped>
	.el-scrollbar {
		height: 100%;
		width: 100%;

		/deep/.el-scrollbar__wrap {
			margin-right: -17px !important;
			overflow: auto;
		}

	}
a{ text-decoration: none; 
		color: #68B096;
		display: flex;
		align-items: center;
		transition: 0.5 s;
	};
	a:hover {  color : #58FFC3 !important; };
	a:visited{ text-decoration: none; }


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
						cursor: pointer;
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
				.middlebtn {
					box-sizing: border-box;
					position: relative;
					font-size: 12px;
					cursor: pointer;
					width: 146px;
					height: 40px;
					margin-left: 32px;
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
						color: #FF5858;
						user-select: none
					}
				}
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
				cursor: pointer;
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
				cursor: pointer;
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
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: #070707;
			.nofiles {
				width: 100%;
				max-width: 1054px;
				background: rgba(9, 20, 15, 0.5);
				height: 410px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			
				.nofilesicon {
					height: 66px;
					width: 66px;
				}
			
				.nofilestxt {
					font-size: 14px;
					color: #243C30;
					padding-top: 10px
				}
			}
		}

		.Collection {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			height: 100%;
			min-height: 500px;
			background: #070707;
			padding-top: 24px;
			.nofiles {
				width: 100%;
				max-width: 1054px;
				background: rgba(9, 20, 15, 0.5);
				height: 410px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			
				.nofilesicon {
					height: 66px;
					width: 66px;
				}
			
				.nofilestxt {
					font-size: 14px;
					color: #243C30;
					padding-top: 10px
				}
			}
			.loading-box{
				width: 100%;
				height: 60px;
				display: flex;
				align-items: center;
				justify-content: center;
				.loadinggif {
					width: 60px;
					height: 60px;
				}
			}
		}
	}
</style>
