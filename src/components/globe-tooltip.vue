<template>
  <div
    id="tooltip-container"
    ref="tooltipContainer"
  >
    <transition name="fade">
      <div v-if="hoveredPoint">
          <div class="tooltip">
              <p>{{ forestName }}</p>
          </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FOREST_DATA from '../data/forests.json';

export default {
  name: 'Tooltip',
  props: {
    hoveredPoint: String,
    mouseX: Number,
    mouseY: Number,
  },
  computed: {
    forestName() {
      if (this.$i18n.locale === 'en') {
        return this.hoveredPoint;
      }
      const [result] = FOREST_DATA.filter((entry) => entry.name === this.hoveredPoint);
      return result.jp_name;
    },
  },
  watch: {
    mouseX() {
      this.moveToolTip();
    },
    mouseY() {
      this.moveToolTip();
    },
  },
  methods: {
    moveToolTip() {
      if (this.hoveredPoint) {
        this.$refs.tooltipContainer.style.left = `${this.mouseX + 50}px`;
        this.$refs.tooltipContainer.style.top = `${this.mouseY}px`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  #tooltip-container {
    position: fixed;
    z-index: 3;
    width: auto;
    height: auto;
    opacity: 0.75;
    top: 0;
    left: 0;

      .tooltip {
        border: 1px solid #ffffff;
        background-color: #000000;
        color: #ffffff;
        padding: 0px 0px;
        margin: 0;
        font-size: 0.75em;

        p {
            padding: 0px 5px;
            margin: 2px 0px;
        }
      }
  }
</style>
