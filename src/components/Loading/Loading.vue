<template>
	<div v-if="isShowLoading" class="loading-container">
		<div class="loading-box">
			
			<div v-if="seletedType === 'balls' ">
				<img class="loadinggif" src="@/assets/images/Common/saoloading.gif" alt="">
			</div>
			<span class="loading-txt">{{content}}</span>
		</div>
	</div>
</template>

<script>
	
export default {
	data () {
		return {
			isShowLoading: false,
			content: '',
			seletedType: ''
		}
	}
}
</script>

<style scoped>
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(54px);
		z-index: 1000;
	}
	.loading-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 180px;
		height: 180px;
		/* background: linear-gradient(45deg, rgba(0,0,0,1), rgba(0,49,28,0.4)); */
		/* border: 1px solid #68B096; */
	}
	.loadinggif{
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
</style>
