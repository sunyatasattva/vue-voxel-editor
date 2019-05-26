<template>
  <a-scene
    stats
    :gridhelper="`divisions: ${this.WORLD_SIZE.x}; size: ${this.WORLD_SIZE.x}; colorGrid: #666; colorCenterLine: black`"
    ref="world"
    @child-attached="childAttached"
  >
    <a-plane
      id="cursor-highlight"
      rotation="-90 0 0"
      width="1"
      height="1"
      color="tomato"
      material="transparent: true; opacity: 0.5"
      :position="cursorHighlightPosition"
    ></a-plane>

    <a-plane
      id="floor"
      class="collidable"
      rotation="-90 0 0"
      :width="WORLD_SIZE.x"
      :height="WORLD_SIZE.y"
      color="#ccc"
      shadow
      raycaster-listen
      @click="handleClick"
      @raycaster-updated="updateCursorHighlight"
    ></a-plane>

    <a-box
      skeleton-helper
      class="collidable voxel"
      v-for="object in objects"
      :color="`${object._uuid === selectedObjectId ? '#0055ff' : object.color}`"
      :key="object._uuid"
      :id="object._uuid"
      :position="`${object.position.x} ${object.position.y} ${object.position.z}`"
      @click="handleClick"
    ></a-box>

    <a-entity
      id="camera"
      orbit-controls="enablePan: true; initialPosition: 10 10 10; keyPanSpeed: 100; maxDistance: 60; minDistance: 5; rotateSpeed: 0.25; zoomSpeed: 1.25"
      camera="fov: 45"
      position="0 0 0"
      cursor="rayOrigin: mouse"
      raycaster="objects: .collidable;"
    ></a-entity>
  </a-scene>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState, mapGetters } from "vuex";
import "aframe";
import "aframe-event-set-component";
import "aframe-gridhelper-component";
import "aframe-orbit-controls";
import "../aframe-components/raycaster-listen";
import "../aframe-components/skeleton-helper";

import { AFrame, DetailEvent, EntityEventMap, utils as AFrameUtils } from "aframe";

@Component({
  computed: {
    ...mapGetters(["selectedObject"]),
    ...mapState(["objects", "selectedObjectId", "selectedTool"])
  }
})
export default class World3d extends Vue {
  private WORLD_SIZE = {
    x: 25,
    y: 25
  };

  private cursorHighlightPosition = "";
  private objects!: any[];
  private selectedObjectId!: string;
  private selectedTool!: string;

  mounted() {
    document.addEventListener("keydown", this.handleRotate);
    document.addEventListener("keyup", this.handleRotate);
  }

  addObject(e: DetailEvent<"click">) {
    const raycasterEl = e.target.components["raycaster-listen"].raycasterEl;

    if (!raycasterEl) return;

    const cursorPosition = AFrameUtils.coordinates.parse(
      this.cursorHighlightPosition
    );

    this.$store.commit("addObject", {
      _uuid: AFRAME.THREE.Math.generateUUID(),
      color: "tomato",
      position: {
        x: cursorPosition.x,
        y: 0.5,
        z: cursorPosition.z
      }
    });
  }

  childAttached(e: EntityEventMap["child-attached"]) {
    if( e.detail.el.className.includes("voxel") )
      console.log(e.detail.el);
  }

  handleClick(e: DetailEvent<"click">) {
    if(this.selectedTool === "Create")
      this.addObject(e);
    else if(this.selectedTool === "Select")
      this.selectObject(e);
  }

  handleRotate({ keyCode, type }: KeyboardEvent) {
    const camera: AFrame["AEntity"] | null = this.$el.querySelector("#camera");
    const orbitControls = camera.components["orbit-controls"];

    if(type === "keydown") {

      if (keyCode === 81) { // Q
        orbitControls.controls.autoRotate = true;
        orbitControls.controls.autoRotateSpeed = 2;
      } else if (keyCode === 69) { // E
        orbitControls.controls.autoRotate = true;
        orbitControls.controls.autoRotateSpeed = -2;
      }

    } else if(type === "keyup") {
      orbitControls.controls.autoRotate = false;
    }
  }

  selectObject(e: DetailEvent<"click">) {
    const oldSelectedObject: AFrame["AEntity"] | null = (<AFrame["AScene"]>this.$refs.world)
      .querySelector(`[id="${this.selectedObjectId}"]`);

    if(oldSelectedObject)
      oldSelectedObject.removeState("selected");

    e.target.addState("selected");
    this.$store.commit("selectObject", e.target.id);
  }

  updateCursorHighlight(e: DetailEvent<"raycaster-updated">) {
    const { x, z } = e.detail.point;

    this.cursorHighlightPosition = `${Math.floor(x + 0.5)} 0.01 ${Math.floor(z + 0.5)}`;
  }
}
</script>

<style scoped lang="scss">
a-scene {
  height: 100vh;
}
</style>
