<template>
  <div class="forest-visualisation-ui-container">
        <transition name="fade">
            <div
                v-if="isShowingQRCodePopout"
                class="share-container"
            >
            <img src="/images/ui/share.png" class="share-box" />
            </div>
        </transition>
        <transition name="fade">
            <div
                v-if="isShowingVRCodePopout"
                class="vr-code-container"
            >
                <div class="vr-code">
                    <vue-qrcode :width=200 :value="qrValue" />
                    <p>{{$t('forest-view.vr-scan')}}</p>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div
                class="perspective-popout-container"
                v-if="isShowingPerspectivePopout"
            >
                <div class="perspective-popout">
                    <div class="left">
                        <p>{{ $t("forest-view.tour-forest")}}</p>
                        <div class="images">
                            <img
                                @click="goToInsectPerspective()"
                                src="/images/ui/insect.png" class="icon-img"
                            />
                            <img
                                @click="goToBirdPerspective()"
                                src="/images/ui/bird.png" class="icon-img"
                            />
                        </div>

                    </div>
                    <div class="right">
                        <p>{{ $t('forest-view.forest-bath')}}</p>
                        <div class="image">
                            <img
                                @click="goToForestBath()"
                                src="/images/ui/forest.png" class="icon-img"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <div class="buttons-container">
            <div class="vr">
                <img
                    src="/images/ui/vr-icon.png"
                    @click="openVR()"
                />
            </div>
            <div class="perspective">
                <img
                    src="/images/ui/perspective-icon.png"
                    @click="openPerspective()"
                />
            </div>
             <div class="share">
                <img
                    src="/images/ui/share-icon.png"
                    @click="openShare()"
                />
            </div>
        </div>

        <div class="logo-container" v-if="isBrandedForest">
            <img :src="getLogoSrc()" class="brand-logo" />
        </div>

  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode';

const brands = ['Netflix', 'Lyft', 'Ecosia', 'Airfrance', 'Toyoshima', 'Nike', 'Nestle', 'Timberland', 'Adidas'];

export default {
  name: 'forest-visualisation-ui',
  props: {
    selectedForest: String,
    isLoading: Boolean,
  },
  components: {
    VueQrcode,
  },
  computed: {
    isBrandedForest() {
      if (brands.includes(this.selectedForest)) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      showForestHealth: false,
      isShowingQRCodePopout: false,
      isShowingVRCodePopout: false,
      isShowingPerspectivePopout: false,
      qrValue: `${window.location.href}?mobileVR`,
    };
  },
  methods: {
    openVR() {
      this.isShowingPerspectivePopout = false;
      this.isShowingQRCodePopout = false;
      this.isShowingVRCodePopout = !this.isShowingVRCodePopout;
    },
    goToBirdPerspective() {
      this.isShowingPerspectivePopout = false;
      this.$emit('goToBirdPerspective');
    },
    goToInsectPerspective() {
      this.isShowingPerspectivePopout = false;
      this.$emit('goToInsectPerspective');
    },
    goToForestBath() {
      this.isShowingPerspectivePopout = false;
      this.$emit('goToForestBath');
    },
    openPerspective() {
      this.$emit('exitVideoGenerator');
      this.isShowingVRCodePopout = false;
      this.isShowingQRCodePopout = false;
      this.isShowingPerspectivePopout = !this.isShowingPerspectivePopout;
    },
    openShare() {
      this.isShowingVRCodePopout = false;
      this.isShowingPerspectivePopout = false;
      this.isShowingQRCodePopout = !this.isShowingQRCodePopout;
    },
    getLogoSrc() {
      return `./images/brand-logos/${this.selectedForest}.png`;
    },
    toggleForestHealthModal() {
      this.showForestHealth = !this.showForestHealth;
    },
    goToForestMap() {
      this.showForestHealth = false;
      this.$emit('goToForestMap');
    },
  },
};
</script>

<style scoped lang="scss">
    .forest-visualisation-ui-container {
        position: absolute;
        bottom: 0; right: 0;
        color: #FFFFFF;
        z-index: 5;
        text-align: right;
        margin: 25px 0;

        .share-container {
            position: absolute;
            right: 125px;
            bottom: 185px;
            z-index: 6;

            .share-box {
            height: 65vh;
            }
        }

        .vr-code-container  {
            position: absolute;
            height: auto;
            width: 260px;
            background-color: #FFFFFF;
            position: fixed;
            z-index: 4;
            -webkit-box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
            box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
            text-align: center;
            border-radius: 50px 50px 0px 50px;
            padding: 15px;
            top: 25px;
            right: 155px;

            .vr-code {
                font-family: 'Lexend Deca', sans-serif;
                color: #000000;
                text-align: left;
                padding: 15px;
                font-size: 0.9em;
                text-align: center;
            }
        }

        .qr-code-popout-container {
            position: absolute;
            width: 400px;
            max-width: 50vw;
            height: 400px;
            max-height: 55vh;
            right: 65px;
            bottom: 150px;
            z-index: 3;
        }

        .perspective-popout-container {
            position: absolute;
            width: 500px;
            max-width: 80vw;
            height: 150px;
            max-height: 25vh;
            right: 130px;
            bottom: 280px;
            z-index: 3;
            background-color: #FFFFFF;
            border-radius: 50px 50px 0px 50px;
            -webkit-box-shadow: -1px 10px 7px -3px rgba(0,0,0,0.74);
            box-shadow: -1px 10px 7px -3px rgba(0,0,0,0.74);
            font-family: 'Lexend Giga';
            font-size: 0.9em;

            .perspective-popout {
                color: #000000;
                display: flex;
                flex-direction: row;
                width: 100%;

                .left {
                    display: flex;
                    flex-direction: column;
                    width: 50%;
                    padding: 15px;
                    box-sizing: border-box;

                    p {
                        text-align: center;
                    }

                    .images {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;

                        .icon-img {
                            width: 50px;
                        }
                    }
                }

                .right {
                    display: flex;
                    flex-direction: column;
                    width: 50%;
                    box-sizing: border-box;

                    .image {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;

                        .icon-img {
                            width: 80px;
                        }
                    }

                    p {
                        text-align: center;
                    }

                }
            }
        }

        .buttons-container {
            position: relative;
            display: flex;
            flex-direction: column;
            bottom: 140px;
            right: 89px;

            .vr {
                cursor: pointer;
                position: relative;

                img {
                    width: 60px;
                }
            }

            .perspective {
                cursor: pointer;
                position: relative;
                padding: 35px 0;

                img {
                    width: 60px;
                }
            }

            .share {
                cursor: pointer;
                position: relative;

                img {
                    width: 60px;
                }
            }
        }

        .logo-container {
            position: absolute;
            right: 190px;
            bottom: 0;
            margin-bottom: 0px;
            img {
                max-width: 150px;
            }
        }

        .forest-health-button {
            background-color: grey;
            border: none;
            padding: 15px;
            text-transform: uppercase;
            color: #FFFFFF;
            margin-bottom: 25px;
            cursor: pointer;
            opacity: 0.65;
        }

        .rounded-button{
            text-transform: uppercase;
            outline: none;
            border-radius: 100px;
            height: 35px;
            width: 60px;
            background: none;
            color: #FFFFFF;
            border: 1px solid #FFFFFF;
            font-weight: 900;
            font-size: 1em;

            &.map-button {
                margin-right: 25px;
            }
        }
    }
</style>
