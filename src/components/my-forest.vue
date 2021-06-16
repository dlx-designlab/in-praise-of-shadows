<template>
  <div class="my-forest-container">
    <audio loop class="rainfall-sounds">
        <source src="/audio/rain-sounds.mp3" type="audio/mpeg">
    </audio>
      <div class="my-forest-ui-container" v-if="!isLoading">
        <MyForestUI
          :showingMyForestStats="showingMyForestStats"
          @changeTreeCount="changeTreeCount"
          @startRain="startRain"
          :isLoading="isLoading"
        />
      </div>
    <div class="scene-container" ref="three">
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import TWEEN from '@tweenjs/tween.js';
import MyForestUI from './my-forest-ui.vue';

let width = window.innerWidth;
let height = window.innerHeight;
const manager = new THREE.LoadingManager();

let camera;
let renderer;
let scene;
let orbitControls;

const loader = new PLYLoader(manager);

const mouse = new THREE.Vector2();
const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

let model;
let model3;
let model4;
const sceneObjects = [];
const allTreeModels = [];

// related to rain
const cloudParticles = [];
const rainGeo = new THREE.Geometry();
const rainCount = 50000;
let rain;
let flash;

let model2;

export default {
  name: 'MyForest',
  props: {
    showingMyForestStats: Boolean,
    subPage: Number,
    isLoading: Boolean,
  },
  watch: {
    subPage(val) {
      if (val === 0) {
        this.$emit('goToMyForestVisualisationVR');
      } else if (val === 2) {
        this.$emit('goToMyForestMap');
      }
    },
  },
  data() {
    return {
      animating: true,
      currentTreeCount: 30,
      isRaining: false,
    };
  },
  components: {
    MyForestUI,
  },
  mounted() {
    camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 15000);
    camera.position.set(850, 250, 1250);
    camera.up = new THREE.Vector3(0, 0, 1);
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    scene = new THREE.Scene();
    scene.add(camera);
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = true;
    orbitControls.enableZoom = true;
    orbitControls.autoRotateSpeed = 0.5;
    orbitControls.target.set(0, -100, 0);
    orbitControls.maxDistance = 1500;
    this.setupRenderer();
    this.setupLights();
    this.bindEvents();
    this.onWindowResize();

    loader.load('./models/tree-1-0.005.ply', (geometry) => {
      model = new THREE.Points(geometry,
        new THREE.PointsMaterial({
          size: 1,
          vertexColors: THREE.VertexColors,
        }));

      model.geometry.computeBoundingBox();
      model.geometry.center();
      model.scale.set(25, 25, 25);
      model.rotation.x = Math.PI * 3;
      model.rotation.y = Math.PI * 3;
      model.position.set(-150, 0, 0);
      allTreeModels.push(model);
      sceneObjects.push(model);
    });

    loader.load('./models/tree-2-0.005.ply', (geometry) => {
      model2 = new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 1,
        vertexColors: THREE.VertexColors,
      }));
      model2.geometry.computeBoundingBox();
      model2.geometry.center();
      model2.scale.set(25, 25, 25);
      model2.rotation.x = Math.PI * 3;
      model2.rotation.y = Math.PI * 3;
      model2.position.set(-150, 0, 0);
      allTreeModels.push(model2);
      sceneObjects.push(model2);
    });

    loader.load('./models/tree-3-0.005.ply', (geometry) => {
      model3 = new THREE.Points(geometry,
        new THREE.PointsMaterial({
          size: 1,
          vertexColors: THREE.VertexColors,
        }));

      model3.geometry.computeBoundingBox();
      model3.geometry.center();
      model3.scale.set(25, 25, 25);
      model3.rotation.x = Math.PI * 3;
      model3.rotation.y = Math.PI * 3;
      model3.position.set(-750, 0, 0);
      allTreeModels.push(model3);
      sceneObjects.push(model3);
    });

    loader.load('./models/tree-4-0.005.ply', (geometry) => {
      model4 = new THREE.Points(geometry,
        new THREE.PointsMaterial({
          size: 1,
          vertexColors: THREE.VertexColors,
        }));

      model4.geometry.computeBoundingBox();
      model4.geometry.center();
      model4.scale.set(45, 45, 45);
      model4.rotation.x = Math.PI * 3;
      model4.rotation.y = Math.PI * 3;
      model4.position.set(-1000, 0, 0);
      allTreeModels.push(model4);
      sceneObjects.push(model4);
    });
  },
  methods: {
    startRain() {
      this.isRaining = true;

      const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
      scene.add(hemiLight);
      document.querySelector('.rainfall-sounds').play();
      for (let i = 0; i < rainCount; i += 1) {
        const rainDrop = new THREE.Vector3(
          Math.ceil(Math.random() * 1500) * (Math.round(Math.random()) ? 1 : -1),
          Math.ceil(Math.random() * 1500) * (Math.round(Math.random()) ? 1 : -1),
          Math.random() * 1400 - 200,
        );
        rainDrop.velocity = {};
        rainDrop.velocity = 0;
        rainGeo.vertices.push(rainDrop);
      }
      const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.5,
        transparent: true,
      });
      rain = new THREE.Points(rainGeo, rainMaterial);
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/images/smoke.png', (texture) => {
        const cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        const cloudMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true,
        });
        for (let p = 0; p < 25; p += 1) {
          const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
          cloud.position.x = Math.ceil(Math.random() * 1500) * (Math.round(Math.random()) ? 1 : -1);
          cloud.position.z = Math.ceil(Math.random() * 1500) * (Math.round(Math.random()) ? 1 : -1);
          cloud.position.y = 150;
          cloud.rotation.x = 1.16;
          cloud.rotation.z = -0.12;
          cloud.rotation.y = Math.random() * 360;
          cloud.material.opacity = 0.6;
          cloudParticles.push(cloud);
        }
      });
      scene.add(rain);
    },
    changeTreeCount(count) {
      if (count < this.currentTreeCount) {
        this.addTrees(Math.abs(count - this.currentTreeCount));
      } else {
        this.removeTrees(Math.abs(count - this.currentTreeCount));
      }
    },
    addTrees(number) {
      console.log(this.currentTreeCount);
      if (this.currentTreeCount < 17) { return; }
      for (let i = 0; i < number; i += 1) {
        this.createTree();
      }

      this.currentTreeCount -= number;
    },
    removeTrees(number) {
      for (let i = 0; i < number; i += 1) {
        const lastTree = sceneObjects.pop();
        lastTree.geometry.dispose();
        lastTree.material.dispose();
        scene.remove(lastTree);
      }
      this.currentTreeCount += number;
    },
    goToForestMap() {
      this.$emit('goToForestMap');
    },
    onMouseMove(event) {
      mouse.x = (event.clientX - windowHalf.x);
      mouse.y = (event.clientY - windowHalf.x);
    },
    tweenOut() {
      new TWEEN.Tween(orbitControls.target)
        .to({
          x: -100, y: -250, z: -100,
        }, 5000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {

        })
        .start();

      new TWEEN.Tween(camera.position)
        .to({
          x: 0, y: -100, z: -200,
        }, 5000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {

        })
        .start();
    },
    createTree() {
      const chosenModel = allTreeModels[Math.floor(Math.random() * allTreeModels.length)].clone();
      chosenModel.position.x = Math.ceil(Math.random() * 1500)
        * (Math.round(Math.random()) ? 1 : -1);
      chosenModel.position.y = Math.ceil(Math.random() * 1500)
        * (Math.round(Math.random()) ? 1 : -1);
      chosenModel.rotation.z = Math.floor(Math.random() * 360) + 1;
      scene.add(chosenModel);
      sceneObjects.push(chosenModel);
    },
    placeTreeBatch() {
      for (let i = 0; i < this.currentTreeCount; i += 1) {
        this.createTree();
      }
    },
    animate() {
      const render = () => {
        if (this.animating) {
          renderer.render(scene, camera);
          TWEEN.update();
          orbitControls.update();

          requestAnimationFrame(render);

          if (this.isRaining) {
            cloudParticles.forEach((p) => {
              const x = p;
              x.rotation.z -= 0.002;
            });
            rainGeo.vertices.forEach((p) => {
              const x = p;
              x.velocity -= 0.1 + Math.random() * 0.1;
              x.z += p.velocity;
              if (p.z < -200) {
                x.z = 200;
                x.velocity = 0;
              }
            });
            rainGeo.verticesNeedUpdate = true;
            rain.rotation.z += 0.002;
            if (Math.random() > 0.93 || flash.power > 100) {
              if (flash.power < 100) {
                flash.position.set(
                  Math.random() * 400,
                  300 + Math.random() * 200,
                  100,
                );
              }
              flash.power = 50 + Math.random() * 500;
            }
          }
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
      flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
      flash.position.set(200, 300, 100);
      scene.add(flash);
      scene.fog = new THREE.FogExp2(0x11111f, 0.001);
    },
    bindEvents() {
      window.addEventListener('resize', this.onWindowResize, false);
      manager.onStart = () => {
        this.isLoaded = false;

        this.$emit('showLoader', 'loading forest...');
      };

      manager.onLoad = () => {
        this.isLoaded = true;
        this.placeTreeBatch();
        this.animate();
        this.$emit('hideLoader');
        this.tweenOut();
      };
    },
    destroyScene() {
      scene.remove(model);
      scene.remove(model2);
      scene.remove(model3);
      scene.remove(model4);

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

      sceneObjects.forEach((element) => scene.remove(element));
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
  },
};
</script>

<style scoped lang="scss">

.my-forest-container {
   position: absolute;
   top: 0;
   right: 0;
   margin: 0;
   width: 100vw;
   height: 100vh;
   background-color: #FFFFFF;

   .loading-message-container {
      position: absolute;
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.7);

      .loading-message {
          font-weight: 900;
          text-transform: uppercase;
      }
   }
}

.scene-container {
    width: 100vw;
}

</style>
