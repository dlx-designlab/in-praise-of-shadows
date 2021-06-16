<template>
  <div class="root">
    <div class="scene-container" ref="three"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

let camera;
let renderer;
let scene;

const manager = new THREE.LoadingManager();
const loader = new PLYLoader(manager);

let width = window.innerWidth;
let height = window.innerHeight;

const forestPoints = [];

let model;

export default {
  name: 'Tree',
  data() {
    return {
      zoomedOut: false,
      animating: true,
      hoveredPoint: null,
      mouseX: 0,
      mouseY: 0,
    };
  },
  props: {
    subPage: Number,
    showingMyForestStats: Boolean,
  },
  watch: {
  },
  components: {
  },
  mounted() {
    camera = new THREE.PerspectiveCamera(90, width / height, 0.01, 1950);
    camera.position.set(0, 50, 1750);
    window.camera = camera;
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    scene = new THREE.Scene();
    camera.rotation.x = -0.5;
    scene.add(camera);
    this.setupRenderer();
    this.setupLights();
    this.bindEvents();
    this.onWindowResize();

    const self = this;

    loader.load('./models/floor2.ply', (geometry) => {
      model = new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 1,
        vertexColors: THREE.VertexColors,
      }));
      model.geometry.computeBoundingBox();
      model.geometry.center();
      model.scale.set(250, 250, 250);
      model.rotateX(Math.PI / 2);
      model.rotateY((Math.PI / 2) * 2);
      scene.add(model);
      self.animate();
    });
  },
  methods: {
    close() {
      this.$emit('closeForestMap');
    },
    tweenOut() {
      new TWEEN.Tween(camera.position)
        .to({
          y: 1500,
        }, 2000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {
          this.zoomedOut = true;
        })
        .start();

      new TWEEN.Tween(model.rotation)
        .to({
          z: -Math.PI / 2,
        }, 2000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {

        })
        .start();
    },
    destroyScene() {
      scene.remove(model);

      forestPoints.forEach((element) => scene.remove(element));
      renderer.renderLists.dispose();
      renderer.dispose();
      model = null;
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (object.material.isMaterial) {
            object.material.dispose();
          } else {
            // eslint-disable-next-line no-restricted-syntax
            for (const material of object.material) material.dispose();
          }
        }

        if (!object.isMesh) return;

        object.geometry.dispose();
        const cleanMaterial = (material) => {
          material.dispose();

          // dispose textures
          // eslint-disable-next-line no-restricted-syntax
          for (const key of Object.keys(material)) {
            const value = material[key];
            if (value && typeof value === 'object' && 'minFilter' in value) {
              value.dispose();
            }
          }
        };

        if (object.material.isMaterial) {
          cleanMaterial(object.material);
        } else {
          // an array of materials
          // eslint-disable-next-line no-restricted-syntax
          for (const material of object.material) cleanMaterial(material);
        }
      });
    },
    animate() {
      const render = () => {
        if (this.animating) {
          camera.position.z -= 0.5;
          TWEEN.update();
          renderer.render(scene, camera);
          requestAnimationFrame(render);
        }
      };
      render();
    },
    setupRenderer() {
      renderer.setClearColor(0x000000, 0);
      renderer.gammaOutput = true;
      renderer.gammaFactor = 1;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.$refs.three.appendChild(renderer.domElement);
    },
    setupLights() {
      const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
      scene.add(light);
    },
    bindEvents() {
      this.$refs.three.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('resize', this.onWindowResize, false);
      this.$refs.three.addEventListener('touchmove', this.onTouchMove);
      manager.onStart = () => {
        this.$emit('showLoader', 'LOADING MAP');
      };

      manager.onLoad = () => {
        this.$emit('hideLoader');
      };
    },
    onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
  },
  beforeDestroy() {
    this.destroyScene();
    this.animating = false;
    renderer.domElement = null;
    renderer = null;
    scene = null;
    camera = null;

    window.removeEventListener('resize', this.onWindowResize);
    this.$refs.three.removeEventListener('mousemove', this.onMouseMove);
    this.$refs.three.addEventListener('touchmove', this.onTouchMove);
  },
};
</script>

<style scoped lang="scss">

.root {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;

    .forest-map-key {
        position: absolute;
        width: 100px;
        top: 150px;
        left: 30px;
        color: #FFFFFF;
        text-align: left;
        padding: 15px;
        font-size: 0.8em;

        p {
            padding: 2px;
            margin: 0;
        }
        .header {
            font-weight: 900;
        }
    }

    .close-button {
        background: none; border: none;
        font-size: 0.8em;
        color: #FFFFFF;
        cursor: pointer;
        top: 150px;
        right: 50px;
        position: absolute;
    }
}

</style>
