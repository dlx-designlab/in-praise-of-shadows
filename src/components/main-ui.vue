<template>
  <div :class="['main-ui-container', {'is-fixed': page === 'discover' }]">
        <div class="top-buttons-container">
            <button
                :class="['top-button', { 'selected': page === 'explore' || page === 'forestBath' }]"
                @click="goToExplore"
            >
                <span>{{ $t('nav-bar.explore') }}</span>
            </button>
            <button
                :class="
                    ['top-button',
                        { 'selected': page === 'search'
                            || page === 'forestVisualisation'
                            || page === 'forestMap'
                        }
                ]"
                @click="goToSearch"
            >
                <span>{{ $t('nav-bar.search') }}</span>
            </button>
            <button
                :class="['top-button', { 'selected': page === 'discover' }]"
                @click="goToDiscover"
            >
               <span>{{ $t('nav-bar.discover') }}</span>
            </button>
        </div>
        <div class="my-forest-btn-container">
            <button
                :class="['my-forest-btn']"
                @click="goToMyForest"
            >
                <img class="my-forest-icon" src="/images/ui/my-forest-icon.png" />
            </button>
        </div>
        <transition name="fade">
            <div class="info-box" v-if="showingInfoBox">
                <h1 v-html="$t(getInfoHeader)"></h1>
                <p class="info-text" v-html="$t(getInfoText)"></p>
                <p
                    class="language-select"
                >
                    <span class="language">
                        {{ $t('language') }}:
                    </span>
                    <span class="language-choices">
                        <span
                            @click="toggleLang"
                            :class="[{ 'selected-lang': $i18n.locale === 'en' }]">
                            EN
                        </span> /
                        <span
                            @click="toggleLang"
                            :class="[{ 'selected-lang': $i18n.locale === 'jp' }]">
                            JP
                        </span>
                    </span>
                </p>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="showingInfoIcon" class="info-icon-container">
                <img
                    src="/images/info-icon-inverted.png"
                    class="info-icon inverted"
                    @click="showInfoBox"
                />
            </div>
        </transition>
        <transition name="fade">
            <div v-if="showingGlobeIcon" class="info-icon-container">
                <img
                    :src="getGlobeToShow"
                    class="globe-icon"
                />
            </div>
        </transition>
        <transition name="fade">
            <div class="side-menu-container">
                <div class="side-menu" v-if="showingSideMenu">
                    <div
                        :class="['side-button one', {'selected': subPage === 0}]"
                        @click="sideButtonOneHandler"
                    />
                    <div
                        :class="['side-button two', {'selected': subPage === 1}]"
                        @click="sideButtonTwoHandler"
                    />
                    <div v-if="showingSideButtonThree"
                        :class="['side-button three', {'selected': subPage === 2}]"
                        @click="sideButtonThreeHandler"
                    />
                </div>
            </div>
        </transition>
  </div>
</template>

<script>
const brands = ['Netflix', 'Lyft', 'Ecosia', 'Airfrance', 'Toyoshima', 'Nike', 'Nestle', 'Timberland', 'Adidas'];

