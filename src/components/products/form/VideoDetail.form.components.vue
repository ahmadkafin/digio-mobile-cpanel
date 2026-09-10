<template>
  <form @submit.prevent="submit" class="form">
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="product_id" class="form-label">Product</label>
        <select v-model="formData.product_id" class="form-select" id="product_id">
          <option value="" disabled>Select Product...</option>
          <option v-for="cat in categories" :key="cat.uid || cat.id" :value="cat.uid || cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Video Name -->
      <div class="col-md-6 mb-3">
        <label for="video_name" class="form-label">Video Name</label>
        <input
          v-model="formData.video_name"
          type="text"
          class="form-control"
          id="video_name"
          placeholder="Enter video name"
        />
      </div>

      <!-- Video Description -->
      <div class="col-12 mb-3">
        <label for="video_description" class="form-label">Video Description</label>
        <textarea
          v-model="formData.video_description"
          class="form-control"
          id="video_description"
          rows="4"
          placeholder="Enter video description"
        ></textarea>
      </div>

      <!-- Thumbnail Upload & Preview -->
      <div class="col-md-6 mb-4">
        <label class="form-label">Thumbnail Image</label>
        <div
          class="card p-2 mb-2 bg-light text-center"
          style="min-height: 200px; cursor: pointer"
          @click="$refs.thumbnailInput.click()"
        >
          <img
            v-if="thumbnailPreview"
            :src="thumbnailPreview"
            class="img-fluid rounded mx-auto"
            style="max-height: 250px; object-fit: contain"
          />
          <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted">
            Click to upload thumbnail
          </div>
        </div>
        <input
          ref="thumbnailInput"
          type="file"
          class="d-none"
          accept="image/*"
          @change="onThumbnailChange"
        />
      </div>

      <!-- Video Upload & Preview -->
      <div class="col-md-6 mb-4">
        <label class="form-label">Video File</label>
        <div
          class="card p-2 mb-2 bg-light text-center"
          style="min-height: 200px; cursor: pointer"
          @click="!videoPreview && $refs.videoInput.click()"
        >
          <video
            v-if="videoPreview"
            :src="videoPreview"
            controls
            class="w-100 rounded"
            style="max-height: 250px; outline: none"
          ></video>
          <div
            v-else
            class="d-flex align-items-center justify-content-center h-100 text-muted"
            @click="$refs.videoInput.click()"
          >
            Click to upload video
          </div>
        </div>
        <input
          ref="videoInput"
          type="file"
          class="d-none"
          accept="video/*"
          @change="onVideoChange"
        />
        <div class="d-grid" v-if="videoPreview">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="$refs.videoInput.click()"
          >
            Change Video
          </button>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="d-grid gap-2 mt-3">
      <button type="submit" class="btn btn-success" :disabled="isLoadingSubmit">
        <span
          v-if="isLoadingSubmit"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        Submit Video
      </button>
    </div>
  </form>
</template>

<script>
import { BASE_API_URL as baseUrl } from '@/utils/baseUrl.utils'
import apiServices from '@/services/api.services'

export default {
  name: 'VideoDetailFormComponents',
  props: {
    initialData: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      formData: {
        product_id: '',
        video_name: '',
        video_description: '',
        product_thumbnail_video: null,
        product_video: null,
      },
      thumbnailPreview: '',
      videoPreview: '',
      categories: [],
      isLoadingData: false,
      isLoadingSubmit: false,
    }
  },
  mounted() {
    this.initForm()
    this.fetchCategories()
  },
  watch: {
    initialData: {
      deep: true,
      handler() {
        this.initForm()
      },
    },
  },
  methods: {
    fetchCategories() {
      this.isLoading = true
      apiServices.getProductsCategories().then((res) => {
        this.isLoading = false
        this.categories = res.data?.data
      })
    },
    initForm() {
      if (this.initialData) {
        this.formData.product_id = this.initialData.product_id || ''
        this.formData.video_name = this.initialData.video_name || ''
        this.formData.video_description = this.initialData.video_description || ''

        // Setup initial previews using baseUrl if data exists
        if (this.initialData.video_thumbnail_path) {
          this.thumbnailPreview = `${baseUrl}/${this.initialData.video_thumbnail_path}`
        }
        if (this.initialData.video_path) {
          this.videoPreview = `${baseUrl}/${this.initialData.video_path}`
        }
      }
    },
    revokePreviews() {
      if (this.thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(this.thumbnailPreview)
      }
      if (this.videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(this.videoPreview)
      }
    },
    onThumbnailChange(e) {
      const file = e.target.files?.[0]
      if (file) {
        this.formData.product_thumbnail_video = file
        if (this.thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(this.thumbnailPreview)
        this.thumbnailPreview = URL.createObjectURL(file)
      }
    },
    onVideoChange(e) {
      const file = e.target.files?.[0]
      if (file) {
        this.formData.product_video = file
        if (this.videoPreview.startsWith('blob:')) URL.revokeObjectURL(this.videoPreview)
        this.videoPreview = URL.createObjectURL(file)
      }
    },
    async submit() {
      console.log('--- Form Submitted ---')
      this.isLoadingSubmit = true

      const fData = new FormData()
      fData.append('product_id', this.formData.product_id)
      fData.append('video_name', this.formData.video_name)
      fData.append('video_description', this.formData.video_description)

      if (this.initialData?.id) {
        fData.append('id', this.initialData.id)
      }

      if (this.formData.product_thumbnail_video instanceof File) {
        fData.append('product_thumbnail_video', this.formData.product_thumbnail_video)
      }

      if (this.formData.product_video instanceof File) {
        fData.append('product_video', this.formData.product_video)
      }

      let apiCall
      if (this.initialData?.id) {
        apiCall = apiServices.updateVideo(this.initialData.id, fData)
      } else {
        apiCall = apiServices.createVideo(fData)
      }

      await apiCall
        .then(() => {
          this.$toast.success('Success save video')
        })
        .catch((e) => {
          this.$toast.error(e.response?.data?.message || e.message || 'Error saving video')
        })
        .finally(() => {
          this.isLoadingSubmit = false
        })
    },
  },
  unmounted() {
    this.revokePreviews()
  },
}
</script>

<style scoped>
/* Optional custom styling */
</style>
