<template>
  <div class="row">
    <div class="col-12">
      <div class="px-2">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search notices..."
            id="search-notice-value"
            :value="searchValue"
            v-debounce:500ms="searchData"
          />
          <span class="input-group-text" id="basic-addon">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </span>
        </div>
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
              <span class="placeholder col-6"></span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mx-auto" v-else>
      <div v-if="noData" class="text-center text-light w-100 py-4">No Data</div>
      <div v-else-if="notices.length === 0" class="text-center text-light w-100 py-4">
        <p>Tidak ada notice ditemukan.</p>
      </div>
      <template v-else v-for="item in notices" :key="item.id || item">
        <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
          <div class="card mx-2 my-2 p-0 h-100 d-flex flex-column">
            <img
              v-if="item.type === 'image' && item.image"
              :src="resolveImageUrl(item.image)"
              class="card-img-top fixed-img"
              :alt="item.captions || 'notice image'"
              @error="onImgError($event, item.image)"
            />
            <div
              v-else
              class="fixed-img d-flex align-items-center justify-content-center bg-secondary text-white px-3 text-center"
            >
              <span class="fw-semibold">{{ item.captions || 'Text Notice' }}</span>
            </div>

            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-info text-dark text-uppercase">{{
                  item.type || 'text'
                }}</span>
                <span class="badge" :class="item.isActive ? 'bg-success' : 'bg-secondary'">
                  {{ item.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <p class="card-text clamp-4 mb-2">
                {{ item.captions || '-' }}
              </p>

              <div v-if="getNoticeAction(item)" class="mt-auto pt-2 border-top small text-muted">
                <div><strong>Target:</strong> {{ getNoticeAction(item).target }}</div>
                <div v-if="getNoticeAction(item).title || getNoticeAction(item).name">
                  <strong>Title:</strong>
                  {{ getNoticeAction(item).title || getNoticeAction(item).name }}
                </div>
                <div v-if="getNoticeAction(item).button_label">
                  <strong>Button:</strong> {{ getNoticeAction(item).button_label }}
                </div>
              </div>
            </div>

            <ul class="list-group list-group-flush mt-auto">
              <li class="list-group-item warning" @click="goToForm(item)">
                <font-awesome-icon :icon="['fas', 'pencil']" class="me-2" />
                Update
              </li>
              <li
                class="list-group-item"
                :class="item.isActive ? 'text-secondary' : 'text-success'"
                @click="apiSwitch(item)"
              >
                <font-awesome-icon
                  :icon="['fas', item.isActive ? 'eye-slash' : 'check']"
                  class="me-2"
                />
                {{ item.isActive ? 'Deactivate' : 'Activate' }}
              </li>
              <li class="list-group-item danger" @click="apiDelete(item.id)">
                <font-awesome-icon :icon="['fas', 'trash']" class="me-2" />
                Delete
              </li>
            </ul>
          </div>
        </div>
      </template>

      <!-- Pagination -->
      <div class="d-flex justify-content-center mt-4 mb-3" v-if="totalPages >= 1">
        <nav aria-label="Notice Pagination">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage <= 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { BASE_API_URL as baseUrl } from '@/utils/baseUrl.utils'

export default {
  name: 'NoticesComponents',
  components: { FontAwesomeIcon },
  props: {
    notices: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    noData: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      searchValue: '',
      baseUrl,
    }
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit('changePage', page)
      }
    },
    searchData() {
      const el = document.getElementById('search-notice-value')
      const value = el ? el.value : ''
      this.searchValue = value
      this.$emit('searchData', value)
    },
    getNoticeAction(item) {
      if (!item) return null
      const act = item.actions || item.action || item.NoticeAction || item.notice_action || null
      if (Array.isArray(act)) return act[0] || null
      if (typeof act === 'string') {
        try {
          return JSON.parse(act)
        } catch (_) {
          return null
        }
      }
      if (act && typeof act === 'object' && act.target) return act
      if (item.target) {
        return {
          target: item.target,
          target_id: item.target_id,
          name: item.name,
          title: item.title,
          url: item.url,
          button_label: item.button_label,
          params: item.params,
        }
      }
      return null
    },
    resolveImageUrl(img) {
      if (!img) return ''
      if (/^https?:\/\//i.test(img) || img.startsWith('blob:') || img.startsWith('data:')) {
        return img
      }
      const clean = String(img).replace(/^\//, '')
      if (clean.startsWith('static/')) {
        return `${this.baseUrl}/${clean}`
      }
      return `${this.baseUrl}/static/notice/${clean}`
    },
    onImgError(event, img) {
      if (!img || event.target.dataset.fallbackTried) return
      event.target.dataset.fallbackTried = 'true'
      const clean = String(img).replace(/^\//, '')
      event.target.src = `${this.baseUrl}/${clean}`
    },
    goToForm(item) {
      this.$emit('goTo', item)
    },
    apiSwitch(item) {
      this.$emit('apiSwitch', item)
    },
    apiDelete(id) {
      this.$emit('apiDelete', id)
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
</style>
