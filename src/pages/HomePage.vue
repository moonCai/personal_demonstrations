<template>
  <div id="home-page-container">
    <!-- header -->
    <header-component></header-component>

    <!-- 内容区  start -->
    <div class="content">
      <div class="content-center">
        <!-- 封面图 -->
        <div class="cover-container">
          <div class="cover"></div>
        </div>

        <!-- 场景 -->
        <div class="scene-container">
          <div class="title">功能目录</div>
          <router-link class="item" v-for="info in routeInfos" :key="info.name" :to="info.path">{{ info.name }}</router-link>
        </div>
      </div>
    </div>
    <!-- 内容区  end -->
  </div>
</template>

<script>
import HeaderComponent from "components/common/Header";

export default {
  name: "homePage",
  data() {
    return {
      routeInfos: [
        {
          path: "/tiles",
          name: "倾斜摄影"
        },
        {
          path: "/popover",
          name: "气泡弹窗"
        },
        {
          path: "/hotMap",
          name: "时间轴 & 热力图"
        },
        {
          path: "/videoProjection",
          name: "视频配准"
        },
        {
          path: "/query",
          name: "网格查询"
        },
        {
          path: "/cameraIcons",
          name: "摄像头图标"
        },
      ]
    };
  },
  components: {
    HeaderComponent,
  },
};
</script>

<style scoped lang="scss">
#home-page-container {
  .content {
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(~assets/images/homePage/cover.png) no-repeat center / cover;

    .content-center {
      width: 960px;
      height: 520px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;

      .cover-container {
        background: url(~assets/images/homePage/cover_border.png) no-repeat
          center / cover;
        position: relative;

        .cover {
          background: url(~assets/images/homePage/bg.png) no-repeat center /
            cover;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .scene-container {
        position: absolute;
        top: 25px;
        right: 10px;
        bottom: 30px;

        .title {
          color: #fff;
          font-weight: 500;
          text-align: left;
        }

        .item {
          width: 200px;
          display: inline-block;
          color: rgb(133, 206, 255);
          background: rgba(68, 124, 255, 0.3);
          cursor: pointer;
          font-weight: 320;
          box-shadow: inset 0 0 20px 2px #54beff;

          &:hover {
            color: #fff;
            font-weight: 350;
            transform: scale(1.1);
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1919px) {
  .content .content-center {
    width: 960px;
    height: 520px;
  }
  .content .cover-container {
    width: 677px;
    height: 492px;
  }
  .cover-container .cover {
    width: 600px;
    height: 396px;
  }
  .content .scene-container {
    width: 200px;
  }
  .scene-container .title {
    height: 30px;
    line-height: 50px;
    font-size: 16px;
  }
  .scene-container .item {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-radius: 4px;
    margin-top: 18px;
  }
}
@media screen and (min-width: 1920px) and (min-height: 735px) {
  .content .content-center {
    width: 1248px;
    height: 676px;
  }
  .content .cover-container {
    width: 880px;
    height: 640px;
  }
  .cover-container .cover {
    width: 780px;
    height: 515px;
  }
  .content .scene-container {
    width: 260px;
  }
  .scene-container .title {
    height: 39px;
    line-height: 65px;
    font-size: 20px;
  }
  .scene-container .item {
    height: 52px;
    line-height: 52px;
    font-size: 18px;
    border-radius: 5px;
    margin-top: 25px;
  }
}

@media screen and (min-width: 2560px) and (min-height: 1315px) {
  .content .content-center {
    width: 1632px;
    height: 884px;
  }
  .content .cover-container {
    width: 1151px;
    height: 836px;
  }
  .cover-container .cover {
    width: 1020px;
    height: 673px;
  }
  .content .scene-container {
    width: 340px;
  }
  .scene-container .title {
    height: 51px;
    line-height: 85px;
    font-size: 27px;
  }
  .scene-container .item {
    height: 68px;
    line-height: 68px;
    font-size: 24px;
    border-radius: 7px;
    margin-top: 34px;
  }
}
</style>
