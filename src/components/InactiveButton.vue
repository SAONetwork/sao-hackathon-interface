<template>
    <div>
         <div  class="btn" @click="onClick" :style="btnstyle">
            <img class="btn-img" src="@/assets/images/Upload/nativeBtn.png" alt="">
            <span :style="TextbtnStyle" class="btn-text">{{btnText}}</span>
        </div>
    </div>
</template>

<script>
    export default {
         data(){
     return {
       
     }
   },
   props: {
    btnstyle: {
        type:Object,
         default:()=>{}
    },
    btnText:{
        type:String,
        default: '' 
    },
    TextbtnStyle:{
        type:Object,
        default:()=>{}
    }
},
   methods:{
       onClick(){
           this.$emit('onClickBtn')
       }
   }
    }
</script>

<style lang="less" scoped>
  .btn{
            // width: 200px;
            // height: 35px;
            box-sizing: border-box;
            // padding: 20px 100px;
            position: relative;
        font-size: 12px;
             cursor:pointer;
         .btn-img{
             position: absolute;
             width: 100%;
             height: 100%;
             left: 0;
             z-index: 1
         }
         .btn-text{
            z-index: 2;
            position: absolute;
            left:50%;
            top: 50%;
            transform: translate(-50%,-50%);
            width: 100%;
            text-align: center;
            color: #001e13;
            font-weight: bold;
            user-select:none      
         } 
        }
      
      
</style>