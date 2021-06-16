<template>
  <div class="vr-screen-container">
       <h1>VR</h1>
       <vue-qrcode :value="value" />
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
    subPage: Number,
    selectedForest: String,
  },
  watch: {
    subPage(val) {
      if (val === 1) {
        this.$emit('goToForestVisualisation', this.selectedForest);
      } else if (val === 2) {
        this.$emit('goToForestMap');
      }
    },
  },
  data() {
    return {
      value: `${window.location.href}?mobileVR`,
    };
  },
};
</script>

<style scoped lang="scss">
  .vr-screen-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;

      h1 {
        margin-top: 25vh;
        font-family: 'CODEINK';
        color: #FFFFFF;
        font-size: 5em;
      }
  }
</style>
