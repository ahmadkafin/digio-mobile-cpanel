<template>
  <div class="card mx-2 my-2 p-0 h-100">
    <img
      :src="`${baseUrl}/${video.video_thumbnail_path}`"
      class="card-img-top fixed-img"
      :alt="video.video_name"
    />
    <div class="card-body">
      <h5 class="card-title">{{ video.video_name }}</h5>
      <p class="card-text text-muted small clamp-4">{{ video.video_description }}</p>
    </div>
    <ul class="list-group list-group-flush mt-auto">
      <li class="list-group-item success" @click="handleView">
        <font-awesome-icon :icon="['fas', 'eye']" class="me-2" />
        View
      </li>
      <li class="list-group-item warning" @click="handleUpdate">
        <font-awesome-icon :icon="['fas', 'pencil']" class="me-2" />
        Update
      </li>
      <li class="list-group-item danger" @click="handleDelete">
        <font-awesome-icon :icon="['fas', 'trash']" class="me-2" />
        Delete
      </li>
      <li
        class="list-group-item"
        :class="video.isEnable ? 'text-secondary' : 'text-success'"
        @click="handleToggleEnable"
      >
        <font-awesome-icon :icon="['fas', video.isEnable ? 'eye-slash' : 'check']" class="me-2" />
        {{ video.isEnable ? 'Disable' : 'Enable' }}
      </li>
    </ul>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BASE_API_URL as baseUrl } from '@/utils/baseUrl.utils'

export default {
  name: 'VideoCardProducts',
  components: { FontAwesomeIcon },
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      baseUrl,
    }
  },
  methods: {
    handleView() {
      console.log('View clicked for video:', this.video.id)
    },
    handleUpdate() {
      this.$router.push({
        name: 'video-detail',
        params: {
          path: this.video.id,
        },
        state: {
          payload: JSON.parse(JSON.stringify(this.video)),
        },
      })
      console.log('Update clicked for video:', this.video.id)
    },
    handleDelete() {
      this.$emit('deleteVideo', this.video.id)
      console.log('Delete clicked for video:', this.video.id)
    },
    handleToggleEnable() {
      console.log(
        'Toggle enable clicked for video:',
        this.video.id,
        'currently:',
        this.video.isEnable,
      )
      this.$emit('switchEnable', { id: this.video.id, status: !this.video.isEnable })
    },
  },
}
</script>

<style scoped>
.clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
