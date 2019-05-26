import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  getters: {
    getObjectById(state) {
      return (id: string) => {
        return state.objects.filter(object => object._uuid === id);
      }
    },
    selectedObject(state) {
      this.getObjectById(state)(state.selectedObjectId);
    }
  },
  mutations: {
    addObject(state, object) {
      state.objects = [...state.objects, object];
    },
    selectObject(state, objectId) {
      state.selectedObjectId = objectId;
    },
    selectTool(state, tool) {
      state.selectedTool = tool;
    }
  },
  state: {
    objects: [],
    selectedObjectId: null,
    selectedTool: "Select"
  }
});
