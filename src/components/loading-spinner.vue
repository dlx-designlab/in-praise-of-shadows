<template>
    <div class="loader-container">
        <p class="loading-message">{{ loadingMessage }}</p>
        <div class="loader">
            <div v-for="index in blocksToShow" :key="index">
                <div class="loading-block"></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'Tree',
  props: {
    loadingMessage: String,
  },
  mounted() {
    const self = this;
    const loaderInterval = setInterval(() => {
      if (self.blocksToShow < 11) {
        self.blocksToShow += 1;
      } else {
        clearInterval(loaderInterval);
      }
    }, 5000);
  },
  data() {
    return {
      blocksToShow: 1,
    };
  },
};
</script>

<style scoped lang="scss">

    .loader-container {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000000;
        opacity: 1;
        z-index: 9 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000000;
        font-family: 'Lexend Giga', sans-serif;
        display: flex;
        flex-direction: column;

        .loader {
            width: 250px;
            border: 1px solid #000000;
            background-color: #ffffff;
            height: 25px;
            display: flex;
            flex-direction: row;
            padding: 5px;

            .loading-block {
                height: 25px;
                width: 20px;
                background-color: #000000;
                margin-right: 3px;
            }
        }
    }

</style>
