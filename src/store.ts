import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";
import { AFrame } from 'aframe';

Vue.use(Vuex);

function deselectSelectedObject(state: RootState) {
  const selectedObject: AFrame["AEntity"] | null = (<AFrame["AScene"]>state.world)
    .querySelector(`[id="${state.selectedObjectId}"]`);

  if(selectedObject)
    selectedObject.removeState("selected");

  state.selectedObjectId = null;
}

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
    createWorld(state, world) {
      state.world = world;
    },
    selectObject(state, targetId) {
      deselectSelectedObject(state);

      state.selectedObjectId = targetId || null;
    },
    selectTool(state, tool) {
      state.selectedTool = tool;

      deselectSelectedObject(state);
    }
  },
  state: {
    objects: [],
    selectedObjectId: null,
    selectedTool: "Select",
    world: {}
  }
});
