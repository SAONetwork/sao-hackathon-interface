<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<style lang="less">
  @import "./css/rest.css";
  @import "./css/transform.css";
  #app{
    width: 100%;
    height: 100%;
    font-family: 'RobotoMono'
  }
	.el-icon-loading{
		color: #44c194 !important;
	}
	.el-loading-text{
		color: #44c194 !important;
	}
	  [v-cloak] {
	    display: none;
	  }
</style>
