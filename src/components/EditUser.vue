<template>

		<div class="dialog" v-if="visible" @click.self="cancleDialog">
			<div class="dialoginfo">
				<img class="dialogback" src="@/assets/images/Common/dialogback.png" alt="">
				<div class="dialogmess">
					<div class="dialoghead">
						<span>Edit Profile</span>
						<i class="el-icon-close" @click="cancleDialog"></i>
					</div>
				</div>
				<div class="dialogmain">
					<div class="editavatar">
						<el-upload class="avatar-uploader" :action="uploadApi" :show-file-list="false"
							:on-success="handleAvatarSuccess" :accept="accept" :before-upload="beforeAvatarUpload">
							

							<img class="pickedavatar" v-if="userAvatar" :src="userAvatar">
							<img v-else class="pickedavatar" src="../../src/assets/images/Profile/avatar.png" alt="">
							<img class="editavatarBack" src="../../src/assets/images/Profile/eiditavatar.png" alt="">
						</el-upload>
					</div>
					<div class="avatarrules">
						Support JPG, PNG, etc.
						Max size: 10M 
					</div>
					<div class="editname">
						<el-input v-model="username" placeholder="User name" maxlength="36" show-word-limit></el-input>
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
		</div>

</template>

<script>
	import {
		update
	} from '../api/UserApi.js'
	import ActiveBtn from "./ActiveBtn";
	import BorderBtn from "./BorderBtn.vue";
	import config from "@/libs/config.js";
	import utils from "@/libs/utils.js";
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
			userinfo: {
				type: Object,
				default: {}
			},
		},
		components: {
			ActiveBtn,
			BorderBtn
		},
		watch: {
			
		},
		created() {
			console.log(this.userinfo)
			this.username = this.userinfo.Username
			
				this.userAvatar = this.userinfo.Avatar
			

			// this.$forceUpdate()
		},
		data() {
			return {
				uploadApi: config.baseApi + "file/upload",
				accept: ".jpg,.png,.jpeg",
				username: this.userinfo.username,
				userAvatar: this.userinfo.avatar,
				BorderbtnText: "CLOSE",
				uploadbtnstyle: "other",
				Savebtnstyle: "big",
				SolidbtnText: 'SAVE',
				showPiced: false
			};
		},
		methods: {
			cancleDialog() {
				this.$emit('update:visible', false)
				// this.userAvatar = ''
				// this.username = ''
			},
			saveUserInfo() {
				if(this.username==''){
					return
				}else{
					this.$saoloading.show('Loading', 'ball');
					update({
						avatar: this.userAvatar,
						username: this.username
					}).then(res => {
						console.log(res);
						this.$saoloading.hide();
						this.$emit('update:visible', false)
						window.location.reload()
					}).catch(() => {
						this.$saoloading.hide();
					})
				}
				
			},
			handleAvatarSuccess(res, file) {
				console.log(res);
				console.log(file);

				// this.uploadForm.preview = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file, files) {
			
				let rules = ["image/jpeg", "image/jpg", "image/svg", "image/png"];
				const isJPG = rules.some(item => {
					return file.type == item;
				});
				const isLt10M = file.size / 1024 / 1024 < 10;

				if (!isLt10M) {
					this.$message.error("MAX 10MB!");
				}
				if(isLt10M&&isJPG){
					utils.getFileAvatarBase64(file).then(base64 => {
						this.userAvatar = base64;
					}).catch(response => {
						console.log(response)
					})
				}
				return isJPG && isLt10M;
			},
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
		// background: rgba(0, 0, 0, 0.5);
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(54px);

		// -webkit-backdrop-filter: blur(54px);
		.dialoginfo {
			// width: 35%;
			// height: 35%;
			width: 557px;
			height: 380px;
			position: absolute;
			left: 50%;
			top: 40%;
			box-sizing: border-box;
			padding: 35px 40px;
			transform: translate(-50%, -50%);

			.dialogback {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}

			.dialogmess {
				position: relative;

				.dialoghead {
					display: flex;
					width: 100%;
					align-items: center;
					justify-content: space-between;
					color: #58ffc3;
					box-sizing: border-box;
					padding: 2px 15px;

					.el-icon-close {
						font-weight: bold;
						cursor: pointer;
					}
				}
			}

			.dialogmain {
				width: 100%;
				height: 90%;
				box-sizing: border-box;
				position: relative;
				padding: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				.editavatar {
					width: 136px;
					height: 136px;
					position: relative;
					cursor: pointer;

					.editavatarBack {
						width: 136px;
						height: 136px;
					}

					.pickedavatar {
						width: 90px;
						height: 90px;
						position: absolute;
						top: 49%;
						left: 49%;
						transform: translate(-50%, -50%);
						border-radius: 50%;
					}
				}

				.avatarrules {
					width: 149px;
					height: 36px;
					left: 967px;
					top: 354px;
					font-family: 'Roboto Mono';
					font-style: normal;
					font-weight: 400;
					font-size: 12px;
					line-height: 18px;
					text-align: center;
					color: #68B096;
				}
			}

			.editname {
				width: 448px;
				margin: 15px 0 20px 0;

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

				/deep/.el-input__count-inner {
					background: none;
					color: #68B096;
				}
			}

			.btns {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>
