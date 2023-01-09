import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/views/Main.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		redirect: '/Space'
	},
	{
		path: '',
		name: 'Space',
		component: Main,
		children: [{
			path: '/Space',
			name: 'Space',
			component: () => import('../views/Space/Space.vue'),

		}]
	},
	{
		path: '',
		name: 'Profile',
		component: Main,
		children: [{
			path: '/Profile',
			name: 'Profile',
			component: () => import('../views/Profile/Profile.vue'),

		},
		{
			path: '/OtherProfile',
			name: 'OtherProfile',
			component: () => import('../views/Profile/OtherProfile.vue'),
		
		}]
	},
	{
		path: '',
		name: 'UpLoad',
		component: Main,
		children: [{
			path: '/UpLoad',
			name: 'UpLoad',
			component: () => import('../views/UpLoad/UpLoad.vue'),

		}]
	},
	{
		path: '',
		name: 'FileDetails',
		component: Main,
		children: [{
				path: '/VideoFile',
				name: 'VideoFile',
				component: () => import('../views/FileDetails/VideoFile.vue'),

			},
			{
				path: '/MusicFile',
				name: 'MusicFile',
				component: () => import('../views/FileDetails/MusicFile.vue'),

			},
			{
				path: '/OtherFile',
				name: 'OtherFile',
				component: () => import('../views/FileDetails/OtherFile.vue'),

			}
		]
	},
	{
		path: '',
		name: 'collection',
		component: Main,
		children: [{
			path: '/Collectioninfo',
			name: 'Collectioninfo',
			component: () => import('../views/Collection/CollectionInfo.vue'),
	
		}]
	},
	{
		path: '',
		name: 'search',
		component: Main,
		children: [{
			path: '/Search',
			name: 'Search',
			component: () => import('../views/Search/Search.vue'),
	
		}]
	},
]
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
	routes
})

export default router
