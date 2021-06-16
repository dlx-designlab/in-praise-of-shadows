<template>
  <div class="root">
    <transition name="fade">
      <div class="pointcloud-video-generator-container" v-if="currentPerspective">
        <PointcloudVideos
          @exitVideoGenerator="exitVideoGenerator"
          :currentPerspective="currentPerspective"
        />
      </div>
    </transition>
    <div>
        <div class="tooltip-container" ref="tooltipContainer">
          <div class="tooltip">
            <p ref="tooltipText" v-html="getInfoText()" />
          </div>
        </div>
        <div class="scene-container" ref="three"></div>
        <audio loop class="forest-sounds">
            <source src="/audio/forest-sounds.mp3" type="audio/mpeg">
        </audio>
        <audio loop class="synth-sounds">
            <source src="/audio/synth-sounds.mp3" type="audio/mpeg">
        </audio>
        <audio loop class="rainfall-sounds">
            <source src="/audio/rain-sounds.mp3" type="audio/mpeg">
        </audio>
        <transition name="fade">
            <div v-if="isLoaded">
                <ForestVisualisationUI
                    :selectedForest="selectedForest"
                    @goToForestBath="goToForestBath"
                    @exitVideoGenerator="exitVideoGenerator"
                    @goToInsectPerspective="goToInsectPerspective"
                    @goToBirdPerspective="goToBirdPerspective"
                />
            </div>
        </transition>
      </div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import PointcloudVideos from './pointcloud-videos.vue';
import ForestVisualisationUI from './forest-visualisation-ui.vue';

let camera;
let renderer;
let scene;
let orbitControls;

const manager = new THREE.LoadingManager();
const loader = new PLYLoader(manager);

let width = window.innerWidth;
let height = window.innerHeight;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let model;
let model2;
let model3;
let model4;
const sceneObjects = [];
const allTreeModels = [];

// related to rain
const cloudParticles = [];
const rainGeo = new THREE.Geometry();
const rainCount = 20000;
let rain;
let flash;
let clickables = [];

