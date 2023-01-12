import config from "./config";

export default {
	getUUID: () => {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	getUser: () => {
		return JSON.parse(localStorage.getItem(config.localStorageUserKey)) || null;
	},

	getHeadserConfig: () => {
		let saoSign = JSON.parse(localStorage.getItem(config.localStorageSignKey)) || null;
		if (saoSign) {
			return {
				address: saoSign.address,
				signaturemessage: encodeURI(saoSign.signaturemessage),
				signature: saoSign.signature
			}
		}
		return null;
	},

	setSignList(sign) {
		let signList = JSON.parse(localStorage.getItem(config.localStorageSignKeyList)) || [];
		let i = signList.findIndex(item => item.address === sign.address)
		if (i >= 0) signList[i] = sign;
		else signList.push(sign);
		localStorage.setItem(config.localStorageSignKeyList, JSON.stringify(signList));
	},

	getCurrentSign(address) {
		let signList = JSON.parse(localStorage.getItem(config.localStorageSignKeyList)) || [];
		let currentSign = signList.find(item => item.address === address);
		if (currentSign) {
			localStorage.setItem(config.localStorageSignKey, JSON.stringify(currentSign));
		}
		return currentSign;
	},

	getFileBase64: (file) => {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				resolve(e.target.result.split("base64,")[1])
			};
		})
	},
	getFileAvatarBase64: (file) => {
		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				resolve(e.target.result)
			};
		})
	},
	getImgBase64(url) {
		return new Promise((resolve, reject) => {
			var img = new Image()
			img.setAttribute('crossOrigin', 'Anonymous')
			img.onload = function() {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				img.setAttribute("crossOrigin", 'Anonymous')
				ctx.drawImage(img, 0, 0, img.width, img.height);
				var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
				var base64 = canvas.toDataURL("image/" + ext);
				resolve(base64)
			}
			img.src = url + '?v=' + Math.random()
		})
	},
	getAvatarBase64(url) {
		return new Promise((resolve, reject) => {
			var img = new Image()
			img.setAttribute('crossOrigin', 'Anonymous')
			img.onload = function() {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				img.setAttribute("crossOrigin", 'Anonymous')
				ctx.drawImage(img, 0, 0, img.width, img.height);
				var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
				var base64 = canvas.toDataURL("image/" + ext);
				resolve(base64)
			}
			img.src = url + '?v=' + Math.random()
		})
	},
	randomNumBoth: (min, max) => {
		var range = max - min;
		var rand = Math.random();
		var num = min + Math.round(rand * range);
		return num;
	},
	getFileSize(val) {
		
		if (!val) return "";
		if (val < 102.4) {
			return val + " B";
		}
		let num = val / 1024;
		if (num > 1024) {
			num = num / 1024;
			return num.toFixed(2) + " M";
		} else {
			return num.toFixed(2) + " K";
		}
	},



}
