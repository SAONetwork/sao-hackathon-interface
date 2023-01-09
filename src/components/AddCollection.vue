<template>
	<div>
		<transition name="dialog-fade">
			<div class="dialog" v-if="visible" @click.self="cancleDialog">
				<div class="dialoginfo">
					<img class="dialogback" src="@/assets/images/Common/addcollBg.png" alt="" />
					<div class="dialogmess">
						<div class="dialoghead">
							<span>Create new collection</span>
							<i class="el-icon-close" @click="cancleDialog"></i>
						</div>
					</div>
					<div class="tableform" v-show="confirmloading">
						<el-form ref="uploadForm" :model="uploadForm" label-width="84px" label-position="left">
							<el-form-item label="Preview" :required="true">
								<div class="uploadcover">
									<el-upload v-loading="israndom" element-loading-background="rgba(0, 0, 0, 0.8)"
										class="avatar-uploader" :action="uploadApi" :show-file-list="false"
										:on-success="handleAvatarSuccess" :accept="accept"
										:before-upload="beforeAvatarUpload">
										<div v-if="isEdit">
											<img class="preview-cover" v-if="uploadForm.preview"
												:src="'data:image/png;base64,'+ uploadForm.preview">
											<div class="avatar-uploader-bg" v-else>
												<img class="addicon" src="@/assets/images/Upload/add.png" alt="">
											</div>
										</div>
										<div v-else>
											<img class="preview-cover" v-if="uploadForm.preview"
												:src="uploadForm.preview">
											<div class="avatar-uploader-bg" v-else>
												<img class="addicon" src="@/assets/images/Upload/add.png" alt="">
											</div>
										</div>
									</el-upload>
									<div class="covers-tig">
										<div class="covers-warn">
											<span>Support JPG, JPEG, PNG</span>
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
								<el-input class="preview-title" show-word-limit placeholder="36 characters or less" maxlength="36"
									v-model="uploadForm.title"
									@blur="uploadForm.title=uploadForm.title.replace(/^\s+|\s+$/g,'')"></el-input>
						
							</el-form-item>
							<el-form-item label="Description">
								<el-input type="textarea"  maxlength="300" placeholder="300 characters or less."
									class="preview-Description" resize='none' show-word-limit v-model="uploadForm.description"
									@blur="blurDesc">
								</el-input>
							</el-form-item>
							<el-form-item label="Tags" :required="true">
								<div class="form-Tagsitem">
									<div :class="showtigborder?'preview-tags tagsborder':'preview-tags'">
						
										<div class="Alltags" v-if="uploadForm.labels.length>0" :style="{'flex-wrap': uploadForm.labels.length > 3 ?'wrap': 'inherit'}">
											<div class="single-tag" v-for="(v,i) in uploadForm.labels" :key="i">
												<span class="">{{v}}</span>
												<i @click="deleteTag(v,i)" class="el-icon-close"></i>
											</div>
										</div>
						
										<el-input @focus='focusOn' @blur="cancelon" @change='addTig' @input="putfileTags"
											maxlength="20"
											placeholder="Separate your tags with a COMMA."
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
						
							<el-form-item label="Type"  :required="true">
								<el-radio-group v-model="uploadForm.type" class="preview-Privacy">
									<el-radio :label="0">Public</el-radio>
									<el-radio :label="1">Privacy</el-radio>
								</el-radio-group>
								<div class="typetips">
									* Public collection will be visible to others in SPACE.
								</div>
							</el-form-item>
						</el-form>
					</div>
					<div v-show="!confirmloading" class="confirmloadingstyle">
						<img class="loadinggif" src="@/assets/images/Common/saoloading.gif" alt="">
					</div>
					<div class="btns">
						<BorderBtn class="padingstyle" @onClickBtn="cancleDialog" :btnText='BorderbtnText'
							:btnstyle='uploadbtnstyle'>
						</BorderBtn>
						<ActiveBtn class="padingstyle" @onClickBtn="saveUserInfo" :btnText='SolidbtnText'
							:btnstyle='Savebtnstyle'>
						</ActiveBtn>
					</div>
				</div>
			</div>
		</transition>
		<!-- <ChangeRinkeby :visible.sync="ChangeRinkebyVisible" :title="DiaLogtitle"></ChangeRinkeby> -->
	</div>
	
</template>

