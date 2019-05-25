import AFRAME from 'aframe';

AFRAME.registerComponent(
  "raycaster-listen",
  {
    init() {
      this.el.addEventListener("raycaster-intersected", (e) => {
        this.raycasterEl = e.detail.el;
      });

      this.el.addEventListener("raycaster-intersected-cleared", (e) => {
        this.raycasterEl = null;
      });
    },

    tick() {
      if(!this.raycasterEl) return;

      this.intersectionPoint = this.raycasterEl.components.raycaster.getIntersection(this.el);

      if(!this.intersectionPoint) return;

      this.el.emit("raycaster-updated", this.intersectionPoint);
    }
  }
)