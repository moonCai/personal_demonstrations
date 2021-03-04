import {
  post,
  fetch,
  put,
  deleteMethod
} from './http.js'

export const server = {

  /**
   * 网格热力 -- 获取热力图数据
   * */
  getHotMapData: function (paramObj) {
    return post('/track_analyse/grid_diagram', paramObj);
  },

  /**
   * COMMON -- 人员ID有效性验证
   * */
  vertifyIds: function (paramObj) {
    return post('/track_analyse/validate_track_id_list', paramObj);
  },

  /**
   * 轨迹查询 -- 足迹构建
   * */
  trackList: function (paramObj) {
    return post('/track_analyse/trail_structure', paramObj);
  },

  /**
   * 可能的密切接触者 -- 可能的密切接触者列表
   * */
  contactList: function (paramObj) {
    return post('/track_analyse/close_contract', paramObj);
  },

  /**
   * 可能的密切接触者 -- 某密切接触者详情
   * */
  detailList: function (paramObj) {
    return post('/track_analyse/close_contract_trail', paramObj);
  },

}
