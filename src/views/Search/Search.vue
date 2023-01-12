<template>
	<div class="search-content" ref="searchContent">
		<div class="head" ref="head">
			<h2 class="searchinfo">"{{searchInfo}}"</h2>
			<div class="tabs">
				<div :class="tabNumber==1?'tabActive singletab':'singletab'" @click="showtabs(1)">
					<span>Files</span>

					<div v-if="tabNumber==1" class="activeBar"></div>


				</div>
				<div :class="tabNumber==2?'tabActive singletab':'singletab'" @click="showtabs(2)">
					<span>Collection</span>

					<div v-if="tabNumber==2" class="activeBar"></div>

				</div>
				<div :class="tabNumber==3?'tabActive singletab':'singletab'" @click="showtabs(3)">
					<span>Users</span>

					<div v-if="tabNumber==3" class="activeBar"></div>

				</div>

			</div>
		</div>
		<div class="search-container">
			<div v-if="tabNumber==1">
				<el-scrollbar :style="{height:searchArea+'px'}">
					<FileList :FileList='CollectionList' :loading="loading" @loginwallet='getlogin'>
					</FileList>
					<div class='nofiles' v-if="!loading&&CollectionList.length<=0">
						<img class="nofilesicon" src="@/assets/images/Profile/nofiles.png" alt="">
						<span class="nofilestxt">
							No Files
						</span>
					</div>
				</el-scrollbar>
			</div>
			<div v-if="tabNumber==2">
				<el-scrollbar :style="{height:searchArea+'px'}">
					<Favorites :favolist="CollectionList" :loading="loading"></Favorites>
					<div class='nofiles' v-if="!loading&&CollectionList.length<=0">
						<img class="nofilesicon" src="@/assets/images/Profile/nofiles.png" alt="">
						<span class="nofilestxt">
							No Collection
						</span>
					</div>
				</el-scrollbar>
			</div>
			<div v-if="tabNumber==3">
				<el-scrollbar :style="{height:searchArea+'px'}">
					<UserList :userlist="CollectionList" :loading="loading"></UserList>
					<div class='nofiles' v-if="!loading&&CollectionList.length<=0">
						<img class="nofilesicon" src="@/assets/images/Profile/nofiles.png" alt="">
						<span class="nofilestxt">
							No Users
						</span>
					</div>
				</el-scrollbar>
			</div>
			<div class="loadingdialog" v-if="loading&&CollectionList.length<=0">
				<div class="loading-box">
					<div>
						<img class="loadinggif" src="@/assets/images/Common/saoloading.gif" alt="">
					</div>
					<span class="loading-txt">Loading</span>
				</div>

			</div>
		</div>


		<!-- <div class="loadingdialog" v-show="showMarket">
			<div>
		
				<div>
					<img class="loadinggif" src="@/assets/images/Common/saoloading.gif" alt="">
				</div>
				<span class="loading-txt">Loading</span>
			</div>
		</div> -->
	</div>
</template>

<script>
	import {
		fileDetails,
		download,
		fileInfos,
		getSearch
	} from '../../api/FileApi.js'
	import Favorites from '../../components/Favorites.vue'
	import FileList from '../../components/FileList.vue'
	import UserList from '../../components/UserList.vue'
	export default {
		data() {
			return {
				searchInfo: '',
				tabNumber: 1,
				CollectionList: [],
				loading: false,
				searchArea: 600
			}
		},
		mounted() {
			let height = this.$refs.head.offsetHeight; //100
			let contentHeight = this.$refs.searchContent.offsetHeight
			this.searchArea = contentHeight - height - 80
		},
		components: {
			Favorites,
			FileList,
			UserList
		},
		created() {
			
			this.searchInfo = this.$route.query.searchinfo
			this.getFileList()
		},
		watch: {
			$route(to, from) {
			this.loading = true
			this.searchInfo = to.query.searchinfo
			this.getFileList()
			}

		},
		methods: {
			getFileList() {
				this.loading = true

				const scope = this.tabNumber == 1 ? 'file' : this.tabNumber == 2 ? 'collection' : "user"
				const obj = {
					key: this.searchInfo,
					scope: scope

				}

				getSearch(obj).then(res => {
					
					this.loading = false
					
					if (res.data != null && res.data != []) {
						res.data.forEach(item => {
							item.iscol = true
						})
						this.CollectionList = [...res.data]
					} else {
						this.CollectionList = []
					}
				}).catch(res => {
					this.loading = false
					this.CollectionList = []
				})
			},
			showtabs(val) {
				this.CollectionList = []
				this.tabNumber = val
				this.getFileList()
			},
			getlogin() {}
		}
	}
</script>

<style scoped lang="less">
	.search-content {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		// height: 500px;
	}

	.el-scrollbar ::v-deep .el-scrollbar__wrap {
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.el-scrollbar {
		// height:  e("calc(100% - 120px)");
		min-width: 250px;
	}

	.head {
		width: 100%;
		// height: 70px;
		display: flex;
		// align-items: center;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0px 80px;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9;

		.searchinfo {
			font-style: normal;
			font-weight: 700;
			font-size: 24px;
			line-height: 16px;
			color: #58FFC3;
			margin: 30px 0;
		}

		.tabs {
			// width: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding-top: 10px;

			// transform: translateX(0px);
			.singletab {
				padding: 0 50px 10px 50px;
				cursor: pointer;
				color: #68b096;
				font-size: 16px;
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
	}

	.search-container {
		padding: 40px 80px;
		box-sizing: border-box;
		background-color: #000;
		position: relative;
		// height: 100%;
		// overflow: scroll;
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

	.nofiles {
		width: 100%;
		max-width: 100%;
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
</style>
