<template>
  <div class="toolbar">
    <button @click="selectTool('Create')" :disabled="this.selectedTool === 'Create'">Create</button>
    <button @click="selectTool('Select')" :disabled="this.selectedTool === 'Select'">Select</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import World3d from "./components/World3d.vue";
import { mapState } from 'vuex';

@Component({
  computed: mapState(["selectedTool"])
})
export default class Toolbar extends Vue {
  selectTool(tool: string) {
    this.$store.commit("selectTool", tool);
  }
}
</script>

<style lang="scss">
.toolbar {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 3;
}
</style>
