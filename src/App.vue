<template>
  <div id="app">
    <transition name="slowfade">
      <div class="loader-container" v-if="isLoading">
        <LoadingSpinner
          :loadingMessage="loadingMessage"
         />
      </div>
    </transition>
    <MainUI
      v-if="page !== 'mobileVR'"
      :page="page"
      :subPage="subPage"
      :selectedForest="selectedForest"
      :isLoading="isLoading"
      :isInPerspectiveMode="isInPerspectiveMode"
      @toggleMyForestLogin="toggleMyForestLogin"
      @goToSearch="goToSearch"
      @goToExplore="goToExplore"
      @goToDiscover="goToDiscover"
      @setSubPage="setSubPage"
    />

    <div v-if="this.page === 'mobileVR'">
      <MobileVR
        @hideLoader='hideLoader'
        @showLoader='showLoader'
      />
    </div>

    <transition name="fade">
        <MyForestLogin
          v-if="showingMyForestLogin"
          @goToMyForest="goToMyForest"
        />
    </transition>

    <transition name="slowfade">
      <GridTransition
        v-if="transitioningIntoMap"
        @finishGridTransition="finishGridTransition"
      />
    </transition>

    <transition name="fade">
      <div v-if="page === 'forestVisualisationVR'">
        <ForestVisualisationVRScreen
          :subPage="subPage"
          :selectedForest="selectedForest"
          @goToForestMap="goToForestMap"
          @goToForestVisualisation="goToForestVisualisation"
        />
      </div>
    </transition>

    <transition name="fade">
      <div v-if="page === 'myForest' ">
        <MyForest
          @hideLoader='hideLoader'
          @showLoader='showLoader'
          :showingMyForestStats="showingMyForestStats"
          :subPage="subPage"
          @goToMyForestVisualisationVR="goToMyForestVisualisationVR"
          @goToMyForestMap="goToMyForestMap"
          :isLoading="isLoading"
        />
      </div>
    </transition>

    <transition name="fade">
      <div v-if="page==='myForestVisualisationVR'">
        <MyForestVisualisationVRScreen
          :subPage="subPage"
          @hideLoader='hideLoader'
          @showLoader='showLoader'
          :showingMyForestStats="showingMyForestStats"
          @goToMyForest="goToMyForest"
          @goToMyForestMap="goToMyForestMap"
        />
      </div>
    </transition>

    <transition name="fade">
      <div v-if="page==='myForestMap'">
        <MyForestMap
          :subPage="subPage"
          @goToMyForestVisualisationVR="goToMyForestVisualisationVR"
          @goToMyForest="goToMyForest"
          @hideLoader='hideLoader'
          :showingMyForestStats="showingMyForestStats"
          @showLoader='showLoader'
        />
      </div>
    </transition>

    <transition name="slowfade">
      <div v-if="page==='explore' || page === 'search' || page === 'discover'">
        <Globe
          :showingSearch="page==='search'"
          :subPage="subPage"
          @selectForestOnGlobe="selectForestOnGlobe"
          @goToForestMap="goToForestMap"
          @startGridTransition="startGridTransition"
        />
      </div>
    </transition>
    <transition name="fade">
      <div v-if="page==='forestVisualisation'">
        <ForestVisualisation
          :selectedForest="selectedForest"
          :subPage="subPage"
          :loadLocationTwo="loadLocationTwo"
          @goToForestMap="goToForestMap"
          @goToForestVisualisationVR="goToForestVisualisationVR"
          @hideLoader='hideLoader'
          @showLoader='showLoader'
          @setToPerspectiveMode="setToPerspectiveMode"
        />
      </div>
    </transition>
    <transition name="slowfade">
      <div v-if="page==='forestMap'">
        <ForestMap
          :selectedForest="selectedForest"
          :subPage="subPage"
          @closeForestMap="closeForestMap"
          @goToForestVisualisationVR="goToForestVisualisationVR"
          @hideLoader='hideLoader'
          @showLoader='showLoader'
          @hideGridTransition="hideGridTransition"
          :isLoading='isLoading'
        />
      </div>
    </transition>
    <transition name="fade">
      <div v-if="page==='forestBath'">
        <ForestBath
          :selectedForestBath="selectedForestBath"
          :selectedForestBathView="selectedForestBathView"
          @toggleMyForest="toggleMyForest"
          @hideLoader='hideLoader'
          @showLoader='showLoader'
          @goToForestBathBird="goToForestBathBird"
        />
      </div>
    </transition>
     <transition name="fade">
      <div v-if="page==='forestBathBird'">
        <ForestBathBird
          :selectedForestBath="selectedForestBath"
          @toggleMyForest="toggleMyForest"
          @hideLoader='hideLoader'
          @showLoader='showLoader'
          @goToForestBath="goToForestBath"
        />
      </div>
    </transition>
    <transition name="fade">
      <div v-if="page==='discover'">
        <Discover />
      </div>
    </transition>
  </div>
</template>

