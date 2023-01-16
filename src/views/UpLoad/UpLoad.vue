<template>
	<el-scrollbar>
		
		<div class="upload">
			<div class="uploadmain">
				<!-- uploadfile -->
				<div class="uploadback">
					<img class="uploadimg" src="@/assets/images/Upload/uploadback.png" alt="">

					<el-upload v-show="showUpload" :limit="1" :action="uploadApi" :headers="headers" :data="{fileName}"
						ref="upload" :before-upload='beforeUpload' :show-file-list="false" class="uploadstyle" drag
						:on-error='uploaderror' :on-change='uploadfile' :on-success="uploadSuccess"
						:on-progress="onProgress">
						<div class="el-upload__text">


							<span class="el-upload__text1">Drag and drop your file here</span>
							<div class="el-upload__text2">
								(DO NOT infringe on any copyright or privacy rights of any other party.)

							</div>
							<ActiveBtn class="uploadfilebtn" @onClickBtn="selectfile" :btnText='btnText'
								:btnstyle='bigSize'></ActiveBtn>
						</div>
					</el-upload>

					<div class="uploading" v-show="!showUpload">
						<div class="uploading-title">
							Upload
						</div>
						<div class="uploading-main">
							<img class="uploading-icon" src="@/assets/images/Upload/upload.png" alt="">
							<div class="uploadings">
								<span class="uploading-adress">
									{{uploadingUrl}}
								</span>
								<div class="uploading-status">
									<div class="uploading-info">
										<div class="uploading-press">

											<!-- <img class="uploading-back" src="@/assets/images/Upload/uploading.png" alt=""> -->
											<div class="bg">
												<div class="progress-bar">
													<div class="progress-border">
														<div class="progress" :style="{width: loadProgress + '%'}">
														</div>
														<span class="progress-number">{{loadProgress}}%</span>
													</div>
												</div>
											</div>
										</div>
										<span class="uploading-text" v-if="loadProgress<100">Uploading...</span>
										<span class="uploading-text" v-else>Completed</span>
									</div>
									<MiniHollowBtn @MHoBtn='Cancelprofile' :btnstyle='hollowstyle'
										v-if="loadProgress<100">
										<div slot="btncontent" class="deletebtn">
											<span>Cancel</span>
										</div>
									</MiniHollowBtn>
									<MiniHollowBtn @MHoBtn='Deleteprofile' :btnstyle='hollowstyle' v-else>
										<div slot="btncontent" class="deletebtn">
											<span>Delete</span>
										</div>
									</MiniHollowBtn>


								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tableform">
					<img class="formtoppic" src="@/assets/images/Upload/formtop.png" alt="">
					<img class="formbtmpic" src="@/assets/images/Upload/formbtm.png" alt="">
					<el-form ref="uploadForm" :model="uploadForm" label-width="100px" label-position="left">
						<el-form-item label="Preview" :required="true">
							<div class="uploadcover">
								<el-upload v-loading="israndom" element-loading-background="rgba(0, 0, 0, 0.8)"
									class="avatar-uploader" :action="uploadApi" :show-file-list="false"
									:on-success="handleAvatarSuccess" :accept="accept"
									:before-upload="beforeAvatarUpload">
									
									<img class="preview-cover" v-if="uploadForm.preview"
										:src="uploadForm.preview">
									<div class="avatar-uploader-bg" v-else>
										<img class="addicon" src="@/assets/images/Upload/add.png" alt="">
									</div>
								</el-upload>
								<div class="covers-tig">
									<div class="covers-warn">
										<span>Support JPG, JPEG, PNG, GIF</span>
										<span>Max size: 6 MB</span>
									</div>
									<MiniHollowBtn @MHoBtn='randomCover' :btnstyle='Randombtnstyle'>
										<div slot="btncontent" class="Randombtn">
											<img class="uploading-back" src="@/assets/images/Upload/random.png" alt="">

											<span>Random</span>
										</div>
									</MiniHollowBtn>
								</div>
							</div>

						</el-form-item>
						<el-form-item label="Title" :required="true">
							<el-input class="preview-title" placeholder="100 characters or less" maxlength="100"
								v-model="uploadForm.title"
								@blur="uploadForm.title=uploadForm.title.replace(/^\s+|\s+$/g,'')"></el-input>

						</el-form-item>
						<el-form-item label="Description">
							<el-input type="textarea" autosize maxlength="2000" placeholder="2000 characters or less."
								class="preview-Description" v-model="uploadForm.description"
								@blur="uploadForm.description=uploadForm.description.replace(/^\s+|\s+$/g,'')">
							</el-input>
						</el-form-item>
						<el-form-item label="Tags" :required="true">
							<div class="form-Tagsitem">
								<div :class="showtigborder?'preview-tags tagsborder':'preview-tags'">

									<div class="Alltags" v-if="uploadForm.tags.length>0" :style="{'flex-wrap': uploadForm.tags.length > 3 ?'wrap': 'inherit'}">
										<div class="single-tag" v-for="(v,i) in uploadForm.tags" :key="i">
											<span class="">{{v}}</span>
											<i @click="deleteTag(v,i)" class="el-icon-close"></i>
										</div>
									</div>

									<el-input @focus='focusOn' @blur="cancelon" @change='addTig' @input="putfileTags"
										maxlength="20"
										placeholder="4-20 tags is allowed. Separate your tags with a COMMA."
										v-model="inputTags"></el-input>

								</div>
								<div class="RecommendedTags" v-if="recommendedTags.length>0">
									<span class="RecommendedTags-title">Recommended Tags:</span>
									<div class="single-retag">
										<span v-for="(value,index) in recommendedTags" :key="index"
											@click="addrecommedTag(value)">{{value}}</span>
									</div>
								</div>
							</div>

						</el-form-item>
						<!-- <el-form-item label="*Type"  :required="true">
							<el-radio-group v-model="uploadForm.type" class="preview-Privacy">
								<el-radio :label="0">Public</el-radio>
								<el-radio :label="1">Privacy</el-radio>
							</el-radio-group>
						</el-form-item> -->

						<el-form-item label="Price">
							<div class="priceinfo">
								<div class=""
									:class="showpriceborder?'priceborder input-with-select':'input-with-select'">
									<el-input @input="inputPrice" @focus='focusprice' @blur="cancelfocusprice"
										v-model="uploadForm.Price">

									</el-input>
									<div class="priceunit">
										ETH
									</div>
								</div>

								<div class="priceinfo-tig">
									You will earn at this price when any user purchases this file's permanent access
									right.
									SAO will charge you a 1% commission when this file is purchased.
								</div>
							</div>

						</el-form-item>
					</el-form>
					<div class="uploadBtn">

						<ActiveBtn v-if="showUploadBtn && doubleUploadbtn" @onClickBtn="contractUpload"
							:btnText='UploadbtnText' :btnstyle='bigSize' :TextbtnStyle='UploadTextbtnStyles'>
						</ActiveBtn>
						<InactiveButton v-else :btnText='UploadbtnText' :btnstyle='UploadbtnStyle'></InactiveButton>
					</div>

				</div>
			</div>
		</div>
		<ChangeRinkeby :visible.sync="ChangeRinkebyVisible" :title="DiaLogtitle"></ChangeRinkeby>
	</el-scrollbar>
