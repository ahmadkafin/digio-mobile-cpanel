<template>
  <div class="row">
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
      <div class="text-center" v-if="noData">No Data</div>
      <template v-for="item in infrabooks" :key="item" v-else>
        <div class="col-sm-12 col-md-6 col-lg-4">
          <div class="card mx-2 my-2 p-0">
            <img
              :src="`${this.baseUrl}/static/images/infra/${item.poster_path}`"
              class="card-img-top fixed-img"
              :alt="item.image"
            />
            <div class="card-body">
              <h5 class="card-title">{{ item.name }}</h5>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item success" @click="goToForm(item.uuid)">
                <font-awesome-icon :icon="['fas', 'eye']" />
                View
              </li>
              <li class="list-group-item warning" @click="goToForm(item.uuid)">
                <font-awesome-icon :icon="['fas', 'pencil']" />
                Update
              </li>
              <li class="list-group-item danger" @click="apiDelete(item.uuid)">
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BASE_API_URL as baseUrl } from '@/utils/baseUrl.utils'

export default {
  name: 'InfrabooksComponents',
  components: { FontAwesomeIcon },
  data() {
    return {
      searchValue: '',
      baseUrl: baseUrl,
    }
  },
  props: ['infrabooks', 'isLoading', 'noData'],
  methods: {
    searchData(value) {
      value = document.getElementById('search-value').value
      this.searchValue = value
      this.$emit('searchData', value)
    },
    goToForm(item) {
      this.$emit('goTo', item)
    },
    apiDelete(uuid) {
      this.$emit('apiDelete', uuid)
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
