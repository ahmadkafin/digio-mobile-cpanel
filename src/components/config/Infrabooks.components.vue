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
    <div v-if="isLoading" class="d-flex justify-content-center">
      <span class="loader"></span>
    </div>
    <template v-else>
      <div class="text-center" v-if="noData">No Data</div>
      <template v-for="item in infrabooks" v-else>
        <div class="card mx-2 my-2 p-0" style="width: 18rem">
          <img
            :src="`https://digio.pgn.co.id/digiomobilebe/static/images/infra/${item.poster_path}`"
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
      </template>
    </template>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'InfrabooksComponents',
  components: { FontAwesomeIcon },
  data() {
    return {
      searchValue: '',
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