</template>

<script>
	import {
		fileInfos,
		download,
		cancelUpload,
		addFileWithPreview
	} from "@/api/FileApi.js";

	import config from "@/libs/config.js";
	import utils from "@/libs/utils.js";
	import ActiveBtn from "@/components/ActiveBtn.vue";
	import MiniHollowBtn from "@/components/MiniHollowBtn.vue";
	import InactiveButton from "@/components/InactiveButton.vue";
	import ChangeRinkeby from '@/components/ChangeRinkeby.vue';

	export default {
		data() {
			return {
				uploadApi: config.baseApi + "file/upload",
				headers: utils.getHeadserConfig(),
				fileName: "",
				loadProgress: 0,
				btnText: "SELECT A FILE",
				UploadbtnText: "UPLOAD",
				showtigborder: false,
				showpriceborder: false,
				israndom: false,
				isuploading: false,
				bigSize: 'big',
				UploadbtnStyle: {
					width: "227px",
					height: "40px"
				},
				UploadTextbtnStyles: {
					top: "45%"
				},
				hollowstyle: {
					width: "90px",
					height: "25px",
					fontSize: "14px"
				},
				Randombtnstyle: {
					width: "90px",
					height: "25px",
					fontSize: "14px"
				},
				uploadingUrl: "",
				showUpload: true,
				uploadForm: {
					preview: "",
					title: "",
					description: "",
					tags: [],
					type: 0,
					Price: 0,
					fileId: "",
					AdditionalInfo:''
				},
				inputTags: "",
				imageUrl: "",
				selectprice: "ETH",
				recommendedTags: [],
				showUploadBtn: false,
				doubleUploadbtn: false,
				fileList: [],
				accept: ".jpg,.png,.jpeg,.gif",
				DiaLogtitle: 'Connect wallet',
				ChangeRinkebyVisible: false,
				rules: {
					preview: [{
						required: true
					}, ],
					title: [{
						required: true,
					}, ],
					Tags: [{
						required: true,
					}, ]
				}
			};
		},
		components: {
			ActiveBtn,
			MiniHollowBtn,
			InactiveButton,
			ChangeRinkeby
		},
		mounted() {
			this.$checkConnectedAndNetwork().then(({
				network,
				connected
			}) => {
				if (connected) {
					
				}
				else {
					location.href = "https://demo.storverse.app";
				}
			})
		},
		watch: {
			uploadForm: {
				handler(newValue, oldValue) {
					

					if (
						newValue.preview.length > 0 &&
						newValue.title.length > 0 &&
						newValue.tags.length > 0
					) {
						this.showUploadBtn = true;
					} else {
						this.showUploadBtn = false;
					}
				},
				deep: true
			}
		},
		methods: {
			inputPrice() {
				
				this.uploadForm.Price = this.uploadForm.Price.replace(/[^\d.]/g, "");
				this.uploadForm.Price = this.uploadForm.Price.replace(/\.{2,}/g, ".");
				this.uploadForm.Price = this.uploadForm.Price
					.replace(".", "$#$")
					.replace(/\./g, "")
					.replace("$#$", ".");
				this.uploadForm.Price = this.uploadForm.Price.replace(
					/^(-)*(\d+)\.(\d\d\d\d\d\d).*$/,
					"$1$2.$3"
				);
				if (
					this.uploadForm.Price &&
					this.uploadForm.Price.indexOf(".") < 0 &&
					this.uploadForm.Price != ""
				) {
					this.uploadForm.Price = parseFloat(this.uploadForm.Price);
					this.uploadForm.Price = this.uploadForm.Price + "";
				}

			},
			uploaderror(file) {
				
			},
			uploadloading() {},
			focusOn() {
				this.showtigborder = true;
			},
			cancelon() {
				this.inputTags = this.inputTags.replace(/^\s+|\s+$/g, "");
				this.showtigborder = false;
			},
			cancelfocusprice() {
				this.showpriceborder = false;
				if (this.uploadForm.Price.indexOf(".") > 0) {
					let str = this.uploadForm.Price.slice(
						this.uploadForm.Price.indexOf("."),
						this.uploadForm.Price.length
					);
					if (str / 1 <= 0) {
						this.uploadForm.Price = this.uploadForm.Price.replace(str, "");
					}
				}

			},
			focusprice() {
				this.showpriceborder = true;
			},
			selectfile() {
				
			},
			Cancelprofile() {
				this.$refs.upload.abort();
				this.loadProgress = 0;
				this.uploadingUrl = '';
				this.showUpload = true;
				this.$refs.upload.clearFiles();
			},
			Deleteprofile() {
				
				this.doubleUploadbtn = false;
				cancelUpload(this.uploadForm.fileId)
					.then(res => {
						
						this.showUpload = true;
						this.$refs.upload.clearFiles();
						this.loadProgress = 0;
						this.uploadingUrl = ''
					})
					.catch();
			},
			contractUpload() {
				
				this.$checkConnectedAndNetwork().then(({
					network,
					connected
				}) => {
					this.ChangeRinkebyVisible = !network && network !== undefined;
					if (network) {
						this.$getWalletAddress().then(address => {
							if (address) {
								this.$saoloading.show('Uploading', 'ball');
								addFileWithPreview({
										description: this.uploadForm.description,
										id: this.uploadForm.fileId,
										labels: this.uploadForm.tags.join(","),
										title: this.uploadForm.title,
										preview: this.uploadForm.preview,
										price: Number(this.uploadForm.Price),
										AdditionalInfo:this.uploadForm.AdditionalInfo,
										type: this.uploadForm.type
									})
									.then(res => {
										if (Number(this.uploadForm.Price) > 0) {
											let currentSign = utils.getCurrentSign(address);
											if (!currentSign) {
												let signaturemessage = config.signMessage + address;
												this.$sign(signaturemessage, address).then(
													signature => {
														let sign = {
															address,
															signaturemessage,
															signature
														};
														localStorage.setItem(config
															.localStorageSignKey, JSON
															.stringify(sign));
														utils.setSignList(sign);
														this.contractUploadBuy(address)
													}).catch(() => {
													this.$saoloading.hide();
													this.$emit("update:visible", true);
													this.$emit("buyingFall", this
														.fallBuyinginfo);
												});
											} else {
												this.contractUploadBuy(address)
											}
										} else {
											this.$saoloading.hide();
											this.uploadForm.description = "";
											this.uploadForm.fileId = "";
											this.uploadForm.tags = [];
											this.uploadForm.title = "";
											this.uploadForm.preview = "";
											this.uploadForm.type = 0;
											this.uploadForm.AdditionalInfo=''
											this.showUpload = true;
											
											this.$refs.upload.clearFiles();
											this.loadProgress = 0;
											this.$router.push("/Profile");
										}


									})
									.catch(responce => {
										this.$saoloading.hide();
									});
							}

						})
					}
				})

			},
			contractUploadBuy(address) {
				this.$contractUpload(
					this.uploadForm.fileId,
					this.uploadForm.Price * 1,
					address,
					res => {
						
						if (res === 3) {
							this.$saoloading.hide();
							this.$router.push("/Profile");
						}
						if (res == 'error') {
							this.$saoloading.hide()
						}
						this.loading = false;
					}
				);
			},
			uploadSuccess(res, file) {
				
				if (res.code == 200) {
					this.uploadForm.fileId = res.data.Id;
					if (res.data.Preview != '') {
						this.uploadForm.preview = res.data.Preview
					}
					if (res.data.Labels.length > 0) {
						this.recommendedTags = res.data.Labels.split(',')
					}
					this.doubleUploadbtn = true;
				} else {
					this.doubleUploadbtn = false;
				}
			},
			onProgress(event) {
				this.loadProgress = parseInt(event.percent);
				
				if (this.loadProgress >= 100) {
					this.loadProgress = 100;
				}
			},
			randomCover() {
				this.israndom = true;
				let random = utils.randomNumBoth(1, 6);
				let imgs = require(`../../assets/avatar/${random}.png`);

				utils.getImgBase64(imgs).then(res => {
					
					this.uploadForm.preview = res;
					this.israndom = false;
					
				});
			},
			deleteTag(v, i) {
				
				this.uploadForm.tags.splice(i, 1);
			},

			uploadfile(file, fileLists) {
				this.showUpload = false;
				// if (!this.uploadingUrl) {
				// 	this.uploadingUrl = window.document.getElementsByClassName(
				// 		"el-upload__input"
				// 	)[0].value;
				// }
			},
			beforeUpload(file) {
				
				var url = URL.createObjectURL(file);
				var audioElement = new Audio(url);
				var duration;
				
				audioElement.addEventListener("loadedmetadata", () => {
					this.uploadForm.AdditionalInfo = parseInt(audioElement.duration)+'';
				});
					
				this.uploadingUrl = file.name
				this.fileName = file.name;
				const isLt50M = file.size / 1024 / 1024 < 50;
				if (!isLt50M) {
					this.$message.error("Max size: 50 MB!");
				}
				return isLt50M;
			},
			handleAvatarSuccess(res, file) {
				

				// this.uploadForm.preview = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file, files) {
				let rules = ["image/jpeg", "image/jpg", "image/svg", "image/png","image/gif"];
				const isJPG = rules.some(item => {
					return file.type == item;
				});
				const isLt6M = file.size / 1024 / 1024 < 6;

				if (!isLt6M) {
					this.$message.error("MAX 6MB!");
				}
				if (isLt6M && isJPG) {
					
					utils.getFileAvatarBase64(file).then(base64 => {
						this.uploadForm.preview = base64;
						
					});
				}
				return isJPG && isLt6M;

			},
			addTig() {
				this.inputTags = this.inputTags.replace(/^\s+|\s+$/g, "");
				// this.uploadForm.tags.push(this.inputTags);
				if (this.uploadForm.tags.length == 0) {
					this.uploadForm.tags.push(this.inputTags);
				} else {
					let booleans = this.uploadForm.tags.find(item => {
						return item.toLowerCase() == this.inputTags.toLowerCase()
					})
					
					if (!booleans) {
						this.uploadForm.tags.push(this.inputTags);
					}
					
				}
				this.inputTags = "";
			},
			addrecommedTag(v) {
				this.showtigborder = true;
				if (this.uploadForm.tags.length == 0) {
					this.uploadForm.tags.push(v);
				} else {
					let booleans = this.uploadForm.tags.find(item => {
						return item.toLowerCase() == v.toLowerCase()
					})
					
					if (!booleans) {
						this.uploadForm.tags.push(v);
					}
					
				}
			},
			putfileTags() {
				if (this.inputTags.includes(',')) {
					this.inputTags = this.inputTags.split(',')[0]
					if (this.inputTags.length > 0) {
						if (this.uploadForm.tags.length == 0) {
							this.uploadForm.tags.push(this.inputTags);
						} else {
							let booleans = this.uploadForm.tags.find(item => {
								return item.toLowerCase() == this.inputTags.toLowerCase()
							})
							if (!booleans) {
								this.uploadForm.tags.push(this.inputTags);
							}
						}
					}
					this.inputTags = "";
				}
				if (this.inputTags.includes(' ')) {
					this.inputTags = this.inputTags.split(' ')[0]
					if (this.inputTags.length > 0) {
						if (this.uploadForm.tags.length == 0) {
							this.uploadForm.tags.push(this.inputTags);
						} else {
							let booleans = this.uploadForm.tags.find(item => {
								return item.toLowerCase() == this.inputTags.toLowerCase()
							})
							if (!booleans) {
								this.uploadForm.tags.push(this.inputTags);
							}
						}
					}
					this.inputTags = "";
				}
				this.inputTags = this.inputTags.replace(/[\W]/g, '')
			},
		}
	};
