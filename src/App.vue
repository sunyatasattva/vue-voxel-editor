<template>
  <div id="app">
    <Toolbar />
    <World3d />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Toolbar from "./components/Toolbar.vue";
import World3d from "./components/World3d.vue";

@Component({
  components: {
    Toolbar,
    World3d,
  },
})
export default class App extends Vue {
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
