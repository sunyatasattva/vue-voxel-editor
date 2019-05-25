import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {
    objects: []
  },
  mutations: {
    addObject(state, object) {
      state.objects = [...state.objects, object];
    }
  },
  actions: {

  },
});
