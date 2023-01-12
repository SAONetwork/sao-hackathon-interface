<template>
	<div class="comments">
		<div class="commentarea">
			<div v-show="showOther" >
				<div class="showcomment">
					<span>Reply </span>
					<span class="reply">{{otherComment.Comment}}</span>
					<img @click="cancelReply" class="deletereply" src="@/assets/images/Connectwallet/Union.png" alt="">
				</div>
				
				
			</div>
			<el-input
			  type="textarea"
			  autosize
			  maxlength="300"
			 ref="inputs"
			  placeholder="Please enter your opinion"
			  v-model="myComment">
			</el-input>
			<div class="inputcomment">
				<div class="inputNumber">{{myComment.length}}/300</div>
				<ActiveBtn @onClickBtn="gotoReply" :btnText="SolidbtnText" :btnstyle="smallSize"></ActiveBtn>
			</div>
		</div>
		<ul class="commentlist">
			<li class="singleComment" v-for="(item,index) in commentList" :key="index">
				<div class="commenthead" @click="gotodetails(item)">
					<img class="commentavatar" v-if="item.Avatar" :src="item.Avatar" alt="">
					<img class="commentavatar" src="../assets/images/Profile/avatar.png" v-else alt="">
				</div>
				<div class="commentdetails">
					<div class="commentfirstuser">
						<span class="commentname">{{item.UserName}}</span>
						<span class="commenttime">{{item.DateTime | filterTime}}</span>
					</div>
					<div class="commentdesc">
						<span>{{item.Comment}} </span>
					</div>
					<div class="otherscomment"  v-if="item.ParentComment">
						<div class="singleotherComment">
							<div class="otherscommenthead"  @click="gotodetails(item.ParentComment)">
								<img class="otherscommentavatar"   v-if="item.ParentComment.Avatar" :src="item.ParentComment.Avatar" alt="">
								<img class="otherscommentavatar" v-else src="../assets/images/Profile/avatar.png"  alt="">
							</div>
							
							<span  class="otherscommentbody" v-if="item.ParentComment.Status==='deleted'">「Comment deleted」</span>
							<span  class="otherscommentbody" v-else>{{item.ParentComment.Comment}}</span>
						</div>
						
					</div>
					<div class="commentoprea">
						<div @click="deleteComment(item,index)" class="commenmove"  v-if="item.Editable">
							<img class="commenticon" src="@/assets/images/Common/deleteicon.png" alt="">
							<span>Remove</span>
						</div>
						<div  class="commenmove" @click="likeComment(item,index)">
							<img v-show="item.Liked" class="commenticon" src="@/assets/images/Common/likeicon.png" alt="">
							<img v-show="!item.Liked" class="commenticon" src="@/assets/images/Common/cancellike.png" alt="">
							<span>{{item.TotalLikes}}</span>
						</div>
						<div  class="commenmove">
							<img  @click="gotComment(item,index)" class="commenticon" src="@/assets/images/Common/comment.png" alt="">
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import ActiveBtn from "./ActiveBtn.vue";
	import moment from 'moment'
	export default{
		props:{
			commentList:{
				type:Array,
				default:()=>[]
			}
			
		},
		filters:{
			filterTime(val){
				return moment(new Date(val)).format('YYYY-MM-DD')
			}
		},
		data() {
			return {
				myComment:'',
			
				SolidbtnText:'POST',
				smallSize:'small',
				inputNumber:0,
				showOther:false,
				otherComment:{},
				focusinput:false,
				CommentLists:[
					{
						name:'MInaj',
						avatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fmtonews.com%2F.image%2Fc_limit%2Ccs_srgb%2Cq_auto%3Agood%2Cw_700%2FMTU1MTAwNjkxNjc5OTQ1ODQ2%2Fnicki_russian1png.png&refer=http%3A%2F%2Fmtonews.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308832&t=c8ed3c942139d1f389a2b0469cf2f874',
						time:'2022-07-26',
						content:'I love reading this magazine',
						goodNumber:300,
						isGood:true,
						pComment:[]
					},{
						name:'dualipa',
						avatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201806%2F27%2F20180627083237_njceu.jpg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308867&t=51f9240d67088c1954d9fc4f406a631f',
						time:'2022-07-26',
						content:'How much does this book sell for on Amazon?',
						goodNumber:300,
						isGood:true,
						
						pComment:[
							{
								pAvatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201806%2F27%2F20180627083237_njceu.jpg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308867&t=51f9240d67088c1954d9fc4f406a631f',
								pContent:'How much does this book sell for on Amazon?'
							},
							{
								pAvatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fmtonews.com%2F.image%2Fc_limit%2Ccs_srgb%2Cq_auto%3Agood%2Cw_700%2FMTU1MTAwNjkxNjc5OTQ1ODQ2%2Fnicki_russian1png.png&refer=http%3A%2F%2Fmtonews.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308832&t=c8ed3c942139d1f389a2b0469cf2f874',
								pContent:'seems like a lot'
							},
						]
					},
					{
						name:'nicki',
						avatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fmtonews.com%2F.image%2Fc_limit%2Ccs_srgb%2Cq_auto%3Agood%2Cw_700%2FMTU1MTAwNjkxNjc5OTQ1ODQ2%2Fnicki_russian1png.png&refer=http%3A%2F%2Fmtonews.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308832&t=c8ed3c942139d1f389a2b0469cf2f874',
						time:'2022-07-26',
						content:'I love reading this magazine',
						goodNumber:300,
						isGood:false,
						ismine:true,
						pComment:[]
					},
					{
						name:'nicki',
						avatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fmtonews.com%2F.image%2Fc_limit%2Ccs_srgb%2Cq_auto%3Agood%2Cw_700%2FMTU1MTAwNjkxNjc5OTQ1ODQ2%2Fnicki_russian1png.png&refer=http%3A%2F%2Fmtonews.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308832&t=c8ed3c942139d1f389a2b0469cf2f874',
						time:'2022-07-26',
						content:'I love reading this magazine',
						goodNumber:300,
						isGood:false,
						ismine:true,
						pComment:[]
					},
					{
						name:'nicki',
						avatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fmtonews.com%2F.image%2Fc_limit%2Ccs_srgb%2Cq_auto%3Agood%2Cw_700%2FMTU1MTAwNjkxNjc5OTQ1ODQ2%2Fnicki_russian1png.png&refer=http%3A%2F%2Fmtonews.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308832&t=c8ed3c942139d1f389a2b0469cf2f874',
						time:'2022-07-26',
						content:'I love reading this magazine',
						goodNumber:300,
						isGood:false,
						ismine:true,
						pComment:[]
					},
					{
						name:'nicki',
						avatar:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fmtonews.com%2F.image%2Fc_limit%2Ccs_srgb%2Cq_auto%3Agood%2Cw_700%2FMTU1MTAwNjkxNjc5OTQ1ODQ2%2Fnicki_russian1png.png&refer=http%3A%2F%2Fmtonews.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661308832&t=c8ed3c942139d1f389a2b0469cf2f874',
						time:'2022-07-26',
						content:'I love reading this magazine',
						goodNumber:300,
						isGood:false,
						ismine:true,
						pComment:[]
					},
				]
			}
		},
		methods:{
			gotodetails(value){
				
				let routeData = this.$router.resolve({
					path: 'OtherProfile',
					query: {
						address: value.EthAddr
					}
				})
				window.open(routeData.href, '_blank');
			},
			gotoReply(){
				
				this.$emit('replyComment',this.otherComment,this.myComment)
				this.otherComment={}
				this.myComment=''
				this.showOther=false
			},
			deleteComment(item,index){
				this.$emit('deleteComment',item,index)
			},
			likeComment(item,index){
				this.$emit('likeComment',item,index)
			},
			cancelReply(){
				this.otherComment={}
				this.showOther=false
			},
			gotComment(item,index){
				this.showOther=true
				this.focusinput=true
				this.otherComment=item
				this.$nextTick(()=>{
				 let id = 'inputs';
				 this.$refs[id].focus();
				})
			}
		},
		components:{ActiveBtn}
	}
