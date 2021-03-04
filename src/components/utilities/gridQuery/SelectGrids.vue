<template>
  <ul class="query-type-wrapper">
    <li v-for="item in items" :key="item.typeName" :class="{ active: item.id == currentIndex }"
      @click="clickQueryTypeEvent(item)">
      <img :src="item.imgUrl" />
      <div>{{ item.typeName }}</div>
    </li>

  </ul>
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
        ]
      }
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
      }

    }
  }

</script>

<style scoped>
  .query-type-wrapper {
    width: 70px;
    height: 210px;
    border-radius: 4px;
    box-shadow: 0 0px 10px 5px rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 50%;
    right: 0;
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

  .query-type-wrapper div {
    font-size: 12px;
    color: #ddd;
  }

</style>
