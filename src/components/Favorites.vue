<template>
	<div>
		<DeleteDialog :visible.sync='showDelete' :title="deleteTitle" @confirmDelete='confirmDelete'></DeleteDialog>
		<AddCollection  :visible.sync="AddCollectionVisible" :editCollection='readyEditColl' @getlistagain='getcollAgain'></AddCollection>
	<ul class="favorites">
		<li class="singlefavo" v-for="(item,index) in favolist" :key="index" @click.stop='gotodetails(item)'>
			<div class="singlefavo-left">
				<div class="favoCover">
					<img :src="item.Preview" alt="">
				</div>
				<div class="favoinfo">
					<div class="favotitle">
						<div class="favotitlestyle">
							<img class="favotitleicon" src="@/assets/images/Common/Subtract.png" alt="">
							<img v-if="item.Type==1" class="favopriicon" src="@/assets/images/Common/collprivacy.png" alt="">
							<span>{{item.Title}}</span>
						</div>
						
					</div>
					<div class="favodesc">{{item.Description}}</div>
					<div class="favolabel">
						<div class="favotags">
							<span class="singletig" v-for="(v,i) in chanLabel(item.Labels).splice(0,5)" :key="i">{{v}}</span>
						</div>
						<el-popover placement="right" width="300"  trigger="hover" popper-class="popoverBackB"
							v-if="chanLabel(item.Labels).length>5">
							<el-scrollbar> 
							<div class="showtigs">
								<span class="showmoretigs" v-for="(v,i) in chanLabel( item.Labels)" :key="i">{{v}}</span>
							</div>
							</el-scrollbar>
							<img slot="reference" class="tigmoreicon" src="@/assets/images/Market/moreicon.png" alt="">
						</el-popover>
						<!-- <el-popover v-if="chanLabel(item.Labels).length>5" placement="right" width="100" trigger="hover" popper-class="popoverBackB"
							>
							<div class="showtigs">
								<span class="showmoretigs" v-for="(v,i) in chanLabel(item.Labels)" :key="i">{{v}}</span>
							</div>
							<img slot="reference" class="tigmoreicon" src="@/assets/images/Market/moreicon.png" alt="">
						</el-popover> -->
					</div>
				</div>
			</div>
		
			<div class="deal-coll">
				<div class="createdtime">
					{{item.TotalFiles}} files
				</div>
				<div class="edit-coll" @click.stop="editColl(item,index)" v-if="isMine">
					<img src="../assets/images/Common/editicon.png" alt="">
					<span>Edit</span>
				</div>
				<div class="delete-coll" @click.stop="deleteColl(item,index)" v-if="isMine">
					<img src="../assets/images/Common/deletefavo.png" alt="">
					<span>Delete</span>
				</div>
			</div>
		</li>
	</ul>
	<!-- <div class='nofiles' v-if='favolist.length==0'>
		<img class="nofilesicon" src="@/assets/images/Profile/nofiles.png" alt="">
		<span class="nofilestxt">
			No collections
		</span>
	</div> -->
	</div>
</template>

<script>
	import AddCollection from './AddCollection.vue'
	import moment from 'moment'
	export default{
		props:{
			favolist:{
				type:Array,
				default:()=>[]
			},
			isMine:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				showDelete:false,
				AddCollectionVisible:false,
				deleteTitle:'Delete file',
				readyDelete:{},
				readyEditColl:{},
				// favolist:[
				// ]
			}
		},
		filters:{
			filterTime(val){
				return moment(new Date(val)).format('YYYY-MM-DD')
			}
		},
		components:{AddCollection},
		methods:{
			getcollAgain(){
				this.$emit('updatecoll')
			},
			chanLabel(str){
				return str.split(',')
			},
			confirmDelete(){
				this.$emit('confirmDeleteColl',this.readyDelete)
			},
			gotodetails(item){
				// this.$router.push('/CollectionInfo')
				let routeData = this.$router.resolve({
					path: 'CollectionInfo',
					query: {
						id: item.Id
					}
				})
				window.open(routeData.href, '_blank');
				
			},
			deleteColl(item,index){
				this.readyDelete=item
				this.showDelete=true
			},
			editColl(item,index){
				this.readyEditColl=item
				console.log(this.readyEditColl);
				this.AddCollectionVisible=true
			}
		}
	}
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
	.favorites{
		width: 100%;
		width: 900px;
		height: 100%;
		display: flex;
		flex-direction: column;
		// align-items: center;
		.singlefavo{
			width: 900px;
			height: 120px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top:10px ;
			padding: 10px;
			box-sizing: border-box;
			border: 1px solid #68B096;
			background: linear-gradient(45deg, #0B2418 100%, #030F0A 100%);
			cursor: pointer;
			.singlefavo-left{
				
				display: flex;
				align-items: center;
				height: 100px;
			}
			.favoCover{
				width: 100px;
				height: 100px;
				// object-fit: cover;
				margin-right: 20px;
				img{
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.favoinfo{
				// width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.favotitle{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.favotitlestyle{
						display: flex;
						align-items: center;
						font-weight: 700;
						font-size: 16px;
						color: #58FFC3;
						.favotitleicon{
							width: 18px;
							height: 14px;
							margin-right: 6px;
						}
						.favopriicon{
							width: 15px;
							height: 15px;
							margin-right: 6px;
						}
					}
				
				}
				.favodesc{
					width: 560px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 12px;
					line-height: 16px;
					color: #58FFC3;
				}
				.favolabel{
					width: 560px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					overflow: hidden;
					.favotags{
						display: flex;
						align-items: center;
						.singletig {
							height: 20px;
							line-height: 20px;
							padding: 0 10px;
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
		}
		.deal-coll{
			width: 155px;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			justify-content: space-between;
			padding-bottom: 16px;
			box-sizing: border-box;
			.createdtime{
				font-weight: 400;
				font-size: 12px;
				line-height: 16px;
				color: #68B096;
			}
			.edit-coll{
				display: flex;
				align-items: center;
				font-weight: 700;
				font-size: 12px;
				line-height: 16px;
				color: #58FFC3;
				margin-top: 15px;
				img{
					width: 12px;
					height: 12px;
					margin-right: 3px;
				}
			}
			.delete-coll{
				display: flex;
				align-items: center;
				font-weight: 700;
				font-size: 12px;
				line-height: 16px;
				color: #FF5858;
				img{
					width: 10px;
					height: 12px;
					margin-right: 3px;
				}
			}
		}
		.singlefavo:hover{
			border: 2px solid #58FFC3
		}
	}
	.nofiles {
		width: 100%;
		max-width: 1054px;
		background: rgba(9, 20, 15, 0.5);
		height: 410px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	margin-top:20px ;
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
</style>