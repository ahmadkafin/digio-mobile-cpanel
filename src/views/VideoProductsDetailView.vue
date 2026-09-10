<template>
  <div class="container py-4">
    <div class="card p-5 bg-dark">
      <div class="d-flex justify-content-between mb-3">
        <h5 class="d-flex align-items-center gap-2 mb-3 flex-nowrap text-light">
          <span @click="goBack" class="goback-btn d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'arrow-left-long']" />
          </span>
          <span class="breadcrumbs d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </span>
          <span class="text-truncate past-page">{{ title }}</span>
          <span class="breadcrumbs d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </span>
          <span class="text-truncate">{{ subtitle }}</span>
        </h5>
      </div>

      <!-- template -->
      <div class="row">
        <div class="col-12 px-2 text-white">
          <VideoDetailForm :initialData="payload" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDetailForm from '@/components/products/form/VideoDetail.form.components.vue'

export default {
  name: 'VideoProductsDetail',
  components: { VideoDetailForm },
  data() {
    return {
      path: this.$route.params.path,
      title: '',
      subtitle: '',
      payload: history.state?.payload || null,
    }
  },
  mounted() {
    this.title = 'Config ' + (this.payload?.video_name || 'UNKNOWN').toUpperCase()
    this.subtitle = 'Video'
  },
  methods: {
    goBack() {
      this.$router.back()
    },
  },
}
</script>
