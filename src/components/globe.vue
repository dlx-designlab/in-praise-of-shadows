<template>
  <div class="globe-container">
      <transition name="fade">
        <GlobeTooltip
            :hoveredPoint="hoveredPoint"
            :mouseX="mouseX"
            :mouseY="mouseY"
        />
        </transition>
        <transition name="fade">
            <LibrarySearch
                v-if="showingSearch"
                @goToForestMap="goToForestMap"
            />
        </transition>
         <transition name="slowfade">
            <GlobeLogos
                v-show="subPage === 1"
                @goToForestMap="goToForestMap"
            />
        </transition>
      <div class="three-container" ref="three"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FOREST_DATA from '../data/forests.json';
import GlobeTooltip from './globe-tooltip.vue';
import LibrarySearch from './library-search.vue';
import GlobeLogos from './globe-logos.vue';

let orbitControls;
let scene;
let renderer;
let Globe;
let camera;
const forestPoints = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  transparent: false,
  opacity: 1,
  metalness: 0.1,
  roughness: 0.4,
  refractionRatio: 0.4,
});

const materialTwo = new THREE.MeshStandardMaterial({
  color: 0xFF0000,
  transparent: false,
  opacity: 1,
  metalness: 0.1,
  roughness: 0.4,
  refractionRatio: 0.4,
});

