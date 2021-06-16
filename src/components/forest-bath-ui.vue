<template>
  <div class="forest-bath-ui-container">
        <transition name="fade">
            <div
                v-if="showingRadar"
                class="radar-container"
            >
                <img class="radar-bg" src="/images/radar.png" />
                <img
                    class="icon squirrel"
                    src="/images/squirrel.png"
                    @click="showSquirrelView"
                />
                <img
                    class="icon bird"
                    src="/images/bird.png"
                    @click="showBirdView"
                />
                <img
                    class="icon insect"
                    src="/images/insect.png"
                    @click="showInsectView"
                />
            </div>
        </transition>
        <div class="radar-icon-container">
            <img
                class="radar-icon"
                src="/images/radar-icon.png"
                @click="toggleRadar"
            />
        </div>
  </div>
</template>

<script>

export default {
  name: 'forest-bath-ui',
  props: {
    selectedForestBath: String,
  },
  data() {
    return {
      showingRadar: false,
    };
  },
  methods: {
    toggleRadar() {
      this.showingRadar = !this.showingRadar;
    },
    showBirdView() {
      this.$emit('showBirdView');
      this.showingRadar = false;
    },
    showInsectView() {
      this.$emit('showInsectView');
      this.showingRadar = false;
    },
    showSquirrelView() {
      this.$emit('showSquirrelView');
      this.showingRadar = false;
    },
  },
};
</script>

<style scoped lang="scss">
    .forest-bath-ui-container {
        position: absolute;
        bottom: 0; right: 0;
        color: #FFFFFF;
        z-index: 4;
        text-align: right;
        margin: 25px;

        .radar-container {
            left: 0;
            top: 0;
            position: fixed;
            display: flex;
            width: 100vw;
            height: 100vh;
            pointer-events: none;

            .icon {
                position: absolute;
                width: auto;
                z-index: 5;
                cursor: pointer;
                 pointer-events: all;

                &.squirrel {
                    top: 40%;
                    left: 35%;
                    height: 100px;
                }

                &.bird {
                    top: 60%;
                    left: 55%;
                    height: 100px;
                }

                &.insect {
                    top: 60%;
                    left: 35%;
                    height: 100px;
                }
            }

            .radar-bg {
                width: 100vh;
                align-self: center;
                justify-content: center;
                z-index: 4;
                margin: 0 auto;
                pointer-events: none;
            }
        }

        .radar-icon-container {
            margin: 20px 0;

            .radar-icon {
                width: 120px;
                cursor: pointer;
            }

            p {
                padding:0;
                margin: 10px 0;
            }
        }

        .vr-button {
            text-transform: uppercase;
            outline: none;
            border-radius: 100px;
            height: 35px;
            width: 60px;
            background: none;
            color: #FFFFFF;
            border: 1px solid #FFFFFF;
            font-weight: 900;
            font-size: 1.2em;
        }
    }
</style>
