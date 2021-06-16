<template>
  <div class="root">
    <div v-if="!isLoading">
        <transition name="slowfade">
            <h1 v-if="zoomedOut">{{ $t('forest-view.choose-entry') }}</h1>
        </transition>
        <transition name="fade">
        </transition>
        <div class="charts-container">
            <div class="outer-wrapper">
                <div class="first-percentage">--</div>
                <div class="column-wrapper">
                    <div class="label-image-container">
                        <img
                            v-if="$i18n.locale === 'en'"
                            class="label-image"
                            src="/images/ui/biodiversity.png"
                        />
                        <img v-else class="label-image" src="/images/ui/biodiversity-jp.png" />
                    </div>
                    <div class="column-one"></div>
                </div>
            </div>

            <div class="outer-wrapper">
                <div class="second-percentage">--</div>
                <div class="column-wrapper">
                    <div class="label-image-container">
                        <img
                            v-if="$i18n.locale === 'en'"
                            class="label-image"
                            src="/images/ui/carbon-captured.png"
                        />
                        <img v-else class="label-image" src="/images/ui/carbon-captured-jp.png" />
                    </div>
                    <div class="column-two"></div>
                </div>
            </div>

            <div class="outer-wrapper">
                <div class="third-percentage">--</div>
                <div class="column-wrapper">
                    <div class="label-image-container">
                        <img
                            v-if="$i18n.locale === 'en'"
                            class="label-image"
                            src="/images/ui/photosynthesis.png"
                        />
                        <img v-else class="label-image" src="/images/ui/photosynthesis-jp.png" />
                    </div>
                    <div class="column-three"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="scene-container" ref="three"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

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
      isShowingQRCodePopout: false,
    };
  },
  props: {
    selectedForest: String,
    subPage: Number,
    isLoading: Boolean,
  },
  watch: {
    subPage(val) {
      if (val === 1) {
        this.close(false);
      } else if (val === 0) {
        this.$emit('goToForestVisualisationVR');
      }
    },
  },
  mounted() {
    this.startGraphAnimation();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 150000);
    camera.position.set(0, 1850, 350);

    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    scene = new THREE.Scene();
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
      model.scale.set(17, 17, 17);
      model.rotateX(Math.PI / 2);
      model.rotateY((Math.PI / 2) * 2);
      model.rotateZ(-Math.PI / 2);
      scene.add(model);
      self.animate();
      self.addLights();
      setTimeout(() => {
        self.tweenOut();
      }, 1000);
    });
  },
  methods: {
    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    },
    getColour(percentage) {
      let color;
      if (percentage >= 90) {
        color = '#00E676';
      } else if (percentage < 90 && percentage >= 60) {
        color = '#81C784';
      } else if (percentage < 60 && percentage >= 40) {
        color = '#FFEB3B';
      } else if (percentage < 40 && percentage >= 10) {
        color = '#FF9800';
      } else if (percentage < 10 && percentage >= 0) {
        color = '#FF3D00';
      }
      return color;
    },
    startGraphAnimation() {
      this.graphInterval = setInterval(() => {
        const firstRandPercent = this.getRandomArbitrary(50, 80);
        const secondRandPercent = this.getRandomArbitrary(40, 70);
        const thirdRandPercent = this.getRandomArbitrary(20, 40);
        // Generic column color
        const firstColour = this.getColour(firstRandPercent);
        const secondColour = this.getColour(secondRandPercent);
        const thirdColour = this.getColour(thirdRandPercent);

        const first = document.querySelector('.column-one');
        first.style.background = `linear-gradient(180deg, ${firstColour} 70%, rgba(255, 178, 178, 0) 80%)`;
        first.style.height = `${firstRandPercent}%`;

        const second = document.querySelector('.column-two');
        second.style.background = `linear-gradient(180deg, ${secondColour} 40%, rgba(255, 178, 178, 0) 60%)`;
        second.style.height = `${secondRandPercent}%`;

        const third = document.querySelector('.column-three');
        third.style.background = `linear-gradient(180deg, ${thirdColour} 20%, rgba(255, 178, 178, 0) 40%)`;
        third.style.height = `${thirdRandPercent}%`;
        if (this.$i18n.locale === 'en') {
          document.querySelector('.first-percentage').innerHTML = (`${Math.round(firstRandPercent / 10)}<br>Species`);
        } else {
          document.querySelector('.first-percentage').innerHTML = (`${Math.round(firstRandPercent / 10)}<br>種`);
        }
        // eslint-disable-next-line no-mixed-operators
        document.querySelector('.second-percentage').innerHTML = (`${Math.round(secondRandPercent * 10 / 2)}<br>kg`);
        document.querySelector('.third-percentage').innerHTML = (`${Math.round(thirdRandPercent)}<br>%`);
      }, 1000);
    },
    move(elem) {
      let left = 0;
      function frame() {
        left += 1; // update parameters
        // eslint-disable-next-line no-param-reassign
        elem.style.left = `${left}px`; // show frame
        if (left === 100) { // check finish condition
        // eslint-disable-next-line no-use-before-define
          clearInterval(id);
        }
      }
      // eslint-disable-next-line vars-on-top
      const id = setInterval(frame, 10); // draw every 10ms
    },
    openShare() {
      this.isShowingQRCodePopout = !this.isShowingQRCodePopout;
    },
    close(bool) {
      this.$emit('closeForestMap', bool);
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
      sphere.name = 'LOCATION2';
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
          y: 1750,
        }, 2000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {
          this.zoomedOut = true;
          this.addPointsOfInterest();
        })
        .start();
    },
    destroyScene() {
      scene.remove(model);

      forestPoints.forEach((element) => scene.remove(element));
      // renderer.forceContextLoss();
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
    onClick() {
      if (this.hoveredPoint) {
        if (this.hoveredPoint === 'Point of Interest 2') {
          this.close(true);
        } else {
          this.close(false);
        }
      }
    },
    bindEvents() {
      this.$refs.three.addEventListener('click', this.onClick);
      this.$refs.three.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('resize', this.onWindowResize, false);
      this.$refs.three.addEventListener('touchmove', this.onTouchMove);
      manager.onStart = () => {
      };

      manager.onLoad = () => {
        this.$emit('hideGridTransition');
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
    clearInterval(this.graphInterval);
    this.animating = false;
    renderer.domElement = null;
    renderer = null;
    orbitControls.dispose();
    scene = null;
    camera = null;

    window.removeEventListener('resize', this.onWindowResize);
    this.$refs.three.removeEventListener('mousemove', this.onMouseMove);
    this.$refs.three.removeEventListener('touchmove', this.onTouchMove);
    this.$refs.three.removeEventListener('click', this.onClick);
  },
};
</script>

<style scoped lang="scss">

.root {
    position: fixed;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;

    h1 {
        font-family: 'Lexend Giga';
        position: absolute;
        color: #ffffff;
        font-size: 1em;
        text-align: center;
        width: 100%;
        margin-top: 120px;
        font-weight: 400;
    }

     .buttons-container {
            bottom: 170px;
            right: 35px;
            position: absolute;
            height: 100px;
            width: auto;
            z-index: 5;

            .perspective, .share {
                cursor: pointer;
                width: 150px;

                img {
                    width: 80px;
                }
            }

            .share {
                img {
                    width: 60px;
                    margin-right: 5px;
                    margin-top: 25px;
                    position: fixed;
                    right: 85px;
                    bottom: 170px;
                }
            }
        }

     .share-container {
        position: absolute;
        right: 125px;
        bottom: 185px;
        z-index: 6;

        .share-box {
        height: 65vh;
        }
    }

    .charts-container {
        position: absolute;
        right: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 16px;
        bottom: 25px;

        .outer-wrapper{
            display: inline-block;
        }

        .column-wrapper{
            height: 50vh;
            width: 12px;
            background: #CFD8DC;
            transform: rotate(180deg);
            border: 1px solid transparent;
            margin: 0 auto;
            border-radius: 50px;
            -webkit-box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
            box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
            background-image: linear-gradient(#C4C4C4, #C4C4C4), linear-gradient( #000,#fff);
            background-origin: border-box;
            background-clip: padding-box, border-box;
            .label-image-container {
                position: absolute;
                display: flex;
                height: 100%;
                justify-content: center;
                align-items: center;
                 .label-image {
                    position: absolute;
                    left: 25px;
                    transform: rotate(180deg);
                    margin: 0 auto;
                    justify-content: center;
                    width: 15px;
                }
            }
        }

        .column-one {
            border-radius: 50px;
            width: 12px;
            height: 0%;
            background: #90A4AE;
            transition: height 0.5s linear;
        }

        .column-two {
            width: 12px;
            height: 0%;
            background: #90A4AE;
            transition: height 0.5s linear;
            border-radius: 50px;
        }

        .column-three {
            width: 12px;
            height: 0%;
            background: #90A4AE;
            transition: height 0.5s linear;
            border-radius: 50px;
        }

        .first-percentage, .second-percentage, .third-percentage, .value{
            margin-top: 10px;
            padding: 5px 10px;
            color: #FFF;
            background: #263238;
            position: relative;
            border-radius: 4px;
            text-align: center;
            font-family: 'Lexend Giga';
            font-size: 0.55em;
            font-weight: 400;
            background: none;
            width: 50px;
        }

        .value{
            transform: rotate(-90deg);
            text-align: center;
            font-size: 1em;
            background: none;
            right: 25px;
            height: 20px;
            bottom: 20vh;
        }

        .ui-image {
            align-self: center;
            height: 40%;
            margin-bottom: 20vh;
        }
    }

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
