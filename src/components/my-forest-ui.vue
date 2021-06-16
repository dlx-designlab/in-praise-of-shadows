<template>
  <div class="my-forest-ui-container">
    <transition name="fade">
            <div
                v-if="showingVr"
                class="vr-code-container"
            >
                <div class="vr-code">
                    <vue-qrcode width="200" :value="qrValue" />
                    <p>{{ $t('forest-view.vr-scan') }}</p>
                </div>
            </div>
        </transition>
      <div class="bottom-icons-container">
        <div class="challenge-icon-container">
          <img
            v-if="$i18n.locale === 'en'"
            src="/images/ui/challenge-icon.png"
            @click="toggleChallenge"
          />
          <img
            v-else
            src="/images/ui/challenge-icon-jp.png"
            @click="toggleChallenge"
          />
        </div>
      </div>
      <div class="buttons-container">
            <div class="vr">
                <img
                    src="/images/ui/vr-icon.png"
                    @click="toggleVR"
                />
            </div>
             <div class="share">
                <img
                    src="/images/ui/share-icon.png"
                    @click="toggleShare"
                />
            </div>
        </div>

      <div class="co2-level-container">
          <input class="co2-input" name="co2"
              min="0" max="60" value="30" step="1"
              type="range"
              v-model="treeCount"
            >
            <meter
              class="meter"
              min="0" max="60"
              :value="treeCount"
            ></meter>
            <h2>{{ $t('my-forest.my-carbon-footprint') }}</h2>
            <p class="counter">
              {{ treeCount }} kg
            </p>
        <label for="range"></label>
      </div>

      <transition name="fade">
        <div
          v-if="showingShare"
          class="share-container"
        >
          <img src="/images/ui/share.png" class="share-box" />
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showingChallenge" class="challenge-container">
          <div class="challenge-box">

            <div class="padder"></div>
            <img
              v-if="$i18n.locale === 'en'"
              src="/images/ui/challenge-ui-title.png"
              class="challenge-header"
            />
            <img v-else src="/images/ui/challenge-ui-title-jp.png" class="challenge-header" />
            <div class="challenge-info-container">
                <img src="/images/ui/challenges-icon.png" class="statistics-ui" />
              </div>
              <div class="challenges-container">
                <img
                  v-if="$i18n.locale === 'en'"
                  src="/images/ui/challenge-top-ui.png"
                  @click="toggleScore" class="challenge"
                />
                <img v-else
                  src="/images/ui/challenge-top-ui-jp.png"
                  @click="toggleScore"
                  class="challenge"
                />

                <img
                  v-if="$i18n.locale === 'en'"
                  src="/images/ui/challenge-bottom-ui.png"
                  @click="toggleScore"
                  class="challenge"
                />
                <img
                  v-else src="/images/ui/challenge-bottom-ui-jp.png"
                  @click="toggleScore"
                  class="challenge"
                />

              </div>
              <img src="/images/ui/challenge-bottom-arrow.png" class="challenge-bottom-arrow" />
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div
          v-if="showingScore"
          class="score-container"
          @click="toggleScore"
        >
          <div class="score-box">
            <div class="padder"></div>
            <img
              v-if="$i18n.locale === 'en'"
              src="/images/ui/score-ui-title.png"
              class="score-header"
            />
            <img
              v-else
              src="/images/ui/score-ui-title-jp.png"
              class="score-header"
            />
            <div class="score-info-container">
              <div class="statistics-container">
                <img
                  v-if="$i18n.locale === 'en'"
                  src="/images/ui/statistics.png"
                  class="statistics-ui"
                />
                <img v-else src="/images/ui/statistics-jp.png" class="statistics-ui" />
              </div>
              <div class="right-side-container">
                <div class="rewards-container">
                  <h3>{{ $t('my-forest.rewards')}}</h3>
                  <div class="icons-container">
                    <img src="/images/ui/medal-icon.png" class="medal" />

                    <img
                      v-if="$i18n.locale === 'en'"
                      @click="startRain"
                      rc="/images/ui/rain-icon.png"
                      class="rewards rain"
                    />
                    <img v-else
                      @click="startRain"
                      src="/images/ui/rain-icon-jp.png"
                      class="rewards rain"
                    />

                    <img
                      v-if="$i18n.locale === 'en'"
                      src="/images/ui/nutrients-icon.png"
                      class="rewards"
                    />
                    <img v-else src="/images/ui/nutrients-icon-jp.png" class="rewards" />

                    <img
                      v-if="$i18n.locale === 'en'"
                      src="/images/ui/sun-icon.png"
                      class="rewards"
                    />
                    <img v-else src="/images/ui/sun-icon-jp.png" class="rewards" />
                  </div>
                  <div class="reward-bar">
                  </div>
                </div>
                <div class="growth-container">
                  <h3>{{$t('my-forest.growth')}}</h3>
                  <TrendChart
                    :datasets="[
                      {
                        data: chartData,
                        smooth: true,
                        fill: true,
                        className: 'chartLine'
                      }
                    ]"
                    :grid="{
                      verticalLines: false,
                      horizontalLines: false
                    }"
                    :min="0"
                    >
                  </TrendChart>
                </div>
              </div>
              </div>
          </div>
        </div>
      </transition>
      <div class="transparent">
        <transition name="fade">
          <div
            v-if="showingMyForestStats"
            class="user-info"
          >
            <div class="user-avatar">
              <img src="/images/ui/avatar.png" class="avatar" />
              <p class="level">{{ $t('my-forest.account-level') }}</p>
              <p class="last-active">
                {{ $t('my-forest.last-active') }}
              </p>
            </div>
            <div class="linked-accounts-container">
              <p class="linked-account">{{ $t('my-forest.linked-accounts') }}</p>
              <p class="linked-account">
                <span class="name">Google Home</span><span class="logo-container">
                  <img src='/images/brand-logos/google-home.png' class='logo' />
                </span>
              </p>
              <p class="linked-account">
                <span class="name">Revolut</span>
                <span class="logo-container">
                  <img src='/images/brand-logos/revolut.png' class='logo' />
                </span>
              </p>
              <p class="linked-account">
                <span class="name">Strava</span>
                <span class="logo-container">
                  <img src='/images/brand-logos/strava.png' class='logo' />
                </span>
              </p>
              <p class="linked-account no-border">
                <span class="name">PASMO</span>
                <span class="logo-container">
                  <img src='/images/brand-logos/pasmo.png' class='logo' />
                </span>
              </p>
            </div>
          </div>
        </transition>
      </div>
  </div>
