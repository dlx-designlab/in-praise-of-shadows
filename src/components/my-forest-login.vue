<template>
  <div class="my-forest-login-container">
        <div class="my-forest-login">
            <div class="top">
                <div class="top-text-container">
                    <p>{{ $t('log-in-page.username') }}: <span class="blinking">_______</span></p>
                    <p>{{$t('log-in-page.password')}}: <span class="blinking">_______</span></p>
                </div>
            </div>
            <div class="bottom">
                <button
                    class="enter-forest-button"
                    @click="goToMyForest"
                >
                    {{$t('log-in-page.submit')}}
                </button>
            </div>
        </div>
  </div>
</template>

<script>

export default {
  name: 'my-forest-login',
  methods: {
    close() {
      this.$emit('closeMyForestLogin');
    },
    goToMyForest() {
      this.close();
      this.$emit('goToMyForest');
    },
  },
};
</script>

<style scoped lang="scss">
    .my-forest-login-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 7;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .my-forest-login {
            border: 5px solid #000000;
            width: 40vw;
            height: 40vw;
            border-radius: 50%;
            background-color: #FFFFFF;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .top {
                position: relative;
                height: 50%;

                .top-text-container {
                    position: relative;
                    top: 40%;
                    left: 20%;
                    text-align: left;
                    font-family: 'Lexend Giga', sans-serif;
                    text-transform: uppercase;
                    font-size: 0.9em;
                }
                .blinking {
                    font-size: 0.6em;
                    animation: blinker 1s linear infinite;
                }

                @keyframes blinker {
                    50% {
                        opacity: 0;
                    }
                }
            }

            .bottom {
                position: relative;
                height: 50%;
                width:100%;
                background-color: #00FF00;
                border-radius: 0 0 100% 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .enter-forest-button {
                    font-family: 'CodeInk';
                    font-weight: 400;
                    text-transform: uppercase;
                    font-size: 2.5em;
                    line-height: 1.5em;
                    background: none;
                    border: none;
                    width: 300px;
                }
            }
        }
    }
</style>
