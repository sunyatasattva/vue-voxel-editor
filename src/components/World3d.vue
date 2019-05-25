<template>
  <a-scene
    stats
    :gridhelper="`divisions: ${this.WORLD_SIZE.x}; size: ${this.WORLD_SIZE.x}; colorGrid: #666; colorCenterLine: black`"
  >
    <a-plane
      id="cursor-highlight"
      rotation="-90 0 0"
      width="1"
      height="1"
      color="tomato"
      material="transparent: true; opacity: 0.5"
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
    ></a-plane>

    <a-box
      class="collidable"
      v-for="object in objects"
      :key="object.id"
      :color="object.color"
      :position="`${object.position.x} ${object.position.y} ${object.position.z}`"
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
import { mapState } from "vuex";
import "aframe";
import "aframe-event-set-component";
import "aframe-gridhelper-component";
import "aframe-orbit-controls";
import "../aframe-components/raycaster-listen";

import { AFrame, DetailEvent, utils as AFrameUtils } from "aframe";

@Component({
  computed: mapState(["objects"])
})
export default class World3d extends Vue {
  private WORLD_SIZE = {
    x: 25,
    y: 25
  };

  mounted() {
    const camera: AFrame["AEntity"] | null = this.$el.querySelector("#camera");
    const cursorHighlight: AFrame["AEntity"] | null = this.$el.querySelector(
      "#cursor-highlight"
    );
    const floor: AFrame["AEntity"] | null = this.$el.querySelector("#floor");

    document.addEventListener("keydown", (e) => {
      const orbitControls = camera.components["orbit-controls"];

      console.log(orbitControls, e.keyCode, e.key);

      if(e.keyCode === 81) { // Q
        orbitControls.controls.autoRotate = true;
        orbitControls.controls.autoRotateSpeed = 2;
      } else if(e.keyCode === 69) { // E
        orbitControls.controls.autoRotate = true;
        orbitControls.controls.autoRotateSpeed = -2;
      }
    });

    document.addEventListener("keyup", (e) => {
      const orbitControls = camera.components["orbit-controls"];

      orbitControls.controls.autoRotate = false;
    });

    if (floor) {
      floor.addEventListener("raycaster-updated", function(e) {
        const { x, z } = e.detail.point;

        cursorHighlight.setAttribute(
          "position",
          `${Math.floor(x + 0.5)} 0.01 ${Math.floor(z + 0.5)}`
        );
      });

      floor.addEventListener("click", e => {
        const raycasterEl = e.target.components["raycaster-listen"].raycasterEl;

        if (!raycasterEl) return;

        const cursorPosition = AFrameUtils.coordinates.parse(
          cursorHighlight.getAttribute("position")
        );

        this.$store.commit("addObject", {
          color: "tomato",
          position: {
            x: cursorPosition.x,
            y: 0.5,
            z: cursorPosition.z
          }
        });
      });
    }
  }
}
</script>

<style scoped lang="scss">
a-scene {
  height: 100vh;
}
</style>
