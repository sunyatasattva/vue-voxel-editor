import AFRAME, { AFrame } from 'aframe';

AFRAME.registerComponent(
  "skeleton-helper",
  {
    init() {
      const helper = new AFRAME.THREE.BoxHelper(
        this.el.getObject3D("mesh"),
        new AFRAME.THREE.Color("#23b3f4")
      );

      helper.visible = false;

      this.skeletonHelper = helper;
      this.el.object3D.add(helper);
    },

    tick() {
      if( this.el.is("selected") )
        this.skeletonHelper.visible = true;
      else
        this.skeletonHelper.visible = false;
    }
  }
)