export default {
  name: 'forest-visualisation',
  data() {
    return {
      currentPerspective: null,
      isLoaded: false,
      animating: true,
      isRaining: false,
      perspectiveMode: false,
      intersection: null,
      showTooltip: false,
      mouseX: 0,
      mouseY: 0,
    };
  },
  props: {
    selectedForest: String,
    subPage: Number,
    loadLocationTwo: Boolean,
  },
  components: {
    PointcloudVideos,
    // PointcloudVideoScene,
    ForestVisualisationUI,
  },
  watch: {
    subPage(val) {
      if (val === 2) {
        this.goToForestMap();
      } else if (val === 0) {
        this.$emit('goToForestVisualisationVR');
      }
    },
  },
  mounted() {
    camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 15000);
    camera.position.set(50, 75, -400);
    camera.up = new THREE.Vector3(0, 0, 1);
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    scene = new THREE.Scene();
    scene.add(camera);
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = true;
    orbitControls.enableZoom = true;
    orbitControls.autoRotateSpeed = 0.5;
    orbitControls.target.set(0, 0, -400);
    window.orbitControls = orbitControls;
    window.camera = camera;
    orbitControls.maxDistance = 500;
    this.setupRenderer();
    this.setupLights();
    this.bindEvents();
    this.onWindowResize();
    if (this.loadLocationTwo === true) {
      loader.load('./models/flora_scans/location2-rgb.ply', (geometry) => {
        model = new THREE.Points(geometry,
          new THREE.PointsMaterial({
            size: 1,
            vertexColors: THREE.VertexColors,
          }));

        model.scale.set(25, 25, 25);
        model.name = 'location2';
        allTreeModels.push(model);
        model.position.set(0, 0, -500);
        window.model = model;
      });
    } else {
      loader.load('./models/flora_scans/location2-rgb.ply', (geometry) => {
        model = new THREE.Points(geometry,
          new THREE.PointsMaterial({
            size: 1,
            vertexColors: THREE.VertexColors,
          }));

        model.scale.set(25, 25, 25);
        model.name = 'location2';
        allTreeModels.push(model);
        model.position.set(0, 0, -500);
        window.model = model;
      });

      loader.load('./models/flora_scans/location1a-rgb.ply', (geometry) => {
        model = new THREE.Points(geometry,
          new THREE.PointsMaterial({
            size: 1,
            vertexColors: THREE.VertexColors,
          }));

        model.scale.set(25, 25, 25);
        model.name = 'location1a';
        model.position.set(0, 0, -500);
        allTreeModels.push(model);
        window.model = model;
      });

      loader.load('./models/flora_scans/location1b-rgb.ply', (geometry) => {
        model = new THREE.Points(geometry,
          new THREE.PointsMaterial({
            size: 1,
            vertexColors: THREE.VertexColors,
          }));

        model.scale.set(25, 25, 25);
        model.name = 'location1b';
        model.position.set(0, 0, -500);
        allTreeModels.push(model);
        window.model = model;
      });

      loader.load('./models/flora_scans/location1c-rgb.ply', (geometry) => {
        model = new THREE.Points(geometry,
          new THREE.PointsMaterial({
            size: 1,
            vertexColors: THREE.VertexColors,
          }));

        model.scale.set(25, 25, 25);
        model.name = 'location1c';
        model.position.set(0, 0, -500);
        allTreeModels.push(model);
        window.model = model;
      });

      loader.load('./models/flora_scans/location1d-rgb.ply', (geometry) => {
        model = new THREE.Points(geometry,
          new THREE.PointsMaterial({
            size: 1,
            vertexColors: THREE.VertexColors,
          }));

        model.scale.set(25, 25, 25);
        model.name = 'location1d';
        model.position.set(0, 0, -470);
        allTreeModels.push(model);
        window.model = model;
      });
    }
    this.createClickables();
    this.$refs.three.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('click', this.onClick);
  },
  methods: {
    destroyClickables() {
      clickables.forEach((clickable) => {
        scene.remove(clickable);
      });
      clickables = [];
    },
    getInfoText() {
      let texts;
      if (this.$i18n.locale === 'en') {
        texts = [
          'This forest contains nearly 2,000 species and subspecies, including some of the most ancient living trees on the planet. One example is the famous <a href="#" style="color:#00FF00;text-decoration:none;">Jomon Sugi</a>, of an age estimated between 2,170 and 7,200 years.<br><br>Protected as a <a style="color:#00FF00;text-decoration:none;" href="#">UNESCO World Heritage</a>, the forest was an inspiration for Studio Ghibli’s Princess Mononoke.',
          'Watching all ‘Star Wars’ movies emits <a href="#" style="color:#FF0000;text-decoration:none;">6 kg of CO2</span>. That is equivalent to a lightbulbrunning for 73 days. In fact, 60% of the internet’s emissions come from video streaming. <br><br>Netflix has partnered with <a href="#" style="color:#FF0000;text-decoration:none;">Eden Reforestation Projects</a> and committed to planting <a href="#" style="color:#FF0000;text-decoration:none;">1 million trees</span> in Bolivia to reduce its carbon footprint. Netflix has also supported an employment scheme for locals through this reforestation project.',
        ];
      } else {
        texts = [
          '屋久島の森には約2,000種の生物が生息しており、その中には地球上で最も長生きをしている樹木も含まれています。例として、有名な縄文杉は、推定樹齢が2,170年から7,200年と言われています',
          'ユネスコの世界遺産として保護されているこの森は、スタジオジブリの「もののけ姫」のインスピレーションとなりました。<br><br>映画の中で、森の精霊は「シシガミ」と呼ばれ、生と死を司る神として描かれています。また、「こだま」と呼ばれる小さな精霊も杉の森に生息し、生態系の健康状態を表しています。',
          '「スター・ウォーズ」の映画をすべて観ると、6kgのCO2が排出されます。これは、電球を73日間点灯し続けるのに相当します。実際、インターネットによる二酸化炭素排出量の60％は、ビデオストリーミングによるものです。 <br><br>Netflixは、Eden ReforestationProjectsと提携し、二酸化炭素排出量を削減するために、ボリビアに100万本の木を植えることを表明しました。Netflixは、この森林再生プロジェクトを通じて、現地の人々の雇用計画もサポートしています。 ',
        ];
      }
      return `${texts[Math.floor(Math.random() * texts.length)]}`;
    },
    onClick() {
      if (!this.$refs.tooltipText) {
        return;
      }
      this.$refs.tooltipText.innerHTML = this.getInfoText();
      if (this.intersection && this.intersection.length > 0) {
        this.showTooltip = true;
        this.$refs.tooltipContainer.style.display = 'block';
        this.$refs.tooltipContainer.style.left = `${this.currentMouseX}px`;
        this.$refs.tooltipContainer.style.top = `${this.currentMouseY - 300}px`;
      } else {
        this.showTooltip = false;
        this.$refs.tooltipContainer.style.display = 'none';
      }
    },
    onMouseMove(event) {
      this.currentMouseX = event.clientX;
      this.currentMouseY = event.clientY;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (clickables.length > 0) {
        this.raycast();
      }
    },
    changeCameraType() {
      orbitControls.enabled = false;
      camera.position.x = 0;
      camera.position.z = 0;
      camera.rotation.x = 0;
      camera.rotation.y = 0;
      camera.rotation.z = 0;
      this.perspectiveMode = true;
      this.$emit('setToPerspectiveMode');
      window.camera = camera;
    },
    addLensFlare() {
      scene.background = new THREE.CubeTextureLoader()
        .setPath('/images/textures/cubemaps/')
        .load([
          'front.png',
          'left.png',
          'right.png',
          'top.png',
          'bottom.png',
          'back.png',
        ]);
      const light = new THREE.PointLight(0xffffff, 1.5, 2000);
      light.position.x = Math.ceil(Math.random() * 1500) * (Math.round(Math.random()) ? 1 : -1);
      light.position.y = Math.ceil(Math.random() * 1500) * (Math.round(Math.random()) ? 1 : -1);
      light.position.z = 150;
    },
    goToForestBath() {
      this.destroyClickables();
      this.addLensFlare();
      document.querySelector('.forest-sounds').play();
      document.querySelector('.rainfall-sounds').play();

      this.isRaining = true;
      const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
      scene.add(hemiLight);

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
        size: 2.5,
        transparent: true,
      });
      rain = new THREE.Points(rainGeo, rainMaterial);
      scene.add(rain);
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
          cloud.position.y = Math.ceil(Math.random() * 1500) * (Math.round(Math.random()) ? 1 : -1);
          cloud.position.z = 150;
          cloud.rotation.y = Math.PI;
          cloud.material.opacity = 0.6;
          cloudParticles.push(cloud);
          scene.add(cloud);
        }
      });
    },
    createClickables() {
      const spriteImage = new THREE.TextureLoader().load('/images/textures/plus-sprite.png');
      for (let i = 0; i < 3; i += 1) {
        const sprite1 = new THREE.Sprite(new THREE.SpriteMaterial({ map: spriteImage }));
        sprite1.position.x = Math.ceil(Math.random() * 200) * (Math.round(Math.random()) ? 1 : -1);
        sprite1.position.y = Math.ceil(Math.random() * 200) * (Math.round(Math.random()) ? 1 : -1);
        sprite1.position.z = -460;
        sprite1.scale.set(15, 15, 15);
        scene.add(sprite1);
        clickables.push(sprite1);
      }
    },
    exitVideoGenerator() {
      this.currentPerspective = null;
    },
    goToInsectPerspective() {
      this.exitVideoGenerator();
      this.currentPerspective = 'insect';
    },
    goToBirdPerspective() {
      this.exitVideoGenerator();
      this.currentPerspective = 'bird';
    },
    goToForestMap() {
      this.$emit('goToForestMap');
    },
    tweenOut() {
      new TWEEN.Tween(orbitControls.target)
        .to({
          x: 0, y: 0, z: -455,
        }, 5000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {

        })
        .start();

      new TWEEN.Tween(camera.position)
        .to({
          x: 5, y: 5, z: -455,
        }, 5000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {

        })
        .start();
    },
    createTree() {
      const chosenModel = allTreeModels[Math.floor(Math.random() * allTreeModels.length)].clone();
      scene.add(chosenModel);
      sceneObjects.push(chosenModel);
    },
    placeTreeBatch() {
      for (let i = 0; i < 1; i += 1) {
        this.createTree();
      }
    },
    animate() {
      const render = () => {
        if (this.animating) {
          renderer.render(scene, camera);
          TWEEN.update();
          if (this.perspectiveMode === true) {
            target.x = (1 - mouse.x) * 0.002;
            target.y = ((1 - mouse.y) * 0.002);
            camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
            camera.rotation.y += 0.05 * (target.x - camera.rotation.y);
          } else {
            orbitControls.update();
          }

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
              if (p.z < -700) {
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
      scene.fog = new THREE.FogExp2(0x11111f, 0.001);

      // rain lightning flash
      flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
      flash.position.set(200, 300, 100);
      scene.add(flash);
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
    raycast() {
      raycaster.setFromCamera(mouse, camera);
      this.intersection = raycaster.intersectObjects(clickables, true);
      if (this.intersection.length > 0) {
        orbitControls.autoRotate = false;
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'auto';
        orbitControls.autoRotate = true;
        this.showTooltip = false;
        this.$refs.tooltipContainer.style.display = 'none';
      }
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
          // eslint-disable-next-line no-use-before-define
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
    this.$refs.three.removeEventListener('mousemove', this.onMouseMove);
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

.root {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;

    .pointcloud-video-generator-container {
      width: 100%;
      height: 100%;
      position: fixed;
      z-index: 5;
      background-color: rgba(0,0,0,0.9);
    }

  .tooltip-container {
      display: none;
      height: auto;
      width: 340px;
      background-color: #FFFFFF;
      position: fixed;
      z-index: 4;
      -webkit-box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
      box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
      text-align: center;
      border-radius: 50px 50px 50px 0px;
      padding: 15px;

      .tooltip {
          font-family: 'Lexend Deca', sans-serif;
          color: #000000;
          text-align: left;
          padding: 15px;
          font-size: 0.9em;
          text-align: center;
      }
  }
}

</style>
