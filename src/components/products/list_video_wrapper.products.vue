<template>
  <div class="container" v-if="isLoading">
    <div class="row mx-auto">
      <div class="col-sm-12 col-md-6 col-lg-4 mb-4" v-for="n in 3" :key="'skeleton-' + n">
        <div class="card mx-2 my-2 p-0 h-100 bg-secondary border-0" aria-hidden="true">
          <div class="placeholder-glow">
            <div
              class="placeholder w-100 bg-dark"
              style="height: 200px; border-radius: 4px 4px 0 0; opacity: 0.5"
            ></div>
          </div>
          <div class="card-body bg-dark">
            <h5 class="card-title placeholder-glow">
              <span class="placeholder col-6 bg-secondary"></span>
            </h5>
            <p class="card-text placeholder-glow">
              <span class="placeholder col-7 bg-secondary"></span>
              <span class="placeholder col-4 bg-secondary"></span>
              <span class="placeholder col-4 bg-secondary"></span>
              <span class="placeholder col-6 bg-secondary"></span>
              <span class="placeholder col-8 bg-secondary"></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container --nodata p-5" v-else-if="vData.docs.length === 0">No Data</div>
  <div class="container" v-else>
    <div class="row mx-auto">
      <div
        class="col-sm-12 col-md-6 col-lg-4 mb-4"
        v-for="item in vData.docs"
        :key="item.id || item.uid || item"
      >
        <VideoCardProducts
          :video="item"
          @deleteVideo="handleDelete($event)"
          @switchEnable="handleToggleEnable($event)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-center mt-4 mb-5" v-if="vData.pages >= 1">
      <nav aria-label="Video Pagination">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage <= 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
          </li>
          <li
            class="page-item"
            v-for="page in vData.pages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage >= vData.pages }">
            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import VideoCardProducts from './VideoCard.products.vue'

export default {
  name: 'ListVideoWrapperProducts',
  components: { VideoCardProducts },
  props: {
    vData: {
      type: Object,
      default: () => ({ docs: [], pages: 0, total: 0 }),
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.vData.pages && page !== this.currentPage) {
        this.$emit('changePage', page)
      }
    },

    handleDelete(id) {
      this.$emit('deleteVideo', id)
    },

    handleToggleEnable(param) {
      this.$emit('switchEnable', param)
    },
  },
}
</script>

<style scoped>
.--nodata {
  color: white !important;
  font-size: 2rem;
  text-align: center;
}
</style>