</script>
<style>
	.el-scrollbar {
		/* background: #000; */
	}

	.el-select-dropdown {
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

	.el-select-dropdown__item {
		color: #ffffff;
	}

	.el-select-dropdown__item.hover,
	.el-select-dropdown__item:hover {
		background: #44c194;
		color: #000;
	}
</style>

<style lang="less" scoped>
	.el-scrollbar {
		height: 100%;
	}

	.el-scrollbar ::v-deep .el-scrollbar__wrap {
		overflow-y: scroll;
		overflow-x: hidden;
		margin-right: -18px !important;
	}

	.upload {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px 0;

		//   overflow: hidden;
		.uploadmain {
			width: 100%;
			height: 100%;
			max-width: 874px;
			box-sizing: border-box;

			.uploadback {
				position: relative;
				width: 100%;
				max-width: 876px;
				height: 160px;
				margin-top: 20px;

				//   height: 120px;
				// background: url('@/assets/images/Upload/uploadback.png');
				// background-position: center center;
				// background-size: convert()
				.uploadimg {
					width: 100%;
					height: 100%;
					position: absolute;
					left: 0;
					top: 0;
					// z-index: 8
				}
			}

			.uploadstyle {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				padding: 35px 20px;
				padding-bottom: 0;

				.el-upload__text {
					width: 100%;
					height: 100%;
					display: flex;
					box-sizing: border-box;
					// padding: 10px 0;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
				}

				.el-upload__text1 {
					color: #58ffc3;
				}

				.el-upload__text2 {
					color: #68b096;
					line-height: 2em;
				}

				//   background: rgba(0, 0, 0, 0.5);
				/deep/.el-upload-dragger {
					width: 100%;
					height: 100%;
					background: none;
					border: none;
				}

				/deep/.el-upload {
					width: 100%;
					height: 100%;
				}

				/deep/.el-upload-list {
					//   display: none
				}

				.uploadfilebtn {
					padding-bottom: 35px;
				}
			}

			.uploading {
				width: 100%;
				height: 100%;
				z-index: 10;
				box-sizing: border-box;
				// padding: 20px 30px;
				padding: 35px 40px;

				overflow: hidden;
				position: absolute;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.uploading-title {
					font-size: 14px;
					color: #58ffc3;
				}

				.uploading-main {
					width: 100%;
					display: flex;
					align-items: center;

					.uploadings {
						width: 100%;
					}

					.uploading-icon {
						width: 45px;
						height: 45px;
						padding-right: 10px;
					}

					.uploading-adress {
						background: rgba(88, 255, 195, 0.14);
						font-size: 12px;
						padding: 2px 5px;
						color: #58FFC3;
						margin-bottom: 5px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.uploading-status {
						width: 100%;
						overflow: hidden;
						display: flex;
						align-items: center;
						padding-top: 10px;
						justify-content: space-between;

						.uploading-text {
							padding-left: 10px;
						}

						.deletebtn {
							color: #58ffc3;
							display: flex;
							align-items: center;
							justify-content: center;
							height: 28px;
						}
					}

					.uploading-info {
						width: 80%;
						height: 100%;
						display: flex;
						align-items: center;
						font-size: 14px;
						justify-content: flex-start;

						.uploading-press {
							position: relative;
						}
					}
				}
			}
		}

		.tableform {
			width: 100%;
			max-width: 874px;
			height: 75%;
			margin-top: 30px;
			background: rgba(0, 0, 0, 0.5);
			position: relative;
			box-sizing: border-box;
			padding: 40px;

			/deep/.el-form-item__content {
				line-height: 30px;
			}

			/deep/ .el-form-item__label {
				color: #58FFC3;
				font-size: 14px;
				line-height: 2.6em;
				margin-right: 20px;

			}

			/deep/.el-form-item__label:before {
				color: #D6DF68;
			}

			.formtoppic {
				position: absolute;
				width: 100%;
				top: 0;
				left: 0;
			}

			.formbtmpic {
				position: absolute;
				width: 100%;
				bottom: 0;
				left: 0;
			}

			.uploadcover {
				display: flex;
				align-items: center;
				height: 100%;

				/deep/.el-loading-spinner .path {
					stroke: #58fec3;
				}

				/deep/.el-loading-mask {
					top: 1px;
					left: 1px;
				}

				.avatar-uploader {
					width: 100px;
					height: 100px;
				}

				.covers-tig {
					display: flex;
					flex-direction: column;
					height: 100px;
					justify-content: space-between;
					margin-left: 15px;

					.covers-warn {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						font-size: 14px;
						line-height: 1em;

						span {
							line-height: 1.4em;
							font-size: 12px;
						}
					}

					.Randombtn {
						display: flex;
						align-items: center;
						font-size: 12px;
						height: 25px;
						justify-content: center;
						color: #58FFC3;

						img {
							width: 15px;
							height: 10px;
							padding-right: 5px;
						}
					}
				}

				.avatar-uploader-bg {
					width: 100px;
					height: 100px;
					border: 1px dashed #57b196;
					display: flex;
					align-items: center;
					justify-content: center;

					.addicon {
						width: 18px;
						height: 18px;
					}
				}

				.preview-cover {
					width: 100px;
					height: 100px;
					border: 1px solid #57b196;
					object-fit: cover;
				}
			}

			.preview-title {
				width: 80%;

				/deep/.el-input__inner {
					height: 30px;
					font-size: 12px;

					&::placeholder {
						color: #68B096;
						font-size: 12px;
						font-family: 'RobotoMono';
					}

					background: none;
					border: 1px solid #57b196;
					color: #ffffff;
				}


				/deep/.el-input__inner:focus {
					background: none;
					border: 1px solid #58ffc3;
					color: #ffffff;
					// height: 30px;
					// line-height: 30px;
					box-shadow: 0 2px 4px rgba(88, 255, 195, 0.7),
						0 0 6px rgba(88, 255, 195, 0.7);
				}

			}

			.preview-Description {
				width: 80%;

				/deep/.el-textarea__inner {
					background: none;
					border: 1px solid #57b196;
					color: #ffffff;
					font-family: 'RobotoMono';
					font-size: 12px;

					&::placeholder {
						color: #68B096;
						font-size: 12px
					}
				}

				/deep/.el-textarea__inner:focus {
					background: none;
					border: 1px solid #58ffc3;
					color: #ffffff;

					box-shadow: 0 2px 4px rgba(88, 255, 195, 0.7),
						0 0 6px rgba(88, 255, 195, 0.7);
				}
			}

			.form-Tagsitem {
				display: flex;
				flex-direction: column;
				width: 80%;
			}

			.tagsborder {
				background: none;
				border: 1px solid #58ffc3;
				color: #ffffff;
				// height: 30px;
				// line-height: 30px;
				box-shadow: 0 2px 4px rgba(88, 255, 195, 0.7),
					0 0 6px rgba(88, 255, 195, 0.7);
			}

			.preview-tags {
				display: flex;
				align-items: center;
				border: 1px solid #57b196;
				justify-content: flex-start;
				border-radius: 4px;

				.Alltags {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					max-width: 300px;
					.single-tag {
						display: flex;
						align-items: center;
						background: #d6df68;
						padding: 0px 5px;
						height: 20px;
						font-size: 12px;
						color: #001e13;
						border-radius: 15px;
						margin: 5px;

						.el-icon-close {
							font-size: 12px;
							color: #001e13;
							cursor: pointer;
						}
					}
				}

				/deep/.el-input__inner {
					background: none;
					border: none;
					color: #ffffff;
					height: 30px;
					line-height: 30px;
					font-family: 'RobotoMono';
					font-size: 12px;

					&::placeholder {
						color: #68B096;
						font-size: 12px
					}
				}
			}

			.RecommendedTags {
				display: flex;
				align-items: center;
				align-items: center;
				margin-top: 5px;

				.RecommendedTags-title {
					font-size: 12px;
					padding-right: 11px;
					// width: 200px;
				}

				.single-retag {
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					span {
						color: #000;
						background: #6ae2b7;
						line-height: 1.2em;
						margin: 2px 8px 2px 0;
						padding: 3px 10px;
						font-size: 12px;
						border-radius: 14px;
						cursor: pointer;

					}
				}
			}

			.priceborder {
				background: none;
				border: 1px solid #58ffc3;
				color: #ffffff;
				// height: 30px;
				// line-height: 30px;
				box-shadow: 0 2px 4px rgba(88, 255, 195, 0.7),
					0 0 6px rgba(88, 255, 195, 0.7);
			}

			.priceinfo {
				display: flex;
				flex-direction: column;

				.priceinfo-tig {
					font-size: 12px;
					line-height: 1.6em;
					padding-top: 10px;
				}

				.priceunit {
					color: #68B096 !important;
					padding-right: 10px;
				}
			}

			.input-with-select {
				width: 40%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border: 1px solid #57b196;
				background: none;
				height: 30px;
				line-height: 30px;
				border-radius: 4px;

				.el-input {
					width: 100%;
				}

				.el-select {
					width: 40%;

					/deep/.el-input__inner {
						text-align: right;
						padding-right: 30px;
					}
				}

				/deep/.el-input__inner {
					background: none;
					border: none;
					color: #fff;
					font-size: 12px
				}

				/deep/.el-select .el-input .el-select__caret {
					color: #57b196;
				}
			}

			.preview-Privacy {
				/deep/.el-radio__label {
					color: #68b096;
				}

				/deep/.el-radio__inner {
					background: #000;
					border: 1px solid #58ffc3;
				}

				/deep/.el-radio__input.is-checked .el-radio__inner {
					border-color: #58ffc3;
					background: #58ffc3;
				}

				/deep/.is-checked .el-radio__label {
					color: #58ffc3;
				}

				/deep/ .el-radio__input.is-checked .el-radio__inner::after {
					content: "";
					width: 8px;
					height: 3px;
					border: 2px solid #000;
					border-top: transparent;
					border-right: transparent;
					text-align: center;
					display: block;
					position: absolute;
					top: 2px;
					left: 1px;
					vertical-align: middle;
					transform: rotate(-45deg);
					border-radius: 0px;
					background: none;
				}
			}
		}

		.uploadBtn {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.bg {
			background: #091510;
			width: 470px;
			// height: 20px;
			// padding: 50px;
		}

		.progress-bar {
			border: 2px solid #58fec3;
			padding: 2px;
		}

		.progress-border {
			padding: 2px;
			background: #275342;
			border: 2px solid #4aa281;
			position: relative;
		}

		.progress {
			height: 18px;
			width: 50%;
			border: 1px solid rgb(45, 170, 128);
			background: linear-gradient(-45deg,
					#2daa80 30%,
					#34c191 31%,
					#34c191 68%,
					#2daa80 69%);
			background-size: 60px 30px;
			transition: all 0.3s;
			animation: 3s linear 0s infinite normal none running bgRoll;
			padding-left: 5px;
			line-height: 20px;
			box-sizing: border-box;
		}

		.progress-number {
			position: absolute;
			top: 50%;
			right: 10px;
			color: #7bddba;
			font-size: 12px;
			transform: translateY(-50%);
		}

		@keyframes bgRoll {
			0% {
				background-position: 0px 0px;
			}

			100% {
				// background-position: 30px 30px;
				background-position: 60px 0px;
			}
		}
	}
</style>
