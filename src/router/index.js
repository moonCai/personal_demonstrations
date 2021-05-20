import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const HomePage = () => import("pages/HomePage");
const Tiles = () => import("pages/tiles/Tiles");
const Popover = () => import("pages/popover/Popover");
const HotMap = () => import("pages/hotMap/HotMap");
const VideoProjection = () => import("pages/videoProjection/VideoProjection");
const Query = () => import("pages/query/Query");
const CameraIcons = () => import("pages/cameraIcons/CameraIcons");
const ParticleSystem = () => import("pages/particle/ParticleSystem");
const DrawModes = () => import("pages/drawModes/DrawModes");

let routes = [
  {
    path: "/",
    name: "HomePage",
    meta: { title: "" },
    component: HomePage,
  },
  {
    path: "/tiles",
    name: "tiles",
    meta: { title: "倾斜摄影" },
    component: Tiles,
  },
  {
    path: "/popover",
    name: "popover",
    meta: { title: "气泡弹窗" },
    component: Popover,
  },
  {
    path: "/hotMap",
    name: "hotMap",
    meta: { title: "时间轴 & 热力图" },
    component: HotMap,
  },
  {
    path: "/videoProjection",
    name: "videoProjection",
    meta: { title: "视频配准" },
    component: VideoProjection,
  },
  {
    path: "/query",
    name: "query",
    meta: { title: "网格查询" },
    component: Query,
  },
  {
    path: "/cameraIcons",
    name: "cameraIcons",
    meta: { title: "摄像头图标" },
    component: CameraIcons,
  },
  {
    path: "/particle",
    name: "particle",
    meta: { title: "粒子系统" },
    component: ParticleSystem,
  },
  {
    path: "/drawModes",
    name: "drawModes",
    meta: { title: "绘制方式" },
    component: DrawModes,
  },
];

export default new Router({
  routes,
});
