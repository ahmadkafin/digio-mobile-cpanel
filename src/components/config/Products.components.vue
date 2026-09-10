<template>
  <div class="row">
    <div class="col-sm-12 col-md-10 col-lg-10">
      <div class="px-2">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="search"
            id="search-value"
            :value="searchValue"
            v-debounce:1s="searchData"
          />
          <span class="input-group-text" id="basic-addon">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </span>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-2 col-lg-2">
      <div class="d-grid gap-2 px-2">
        <button class="btn btn-warning" @click="goToProductVideo">
          <font-awesome-icon :icon="['fas', 'video']" />
          <span> Video </span>
        </button>
      </div>
    </div>
    <div class="row mx-auto" v-if="isLoading">
      <div class="col-sm-12 col-md-6 col-lg-4" v-for="n in 3" :key="'skeleton-' + n">
        <div class="card mx-2 my-2 p-0 border-0 shadow-sm" aria-hidden="true">
          <div class="placeholder-glow">
            <div
              class="placeholder w-100 bg-secondary"
              style="height: 200px; border-radius: 4px 4px 0 0; opacity: 0.2"
            ></div>
          </div>
          <div class="card-body">
            <h5 class="card-title placeholder-glow">
              <span class="placeholder col-6"></span>
            </h5>
            <p class="card-text placeholder-glow">
              <span class="placeholder col-7"></span>
              <span class="placeholder col-4"></span>
              <span class="placeholder col-4"></span>
              <span class="placeholder col-6"></span>
              <span class="placeholder col-8"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row mx-auto" v-else>
      <div v-if="noData" class="text-center w-100 py-4">No Data</div>
      <div v-else-if="products.length === 0" class="text-center text-muted w-100 py-4">
        <p>Tidak ada produk ditemukan.</p>
      </div>
      <template v-else v-for="item in products" :key="item.uid || item">
        <div class="col-sm-12 col-md-6 col-lg-4">
          <div class="card mx-2 my-2 p-0">
            <img
              :src="`${this.baseUrl}/static/images/products/${item.image}`"
              class="card-img-top fixed-img"
              :alt="item.image"
            />
            <div class="card-body">
              <h5 class="card-title">{{ item.name }}</h5>
              <div class="card-text clamp-4" v-html="legacyToHtml(item.description)"></div>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item warning" @click="goToForm(item.uid)">
                <font-awesome-icon :icon="['fas', 'pencil']" />
                Update
              </li>
              <li class="list-group-item danger" @click="apiDelete(item.uid)">
                <font-awesome-icon :icon="['fas', 'trash']" />
                Delete
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { looksLikeHtml, legacyToHtml } from '@/utils/html.utils'
import { BASE_API_URL as baseUrl } from '@/utils/baseUrl.utils'

export default {
  name: 'ProductsComponents',
  components: { FontAwesomeIcon },
  data() {
    return {
      searchValue: '',
      baseUrl: baseUrl,
    }
  },
  props: ['products', 'isLoading', 'noData'],
  methods: {
    searchData(value) {
      value = document.getElementById('search-value').value
      this.searchValue = value
      this.$emit('searchData', value)
    },
    goToForm(item) {
      this.$emit('goTo', item)
    },
    goToProductVideo() {
      this.$router.push({ name: 'video', params: { path: 'products' } })
    },
    legacyToHtml,
    apiDelete(uid) {
      this.$emit('apiDelete', uid)
    },
  },
}
</script>

<style scoped>
.clamp-4 {
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hidden {
  display: none;
}
</style>
