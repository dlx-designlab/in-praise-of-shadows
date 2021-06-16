<template>
  <div class="globe-logos-container">
        <div class="globe-logos">
            <div class="logo-container">
                <img
                    @click="goToForest('Netflix')"
                    src="/images/brand-logos/Netflix.png"
                    class="logo netflix"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Lyft')"
                    src="/images/brand-logos/Lyft.png"
                    class="logo lyft"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Ecosia')"
                    src="/images/brand-logos/Ecosia.png"
                    class="logo ecosia"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Airfrance')"
                    src="/images/brand-logos/Airfrance.png"
                    class="logo airfrance"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Toyoshima')"
                    src="/images/brand-logos/Toyoshima.png"
                    class="logo toyoshima"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Nike')"
                    src="/images/brand-logos/Nike.png"
                    class="logo nike"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Nestle')"
                    src="/images/brand-logos/Nestle.png"
                    class="logo nestle"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Timberland')"
                    src="/images/brand-logos/Timberland.png"
                    class="logo timberland"
                />
            </div>
            <div class="logo-container">
                <img
                    @click="goToForest('Adidas')"
                    src="/images/brand-logos/Adidas.png"
                    class="logo adidas"
                />
            </div>
        </div>
  </div>
</template>

<script>
export default {
  name: 'logos',
  methods: {
    goToForest(brand) {
      this.$emit('goToForestMap', brand);
    },
  },
};
</script>

<style lang="scss" scoped>
  .globe-logos-container {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .globe-logos {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        padding: 15%;

        .logo-container {
            width: 33.33333%;
            padding: 10px 0;

            .nestle {
                box-sizing: border-box;
                padding: 15px;
            }

            .ecosia {
                box-sizing: border-box;
                padding: 15px;
            }

             .nike {
                box-sizing: border-box;
                padding: 15px;
            }

            .adidas {
                box-sizing: border-box;
                padding: 15px;
            }

            .lyft {
                box-sizing: border-box;
                padding: 15px;
            }

            .netflix {
                box-sizing: border-box;
                padding: 15px;
            }

            img {
                cursor: pointer;
                width: 150px;
            }
        }
    }
  }
</style>
