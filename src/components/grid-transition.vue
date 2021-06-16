<template>
<div class="grid-transition-container">
    <h1>{{ $t('forest-view.simulating-forest') }}</h1>
  <div class="grid-transition">
    <img class="grid-image" src="/images/forest-transition/1.jpg" />
    <img class="grid-image" src="/images/forest-transition/2.jpg" />
    <img class="grid-image" src="/images/forest-transition/3.jpg" />
    <img class="grid-image" src="/images/forest-transition/4.jpg" />
    <img class="grid-image" src="/images/forest-transition/5.jpg" />
    <img class="grid-image" src="/images/forest-transition/6.jpg" />
    <img class="grid-image" src="/images/forest-transition/7.jpg" />
    <img class="grid-image" src="/images/forest-transition/8.jpg" />
    <img class="grid-image" src="/images/forest-transition/9.jpg" />
    <img class="grid-image" src="/images/forest-transition/10.jpg" />
    <img class="grid-image" src="/images/forest-transition/11.jpg" />
    <img class="grid-image" src="/images/forest-transition/12.jpg" />
    <img class="grid-image" src="/images/forest-transition/13.jpg" />
    <img class="grid-image" src="/images/forest-transition/14.jpg" />
    <img class="grid-image" src="/images/forest-transition/15.jpg" />
    <img class="grid-image" src="/images/forest-transition/16.jpg" />
    <img class="grid-image" src="/images/forest-transition/17.jpg" />
    <img class="grid-image" src="/images/forest-transition/18.jpg" />
    <img class="grid-image" src="/images/forest-transition/19.jpg" />
    <img class="grid-image" src="/images/forest-transition/20.jpg" />
    <img class="grid-image" src="/images/forest-transition/21.jpg" />
    <img class="grid-image" src="/images/forest-transition/22.jpg" />
    <img class="grid-image" src="/images/forest-transition/23.jpg" />
    <img class="grid-image" src="/images/forest-transition/24.jpg" />
    <img class="grid-image" src="/images/forest-transition/25.jpg" />
    <img class="grid-image" src="/images/forest-transition/26.jpg" />
    <img class="grid-image" src="/images/forest-transition/27.jpg" />
    <img class="grid-image" src="/images/forest-transition/28.jpg" />
    <img class="grid-image" src="/images/forest-transition/29.jpg" />
    <img class="grid-image" src="/images/forest-transition/30.jpg" />
    <img class="grid-image" src="/images/forest-transition/31.jpg" />
    <img class="grid-image" src="/images/forest-transition/32.jpg" />
    <img class="grid-image" src="/images/forest-transition/33.jpg" />
    <img class="grid-image" src="/images/forest-transition/34.jpg" />
    <img class="grid-image" src="/images/forest-transition/35.jpg" />
    <img class="grid-image" src="/images/forest-transition/36.jpg" />
</div>
</div>
</template>

<script>
export default {
  name: 'gridTransition',
  components: {
  },
  props: {
  },
  watch: {

  },
  data() {
    return {

    };
  },
  mounted() {
    this.startGridTransition();
  },
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        // eslint-disable-next-line no-param-reassign
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    startGridTransition() {
      this.transitioningIn = true;
      setTimeout(() => {
        const images = Array.from(document.querySelectorAll('.grid-image'));
        const shuffledImages = this.shuffleArray(images);
        for (let i = 0; i < 36; i += 1) {
          const selected = shuffledImages[i];
          setTimeout(() => {
            selected.style.visibility = 'visible';
            if (i === 35) {
              this.$emit('finishGridTransition');
            }
          }, i * 50);
        }
      }, 0);
    },
  },
  beforeDestroy() {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .grid-transition-container {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: row;
        justify-content: center;
        z-index: 6;
        background-color: rgba(0, 0, 0, 0.6);

        h1 {
            font-family: 'Lexend Giga';
            position: absolute;
            color: #ffffff;
            font-size: 1em;
            text-align: center;
            width: 100%;
            margin-top: 120px;
            font-weight: 400;
        }

        .grid-transition {
            align-self: center;
            align-items: center;
            justify-content: center;
            position: absolute;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(6, 1fr);
            grid-gap: 5px;
            width: 40vw;
            margin: 0 auto;
            text-align: center;
            margin-top: 55px;

            .grid-image {
                visibility: hidden;
                width: 100%;
                height: 100%;
                opacity: 0.9;
            }
        }
    }

</style>