<script>
import { getUserProfile, update, getUserDashboard } from '../api/UserApi.js';
import { createCollection,collectionTag } from '../api/FileApi.js';
import ChangeRinkeby from '@/components/ChangeRinkeby.vue';

import config from '../libs/config.js';
import utils from '../libs/utils.js';
import ActiveBtn from "./ActiveBtn";
	import BorderBtn from "./BorderBtn.vue";
	import MiniHollowBtn from "@/components/MiniHollowBtn.vue";
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
		profileInfo: {
			type: Object,
			default: () => {}
		},
		editCollection:{
			type: Object,
			default: () => {}
		}
	},
	components: {
		ActiveBtn,
		ChangeRinkeby,MiniHollowBtn,BorderBtn
	},
	data() {
		return {
			isEdit:true,
			confirmloading:true,
			uploadApi: config.baseApi + "file/upload",
			israndom:false,
			showtigborder: false,
			accept: ".jpg,.png,.jpeg",
			inputTags: "",
			BorderbtnText: "BACK",
			SolidbtnText: 'SAVE',
			uploadbtnstyle: "other",
			Savebtnstyle: "big",
			recommendedTags: [],
			Randombtnstyle: {
				width: "90px",
				height: "25px",
				fontSize: "14px"
			},
			uploadForm:{
				preview: "",
				title: "",
				description: "",
				labels: [],
				type: 0,
				id: "",
				AdditionalInfo:''
			},
			// visible:true
			// uploadbtnstyle: 'middle',
			DiaLogtitle: 'Connect wallet',
			ChangeRinkebyVisible: false
		};
	},
	watch:{
		editCollection:{
			handler(item1,item2){
				console.log(item2);
				console.log(item1);
				// item1.labels=item1.labels.split(',')
				console.log(item1);
				if(item1){
					this.isEdit=false
					this.uploadForm.description=item1.Description
					this.uploadForm.title=item1.Title
					this.uploadForm.preview=item1.Preview
					this.uploadForm.type=item1.Type
					this.uploadForm.Id=item1.Id
					this.uploadForm.labels=item1.Labels.split(',')
					// id: this.uploadForm.fileId,
					// labels: this.uploadForm.labels.join(","),
					// ethAddr: "0x8a3787baa7b5024A6a8229a8eCe70761e0Fc4Fc8",
					// this.uploadForm=item1
					// this.uploadForm.labels=[]
				}
			},
			deep:true
		}
	},
	created() {
		// console.log(this.editCollection);
	},
	methods: {
		blurDesc(){
			this.uploadForm.description=this.uploadForm.description.replace(/^\s+|\s+$/g,'')
			this.getcollectionTag()
		},
		getcollectionTag(){
			const formData = new FormData()
			formData.append('desc', this.uploadForm.description)
			collectionTag(formData).then(res=>{
				console.log(res.data);
				if(res.data != ''){
				
					this.recommendedTags=res.data.split(',')
					
				}
			})
		},
		saveUserInfo(){
			
			this.confirmloading=false
			let params={}
			if( this.uploadForm.preview.includes('https')){
				 params={
					description: this.uploadForm.description,
					id: this.uploadForm.Id,
					labels: this.uploadForm.labels.join(","),
					title: this.uploadForm.title,
					type: this.uploadForm.type,
					ethAddr:utils.getUser().EthAddr,
				}
			}else{
				 params={
					description: this.uploadForm.description,
					id: this.uploadForm.Id,
					labels: this.uploadForm.labels.join(","),
					title: this.uploadForm.title,
					preview: this.uploadForm.preview,
					type: this.uploadForm.type,
					ethAddr:utils.getUser().EthAddr,
				}
			}
			createCollection(params).then(res=>{
				this.uploadForm={
					preview: "",
					title: "",
					description: "",
					labels: [],
					type: 0,
					id: "",
					AdditionalInfo:''
				}
				this.$emit('getlistagain')
				this.confirmloading=true
				this.cancleDialog()
				
				console.log(res);
			}).catch(response=>{
				this.cancleDialog()
				this.confirmloading=true
			})
		},
		handleAvatarSuccess(res, file) {
			console.log(res);
			console.log(file);
		
			// this.uploadForm.preview = URL.createObjectURL(file.raw);
		},
		beforeAvatarUpload(file, files) {
			this.isEdit=true
			let rules = ["image/jpeg", "image/jpg", "image/svg", "image/png"];
			const isJPG = rules.some(item => {
				return file.type == item;
			});
			const isLt6M = file.size / 1024 / 1024 < 6;
		
			if (!isLt6M) {
				this.$message.error("MAX 6MB!");
			}
			if (isLt6M && isJPG) {
				utils.getFileBase64(file).then(base64 => {
					this.uploadForm.preview = base64;
					console.log(this.uploadForm.preview)
				});
			}
			return isJPG && isLt6M;
		
		},
		randomCover() {
			this.isEdit=true
			this.israndom = true;
			let random = utils.randomNumBoth(1, 6);
			let imgs = require(`../assets/avatar/${random}.png`);
		
			utils.getImgBase64(imgs).then(res => {
				this.uploadForm.preview = res;
				this.israndom = false;
				console.log(res);
			});
		},
		deleteTag(v, i) {
			console.log(v);
			console.log(i);
			this.uploadForm.labels.splice(i, 1);
		},
		focusOn() {
			this.showtigborder = true;
		},
		cancelon() {
			this.inputTags = this.inputTags.replace(/^\s+|\s+$/g, "");
			this.showtigborder = false;
		},
		addTig() {
			this.inputTags = this.inputTags.replace(/^\s+|\s+$/g, "");
			// this.uploadForm.tags.push(this.inputTags);
			if (this.uploadForm.labels.length == 0) {
				this.uploadForm.labels.push(this.inputTags);
			} else {
				let booleans = this.uploadForm.labels.find(item => {
					return item.toLowerCase() == this.inputTags.toLowerCase()
				})
				console.log(booleans)
				if (!booleans) {
					this.uploadForm.labels.push(this.inputTags);
				}
				console.log(this.uploadForm.labels)
			}
			this.inputTags = "";
		},
		putfileTags() {
			if (this.inputTags.includes(',')) {
				this.inputTags = this.inputTags.split(',')[0]
				if (this.inputTags.length > 0) {
					if (this.uploadForm.labels.length == 0) {
						this.uploadForm.labels.push(this.inputTags);
					} else {
						let booleans = this.uploadForm.labels.find(item => {
							return item.toLowerCase() == this.inputTags.toLowerCase()
						})
						if (!booleans) {
							this.uploadForm.labels.push(this.inputTags);
						}
					}
				}
				this.inputTags = "";
			}
			if (this.inputTags.includes(' ')) {
				this.inputTags = this.inputTags.split(' ')[0]
				if (this.inputTags.length > 0) {
					if (this.uploadForm.labels.length == 0) {
						this.uploadForm.labels.push(this.inputTags);
					} else {
						let booleans = this.uploadForm.labels.find(item => {
							return item.toLowerCase() == this.inputTags.toLowerCase()
						})
						if (!booleans) {
							this.uploadForm.labels.push(this.inputTags);
						}
					}
				}
				this.inputTags = "";
			}
			this.inputTags = this.inputTags.replace(/[\W]/g, '')
		},
		addrecommedTag(v) {
			this.showtigborder = true;
			if (this.uploadForm.labels.length == 0) {
				this.uploadForm.labels.push(v);
			} else {
				let booleans = this.uploadForm.labels.find(item => {
					return item.toLowerCase() == v.toLowerCase()
				})
				console.log(booleans)
				if (!booleans) {
					this.uploadForm.labels.push(v);
				}
				console.log(this.uploadForm.labels)
			}
		},
		cancleDialog() {
			this.$emit('update:visible', false);
			this.uploadForm={
				preview: "",
				title: "",
				description: "",
				labels: [],
				type: 0,
				id: "",
				AdditionalInfo:''
			}
		},
		buynow() {
			this.$checkConnectedAndNetwork().then(({ network, connected }) => {
				this.ChangeRinkebyVisible = !network && network !== undefined;

				if (network) {
					this.$getWalletAddress().then(address => {
						if (address) {
							this.$saoloading.show('Loading', 'ball');
							this.$emit('update:visible', false);

							let currentSign = utils.getCurrentSign(address);
							if (!currentSign) {
								let signaturemessage = config.signMessage + address;
								this.$sign(signaturemessage, address)
									.then(signature => {
										let sign = {
											address,
											signaturemessage,
											signature
										};
										localStorage.setItem(config.localStorageSignKey, JSON.stringify(sign));
										utils.setSignList(sign);
										this.buy(address);
										this.$emit("successbuy", this.profileInfo);
									})
									.catch(() => {
										this.$saoloading.hide();
										this.$emit('buyingFall', this.profileInfo);
									});
							} else {
								this.buy(address);
							}
						} else {
							this.$message.error('please connect wallet');
						}
					});
				}
			});
		},
		buy(address) {
			this.$contractBuy(this.profileInfo.NftTokenId, this.profileInfo.Price * 1, address, res => {
				console.log(res);
				if (res === 4) {
					this.$saoloading.hide();
					// this.$emit("update:visible", false);
					this.$emit('successbuy', this.profileInfo);
				}
				if (res == 'error') {
					this.$saoloading.hide();
					// this.$emit("update:visible", false);
					this.$emit('buyingFall', this.profileInfo);
				}
			});
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
	background: rgba(0, 0, 0, 0.7);
	backdrop-filter: blur(54px);

	// -webkit-backdrop-filter: blur(54px);
	.dialoginfo {
		// width: 35%;
		// height: 35%;
		width: 557px;
		min-height: 631px;
		position: absolute;
		left: 50%;
		top: 50%;
		box-sizing: border-box;
		padding: 35px 40px;
		padding-right: 20px;
		transform: translate(-50%, -50%);
		.buybtn{
			position: absolute;
			right: 50px;
			bottom: 100px;
		}
		.dialogback {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}

		.dialogmess {
			position: relative;
			font-size: 16px;
			.dialoghead {
				display: flex;
				width: 100%;
				align-items: center;
				justify-content: space-between;
				color: #58ffc3;
				box-sizing: border-box;
				padding: 2px 0px;
				padding-bottom: 30px;
				padding-right: 20px;
				font-size: 16px !important;
				.el-icon-close {
					font-weight: bold;
					cursor: pointer;
					font-size: 16px !important;
				}
			}
		}

		.dialogmain {
			// width: 100%;
			// height: 90%;
			box-sizing: border-box;
			position: relative;
			padding: 10px;
		}

		.profileinfo {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.profileinfo-cover {
			width: 120px;
			height: 120px;
			border: 2px solid #58ffc3;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.profileinfo-details {
			flex: 1;
			overflow: hidden;
			height: 124px;
			margin-left: 15px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			
			.profilename {
				line-height: 21px;
				font-size: 16px;
				color: #58ffc3;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-weight: bold;
			}

			.profiledesc {
				width: 100%;
				// height: 25%;
				
				color: #57b196;
				font-size: 14px;
				line-height: 1.3em;
				display: -webkit-box; 
				overflow: hidden; 
				word-break: break-all;
				text-overflow: ellipsis; 
				-webkit-box-orient: vertical; 
				-webkit-line-clamp: 2; 
				white-space: pre-line;
			}

			.profilebuying {
				display: flex;
				// align-items: center;
				align-items: flex-end;
				justify-content: space-between;
				position: relative;
			}
			
			.profilebuyinfo {
				display: flex;
				// align-items: center;
				flex-direction: column;
				padding-bottom: 10px;
				.pricetitile {
					font-size: 12px;
					line-height: 2em;
				}

				.pricenum {
					font-size: 18px;
					color: #58ffc3;
					font-weight: bold;
				}
			}
		}
	}
	.tableform {
		width: 100%;
		position: relative;
		box-sizing: border-box;
		
		/deep/.el-input__count{
			background: none;
			color: #68B096;
		}
		/deep/.el-input__count-inner{
			background: none;
			color: #68B096;
		}
		/deep/.el-form-item__content {
			line-height: 30px;
		}
	
		/deep/ .el-form-item__label {
			color: #58FFC3;
			font-size: 14px;
			line-height: 2.6em;
			word-break: break-all;
			// margin-right: 40px;
	
		}
	
		/deep/.el-form-item__label:before {
			color: #58FFC3;
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
				object-fit: cover
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
			height: 120px;
			/deep/.el-textarea__inner {
				background: none;
				border: 1px solid #57b196;
				color: #ffffff;
				font-family: 'RobotoMono';
				font-size: 12px;
				height: 120px;
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
			flex-wrap: wrap;
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
		.typetips{
			font-weight: 400;
			font-size: 12px;
			color: #68B096;
		}
		
	}
	.confirmloadingstyle{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 450px;
		.loadinggif{
			width: 60px;
			height: 60px;
			position: relative;
		}
	}
	.btns{
		display: flex;
		align-items: center;
		margin-left: 100px;
		.padingstyle{
			margin-right: 15px;
		}
	}
}
</style>
