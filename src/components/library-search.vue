<template>
  <div class="library-search-container">
        <div class="search-wrapper">
            <input type="text"
                v-model="search"
                :placeholder="$t('forest-view.search-placeholder')"
            />
            <div class="filtered-search">
                <img class="filtered-search-icon" src="/images/ui/search-icon.png" />
            </div>
            <div class="results-container">
                <ul class="results-list" v-if="search.length > 1">
                    <li
                        v-for="result in filteredList"
                        v-bind:key="result.id"
                        @click="goToForestMap(result.name)"
                    >
                        <span class="result name">{{ result.name }}</span>,
                        <span class="result">
                            {{ result.country }},
                            {{ result.type }},
                            {{ result.lat }} {{ result.lon }}
                        </span>
                    </li>
                </ul>
                <div
                    class='down-arrow'
                    v-if="search.length > 1 && filteredList.length > 15"
                >
                    \/
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import FOREST_DATA from '../data/forests.json';

export default {
  name: 'librarySearch',
  data() {
    return {
      FOREST_DATA,
      search: '',
    };
  },

  computed: {
    filteredList() {
      const matches = [];
      // eslint-disable-next-line array-callback-return
      FOREST_DATA.filter((forest) => {
        if (forest.name.toLowerCase().includes(this.search.toLowerCase())) {
          matches.push(forest);
        }
        if (forest.country.toLowerCase().includes(this.search.toLowerCase())) {
          matches.push(forest);
        }
        if (forest.type.toLowerCase().includes(this.search.toLowerCase())) {
          matches.push(forest);
        }
      });
      return matches;
    },
  },
  methods: {
    goToForestMap(forest) {
      this.$emit('goToForestMap', forest);
    },
  },
};
</script>

<style scoped lang="scss">
    .library-search-container {
        position: absolute;
        top:0; left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color:rgba(0, 0, 0, 0.5);
        z-index: 4;

        .search-wrapper {
            position: relative;
            width: 70vw;

            input {
                font-family: 'Lexend Giga';
            }

            .filtered-search {
                display: block;
                float: right;
                text-transform: uppercase;
                color: #FFFFFF;
                margin-top: 3px;
                margin-right: -20px;

                .filtered-search-icon {
                    width: 25px;
                    padding: 15px;
                }
            }

            .results-container {
                text-align: left;
                color: #FFFFFF;

                .results-list {
                    list-style-type: none;
                    max-height: 50vh;
                    width: 100%;
                    overflow: scroll;

                    .result {
                        cursor: pointer;
                        color: #00FF00;

                        &.name {
                            font-weight: 900;
                        }
                    }
                }

                .down-arrow {
                    color: #00FF00;
                    text-align: center;
                }
            }

            input {
                display: block;
                border: none;
                border-radius: 50px;
                width: 70vw;
                background-color: #00FF00;
                color: #000000;
                padding: 15px;
                font-size: 1em;
                user-select: none;
                outline: none;
            }

            ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
                color: #000000;
                opacity: 1; /* Firefox */
            }

            :-ms-input-placeholder { /* Internet Explorer 10-11 */
                color: #000000;
            }

            ::-ms-input-placeholder { /* Microsoft Edge */
                color: #000000;
            }
        }
    }
</style>
