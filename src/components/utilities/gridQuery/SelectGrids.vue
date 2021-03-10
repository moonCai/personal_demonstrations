<template>
  <div class="query-type-wrapper">
    <ul>
      <li v-for="item in items" :key="item.typeName" :class="{ active: item.id == currentIndex }"
        @click="clickQueryTypeEvent(item)">
        <img :src="item.imgUrl" />
        <div>{{ item.typeName }}</div>
      </li>
    </ul>

    <div class="config" v-show="currentIndex == 3" @click="configPathWidthEvent">设置路径宽度</div>

    <div class="path-width" v-show="currentIndex == 3">路径宽度: {{width}}米</div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        currentIndex: -1,
        items: [{
            imgUrl: require("@/assets/images/query/single.png"),
            typeName: "单网格查询",
            queryType: "single",
            id: 1
          },
          {
            imgUrl: require("@/assets/images/query/polygon.png"),
            typeName: "多边形查询",
            queryType: "polygon",
            id: 2
          },
          {
            imgUrl: require("@/assets/images/query/path.png"),
            typeName: "路径查询",
            queryType: "path",
            id: 3
          }
        ],
        width: 8
      }
    },
    mounted() {
      this.$bus.$on("lineWidth", lineWidth => this.width = lineWidth);
    },
    methods: {
      clickQueryTypeEvent(item) {
        if (this.currentIndex == item.id) {
          this.currentIndex = -1;
          this.$bus.$emit('queryType', {
            type: item.queryType,
            isDraw: false
          })
          return
        }

        this.currentIndex = item.id;

        this.$bus.$emit('queryType', {
          type: item.queryType,
          isDraw: true
        });
      },

      // 设置路径宽度
      configPathWidthEvent() {
        this.$emit('displayConfigWidth', true);
      }
    }

  }

</script>

<style scoped>
  .query-type-wrapper {
    width: 70px;
    height: 210px;
    box-shadow: 0 0px 10px 5px rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    z-index: 1000;
  }

  .query-type-wrapper li {
    width: 100%;
    height: 70px;
    cursor: pointer;
    background: rgba(25, 49, 76, 0.9);
  }

  .query-type-wrapper li.active {
    background: rgba(0, 170, 255, 0.8);
    border-radius: 4px;
    color: #fff;
  }

  .query-type-wrapper img {
    width: 32px;
    height: 32px;
    margin-top: 10px
  }

  .query-type-wrapper li div {
    font-size: 12px;
    color: #ddd;
  }

  div.config {
    width: 100px;
    height: 30px;
    line-height: 30px;
    float: right;
    font-size: 14px;
    color: #fff;
    background: rgba(0, 170, 255, 0.8);
    text-align: center;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.4);
  }

  div.path-width {
    width: 100px;
    height: 30px;
    line-height: 30px;
    float: right;
    font-size: 12px;
    color: #0af;
    background: rgba(0, 170, 255, 0.8);
    background: rgba(25, 49, 76, 0.9);
    text-align: center;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.4);
  }

</style>
