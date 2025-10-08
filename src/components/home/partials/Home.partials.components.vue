<template>
  <div
    class="tab-pane fade show active mx-3"
    id="v-pills-home"
    role="tabpanel"
    aria-labelledby="v-pills-home-tab"
    tabindex="0"
  >
    <div class="row text-center text-light">
      <h1>CONFIG PAGE</h1>
    </div>

    <div class="row justify-content-between align-items-stretch">
      <template v-for="item in dataCard" :key="item.name">
        <div
          :class="['card', 'col-lg-2', 'col-sm-12', 'mx-2', 'mb-3', 'custom-card', item.images]"
          :style="[`background-color: ${item.color}`]"
        >
          <img
            :src="'/digiomobilecpanel/assets/images/' + item.images + '.jpeg'"
            class="card-img-top fixed-img"
            :alt="item.images"
          />
          <div class="card-body custom-card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <p class="card-text">
              {{ item.description }}
            </p>
            <button class="btn btn-primary btn-sm" @click="goToPage(item.path)">
              Open <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
  name: 'HomePartialsComponents',
  components: { FontAwesomeIcon },
  data() {
    return {
      dataCard: [],
    }
  },
  mounted() {
    this.buildDataCard()
  },
  methods: {
    buildDataCard() {
      this.dataCard = [
        {
          name: 'Products',
          description: 'Use this if you want to make change on page products',
          color: '#E79800', // gold
          images: 'products',
          path: 'products',
        },
        {
          name: 'Standalone Menu',
          description: 'Use this if you want to make change on page Standalone Menu',
          color: '#C44536', // deep red
          images: 'standalone',
          path: 'standalone',
        },
        {
          name: 'Override DIGIO Menu',
          description: 'Use this if you want to make override on DIGIO Menu',
          color: '#4E598C', // indigo
          images: 'override_menu',
          path: 'overridedigio',
        },
        {
          name: 'Infrabooks',
          description: 'Use this if you want to make change on page Infrabooks',
          color: '#2E5077', // dark blue
          images: 'infrabooks',
          path: 'infrabooks',
        },
        {
          name: 'Field Map',
          description: 'Use this if you want to make change on page FieldMap',
          color: '#6A994E', // olive green
          images: 'field_map',
          path: 'fieldmap',
        },
      ]
    },
    goToPage(item) {
      this.$router.push({ name: 'config', params: { path: item } })
    },
  },
}
</script>

<style scoped>
.custom-card {
  color: white;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.custom-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.custom-card.products > .custom-card-body > .btn {
  background-color: rgb(234, 184, 92);
}

.custom-card-body > .btn {
  margin-top: auto;
  font-size: 0.8em;
  background-color: rgb(231 152 0);
  border-color: rgb(231 152 0);
}

.custom-card.products > .custom-card-body > .btn:hover,
.custom-card-body > .btn:hover {
  background-color: rgb(208, 231, 0);
  border-color: rgb(208, 231, 0);
}
</style>
