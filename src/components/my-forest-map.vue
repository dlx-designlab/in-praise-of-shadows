<template>
  <div class="root">
      <MyForestUI
            :showingMyForestStats="showingMyForestStats"
        />
    <transition name="fade">
        <GlobeTooltip
            :hoveredPoint="hoveredPoint"
            :mouseX="mouseX"
            :mouseY="mouseY"
        />
    </transition>

    <transition name="fade">
        <div v-if="zoomedOut" class="forest-map-key">
        </div>
    </transition>
    <div class="scene-container" ref="three"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import GlobeTooltip from './globe-tooltip.vue';
import MyForestUI from './my-forest-ui.vue';

let camera;
let renderer;
let orbitControls;
let scene;

const manager = new THREE.LoadingManager();
const loader = new PLYLoader(manager);

let width = window.innerWidth;
let height = window.innerHeight;

const raycaster = new THREE.Raycaster();
const forestPoints = [];
const mouse = new THREE.Vector2();

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
    subPage(val) {
      if (val === 0) {
        this.$emit('goToMyForestVisualisationVR');
      } else if (val === 1) {
        this.$emit('goToMyForest');
      }
    },
  },
  components: {
    GlobeTooltip,
    MyForestUI,
  },
  mounted() {
    camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 150000);
    camera.position.set(0, 0, 0);
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    scene = new THREE.Scene();
    camera.position.y = 100;
    scene.add(camera);
    this.setupRenderer();
    this.setupLights();
    this.bindEvents();
    this.onWindowResize();

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = false;
    orbitControls.enableZoom = true;
    const self = this;

    loader.load('./models/maps/2-reduced.ply', (geometry) => {
      model = new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 2,
        vertexColors: THREE.VertexColors,
      }));
      model.geometry.computeBoundingBox();
      model.geometry.center();
      model.scale.set(15, 15, 15);
      model.rotateX(Math.PI / 2);
      model.rotateY((Math.PI / 2) * 2);
      scene.add(model);
      self.animate();
      self.addLights();
      self.tweenOut();
    });
  },
  methods: {
    close() {
      this.$emit('closeForestMap');
    },
    raycast() {
      raycaster.setFromCamera(mouse, camera);
      const intersection = raycaster.intersectObjects(forestPoints, false);
      if (intersection.length > 0) {
        this.hoveredPoint = intersection[0].object.name;
        document.body.style.cursor = 'pointer';
      } else {
        this.hoveredPoint = null;
        document.body.style.cursor = 'default';
      }
    },
    updateMousePosition() {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((this.mouseX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((this.mouseY - rect.top) / rect.height) * 2 + 1;
      if (forestPoints.length > 0) {
        this.raycast();
      }
    },
    onMouseMove(e) {
      e.preventDefault();
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    addPointsOfInterest() {
      const geometry = new THREE.SphereGeometry(120, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x90ee90,
        transparent: true,
        opacity: 0,
        metalness: 0.99,
        roughness: 0.3,
        clearcoat: 1,
        refractionRatio: 0.8,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(-550, 0, 550);
      scene.add(sphere);
      forestPoints.push(sphere);
      sphere.name = 'Point of Interest 1';
      for (let i = 0; i < 5; i += 1) {
        const randomA = Math.ceil(Math.random() * 550) * (Math.round(Math.random()) ? 1 : -1);
        const randomB = Math.ceil(Math.random() * 550) * (Math.round(Math.random()) ? 1 : -1);
        const newSphere = sphere.clone();
        sphere.position.set(randomA, 0, randomB);
        scene.add(newSphere);
        newSphere.name = `Point of Interest ${(i + 2).toString()}`;
        forestPoints.push(newSphere);
      }

      new TWEEN.Tween(sphere.material)
        .to({
          opacity: 0.4,
        }, 1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {
        })
        .start();
    },
    addLights() {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      scene.add(directionalLight);
    },
    tweenOut() {
      new TWEEN.Tween(camera.position)
        .to({
          y: 1500,
        }, 2000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {
          this.zoomedOut = true;
          this.addPointsOfInterest();
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
            // an array of materials
            // eslint-disable-next-line no-restricted-syntax
            for (const material of object.material) material.dispose();
          }
        }

        if (!object.isMesh) return;
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

        object.geometry.dispose();

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
          TWEEN.update();
          orbitControls.update();
          renderer.render(scene, camera);
          this.updateMousePosition();
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
    orbitControls.dispose();
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
