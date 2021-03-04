<template>
  <div class="container">
    <div class="title">
      新增数据源
      <span @click="hiddenNewDataEvent"></span>
    </div>

    <div class="item">
      <el-select
        v-model="value"
        filterable
        remote
        reserve-keyword
        placeholder="请输入用户ID"
      >
      </el-select>
      <img src="~assets/images/common/search_15.png" />
      <button>搜索</button>
    </div>

    <div class="item short">
      <el-select v-model="value1" placeholder="全部">
        <el-option
          v-for="item in types"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>

      <el-select v-model="value2" placeholder="数据源类型">
        <el-option
          v-for="item in dataType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>

      <button id="upload">
        <img src="~assets/images/common/upload.png" />
        下载
      </button>
    </div>

    <el-table :data="list" style="width: 91%" height="123">
      <el-table-column
        prop="geoNum"
        width="80"
        label="点位编码"
      ></el-table-column
      ><el-table-column
        prop="dataType"
        width="80"
        label="数据源"
      ></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
    </el-table>

    <div id="data-num">数据编码</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      types: [
        {
          value: "Quanbu",
          label: "全部",
        },
      ],
      dataType: [
        {
          value: "Xinling",
          label: "运营商信令数据",
        },
        {
          value: "Mubiao",
          label: "目标人员数据",
        },
        {
          value: "Jiankangbao",
          label: "健康宝数据",
        },
        {
          value: "Gongjiao",
          label: "公交数据",
        },
      ],
      value1: "",
      value2: "",
      list: [
        {
          geoNum: "0101",
          dataType: "信令数据",
          time: "2020-11-09 12:00:01",
        },
        {
          geoNum: "0102",
          dataType: "信令数据",
          time: "2020-11-09 12:00:01",
        },
      ],
    };
  },
  methods: {
    hiddenNewDataEvent() {
      this.$emit("hiddenNewData", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 380px;
  height: 320px;
  position: absolute;
  top: 215px;
  left: 540px;
  z-index: 999;
  background: #102028;

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

  .item {
    height: 32px;
    margin-top: 20px;
    text-align: center;
    position: relative;

    img {
      width: 15px;
      height: 15px;
      position: absolute;
      top: 50%;
      left: 30px;
      transform: translateY(-50%);
    }

    button {
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
      outline: none;
      border: none;
      position: relative;

      img {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 50%;
        left: 8px;
        transform: translateY(-50%);
      }
    }
    &.short >>> .el-input--small .el-input__inner {
      width: 128px;
      padding-left: 8px;
    }
  }

  #data-num {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #25ace9;
    position: absolute;
    right: 20px;
    bottom: 10px;
  }

  >>> .el-input--small .el-input__inner {
    width: 260px;
    padding-left: 27px;
    font-size: 12px;
  }

  >>> .el-table {
    top: 160px;
    left: 20px;
    right: 0;
    bottom: 60px;
  }
}
</style>
