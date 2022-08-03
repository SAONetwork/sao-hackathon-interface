<template>
	<ul class="favorites">
		<li class="singlefavo" v-for="(item,index) in favolist" :key="index">
			<img class="favoCover" :src="item.preview" alt="">
			<div class="favoinfo">
				<div class="favotitle">
					<div class="favotitlestyle">
						<img class="favotitleicon" src="@/assets/images/Common/Subtract.png" alt="">
						<span>{{item.title}}</span>
					</div>
					<div class="createdtime">
						Create at {{item.createdtime}}
					</div>
				</div>
				<div class="favodesc">{{item.desc}}</div>
				<div class="favolabel">
					<div class="favotags">
						<span class="singletig" v-for="(v,i) in chanLabel(item.labels)" :key="i">{{v}}</span>
					</div>
					<el-popover placement="right" width="100" trigger="hover" popper-class="popoverBackB"
						>
						<div class="showtigs">
							<span class="showmoretigs" v-for="(v,i) in chanLabel(item.labels)" :key="i">{{v}}</span>
						</div>
						<img slot="reference" class="tigmoreicon" src="@/assets/images/Market/moreicon.png" alt="">
					</el-popover>
				</div>
			</div>
		</li>
	</ul>
</template>

<script>
	export default{
		data(){
			return{
				favolist:[
					{
						preview:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg3.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp464468530.jpg&refer=http%3A%2F%2Fimg3.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661323920&t=a726ddf99fedfcb168b1ace979181e4a',
						title:"Crypto Mining",
						desc:"Contains knowledge of mining cryptocurrencies,#Bitcoin #Filecoin #Dogecoin...",
						createdtime:"06-07-2022",
						labels:'sky,blue,lana,del,ray'
					},
					{
						preview:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg3.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp464468530.jpg&refer=http%3A%2F%2Fimg3.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661323920&t=a726ddf99fedfcb168b1ace979181e4a',
						title:"Crypto Mining",
						desc:"Contains knowledge of mining cryptocurrencies,#Bitcoin #Filecoin #Dogecoin...",
						createdtime:"06-07-2022",
						labels:'sky,blue,lana,del,ray'
					}
				]
			}
		},
		methods:{
			chanLabel(str){
				return str.split(',')
			}
		}
	}
</script>

<style lang="less" scoped>
	.favorites{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
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
			.favoCover{
				width: 100px;
				height: 100px;
				object-fit: cover;
				margin-right: 20px;
			}
			.favoinfo{
				width: 100%;
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
						line-height: 21px;
						color: #58FFC3;
						.favotitleicon{
							width: 18px;
							height: 14px;
							margin-right: 6px;
						}
					}
					.createdtime{
						font-weight: 400;
						font-size: 12px;
						line-height: 16px;
						color: #68B096;
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
		.singlefavo:hover{
			border: 2px solid #58FFC3
		}
	}
</style>