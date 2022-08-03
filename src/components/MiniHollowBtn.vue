<template>
      <div class="one" @click="onClick" >
        <img class="btnpic" src="@/assets/images/Common/minihobtn.png" alt="">
         
        <div slot="btncontent" class="btncontent">
          <slot name="btncontent">

          </slot>
        </div>
       </div>
</template>

<script>
    export default {
        props: {
     btnstyle: {
        type:Object,
         default:()=>{} 
    },
},
    
        methods:{
          onClick(){
            this.$emit('MHoBtn')
          }
        }
    }
</script>

<style lang="less" scoped>
.one{
        position: relative;
     cursor: pointer;
        height: 28px;
        width: 107px;
    }
    .btnpic{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0
    }
.btncontent{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 100%;
  height: 100%;
  font-size: 12px;
}
.one:hover{
	filter: drop-shadow(0px 4px 14px #0D7852)
}
     
</style>