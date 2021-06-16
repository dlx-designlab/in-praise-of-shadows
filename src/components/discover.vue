<template>
  <div class="discover-container">
    <div class="stories-container">

      <div class="story">
        <img class="story-image" src="/images/discover/discover1.png" />
        <p>{{ $t('discover-page.first') }}</p>
        <p class="score">
          <img class="heart" src="/images/ui/heart-icon-trimmy.png" />
          <span class="score-text">63</span>
        </p>
      </div>

      <div class="story">
        <img class="story-image" src="/images/discover/discover2.png" />
        <p>{{ $t('discover-page.second') }}</p>
        <p class="score">
          <img class="heart" src="/images/ui/heart-icon-trimmy.png" />
          <span class="score-text">401</span>
        </p>
      </div>

      <div class="story">
        <img class="story-image" src="/images/discover/discover3.png" />
        <p>{{ $t('discover-page.third') }}</p>
        <p class="score">
          <img class="heart" src="/images/ui/heart-icon-trimmy.png" />
          <span class="score-text">1,120</span>
        </p>
      </div>

      <div class="story">
        <img class="story-image" src="/images/discover/discover4.png" />
        <p>{{ $t('discover-page.fourth') }}</p>
        <p class="score">
          <img class="heart" src="/images/ui/heart-icon-trimmy.png" />
          <span class="score-text">678</span>
        </p>
      </div>

      <div class="story">
        <img class="story-image" src="/images/discover/discover5.png" />
        <p>{{ $t('discover-page.fifth') }}</p>
        <p class="score">
          <img class="heart" src="/images/ui/heart-icon-trimmy.png" />
          <span class="score-text">981</span>
        </p>
      </div>

      <div class="story">
        <img class="story-image" src="/images/discover/discover6.png" />
        <p>{{ $t('discover-page.sixth') }}</p>
        <p class="score">
          <img class="heart" src="/images/ui/heart-icon-trimmy.png" />
          <span class="score-text">325</span>
        </p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'discover',
  mounted() {
    document.body.addEventListener('mousewheel', (e) => {
      window.scrollBy(e.deltaY, 0);
    });
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="scss">
  .discover-container {
    position: absolute;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    overflow-x: scroll !important;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }

    .stories-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 100%;

      .story {
        justify-content: center;
        margin: 40px;

        p {
          color: #FFFFFF;
          text-align: center;
          font-family: 'Lexend Giga';
          padding: 0;
          margin: 0;
          margin-top: 5px;

          &.score {
            text-align: left;
            height: 0;
            margin-top: 15px;

            .heart {
              height: 15px;
              padding: 0 15px;
            }
          }
        }

        .story-image {
          width: 300px;
        }
      }
    }
  }
</style>
