import Vuex from 'vuex'
import Vue from 'vue'

import mutations from "./mutations"
import actions from './actions'
import getters from './getters'
import moduleA from "./modules/moduleA"
import moduleB from "./modules/moduleB"

Vue.use(Vuex);

const state = {
  queryType: {},
  counter: 100,
  cartList: [],
};

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,

  modules: {
    a: moduleA,
    b: moduleB
  }
})

export default store;
