<template>
  <div class="qr-code-popout">
    <div class="popout-content">
        <div class="top-row">
            <img src="/images/ui/avatar.png" class="profile-img" />
            <h1>{{ selectedForest || 'John Smith' }}</h1>
        </div>
        <div class="qr-code-container">
            <vue-qrcode :value="value" />
            <p>{{ $t('forest-view.vr-scan') }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode';

export default {
  name: 'vr-screen',
  components: {
    VueQrcode,
  },
  props: {
    selectedForest: String,
  },
  data() {
    return {
      value: `${window.location.href}?forestVisualization`,
    };
  },
};
</script>

<style scoped lang="scss">
    .qr-code-popout {
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #000000;
        border: 2px solid grey;
        border-radius: 50px;
        background-color: #FFFFFF;
        border-radius: 50px 50px 0px 50px;

        .popout-content {
            display: flex;
            flex-direction: column;

            .top-row {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 10px;
                justify-content: center;

                h1 {
                    font-family: 'CODEINK';
                    color: #000000;
                    font-size: 1em;
                    padding: 15px;
                }

                .profile-img {
                    width: 80px;
                    height: 80px;
                }
            }

            .qr-code-container {
                flex-direction: column;
                display: block;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #979797;

                p {
                    font-family: 'Lexend Giga', sans-serif;
                }

                img {
                    width: 60%;
                }
            }
        }
    }
</style>