export default {
  name: 'globe',
  components: {
    GlobeTooltip,
    LibrarySearch,
    GlobeLogos,
  },
  props: {
    backgrounded: Boolean,
    showingSearch: Boolean,
    subPage: Number,
  },
  watch: {
    subPage(val) {
      if (val === 0) {
        new TWEEN.Tween(orbitControls.target)
          .to({
            x: 0,
            y: 0,
            z: 0,
          }, 1000)
          .easing(TWEEN.Easing.Quartic.InOut)
          .start();
      } else if (val === 1) {
        // show globe logos n complete
        new TWEEN.Tween(orbitControls.target)
          .to({
            x: 0,
            y: -350,
            z: 0,
          }, 1000)
          .easing(TWEEN.Easing.Quartic.InOut)
          .onComplete(() => {
          })
          .start();
      }
    },
  },
  data() {
    return {
      animating: true,
      hoveredPoint: null,
      hoveredPointSphere: null,
      mouseX: 0,
      mouseY: 0,
      transitioningIn: false,
    };
  },
  mounted() {
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load('/images/earth-globe-2-normal-min.jpeg');

    Globe = new ThreeGlobe({ waitForGlobeReady: false })
      .globeImageUrl('/images/earth-globe-2-min.jpeg')
      .bumpImageUrl(textureFlare0);

    Globe.children[0].children[0].children[0].material.shininess = 15;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(1);
    document.querySelector('.three-container').appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    const material = Globe.globeMaterial();

    material.specularMap = textureFlare0;
    material.specular = new THREE.Color(0xFFFFFF);
    material.shininess = 15;

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 100, 1000);
    camera.updateProjectionMatrix();

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.autoRotate = true;
    orbitControls.enableZoom = false;
    orbitControls.autoRotateSpeed = 1;

    if (window.innerWidth < 600) {
      camera.position.z = 500;
    } else {
      camera.position.z = 400;
    }
    this.animate();
    renderer.setPixelRatio(2);

    this.createPointsAtLocation();
    this.createStars();
    this.bindEvents();
  },
  methods: {
    createStars() {
      const vertices = [];
      for (let i = 0; i < 2500; i += 1) {
        const x = THREE.MathUtils.randFloatSpread(500);
        const y = THREE.MathUtils.randFloatSpread(500);
        const z = THREE.MathUtils.randFloatSpread(500);

        vertices.push(x, y, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const material = new THREE.PointsMaterial({ color: 0xffffff });
      const points = new THREE.Points(geometry, material);

      scene.add(points);
    },
    goToForestVisualisation(forest) {
      this.$emit('goToForestVisualisation', forest);
    },
    createPointsAtLocation() {
      const geometry = new THREE.SphereGeometry(3, 12, 12);
      const sphere = new THREE.Mesh(geometry, sphereMaterial);
      for (let i = 0; i < FOREST_DATA.length; i += 1) {
        const newSphere = sphere.clone();

        const coords = Globe.getCoords(
          FOREST_DATA[i].lat,
          FOREST_DATA[i].lon,
          0.0,
        );
        if (this.$i18n.locale === 'en') {
          newSphere.name = FOREST_DATA[i].name;
        } else {
          newSphere.name = FOREST_DATA[i].jp_name;
        }

        newSphere.position.set(coords.x, coords.y, coords.z);
        scene.add(newSphere);
        forestPoints.push(newSphere);
      }

      new TWEEN.Tween(sphere.material)
        .to({
          opacity: 0.6,
        }, 3000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onComplete(() => {
        })
        .start();
    },
    makeSphereRed(sphere) {
      // eslint-disable-next-line no-param-reassign
      sphere.material = materialTwo;
    },
    makeSphereWhite(sphere) {
      // eslint-disable-next-line no-param-reassign
      sphere.material = sphereMaterial;
    },
    raycast() {
      raycaster.setFromCamera(mouse, camera);
      const intersection = raycaster.intersectObjects(forestPoints, false);
      if (intersection.length > 0) {
        this.hoveredPointSphere = intersection[0].object;
        this.hoveredPoint = intersection[0].object.name;
        orbitControls.autoRotate = false;
        document.body.style.cursor = 'pointer';
        this.makeSphereRed(this.hoveredPointSphere);
      } else {
        if (this.hoveredPointSphere) {
          forestPoints.forEach((point) => {
            this.makeSphereWhite(point);
          });
        }
        this.hoveredPointSphere = null;
        this.hoveredPoint = null;
        document.body.style.cursor = 'grab';
        orbitControls.autoRotate = true;
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
    bindEvents() {
      this.$refs.three.addEventListener('mousemove', this.onMouseMove);
      this.$refs.three.addEventListener('touchmove', this.onTouchMove);
      this.$refs.three.addEventListener('click', this.onClick);
    },
    goToForestMap(selectedPoint) {
      this.$emit('goToForestMap', selectedPoint);
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        // eslint-disable-next-line no-param-reassign
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    startGridTransition() {
    },
    onClick() {
      if (this.hoveredPoint) {
        // TRANSITION HERE
        // HERE DO THE TRANSITION THINGS
        // this.startGridTransition();
        const selectedPoint = this.hoveredPoint;
        this.$emit('startGridTransition', selectedPoint);

        // const selectedPoint = this.hoveredPoint;
        const destination = this.hoveredPointSphere.position.clone();
        const reducedDestination = destination.multiplyScalar(3.001);
        new TWEEN.Tween(camera.position)
          .to({
            x: reducedDestination.x,
            y: reducedDestination.y,
            z: reducedDestination.z,
          }, 2000)
          .easing(TWEEN.Easing.Quartic.InOut)
          .onComplete(() => {
          })
          .start();
      }
    },
    onTouchMove(e) {
      this.mouseX = e.changedTouches[0].pageX;
      this.mouseY = e.changedTouches[0].pageY;
    },
    destroyScene() {
      renderer.renderLists.dispose();
      renderer.dispose();
      Globe = null;
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
          // cleanMaterial(object.material)
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
          requestAnimationFrame(this.animate);
          orbitControls.update();
          renderer.render(scene, camera);
          TWEEN.update();
          this.updateMousePosition();
        }
      };
      render();
    },
  },
  beforeDestroy() {
    this.animating = false;
    this.destroyScene();
    // renderer.context = null
    renderer.domElement = null;
    orbitControls.dispose();
    renderer = null;
    // controls = null;
    scene = null;
    camera = null;
    window.removeEventListener('resize', this.onWindowResize);
    this.$refs.three.removeEventListener('mousemove', this.onMouseMove);
    this.$refs.three.removeEventListener('touchmove', this.onTouchMove);
    this.$refs.three.removeEventListener('click', this.onClick);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .globe-container {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: row;
        justify-content: center;

        .grid-transition {
            align-self: center;
            align-items: center;
            justify-content: center;
            position: absolute;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(6, 1fr);
            grid-gap: 5px;
            width: 40vw;
            margin: 0 auto;
            text-align: center;

            .grid-image {
                visibility: hidden;
                width: 100%;
                height: 100%;
            }
        }
    }

</style>
