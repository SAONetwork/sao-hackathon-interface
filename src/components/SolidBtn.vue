<template>
      <div class="one" @click="onClick">
          <span class="content">{{SolidbtnText}}</span>
    <div class="border-left">
      <span></span>
    </div>
    <div class="border-right">
      <span></span>
    </div>
       </div>
</template>

<script>
export default {

   props: {
    SolidbtnText: {
        type:String,
         default:()=>{} 
    }
},
methods:{
  onClick(){
    this.$emit('SolidBtnClick')
  }
}
};
</script>

<style lang="less" scoped>
.one {
  width: 80px;
  height: 30px;
  background-color: 152a24;
  position: relative;
  margin: 0 20px;
  border: #58ffc3 1px solid;
  border-left: none;
  border-right: none;
  background: #58ffc3;
  cursor: pointer;
  box-shadow: 0px 2px 12px 5px rgba(88, 255, 195, 0.1)
}
.content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    font-size: 14px;
    color: #000;
    font-weight: bold;
     user-select:none 
}
.border-left {
  width: 0;
  height: 0;
  border-bottom: 16px solid transparent;
  border-right: 16px solid #58ffc3;
  border-top: 16px solid transparent;
  // margin: 50px auto;

  position: absolute;
  top: -1px;
  left: -16px;
  border-left: none;

}
.border-left span {
  display: block;
  width: 0;
  height: 0;
  border-bottom: 15px solid transparent;
  border-right: 15px solid #58ffc3;
  border-top: 15px solid transparent;
  position: absolute;
  left: 1px;
  top: -15px;

}
.border-right {
  width: 0;
  height: 0;
  border-left: 16px solid #58ffc3;
  border-bottom: 16px solid transparent;
  border-top: 16px solid transparent;
  position: absolute;
  right: -16px;
  top: -1px;
}
.border-right span {
  display: block;
  width: 0;
  height: 0;
  border-left: 15px solid #58ffc3;
  border-bottom: 15px solid transparent;
  border-top: 15px solid transparent;
  position: absolute;
  left: -16px;
  top: -15px;
}
</style>