</script>

<style lang="less" scoped>
	.comments{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.commentarea{
			position: sticky;
			top:0px;
			left: 0px;
			width:900px;
			min-height: 100px;
			border: 1px solid #58FFC3;
			background: linear-gradient(180deg, #0B2418 0%, #030F0A 100%);
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			margin: 34px 0;
			padding-top: 4px;
			
			/deep/.el-textarea__inner{
				border: none;
				background: none;
				font-family: 'RobotoMono';
				&::placeholder {
					color: #68B096;
					font-size: 12px;
					font-family: 'RobotoMono';
				}
				color: #ffffff;
			}
			.inputcomment{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding: 5px;
				box-sizing: border-box;
				font-size: 14px;
				line-height: 16px;
				color: #68B096;
				.inputNumber{
					padding-right: 15px;
				}
			}
			.showcomment{
				margin: 10px;
				display: flex;
				display: inline-block;
				line-height: 20px;
				align-items: center;
				background: #072114;
				padding: 10px;
				box-sizing: border-box;
				
				.reply{
					color: #58FFC3;
					margin: 0 20px;
				}
				.deletereply{
					width: 15px;
					height: 15px;
					cursor: pointer;
				}
			}
		}
		.commentlist{
			width:900px;
			display: flex;
			flex-direction: column;
			.singleComment{
				width: 100%;
				display: flex;
				align-items: flex-start;
				border-bottom: 1px solid #2A5646;
				padding: 20px 0;
				.commenthead{
					width: 40px;
					height: 40px;
					border: 1px solid #68B096;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					overflow: hidden;
					cursor: pointer;
					.commentavatar{
						width: 39px;
						height: 39px;
						object-fit: cover
					}
				}
				.commentdetails{
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					margin-left: 10px;
					justify-content: space-between;
					font-size: 12px;
					.commentfirstuser{
						display: flex;
						align-items: center;
						.commentname{
							font-weight: 400;
							font-size: 12px;
							line-height: 16px;
							margin-right: 24px;
							color: #58FFC3;
						}
						.commenttime{
							font-weight: 400;
							font-size: 12px;
							line-height: 16px;
						}
					}
					.commentdesc{
						padding: 10px 0;
						font-weight: 400;
						font-size: 14px;
						line-height: 18px;
						
						color: #58FFC3;
					}
					.otherscomment{
						display: flex;
						flex-direction: column;
						width: 100%;
						padding: 15px 21px;
						padding-bottom: 11px;
						background: #072114;
						box-sizing: border-box;
						font-size: 14px;
						line-height: 18px;
						color: #68B096;
						.singleotherComment{
							display: flex;
							align-items: center;
							margin-bottom: 10px;
							
						}
						.otherscommenthead{
							width: 24px;
							height: 24px;
							border: 1px solid #68B096;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 50%;
							overflow: hidden;
							margin-right: 10px;
							cursor: pointer;
							.otherscommentavatar{
								width: 23px;
								height: 23px;
								object-fit: cover
							}
						}
						.otherscommentbody{
							width: 770px;
						}
					}
					.commentoprea{
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						.commenmove{
							cursor: pointer;
							display: flex;
							align-items: center;
							padding: 20px 25px;
							.commenticon{
								width: 16px;
								height: 16px;
								padding-right: 8px;
							}
						}
					}
				}
			}
		}
		
	}
</style>