<template>
  <div class="container py-4">
    <div class="card p-5 bg-dark">
      <div class="d-flex justify-content-between mb-3">
        <h5 class="d-flex align-items-center gap-2 mb-3 flex-nowrap text-light">
          <span @click="goBack" class="goback-btn d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'arrow-left-long']" />
          </span>
          <span class="past-page">Home</span>
          <span class="breadcrumbs d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </span>
          <span class="text-truncate past-page">{{ title }}</span>
          <span class="breadcrumbs d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </span>
          <span class="text-truncate">{{ subtitle }}</span>
        </h5>
        <div class="d-grid">
          <button class="btn btn-sm btn-success" @click="goToAdd">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
      </div>

      <!-- template -->
      <div class="row">
        <div class="px-2">
          <PillsProductsVue :pCategories="categories" @filterVideoFeed="filterVideoFeed($event)" />
          <ListVideoWrapperProducts
            :vData="vData"
            :currentPage="query.page"
            :isLoading="isLoading"
            @changePage="changePage"
            @deleteVideo="handleDelete($event)"
            @switchEnable="handleToggleEnable($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apiServices from '@/services/api.services'
import PillsProductsVue from '@/components/products/pills.products.vue'
import ListVideoWrapperProducts from '@/components/products/list_video_wrapper.products.vue'

export default {
  name: 'VideoProductsView',
  components: { PillsProductsVue, ListVideoWrapperProducts },
  data() {
    return {
      path: this.$route.params.path,
      isLoading: false,
      categories: [],
      title: '',
      subtitle: '',
      vData: { docs: [], pages: 0, total: 0 },
      productId: '',
      query: {
        page: 1,
        paginate: 10,
        orderBy: 'created_at',
        sortBy: 'DESC',
        productId: '',
      },
    }
  },
  mounted() {
    this.title = 'Config ' + this.path.toUpperCase()
    this.subtitle = 'Video'
    this.fetchCategories()
    this.fetchVideoFeed()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    goToAdd() {
      this.$router.push({
        name: 'video-add',
      })
    },
    fetchCategories() {
      this.isLoading = true
      apiServices.getProductsCategories().then((res) => {
        this.isLoading = false
        this.categories = res.data?.data
      })
    },
    fetchVideoFeed() {
      this.isLoading = true
      apiServices.fetchVideoFeed(this.query).then((res) => {
        this.isLoading = false
        this.vData = res.data?.data
      })
    },
    filterVideoFeed(uid) {
      console.log(uid)
      this.query.productId = uid
      this.query.page = 1
      this.fetchVideoFeed()
    },
    changePage(page) {
      this.query.page = page
      this.fetchVideoFeed()
    },
    handleDelete(id) {
      let isConfirm = confirm('Apakah yakin akan menghapus video ini?')
      if (isConfirm) {
        apiServices.deleteVideo(id).then((res) => {
          this.fetchVideoFeed(this.query)
        })
      }
    },
    handleToggleEnable(param) {
      apiServices
        .updateVideo(param.id, {
          isEnable: param.status,
        })
        .then((res) => {
          this.fetchVideoFeed(this.query)
        })
    },
  },
}
</script>
