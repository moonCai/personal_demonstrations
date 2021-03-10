import {
  post,
  fetch,
  put,
  get,
  deleteMethod
} from './http.js'

export const server = {

  /**
   * 查询 -- 获取多边形/可视域内网格
   * */
  getFineGridsDataInfo: function (paramObj) {
    return fetch('/grid/show_polygon', paramObj);
  },

  /**
   * 查询 -- 单击选择单网格
   */
  getSingleGridInfo(paramObj) {
    return fetch("grid/show_point", paramObj);
  },

  /**
   * 查询 -- 多边形框所覆盖的网格
   */
  getPolygonGrids(paramObj) {
    return fetch("grid/show_polygon", paramObj);
  },

  /**
   * 查询 -- 多边形框所覆盖的网格
   */
  getPathGrids(paramObj) {
    return fetch("grid/show_line_buffer", paramObj);
  },


  ////////////////////  场景一  ////////////////////

  /**
   * 通用接口 -- 获取地图初始化信息
   * */
  // getInitialMapInfo: function(paramObj) {
  //     return fetch('/monitorarea/initializeMap', paramObj);
  // },

  /**
   * 视频配准播放 -- 获取视频树
   * */
  // getVideoTree: function(paramObj) {
  //     return fetch('/camera/get_camera_info', paramObj);
  // },

  /**
   * 视频网格信息查询 -- 获取视频网格（屏幕坐标）
   * */
  // getScreenGrids: function(paramObj) {
  //     return fetch('/camera/get_camera_grid_by_id', paramObj);
  // },

  /**
   * 网格信息综合播报 -- 获取某摄像头区域中的播报消息列表
   * */
  // getBroadcastMessageList: function(paramObj) {
  //     return fetch('/eventmanagement/query_event_by_camera_id', paramObj);
  // },

  /**
   * 网格信息综合播报 -- 加载摄像头信息（获取摄像头图标）
   * */
  // getCameraIconsInVideo: function(paramObj) {
  //     return fetch('/camera/get_camera_id', paramObj);
  // },


  /**
   * 视频查询 -- 网格码查视频
   * */
  getVideosOfSelectedRegion: function (paramObj) {
    return fetch('/camera/get_grid_camera_info', paramObj);
  },

  ////////////////////  场景二  ////////////////////

  /**
   * 行政区域列表
   */
  getAdministrativeInfo(paramObj) {
    return fetch("camera/get_administrative_division_info", paramObj);
  },
  /**
   * 网格事件查询
   */
  gridEventQuery(paramObj) {
    return post("eventmanagement/grid_event_query", paramObj);
  },

  // eventmanagement/event_grid_stats
  /**
   * 
   * 热力图数据查询
   */
  heatMapEventQuery(paramObj) {
    return post("eventmanagement/event_grid_stats", paramObj);
  },
  /**
   * 视频上报管理界面中  列表数据查询
   */
  searchEvent(paramObj) {
    return post("eventmanagement/search_event", paramObj);
  },
  /**
   * 视频上报管理界面中  事件修改
   */
  updateEventStatus(paramObj) {
    return post("eventmanagement/update_event_status", paramObj);
  },

  /**
   * 视频案件报警
   * 根据行政区域查询数据
   */
  // eventmanagement/query_event_by_admin_area
  queryEventbyAdminarea(paramObj) {
    return post("eventmanagement/query_event_by_admin_area", paramObj);
  }
}
