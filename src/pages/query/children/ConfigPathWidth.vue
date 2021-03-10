<template>
    <div class="dimming">
      <div id="path-query">
        <div class="title">设置路径宽度</div>
        <img id="close-path" @click="closePathQuery" src="~assets/images/query/white_close.png" />
  
        <div id="path-query-content">
          <span>输入宽度:</span>
          <input type="number" v-model="width" min="1" max="200" v-enter-number />
          <span class="unit">米</span>
        </div>
        <div class="tip">* 请输入1-200之间的数值</div>
  
        <div class="confirm" @click="confirmWidth">确 定</div>
      </div>
    </div>
  </template>
  
  <script>
  
    export default {
      data() {
        return {
          width: 8
        };
      },
      methods: {
        // 确定输入宽度
        confirmWidth() {
          let condition1 = this.width > 200 || this.width < 1;
          let condition2 = typeof condition2 == "string" && this.width.indexOf(0) == 0;
  
          if (condition1 || condition2) {
            this.$message({
              type: "warning",
              message: "请输入1-200之间的数值"
            });
            return;
          }
  
          this.$bus.$emit("lineWidth", this.width);
          this.$emit("displayConfigWidth", false);
        },
  
        // 关闭路径查询宽度定义
        closePathQuery() {
          this.$emit("displayConfigWidth", false);
        }
      }
    };
  
  </script>
  
  <style scoped>
    .dimming {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 3000;
    }
  
    #path-query {
      width: 300px;
      height: 180px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(4, 17, 45, 1);
      box-shadow: inset 0 0 20px 1px #73c7ff;
      border: 1px solid #1890ff;
      border-radius: 5px;
    }
  
    #close-path {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  
    .title {
      height: 20px;
      line-height: 20px;
      height: 40px;
      line-height: 40px;
      background-image: linear-gradient(90deg, #18ceff 0%, rgba(24, 144, 255, 0.2) 100%);
      text-align: left;
      color: #fff;
      font-size: 16px;
      box-sizing: content-box;
      padding-left: 20px;
    }
  
    #path-query-content {
      margin-top: 25px;
    }
  
    #path-query-content span {
      color: #fff;
      font-size: 14px;
      display: inline-block;
      width: 70px;
      text-align: left;
    }
  
    .tip {
      color: red;
      font-size: 12px;
      margin-top: 3px;
    }
  
    #path-query-content .unit {
      width: 30px;
      text-align: center;
    }
  
    #path-query-content input {
      width: 140px;
      background: transparent;
      color: #fff;
      border: 1px solid #1890ff;
      padding-left: 10px;
      height: 26px;
      line-height: 30px;
      outline: none;
    }
  
    input[type="number"] {
      -moz-appearance: textfield;
    }
  
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  
    .confirm {
      width: 85px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      font-size: 14px;
      margin-top: 15px;
      margin-left: 180px;
      background: #1890ff;
      border-radius: 4px;
      cursor: pointer;
    }
  
  </style>
  