import Vuex from 'vuex'
import Vue from 'vue'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
// import createLogger from '../src/plugins/logger'


Vue.use(Vuex)

const state = {
 
}

export default new Vuex.Store({
  state,
  gettets,
  actions,
  mutations
});

// plugins: process.env.NODE_ENV !== 'production' 
// ? [createLogger()] : []