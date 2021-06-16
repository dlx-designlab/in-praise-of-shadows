<template>
  <div class="container">
    <div class="exit" @click="exit">
      ✕
    </div>
    <div class="video-container" @click="exit">
      <video loop muted autoplay class="video" v-if="currentPerspective === 'insect'">
        <source src="/videos/insect-view-compressed.mp4" type="video/mp4">
      </video>
      <video loop muted autoplay class="video" v-else>
        <source src="/videos/bird-view-compressed.mp4" type="video/mp4">
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scene',
  props: {
    currentPerspective: String,
  },
  data() {
    return {

    };
  },
  methods: {
    exit() {
      this.$emit('exitVideoGenerator');
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
    display: flex;
    flex-direction: column;
    justify-content: center;

    .exit {
      position: fixed;
      top: 150px;
      left: calc(16.5% + 25px);
      z-index: 11;
      font-size: 2.5em;
      font-weight: 900;
      color: #ffffff;
      cursor: pointer;
      font-size: 1em;
    }

    .video-container {
      .video {
         width: 50%;
      }
    }
  }

</style>
