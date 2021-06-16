<template>
  <div class="mobile-vr">
      <a-scene>
        <a-assets>
        </a-assets>
        <a-sky color="#000000"></a-sky>
        <a-entity foo position="0 0 0"> </a-entity>
    </a-scene>
  </div>
</template>

<script>
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

const { THREE } = window.AFRAME;
const manager = new THREE.LoadingManager();
const loader = new PLYLoader(manager);
// import * as THREE from 'three';
/* eslint-disable-next-line */
import VueAframe from 'vue-aframe';
export default {
  name: 'mobile-vr',
  beforeMount() {
  },
  mounted() {
    this.$emit('showLoader');
    const self = this;
    window.AFRAME.registerComponent('foo', {
      // this is called upon initialization
      init() {
        const that = self;
        this.el.addEventListener('loaded', () => {
          loader.load('./models/flora_scans/location2-rgb.ply', (geometry) => {
            const model = new THREE.Points(geometry, new THREE.PointsMaterial({
              size: 1,
              vertexColors: THREE.VertexColors,
            }));
            model.scale.setScalar(30);
            model.scale.set(30, 30, 30);
            window.model = model;
            window.model.rotation.y = Math.PI;
            window.model.rotation.x = Math.PI / 2;
            model.position.set(0, -50, 0);
            this.el.setObject3D('mesh', model);
            that.$emit('hideLoader');
          });
        });
      },
    });
    window.AFRAME.registerComponent('mythreejsthing', {
      schema: {
        color: {
          default: '#000',
        },
      },

      update() {
        const material = new THREE.MeshBasicMaterial({
          color: this.data.color,
          wireframe: false,
        });

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
      },

      remove() {
        this.el.removeObject3D('mesh');
      },
    });
  },
};
</script>

<style scoped lang="scss">
    .mobile-vr {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
