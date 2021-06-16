<template>
  <div class="root">
    <div class="scene-container" ref="three"></div>
    <audio autoplay loop>
        <source src="/audio/forest-sounds.mp3" type="audio/mpeg">
    </audio>
    <transition name="fade">
        <div v-if="isLoaded">
            <ForestBathUI
              :selectedForestBath="selectedForestBath"
              @showBirdView="showBirdView"
              @showSquirrelView="showSquirrelView"
              @showInsectView="showInsectView"
            />
        </div>
    </transition>
  </div>
</template>

<script>
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import ForestBathUI from './forest-bath-ui.vue';

let camera;
let renderer;
let scene;

const manager = new THREE.LoadingManager();

const loader = new PLYLoader(manager);
let width = window.innerWidth;
let height = window.innerHeight;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

let model;

export default {
  name: 'Tree',
  data() {
    return {
      isLoaded: false,
      animating: true,
    };
  },
  props: {
    selectedForestBath: String,
    selectedForestBathView: String,
  },
  components: {
    ForestBathUI,
  },
  mounted() {
    camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 15000);
    camera.position.set(-250, 250, -250);
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    scene = new THREE.Scene();
    scene.add(camera);

    this.setupRenderer();
    this.setupLights();
    this.bindEvents();
    this.onWindowResize();
    const self = this;
    loader.load('./models/baths/flora-point_cloud.ply', (geometry) => {
      model = new THREE.Points(geometry,
        new THREE.PointsMaterial({
          size: 1,
          vertexColors: THREE.VertexColors,
        }));
      model.geometry.computeBoundingBox();
      model.geometry.center();
      model.scale.set(35, 35, 35);
      model.rotation.y = Math.PI / 2;
      scene.add(model);
      self.animate();
    });
  },
  methods: {
    showBirdView() {
      this.$emit('goToForestBathBird');
      camera.fov = 70;
      camera.updateProjectionMatrix();
    },
    showSquirrelView() {
      camera.position.set(-40, -140, -50);
      camera.fov = 70;
      camera.updateProjectionMatrix();
    },
    showInsectView() {
      camera.position.set(-40, -240, -50);
      camera.fov = 20;
      camera.updateProjectionMatrix();
    },
    onMouseMove(event) {
      mouse.x = (event.clientX - windowHalf.x);
      mouse.y = (event.clientY - windowHalf.x);
    },
    animate() {
      const render = () => {
        if (this.animating) {
          renderer.render(scene, camera);
          requestAnimationFrame(render);
          TWEEN.update();

          target.x = (1 - mouse.x) * 0.002;
          target.y = (1 - mouse.y) * 0.002;

          camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
          camera.rotation.y += 0.05 * (target.x - camera.rotation.y);
        }
      };
      render();
    },
    setupRenderer() {
      renderer.setClearColor(0xffffff, 0);
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
    tweenOut() {
      const destination = new THREE.Vector3();
      if (this.selectedForestBathView === 'insect') {
        destination.x = -40;
        destination.y = -240;
        destination.z = -50;
        camera.fov = 20;
        camera.updateProjectionMatrix();
      } else {
        destination.x = -40;
        destination.y = -140;
        destination.z = -50;
      }
      new TWEEN.Tween(camera.position)
        .to({
          x: destination.x, y: destination.y, z: destination.z,
        }, 5000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {
        })
        .start();

      new TWEEN.Tween(model.rotation)
        .to({
          y: 0,
        }, 5000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {

        })
        .start();
    },
    bindEvents() {
      this.$refs.three.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('resize', this.onWindowResize, false);
      manager.onStart = () => {
        this.isLoaded = false;
        this.$emit('showLoader', 'loading forest...');
      };

      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`);
      };

      manager.onLoad = () => {
        this.isLoaded = true;
        this.$emit('hideLoader');
        this.tweenOut();
      };
    },
    onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    destroyScene() {
      scene.remove(model);
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
            // an array of materials
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
}

</style>
