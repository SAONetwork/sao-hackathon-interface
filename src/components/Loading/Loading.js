import Vue from 'vue'
import LoadingComponent from './Loading.vue'

const Loading = {}
let showLoading = false 
let loadingNode = null 
const LoadingConstructor = Vue.extend(LoadingComponent)

Loading.install = function (Vue) {
	Vue.prototype.$saoloading = function (tips,type, method) {
		if (method === 'hide') {
			loadingNode.isShowLoading = showLoading = false
		} else {
			if (showLoading) {
				return
			}
			if(type != 'spin' && type != 'balls' && type != 'bars'){
				type = 'balls';
			}
			loadingNode = new LoadingConstructor({
				data: {
					isShowLoading: showLoading,
					content: tips,
					seletedType: type
				}		 
			})
			loadingNode.$mount()
			document.body.appendChild(loadingNode.$el)
			loadingNode.isShowLoading = showLoading = true
		}
	};
	
	['show', 'hide'].forEach(function (method) {
		Vue.prototype.$saoloading[method] = function (tips, type) {
			return Vue.prototype.$saoloading(tips, type,method)
		}
	})
}

export default Loading