<script>
import Globe from './components/globe.vue';
import MainUI from './components/main-ui.vue';
import ForestBath from './components/forest-bath.vue';
import ForestBathBird from './components/forest-bath-bird.vue';
import GridTransition from './components/grid-transition.vue';
import ForestMap from './components/forest-map.vue';
import Discover from './components/discover.vue';
import MyForestLogin from './components/my-forest-login.vue';
import MyForestMap from './components/my-forest-map.vue';
import LoadingSpinner from './components/loading-spinner.vue';
import ForestVisualisationVRScreen from './components/forest-visualisation-vr-screen.vue';
import MyForestVisualisationVRScreen from './components/my-forest-visualisation-vr-screen.vue';
import MyForest from './components/my-forest.vue';
import ForestVisualisation from './components/forest-visualisation.vue';
import MobileVR from './components/mobile-vr.vue';

export default {
  name: 'App',
  components: {
    Globe,
    MainUI,
    MyForest,
    ForestBath,
    ForestBathBird,
    GridTransition,
    Discover,
    ForestVisualisation,
    ForestMap,
    LoadingSpinner,
    MyForestLogin,
    ForestVisualisationVRScreen,
    MobileVR,
    MyForestMap,
    MyForestVisualisationVRScreen,
  },
  data() {
    return {
      page: 'explore',
      loadLocationTwo: false,
      subPage: 0,
      showingMyLogin: false,
      selectedForestBath: null,
      selectedForestBathView: 'squirrel',
      selectedForest: null,
      isLoading: false,
      loadingMessage: 'Loading',
      showingMyForestLogin: false,
      showingMyForestStats: false,
      isInPerspectiveMode: false,
      transitioningIntoMap: false,
    };
  },
  beforeMount() {
    // eslint-disable-next-line no-restricted-globals
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('mobileVR')) {
      this.page = 'mobileVR';
    }
  },
  methods: {
    setToPerspectiveMode() {
      this.isInPerspectiveMode = true;
    },
    setSubPage(subPage) {
      this.subPage = subPage;
    },
    toggleMyForestLogin() {
      if (this.page === 'myForest'
        || this.page === 'myForestMap'
        || this.page === 'myForestVisualisationVR') {
        this.showingMyForestStats = !this.showingMyForestStats;
      } else {
        this.showingMyForestLogin = !this.showingMyForestLogin;
      }
    },
    selectForestOnGlobe(forest) {
      this.selectedForestBath = forest;
      this.goToForestBath();
    },
    goToMyForest() {
      this.isLoading = true;
      this.showingMyForestLogin = false;
      this.page = 'myForest';
      this.subPage = 1;
    },
    goToForestBathBird() {
      this.page = 'forestBathBird';
    },
    goToForestBath(view = 'squirrel') {
      this.selectedForestBathView = view;
      this.page = 'forestBath';
    },
    goToSearch() {
      this.subPage = 0;
      this.page = 'search';
    },
    startGridTransition(forest) {
      this.selectedForest = forest;
      this.transitioningIntoMap = true;
    },
    hideGridTransition() {
      setTimeout(() => {
        this.transitioningIntoMap = false;
      }, 1000);
    },
    finishGridTransition() {
      this.goToForestMap();
    },
    goToForestVisualisation(forest) {
      this.isLoading = true;
      this.subPage = 1;
      if (forest) {
        this.selectedForest = forest;
      }
      this.page = 'forestVisualisation';
    },
    goToDiscover() {
      this.subPage = 0;
      this.page = 'discover';
    },
    goToExplore() {
      this.page = 'explore';
    },
    goToForestMap(forest) {
      if (forest) {
        this.selectedForest = forest;
      }
      // this.isLoading = true;
      this.subPage = 2;
      this.page = 'forestMap';
    },
    closeForestMap(bool = false) {
      if (bool === true) {
        this.loadLocationTwo = true;
      } else {
        this.loadLocationTwo = false;
      }
      this.subPage = 1;
      this.page = 'forestVisualisation';
    },
    goToForestVisualisationVR() {
      this.subPage = 0;
      this.page = 'forestVisualisationVR';
    },
    goToMyForestVisualisationVR() {
      this.subPage = 0;
      this.page = 'myForestVisualisationVR';
    },
    goToMyForestMap() {
      this.subPage = 2;
      this.page = 'myForestMap';
    },
    showLoader(message) {
      this.isLoading = true;
      if (message) {
        this.loadingMessage = message;
      }
    },
    hideLoader() {
      this.isLoading = false;
      this.loadingMessage = 'Loading';
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lexend+Giga&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap');
@font-face {
  font-family: 'CodeInk';
  src: url('./assets/fonts/CODEINK-Regular.ttf');
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(100%, 0);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slowfade-enter-active, .slowfade-leave-active {
  transition: opacity 1.5s;
}
.slowfade-enter, .slowfade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #000000;
    width: 100%;
    height: 100%;
    position: absolute;
    margin: 0;
    padding: 0;
    top: 0; left: 0;

    .loader-container {
      position: absolute;
      width: 100%;
      z-index: 5;
      height: 100%;
    }

    .my-forest-component-container {
      z-index: 5;
      position: absolute;
      width: 100%;
      -webkit-box-shadow: -7px 0px 8px -7px #000000;
      box-shadow: -7px 0px 8px -7px #000000;
    }

    button:focus {outline:0;}
    button { cursor: pointer; }

  }
</style>
