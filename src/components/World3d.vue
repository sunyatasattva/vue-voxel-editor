<template>
  <a-scene
    stats
    :gridhelper="`divisions: ${this.WORLD_SIZE.x}; size: ${this.WORLD_SIZE.x}; colorGrid: #666; colorCenterLine: black`"
    ref="world"
    @child-attached="childAttached"
  >
    <a-assets>
      <a-mixin id="hover" material="transparent: true; opacity: 0.8"></a-mixin>
    </a-assets>
    <a-plane
      id="cursor-highlight"
      rotation="-90 0 0"
      width="1"
      height="1"
      color="#23b3f4"
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
      @raycaster-updated="handleRaycasterUpdate"
    ></a-plane>

    <a-box
      raycaster-listen
      shadow
      skeleton-helper
      class="collidable voxel"
      v-for="object in objects"
      :color="`${object._uuid === selectedObjectId ? '#0055ff' : object.color}`"
      :key="object._uuid"
      :id="object._uuid"
      :position="`${object.position.x} ${object.position.y} ${object.position.z}`"
      @mousedown="handleClick"
      @mouseenter="handleHover"
      @mouseleave="handleHover"
      @raycaster-updated="handleRaycasterUpdate"
    ></a-box>

    <a-entity
      id="camera"
      orbit-controls="enablePan: true; initialPosition: 10 10 10; keyPanSpeed: 100; enableRotate: false; maxDistance: 60; minDistance: 5; rotateSpeed: 0.25; zoomSpeed: 1.25"
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

import { AFrame, DetailEvent, EntityEventMap, utils as AFrameUtils, Coordinate } from "aframe";

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
  private isMouseDown: false | AFrame["AEntity"] = false;
  private objects!: any[];
  private selectedObjectId!: string;
  private selectedTool!: string;

  mounted() {
    document.addEventListener("keydown", this.handleRotate);
    document.addEventListener("keyup", this.handleRotate);
    document.addEventListener("mouseup", () => this.isMouseDown = false);

    this.$store.commit("createWorld", this.$refs.world);
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
        y: cursorPosition.y + 0.49,
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

  handleHover(e: DetailEvent<"mouseenter">) {
    if(this.selectedTool === "Select") {
      if(e.type === "mouseenter")
        e.target.setAttribute("mixin", "hover");
      else if(e.type === "mouseleave")
        e.target.setAttribute("mixin", "");
    }
  }
  
  handleRaycasterUpdate(e: DetailEvent<"raycaster-updated">) {
    if(this.isMouseDown) {
      this.updateObjectPosition(this.isMouseDown, e.detail.point);
    } else {
      this.updateCursorHighlight(e);
    }
  }

  handleRotate({ keyCode, type }: KeyboardEvent) {
    const camera: AFrame["AEntity"] | null = this.$el.querySelector("#camera");
    const orbitControls = camera.components["orbit-controls"];

    if(type === "keydown") {

      if (keyCode === 81) { // Q
        orbitControls.controls.autoRotate = true;
        orbitControls.controls.autoRotateSpeed = 3;
      } else if (keyCode === 69) { // E
        orbitControls.controls.autoRotate = true;
        orbitControls.controls.autoRotateSpeed = -3;
      }

    } else if(type === "keyup") {
      orbitControls.controls.autoRotate = false;
    }
  }

  selectObject(e: DetailEvent<"click">) {
    e.target.addState("selected");
    this.$store.commit("selectObject", e.target.id);
    this.isMouseDown = e.target;
  }

  updateCursorHighlight(e: DetailEvent<"raycaster-updated">) {
    let v: THREE.Vector3;
    const { x, y, z } = e.detail.point;
    
    if( e.target.className.includes("voxel") ) {
      const intersectedFace = e.detail.face.normal;

      v = new AFRAME.THREE.Vector3(x, y, z)
        .round()
        .add( new AFRAME.THREE.Vector3(0, 0.01, 0) );
    }
    else
      v = new AFRAME.THREE.Vector3( Math.floor(x + 0.5), 0.01, Math.floor(z + 0.5) );

    this.cursorHighlightPosition = AFrameUtils.coordinates.stringify(v);
  }

  // @question Duplicate code?
  updateObjectPosition(object: AFrame["AEntity"], { x, y, z }: Coordinate) {

    // @todo this should update state!
    object.setAttribute(
      "position",
      `${Math.floor(x + 0.5)} 0.5 ${Math.floor(z + 0.5)}`
    );
  }
}
</script>

<style scoped lang="scss">
a-scene {
  height: 100vh;
}
</style>
