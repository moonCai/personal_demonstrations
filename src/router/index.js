import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HomePage = () => import("components/HomePage")
const Tiles = () => import("pages/tiles/Tiles")
const Popover = () => import("pages/popover/Popover")
const HotMap = () => import("pages/hotMap/HotMap")
const VideoProjection = () => import("pages/videoProjection/VideoProjection")
const Query = () => import("pages/query/Query")

let routes = [{
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/tiles',
    name: 'tiles',
    component: Tiles
  },
  {
    path: '/popover',
    name: 'popover',
    component: Popover
  },
  {
    path: '/hotMap',
    name: 'hotMap',
    component: HotMap
  },
  {
    path: '/videoProjection',
    name: 'videoProjection',
    component: VideoProjection
  },
  {
    path: '/query',
    name: 'query',
    component: Query
  }
]

export default new Router({
  routes
})
