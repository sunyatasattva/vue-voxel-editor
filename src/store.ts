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
    createWorld(state, world: AFrame["AScene"]) {
      state.world = world;
    },
    deleteObject(state, targetId: string) {
      if(!targetId) return;

      state.objects = state.objects.filter(obj => obj._uuid !== targetId);
    },
    selectObject(state, targetId: string) {
      deselectSelectedObject(state);

      state.selectedObjectId = targetId || null;
    },
    selectTool(state, tool: string) {
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