</template>

<script>
import TrendChart from 'vue-trend-chart';
import VueQrcode from 'vue-qrcode';

let interval;

export default {
  name: 'my-forest-ui',
  components: {
    TrendChart,
    VueQrcode,
  },
  props: {
    showingMyForestStats: Boolean,
    isLoading: Boolean,
  },
  data() {
    return {
      qrValue: `${window.location.href}?mobileVR`,
      showingVr: false,
      showingShare: false,
      showingChallenge: false,
      showingScore: false,
      treeCount: 30,
      chartData: [10, 50, 20, 100, 40, 60, 80],
    };
  },
  watch: {
    treeCount() {
      this.$emit('changeTreeCount', this.treeCount);
    },
  },
  methods: {
    startRain() {
      this.$emit('startRain');
    },
    toggleVR() {
      this.showingVr = !this.showingVr;
      this.showingShare = false;
    },
    toggleShare() {
      this.showingShare = !this.showingShare;
      this.showingVr = false;
    },
    toggleScore() {
      this.showingChallenge = false;
      this.showingScore = !this.showingScore;
      if (this.showingScore) {
        interval = setInterval(() => {
          this.chartData.shift();
          this.chartData.push(Math.random() * (80 - 40) + 40);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    },
    toggleChallenge() {
      this.showingScore = false;
      this.showingChallenge = !this.showingChallenge;
    },
  },
};
</script>

<style lang="scss">
  .chartLine {
    min-width: 100% !important;
    width: 100% !important;
    resize: horizontal;

    .curve {
      width: 100% !important;
      resize: horizontal;
    }

    .stroke {
      stroke: #ff0000;
      width: 100% !important;
      resize: horizontal;
    }

    .fill {
      fill: rgba(242,26,38,0.1);
      width: 100% !important;
      resize: horizontal;
    }
  }
</style>

<style scoped lang="scss">

  input[type=range] {
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }

  input[type=range]:focus {
    outline: none;
  }

  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 28px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 1px #000000;
    background: none;
    border-radius: 41px;
    border: 0px solid #000000;
  }

  input[type=range]::-webkit-slider-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #000000;
    height: 29px;
    width: 50px;
    border-radius: 50px;
    background: #FFFFFF;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1.5px;
  }

  input[type=range]:focus::-webkit-slider-runnable-track {
    background: rgba(0, 0, 0, 0.5);
  }

  input[type=range]::-moz-range-track {
    width: 100%;
    height: 28px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 1px #000000;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 41px;
    border: 0px solid #000000;
  }

  input[type=range]::-moz-range-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #000000;
    height: 29px;
    width: 50px;
    border-radius: 50px;
    background: #FFFFFF;
    cursor: pointer;
  }

  input[type=range]::-ms-track {
    width: 100%;
    height: 28px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  input[type=range]::-ms-fill-lower {
    background: #00FF00;
    border: 0px solid #000000;
    border-radius: 82px;
    box-shadow: 1px 1px 1px #000000;
  }

  input[type=range]::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.5);
    border: 0px solid #000000;
    border-radius: 82px;
    box-shadow: 1px 1px 1px #000000;
  }

  input[type=range]::-ms-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 0px solid #000000;
    height: 29px;
    width: 50px;
    border-radius: 50px;
    background: #FFFFFF;
    cursor: pointer;
  }

  input[type=range]:focus::-ms-fill-lower {
    background: #00FF00;
  }

  input[type=range]:focus::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.5);
  }

  .my-forest-ui-container {
    overflow: hidden;

    .vr-code-container  {
        position: absolute;
        height: auto;
        width: 260px;
        background-color: #FFFFFF;
        position: fixed;
        z-index: 6;
        border: 4px solid;
        -webkit-box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
        box-shadow: 0px 6px 9px -3px rgba(0,0,0,0.55);
        text-align: center;
        border-radius: 50px 50px 0px 50px;
        padding: 15px;
        top: 45px;
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

    .transparent {
      opacity: 0.9;
    }

    .buttons-container {
      position: absolute;
      display: flex;
      flex-direction: column;
      bottom: 140px;
      right: 89px;

      .vr {
          cursor: pointer;
          position: relative;
          padding-bottom: 50px;

          img {
              width: 60px;
          }
      }

      .share {
          cursor: pointer;
          position: relative;
          padding-bottom: 50px;

          img {
              width: 60px;
          }
      }
  }

  .co2-level-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    bottom: 7.5vh;
    right: 0;
    margin-right: -32px;

    .counter {
      font-family: 'Lexend Giga';
      margin-left: 75px;
      color: #C4C4C4;
    }

    h2 {
      color: #FFFFFF;
      font-family: 'Lexend Giga';
      font-weight: 400;
      width: 350px;
      font-size: 1em;
      position: absolute;
      top: -40px;

    }

    .meter {
      color: #00FF00;
      width: 400px;
      position: absolute;
      height: 30px;
      z-index: 3;
      border: 1px solid #000000;
    }

    meter::-webkit-meter-optimum-value {
      background: none; /* Required to get rid of the default background property */
      background-color: #00FF00;
    }

    .co2-input {
      background: none;
      width: 400px;
      z-index: 5;
      opacity: 0;

    }
  }

  .challenge-popout-container {
        position: absolute;
      display: flex;
      height: 100%;
      width: 100%;
      z-index: 100;
      flex-direction: column;
      justify-content: center;

    .challenge-ui {
      max-height: 90vh;
      justify-content: center;
      align-self: center;
      border-radius: 25px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }
  }

    .challenge-container {
      .challenge-box {
        .padder{
          padding: 20px;
        }
        position: absolute;
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        z-index: 100;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.6);
        max-height: 85vh;
        max-width: 50vw;
        justify-content: center;
        align-self: center;
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;
        cursor: pointer;
        border: 4px solid transparent;
        background-image: linear-gradient(rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.9)),
          linear-gradient( #fff,#000);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        opacity: 0.95;

      .challenge-header {
        margin: 20px;
        max-width: 50%;
        margin: 10px auto;
      }

      .challenge-bottom-arrow {
        margin: 10px auto;
        max-width: 30px;
      }

      .statistics-ui {
        max-width: 80px;
        margin: 20px;
      }

      .challenge {
          width: 100%;
          box-sizing: border-box;
          padding: 5px 20px;
        }
      }
    }

    .score-container {
      position: absolute;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      z-index: 100;
      height: 100%;

      .score-box {
        background-color: rgba(255, 255, 255, 0.6);
        max-height: 85vh;
        max-width: 50vw;
        justify-content: center;
        align-self: center;
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;
        cursor: pointer;
        border: 4px solid transparent;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.9)),
          linear-gradient( #fff,#000);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        opacity: 0.95;

        .padder{
          padding: 20px;
        }

        .score-header {
          max-width: 50%;
          margin: 10px auto;
        }

        .score-info-container {
          display: flex;
          flex-direction: row;
          height: 95%;
          width: 100%;

            .right-side-container {
              width: 50%;

              .growth-container {
                display: flex;
                flex-direction: column;
                background-color: #FFFFFF;
                border-radius: 25px;
                box-sizing: border-box;
                padding: 25px;
                margin: 5%;
                height: 40%;
                width: 90%;

                h3 {
                  font-family: 'Lexend Giga';
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 15px;
                  letter-spacing: 0em;
                  text-align: left;
                }
              }

              .rewards-container {
                display: flex;
                flex-direction: column;
                background-color: #FFFFFF;
                border-radius: 25px;
                box-sizing: border-box;
                padding: 25px;
                margin: 5%;
                height: 40%;
                width: 90%;

                h3 {
                  font-family: 'Lexend Giga';
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 15px;
                  letter-spacing: 0em;
                  text-align: left;
                }

                .rain {
                  cursor: pointer;
                }

                .icons-container {
                  display: flex;
                  flex-direction: row;
                    .rewards {
                      height: 50px;
                      max-width: 20%;
                      padding: 7px;
                      display: flex;
                      flex-direction: row;
                    }

                    .medal {
                      height: 70px;
                      margin-left: 10px;
                      margin-right: 20px;
                      max-width: 30%;
                    }
                }
              }
            }

            .statistics-container {
              width: 50%;

              .challenges-container {
                width: 100%;

                .challenge {
                  max-width: 90%;
                }
              }

            .statistics-ui {
                width: auto;
                box-sizing: border-box;
                max-height: 90%;
                padding: 4.5%;
                padding-right: 0;
                margin: 0 auto;
                max-width: 100%;
            }
          }
        }
      }
    }

    .share-container {
      position: absolute;
      right: 145px;
      bottom: 215px;
      z-index: 6;

      .share-box {
        height: 65vh;
      }
    }

    .bottom-icons-container {
      position: absolute;
      bottom: 0;
      left: 15px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      z-index: 500;
      cursor: pointer;

      .challenge-icon-container {
        cursor: pointer;
      }

      .challenge-icon-container, .score-icon-container {
        padding: 45px;
        cursor: pointer;

        img {
          height: 120px;
        }

        .score-text {
          position: absolute;
          z-index: 4;
          bottom: 44px;
          padding-left: 45px;
          font-family: 'Lexend Giga';
        }
      }
    }

    .user-info {
      position: absolute;
      bottom: 140px;
      right: 150px;
      z-index: 5;
      width: 350px;
      height: 400px;
      background-color: rgba(255, 255, 255, 0.7);
      border: 2px solid transparent;
      border-radius: 20% 20% 0 20%;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.9)), linear-gradient( #000,#fff);
      background-origin: border-box;
      background-clip: padding-box, border-box;
      display: flex;
      flex-direction: column;
      color: #979797;

      .level {
        color: #828181;
        font-family: 'CodeInk';
        font-size: 0.9em;
      }

      .linked-accounts-container {
      text-align: left;
      padding: 0 25px;
      font-family: 'Lexend Giga';
      font-size: 0.8em;

      .linked-account {
        height: 40px;
        width: 100%;
        margin: 0;
        border-bottom: 1px solid rgba(110, 110, 110, 0.4);
        display: flex;
        line-height: 40px;

        &.no-border {
          border-bottom: none;
        }

        .name {
          width: 50%;
          display: inline-block;
          line-height: 40px;
        }

        .logo-container {
          position: relative;
          right: 0;
          width: 50%;
          float: right;
          align-self: center;
          justify-content: center;
          display: flex;

          .logo {
            height: 30px;
            text-align: center;
              }
            }
          }
        }

      .user-avatar {
        margin-top: 10px;

        .last-active {
          margin-bottom: 20px;
          font-family: 'Lexend Giga';
          font-size: 0.7em;
        }

        .avatar {
          width: 50px;
          height: auto;
        }
      }
    }
  }
</style>