export default {
  name: 'ui',
  props: {
    page: String,
    subPage: Number,
    selectedForest: String,
    isLoading: Boolean,
    isInPerspectiveMode: Boolean,
  },
  mounted() {
    window.addEventListener('wheel', (e) => {
      const delta = Math.sign(e.deltaY);
      if (this.page !== 'explore') {
        return;
      }
      if (delta === -1) {
        if (this.subPage === 1) {
          this.sideButtonOneHandler();
        } else if (this.subPage === 2) {
          this.sideButtonTwoHandler();
        }
      }

      if (delta === 1) {
        if (this.subPage === 0) {
          this.sideButtonTwoHandler();
        } else if (this.subPage === 1 && this.showingSideButtonThree) {
          this.sideButtonThreeHandler();
        }
      }
    });
  },
  computed: {
    showingSideMenu() {
      return !this.isLoading && (this.page === 'explore' || this.page === 'search');
    },
    isBrandedForest() {
      if (brands.includes(this.selectedForest)) {
        return true;
      }
      return false;
    },
    getGlobeToShow() {
      if (this.selectedForest === 'Valdivian') {
        return '/images/ui/globes/5.png';
      } if (this.selectedForest === 'Maya Biosphere Reserve') {
        return '/images/ui/globes/7.png';
      } if (this.selectedForest === 'Yamanashi') {
        return '/images/ui/globes/3.png';
      } if (this.selectedForest === 'Yakushima') {
        return '/images/ui/globes/1.png';
      } if (this.selectedForest === 'Kinabalu National Park') {
        return '/images/ui/corner-globe.png';
      } if (this.selectedForest === 'Akasawa Natural Recreational Forest') {
        return '/images/ui/globes/3.png';
      } if (this.selectedForest === 'Epping Forest') {
        return '/images/ui/globes/6.png';
      } if (this.selectedForest === 'Aya Biosphere Reserve') {
        return '/images/ui/globes/1.png';
      }
      return '/images/ui/corner-globe.png';
    },
    showingSideButtonThree() {
      return this.page === 'myForest'
        || this.page === 'forestVisualisation'
        || this.page === 'forestMap'
        || this.page === 'forestVisualisationVR'
        || this.page === 'myForestVisualisationVR'
        || this.page === 'myForestMap';
    },
    getInfoText() {
      if (this.page === 'explore') {
        return 'about-the-project';
      } if (this.page === 'forestBath') {
        return 'Shinrin-yoku (森林浴) is the Japanese practice of forest bathing as a modern form of healing.<br><br>Select different soundscapes and characters to immerse in a digital shinrin-yoku.';
      } if (this.page === 'forestVisualisation' && this.selectedForest === 'Yakushima') {
        return 'forest-fact-one';
      } if (this.page === 'forestVisualisation' && this.selectedForest === 'Netflix') {
        return 'forest-fact-three';
      } if (this.page === 'forestVisualisation' && this.isBrandedForest) {
        return `You are currently viewing ${this.selectedForest}'s forest, home to over 10 species of tree.`;
      }
      return `You are currently in ${this.selectedForest}, home to over 14 species of tree and 1000 species of bird.`;
    },
    getInfoHeader() {
      if (this.page === 'explore') {
        return 'about';
      } if (this.page === 'forestBath') {
        return 'Shinrin-yoku (森林浴) is the Japanese practice of forest bathing as a modern form of healing.<br><br>Select different soundscapes and characters to immerse in a digital shinrin-yoku.';
      } if (this.page === 'forestVisualisation') {
        return '';
      }
      return 'placeholder';
    },
    showingInfoIcon() {
      console.log(this.selectedForest);
      if (
        // eslint-disable-next-line no-mixed-operators
        !this.isLoading && this.page === 'explore' || this.page === 'globe'
      ) {
        return true;
      }
      return false;
    },
    showingGlobeIcon() {
      return this.page === 'forestVisualisation' || this.page === 'forestMap';
    },
  },
  data() {
    return {
      showingInfoBox: false,
    };
  },
  methods: {
    toggleLang() {
      if (this.$i18n.locale === 'en') {
        this.$i18n.locale = 'jp';
      } else {
        this.$i18n.locale = 'en';
      }
      this.showingInfoBox = false;
    },
    showInfoBox() {
      this.showingInfoBox = !this.showingInfoBox;
    },
    goToExplore() {
      this.$emit('goToExplore');
    },
    goToSearch() {
      this.$emit('goToSearch');
    },
    goToDiscover() {
      this.$emit('goToDiscover');
    },
    goToMyForest() {
      this.$emit('toggleMyForestLogin');
    },
    sideButtonOneHandler() {
      this.$emit('setSubPage', 0);
    },
    sideButtonTwoHandler() {
      this.$emit('setSubPage', 1);
    },
    sideButtonThreeHandler() {
      this.$emit('setSubPage', 2);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .main-ui-container {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        color: #FFFFFF;
        font-family: 'Lexend Giga', sans-serif;
        justify-content: center;
        display: flex;
        overflow: hidden;

        &.is-fixed {
            position: fixed !important;
            z-index: 3;
        }

        .info-box {
            bottom: 120px;
            left: 200px;
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
            cursor: default !important;

            .language-select {
                color: #000000;
                cursor: pointer;
                .language {
                    font-family: 'CodeInk';
                    padding-right: 15px;
                }
                .language-choices {
                    cursor: pointer;
                     .selected-lang {
                        color: #00FF00;
                    }
                }
            }

            h1 {
                padding-top: 10px;
                font-family: 'CodeInk';
                font-weight: 900;
                font-size: 1.1em;
                color: #000000;
                text-align: center;
            }

            .info-text {
                font-family: 'Lexend Deca', sans-serif;
                color: #000000;
                text-align: left;
                padding: 15px;
                font-size: 0.9em;
                text-align: center;
            }
        }

        .info-icon-container {
            z-index: 6;
            position: absolute;
            bottom: 25px;
            left: 25px;
            margin: 10px 25px;
            color: #FFFFFF;
            text-transform: lowercase;

            .globe-icon {
                width: 120px;
                padding: 10px;
            }

            .info-icon {
                width: 200px;
                cursor: pointer;
            }
        }

        .my-forest-btn-container {
            z-index: 8 !important;
            position: fixed;
            right: 85px;
            bottom: 45px;
            margin-right: -6px;

            .my-forest-btn {
                outline: none;
                height: 100px;
                background: none;
                // color: #FFFFFF;
                // border: 1px solid #76EE00;
                cursor: pointer;
                text-transform: uppercase;
                font-size: 1.2em;
                font-weight: 100;
                outline: none;
                border: none;

                .my-forest-icon {
                    top: 0;
                    width: 70px;
                }

                &:hover {
                    // background-color: #76EE00;
                }
            }
        }

        .side-menu-container {
            position: absolute;
            left: 5px;
            z-index: 4;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100%;

            .side-menu {
                display: flex;
                flex-direction: column;
                margin: 15px;
                margin-left: 80px;
                align-self: center;
                justify-content: center;

                .side-button {
                    width: 25px;
                    height: 25px;
                    border: 3px solid transparent;
                    border-radius: 50%;
                    margin: 10px;
                    cursor: pointer;
                    background-color: white;
                    background-image: linear-gradient(white, white), linear-gradient( #fff,#000);
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                }
            }
        }

        .top-buttons-container {
            z-index: 5 !important;
            position: absolute;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: 25px;
            display: flex;
            top: 15px;
            width: 100%;
            text-align: center;
            align-items: center;
            justify-content: center;

            .top-button {
                font-family: 'CodeInk';
                font-weight: 900;
                text-transform: lowercase;
                font-size: 1.1em;
                outline: none;
                border-radius: 150px;
                height: 40px;
                width: 28%;
                max-width: 450px;
                background-color: #FFFFFF;
                color: #000000;
                border: 2px solid transparent;
                margin-left: -10px;
                cursor: pointer;
                // font-family: 'Lexend Giga', sans-serif;
                text-transform: uppercase;
                -webkit-box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
                box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
                background-image: linear-gradient(white, white), linear-gradient( #fff,#000);
                background-origin: border-box;
                background-clip: padding-box, border-box;

                span {
                     background: -webkit-linear-gradient(-90deg, #FFF, #000);
                    -webkit-background-clip: text;
                    -webkit-text-stroke: 2px transparent;
                }

                &:hover {
                    background-color: #B7FF00;
                }
            }
        }
         .selected {
            color: #000000 !important;
            background-color: #00FF00;
            background-image:
                linear-gradient(#00FF00, #00FF00),
                linear-gradient( #fff,#000) !important;
            z-index: 5 !important;
            position: relative;
            background-clip: none;
            background-origin: none;

            &.my-forest-btn {
                border: 2px solid #000000 !important;
            }
        }
    }
</style>
