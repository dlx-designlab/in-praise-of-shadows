<template>
  <div class="container">
    <div class="exit" @click="exit">
      ✕
    </div>
    <div class="videos" :class="{ 'visible': showBackgroundVideo }">
    </div>
    <div
      ref="threeTwo"
      class="second-three-container"
    />
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';

let width = window.innerWidth;
let height = window.innerHeight;
const cubes = [];

let rgbData;
let depthData;
let points;

export default {
  name: 'Scene',
  props: {
    currentPerspective: String,
  },
  data() {
    return {
      animating: false,
      spread: 1000,
      depthSpread: -750,
      pointSize: 10,
      pointDensity: 3,
      showBackgroundVideo: false,
      pause: false,
    };
  },
  async mounted() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 100000);
    this.camera.position.set(0, 0, -2000);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.originalVideo = document.createElement('video');
    this.depthVideo = document.createElement('video');

    if (this.currentPerspective === 'insect') {
      this.originalVideo.setAttribute('src', '/videos/bird-1.mp4');
      this.depthVideo.setAttribute('src', '/videos/bird-2.mp4');
    } else {
      this.originalVideo.setAttribute('src', '/videos/bird-1-2.mp4');
      this.depthVideo.setAttribute('src', '/videos/bird-1-2.mp4');
    }

    const videoContainer = document.querySelector('.videos');
    videoContainer.appendChild(this.originalVideo);
    videoContainer.appendChild(this.depthVideo);
    this.setupRenderer();
    this.setupLights();
    this.bindEvents();
    Promise.all([this.originalVideo, this.depthVideo].map((vid) => new Promise((resolve) => {
      // eslint-disable-next-line no-param-reassign
      vid.onloadeddata = () => {
        resolve();
      };
    }))).then(() => {
      this.originalVideo.muted = true;
      this.depthVideo.muted = true;
      this.originalVideo.autoplay = true;

      this.depthVideo.autoplay = true;

      this.originalVideo.width = this.originalVideo.videoWidth;
      this.originalVideo.height = this.originalVideo.videoHeight;
      this.depthVideo.width = this.depthVideo.videoWidth;
      this.depthVideo.height = this.depthVideo.videoHeight;

      this.originalVideo.loop = true;
      this.depthVideo.loop = true;

      this.originalVideo.play();
      this.depthVideo.play();
      this.depthVideo.style.transform = 'scale(0.5) translateX(-100%) translateY(-100%) scaleX(-1)';
      this.originalVideo.style.transform = 'scale(0.5) translateX(-100%) scaleX(-1)';
      this.animating = true;
      this.animate();
      this.startPointCloudLoop();
    });

    const rgbImg = new Image();
    rgbImg.src = '../assets/images/forest1.png';
    rgbImg.onload = () => {
      const depthImg = new Image();
      depthImg.src = '../assets/images/forest-1-depth.png';
      depthImg.onload = () => {
        rgbData = this.getImageData(rgbImg);
        depthData = this.getImageData(depthImg);
      };
    };
  },
  beforeDestroy() {
    this.destroyScene();
    this.animating = false;
    this.pause = true;
    this.renderer.domElement = null;
    this.renderer = null;
    this.controls.dispose();
    this.scene = null;
    this.camera = null;
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    destroyScene() {
      this.renderer.renderLists.dispose();
      this.renderer.dispose();
      this.scene.traverse((object) => {
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
          // eslint-disable-next-line no-restricted-syntax
          for (const material of object.material) cleanMaterial(material);
        }
      });
    },
    exit() {
      this.$emit('exitVideoGenerator');
    },
    startPointCloudLoop() {
      if (!this.animating) {
        return;
      }
      const self = this;
      setTimeout(() => {
        if (!self.pause) {
          self.updatePointCloud();
        }
        self.startPointCloudLoop();
      }, 0);
    },
    updatePointCloud() {
      this.getVideoData();
      rgbData = this.getImageData(this.originalVideo);
      depthData = this.getImageData(this.depthVideo);

      const skip = this.pointDensity;
      const across = Math.ceil(rgbData.width / skip);
      const down = Math.ceil(rgbData.height / skip);

      const positions = [];
      const cubepositions = [];
      const cubecolours = [];
      const colors = [];
      const { spread } = this;
      const { depthSpread } = this;
      const imageAspect = rgbData.width / rgbData.height;

      for (let y = 0; y < down; ++y) {
        const v = y / (down - 1);
        for (let x = 0; x < across; ++x) {
          const u = x / (across - 1);
          const rgb = this.getPixel(rgbData, u, v);
          const depth = 1 - this.getPixel(depthData, u, v)[0];

          positions.push(
            (u * 2 - 1) * spread * imageAspect,
            (v * -2 + 1) * spread,
            depth * depthSpread,
          );

          cubepositions.push({
            x: (u * 2 - 1) * spread * imageAspect,
            y: (v * -2 + 1) * spread,
            z: depth * depthSpread,
          });
          colors.push(...rgb.slice(0, 3));

          cubecolours.push({ ...rgb.slice(0, 3) });
        }
      }
      this.scene.remove(points);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeBoundingSphere();
      const material = new THREE.PointsMaterial({ size: this.pointSize, vertexColors: THREE.VertexColors });
      points = new THREE.Points(geometry, material);
      this.scene.add(points);
    },
    getVideoData() {
      this.getImageData(this.originalVideo);
      this.getImageData(this.depthVideo);
    },
    getImageData(img) {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    getPixel(imageData, u, v) {
      // eslint-disable-next-line no-bitwise
      const x = u * (imageData.width - 1) | 0;
      // eslint-disable-next-line no-bitwise
      const y = v * (imageData.height - 1) | 0;
      if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
        return [0, 0, 0, 0];
      }
      const offset = (y * imageData.width + x) * 4;
      return Array.from(imageData.data.slice(offset, offset + 4)).map((v) => v / 255);
    },
    animate() {
      const render = () => {
        if (!this.animating) {
          window.cancelAnimationFrame(render);
          cancelAnimationFrame(render);
          return;
        }
        if (points) {
          points.rotation.y += 0.005;
        }
        this.controls.update();
        requestAnimationFrame(render);
        this.renderer.render(this.scene, this.camera);
      };

      if (this.animating) {
        render();
      }
    },
    setupRenderer() {
      this.renderer.setClearColor(0xffffff, 0);
      this.renderer.setSize(width / 2, height / 2);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio));
      this.$refs.threeTwo.appendChild(this.renderer.domElement);
      this.renderer.domElement.style.width = '110%';
      this.renderer.domElement.style.height = '110%';
      this.renderer.domElement.style.margin = '0 auto';
      this.renderer.domElement.style.top = '10vh';
    },
    setupLights() {
      const light = new THREE.AmbientLight(0xffffff, 10); // soft white light
      const pointlight = new THREE.PointLight();
      pointlight.position.set(0, 2.5, 0);
      this.scene.add(light);
      this.scene.add(pointlight);
    },
    bindEvents() {
      window.addEventListener('resize', this.onWindowResize, false);
    },
    onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      this.renderer.setSize(width / 2, height / 2);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.domElement.style.width = '110%';
      this.renderer.domElement.style.height = '110%';
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    position: absolute;

    .exit {
      position: fixed;
      top: 80px;
      left: 30px;
      z-index: 11;
      font-size: 2.5em;
      font-weight: 900;
      color: #ffffff;
      cursor: pointer;
    }

    .videos {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: fill;
      pointer-events: none;
      opacity: 0;
      width: 10%;
      height: 0;

      &.visible {
        opacity: 1;
      }
    }
  }

</style>
