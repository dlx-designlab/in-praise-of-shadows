<template>
  <div class="forest-health-modal-container">
        <button
            class="close-button"
            @click="close"
        >
            ×
        </button>
      <div class="info-text"><p>Location:<br>{{ forest.name }}</p></div>
      <div class="info-text"><p>Biodiversity:<br>50 Species</p></div>
      <div class="info-text"><p>Photosynthesis:<br>123</p></div>
      <div class="info-text"><p>Biomass:<br>500kg Co2</p></div>
  </div>
</template>

<script>
import FOREST_DATA from '../data/forests.json';

export default {
  name: 'forest-health-modal-container',
  data() {
    return {
      FOREST_DATA,
      search: '',
    };
  },
  props: {
    selectedForest: String,
  },
  computed: {
    forest() {
      const found = FOREST_DATA.find((forest) => forest.name.toLowerCase()
            === this.selectedForest.toLowerCase());
      return found;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
    .forest-health-modal-container {
        position: absolute;
        background-color: grey;
        border: none;
        padding: 15px;
        color: #FFFFFF;
        margin-bottom: 25px;
        left: 0;
        right: 0;
        bottom: 200px;
        opacity: 0.85;
        text-align: left;

        .close-button {
            background: none; border: none;
            font-size: 1.5em;
            color: #FFFFFF;
            cursor: pointer;
            text-align: right;
            float: right;
        }

    }
</style>
