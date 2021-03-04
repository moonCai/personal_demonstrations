<template>
  <div class="container">
    <div class="title">
      添加数据源
      <span @click="addDataSourceEvent"></span>
    </div>

    <div class="select-data-source">
      <!-- 选择数据源 -->
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <!-- 新增数据源 -->
      <div class="" id="add-data-button" @click="addDataEvent">
        <strong>+</strong> 新增
      </div>

      <!-- 取消 / 确定添加 -->
      <div class="handle-container">
        <button class="cancel" @click="addDataSourceEvent">取消</button>
        <button class="confirm" @click="addDataSourceEvent">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "item1",
          label: "运营商信令数据",
        },
        {
          value: "item2",
          label: "目标人员数据",
        },
        {
          value: "item3",
          label: "健康宝数据",
        },
        {
          value: "item4",
          label: "公交数据",
        },
      ],
      value: "",
    };
  },
  methods: {
    // 新增数据
    addDataEvent() {
      this.$emit("addNewData", true);
    },

    // 关闭 / 取消 / 确定添加数据源
    addDataSourceEvent() {
      this.$emit("hiddenAddSource", false);
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 330px;
  height: 200px;
  background: #102028;
  position: absolute;
  top: 215px;
  left: 200px;
  z-index: 999;

  .title {
    height: 36px;
    line-height: 36px;
    text-align: left;
    padding-left: 10px;
    color: #fff;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    background-image: linear-gradient(
      -179deg,
      rgba(3, 202, 255, 0.6) 0%,
      rgba(66, 193, 239, 0) 100%
    );
    border: 1px solid #0173a6;
    position: relative;

    span {
      width: 15px;
      height: 15px;
      background: url(~assets/images/common/close_15.png) center/cover;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }

  .select-data-source {
    height: 32px;
    margin-top: 20px;
    text-align: center;

    #add-data-button {
      width: 70px;
      height: 32px;
      line-height: 32px;
      background: #0173a6;
      border-radius: 2px;
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #ffffff;
      display: inline-block;
      margin-left: 10px;
      cursor: pointer;
      vertical-align: top;

      strong {
        font-size: 18px;
      }
    }

    .handle-container {
      width: 100%;
      height: 32px;
      line-height: 32px;
      position: absolute;
      right: 0;
      bottom: 30px;
      text-align: right;

      button {
        width: 80px;
        height: 30px;
        font-size: 12px;
        color: #ffffff;
        border: 1px solid #0173a6;
        border-radius: 2px;
        outline: none;
        margin-right: 17px;
        cursor: pointer;

        &.cancel {
          background: #04283a;
        }

        &.confirm {
          background: #0173a6;
        }
      }
    }
  }

  >>> .el-input--small .el-input__inner {
    width: 210px;
    font-size: 12px;
    padding-left: 8px;
  }
}
</style>