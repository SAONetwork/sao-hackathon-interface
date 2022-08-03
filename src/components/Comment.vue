<template>
	<div class="comments">
		<div class="commentarea">
			<el-input
			  type="textarea"
			  autosize
			  placeholder="Please enter your opinion"
			  v-model="myComment">
			</el-input>
			<div class="inputcomment">
				<div class="inputNumber">{{myComment.length}}/300</div>
				<ActiveBtn @onClickBtn="gotoupload" :btnText="SolidbtnText" :btnstyle="smallSize"></ActiveBtn>
			</div>
		</div>
		<ul class="commentlist">
			<li class="singleComment" v-for="(item,index) in CommentList" :key="index">
				<div class="commenthead">
					<img class="commentavatar" :src="item.avatar" alt="">
				</div>
				<div class="commentdetails">
					<div class="commentfirstuser">
						<span class="commentname">{{item.name}}</span>
						<span class="commenttime">{{item.time}}</span>
					</div>
					<div class="commentdesc">
						<span>{{item.content}} </span>
					</div>
					<div class="otherscomment"  v-if="item.pComment.length>0">
						<div class="singleotherComment" v-for="(v,i) in item.pComment">
							<div class="otherscommenthead">
								<img class="otherscommentavatar" :src="v.pAvatar" alt="">
							</div>
							<span>{{v.pContent}}</span>
						</div>
						
					</div>
					<div class="commentoprea">
						<div class="commenmove"  v-if="item.ismine">
							<img class="commenticon" src="@/assets/images/Common/deleteicon.png" alt="">
							<span>Remove</span>
						</div>
						<div  class="commenmove">
							<img v-show="item.isGood" class="commenticon" src="@/assets/images/Common/likeicon.png" alt="">
							<img v-show="!item.isGood" class="commenticon" src="@/assets/images/Common/cancellike.png" alt="">
							<span>{{item.goodNumber}}</span>
						</div>
						<div  class="commenmove">
							<img class="commenticon" src="@/assets/images/Common/comment.png" alt="">
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import ActiveBtn from "./ActiveBtn.vue";
	export default{
		data() {
			return {
				myComment:'',
				SolidbtnText:'POST',
				smallSize:'small',
				inputNumber:0,
				CommentList:[
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
				]
			}
		},
		methods:{
			gotoupload(){},
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
							.otherscommentavatar{
								width: 23px;
								height: 23px;
								object-fit: cover
							}
						}
					}
					.commentoprea{
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						.commenmove{
							
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