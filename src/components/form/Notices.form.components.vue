<template>
  <div v-if="isLoading" class="d-flex justify-content-center py-5">
    <span class="loader"></span>
  </div>

  <template v-else>
    <form @submit.prevent="submit" class="form has-overlay text-light">
      <div class="overlay" v-show="loading">
        <div class="d-flex justify-content-center">
          <span class="loader"></span>
        </div>
      </div>

      <div class="row g-3">
        <!-- Notice Type -->
        <div class="col-md-6">
          <label for="notice-type" class="form-label"
            >Notice Type <span class="text-danger">*</span></label
          >
          <select id="notice-type" v-model="form.type" class="form-select">
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>

        <!-- Active Status -->
        <div class="col-md-6 d-flex align-items-end">
          <div class="form-check form-switch mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="notice-isActive"
              v-model="form.isActive"
            />
            <label class="form-check-label" for="notice-isActive">
              {{ form.isActive ? 'Active' : 'Inactive' }}
            </label>
          </div>
        </div>

        <!-- Image Upload & Preview -->
        <div class="col-12" v-if="form.type === 'image'">
          <label class="form-label">Notice Image</label>
          <div
            class="image-box"
            :class="{ 'is-invalid': imageError }"
            @click="$refs.imageInput.click()"
          >
            <img v-if="previewUrl" :src="previewUrl" alt="Notice Preview" @error="onPreviewError" />
            <div v-else class="placeholder-text">
              Klik untuk pilih gambar (Preview sebelum upload)
            </div>
          </div>
          <input
            ref="imageInput"
            type="file"
            class="d-none"
            accept="image/*"
            @change="onImageSelected"
          />
          <div class="d-flex justify-content-between align-items-center mt-2" v-if="previewUrl">
            <small class="text-secondary">Klik kotak gambar di atas untuk mengganti gambar.</small>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="clearImage">
              Hapus Gambar
            </button>
          </div>
          <small v-if="imageError" class="text-danger d-block mt-1">{{ imageError }}</small>
        </div>

        <!-- Captions -->
        <div class="col-12">
          <label for="notice-captions" class="form-label">Captions</label>
          <textarea
            id="notice-captions"
            v-model="form.captions"
            class="form-control"
            rows="3"
            placeholder="Masukkan caption notice (opsional)"
          ></textarea>
        </div>

        <!-- Optional Action Toggle -->
        <div class="col-12 mt-4">
          <div class="card bg-secondary bg-opacity-25 border-secondary p-3">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="enable-action"
                v-model="hasAction"
              />
              <label class="form-check-label fw-bold text-light" for="enable-action">
                Include Action / CTA (Optional)
              </label>
            </div>

            <div v-if="hasAction" class="row g-3 mt-2">
              <!-- Target -->
              <div class="col-md-6">
                <label for="action-target" class="form-label text-light">
                  Target <span class="text-danger">*</span>
                </label>
                <select
                  id="action-target"
                  v-model="actionForm.target"
                  class="form-select"
                  @change="onTargetChange"
                >
                  <option value="" disabled>Pilih Target...</option>
                  <option value="product_detail">product_detail</option>
                  <option value="video_detail">video_detail</option>
                </select>
                <small v-if="targetError" class="text-danger d-block mt-1">{{ targetError }}</small>
              </div>

              <!-- Target ID (from Products or Videos endpoint) -->
              <div class="col-md-6">
                <label for="action-target-id" class="form-label text-light">
                  Target Item (target_id)
                </label>
                <select
                  v-if="actionForm.target === 'product_detail'"
                  id="action-target-id"
                  v-model="actionForm.target_id"
                  class="form-select"
                  :disabled="loadingTargets"
                  @change="onTargetItemSelect"
                >
                  <option value="">-- Pilih Product (Opsional) --</option>
                  <option
                    v-for="prod in productList"
                    :key="prod.uid || prod.id"
                    :value="String(prod.uid || prod.id)"
                  >
                    {{ prod.name }} ({{ prod.uid || prod.id }})
                  </option>
                </select>

                <select
                  v-else-if="actionForm.target === 'video_detail'"
                  id="action-target-id"
                  v-model="actionForm.target_id"
                  class="form-select"
                  :disabled="loadingTargets"
                  @change="onTargetItemSelect"
                >
                  <option value="">-- Pilih Video (Opsional) --</option>
                  <option v-for="vid in videoList" :key="vid.id" :value="String(vid.id)">
                    {{ vid.video_name }} ({{ vid.id }})
                  </option>
                </select>

                <input
                  v-else
                  id="action-target-id"
                  v-model="actionForm.target_id"
                  type="text"
                  class="form-control"
                  placeholder="Pilih target terlebih dahulu"
                  disabled
                />
                <small v-if="loadingTargets" class="text-warning d-block mt-1">
                  Memuat daftar {{ actionForm.target === 'product_detail' ? 'produk' : 'video' }}...
                </small>
              </div>

              <!-- Action Name -->
              <div class="col-md-6">
                <label for="action-name" class="form-label text-light">Name (Opsional)</label>
                <input
                  id="action-name"
                  v-model="actionForm.name"
                  type="text"
                  class="form-control"
                  placeholder="Action name"
                />
              </div>

              <!-- Action Title -->
              <div class="col-md-6">
                <label for="action-title" class="form-label text-light">Title (Opsional)</label>
                <input
                  id="action-title"
                  v-model="actionForm.title"
                  type="text"
                  class="form-control"
                  placeholder="Action title"
                />
              </div>

              <!-- Action URL -->
              <div class="col-md-6">
                <label for="action-url" class="form-label text-light">URL (Opsional)</label>
                <input
                  id="action-url"
                  v-model="actionForm.url"
                  type="text"
                  class="form-control"
                  placeholder="https://..."
                />
              </div>

              <!-- Button Label -->
              <div class="col-md-6">
                <label for="action-button-label" class="form-label text-light">
                  Button Label / CTA (Opsional)
                </label>
                <input
                  id="action-button-label"
                  v-model="actionForm.button_label"
                  type="text"
                  class="form-control"
                  placeholder="Contoh: Lihat Detail"
                />
              </div>

              <!-- Params (JSONB) -->
              <div class="col-12">
                <label for="action-params" class="form-label text-light">
                  Params JSON (Opsional)
                </label>
                <textarea
                  id="action-params"
                  v-model="actionForm.paramsText"
                  class="form-control font-monospace"
                  rows="3"
                  placeholder='{"key": "value"}'
                  :class="{ 'is-invalid': paramsError }"
                ></textarea>
                <small v-if="paramsError" class="text-danger d-block mt-1">{{ paramsError }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 d-grid gap-2 mt-4">
          <button type="submit" class="btn btn-success" :disabled="loading">Simpan Notice</button>
        </div>
      </div>
    </form>
  </template>
</template>

<script>
import apiServices from '@/services/api.services'
import { BASE_API_URL as baseUrl } from '@/utils/baseUrl.utils'

export default {
  name: 'NoticesFormComponents',
  props: ['isLoading', 'notice'],
  data() {
    return {
      routeUuid: this.$route.params.uuid,
      loading: false,
      loadingTargets: false,
      form: {
        id: '',
        type: 'text',
        captions: '',
        isActive: true,
      },
      imageFile: null,
      previewUrl: '',
      imageError: '',
      hasAction: false,
      targetError: '',
      paramsError: '',
      actionForm: {
        target: 'product_detail',
        target_id: '',
        name: '',
        title: '',
        url: '',
        button_label: '',
        paramsText: '',
      },
      productList: [],
      videoList: [],
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchVideos()
    this.initFromNotice()
  },
  watch: {
    notice: {
      immediate: true,
      deep: true,
      handler() {
        this.initFromNotice()
      },
    },
  },
  methods: {
    initFromNotice() {
      if (!this.notice || typeof this.notice !== 'object') return

      this.form.id = this.notice.id || ''
      this.form.type = this.notice.type || 'text'
      this.form.captions = this.notice.captions ?? ''
      this.form.isActive = this.notice.isActive !== undefined ? Boolean(this.notice.isActive) : true

      this.revokeBlob()
      if (this.notice.image && this.notice.image !== 'null') {
        this.previewUrl = this.resolveImageUrl(this.notice.image)
      } else {
        this.previewUrl = ''
      }

      const rawAction =
        this.notice.actions ||
        this.notice.action ||
        this.notice.NoticeAction ||
        this.notice.notice_action ||
        (this.notice.target ? this.notice : null)
      let act = Array.isArray(rawAction) ? rawAction[0] : rawAction
      if (typeof act === 'string') {
        try {
          act = JSON.parse(act)
        } catch (_) {
          act = null
        }
      }

      if (act && typeof act === 'object' && act.target) {
        this.hasAction = true
        this.actionForm.target = act.target || 'product_detail'
        this.actionForm.target_id = act.target_id ? String(act.target_id) : ''
        this.actionForm.name = act.name ?? ''
        this.actionForm.title = act.title ?? ''
        this.actionForm.url = act.url ?? ''
        this.actionForm.button_label = act.button_label ?? ''
        this.actionForm.paramsText =
          act.params !== null && act.params !== undefined
            ? typeof act.params === 'string'
              ? act.params
              : JSON.stringify(act.params, null, 2)
            : ''
      } else {
        this.hasAction = false
      }
    },
    resolveImageUrl(img) {
      if (!img) return ''
      if (/^https?:\/\//i.test(img) || img.startsWith('blob:') || img.startsWith('data:')) {
        return img
      }
      const clean = String(img).replace(/^\//, '')
      if (clean.startsWith('static/')) {
        return `${baseUrl}/${clean}`
      }
      return `${baseUrl}/static/notice/${clean}`
    },
    onPreviewError(event) {
      if (!this.notice?.image || event.target.dataset.fallbackTried) return
      event.target.dataset.fallbackTried = 'true'
      const clean = String(this.notice.image).replace(/^\//, '')
      event.target.src = `${baseUrl}/${clean}`
    },
    fetchProducts() {
      this.loadingTargets = true
      apiServices
        .getProducts()
        .then((res) => {
          this.productList = Array.isArray(res.data?.data) ? res.data.data : []
        })
        .catch(() => {
          this.productList = []
        })
        .finally(() => {
          this.loadingTargets = false
        })
    },
    fetchVideos() {
      const query = {
        page: 1,
        paginate: 100,
        orderBy: 'created_at',
        sortBy: 'DESC',
        productId: '',
      }
      apiServices
        .fetchVideoFeed(query, '')
        .then((res) => {
          this.videoList = Array.isArray(res.data?.data?.docs) ? res.data.data.docs : []
        })
        .catch(() => {
          this.videoList = []
        })
    },
    onTargetChange() {
      this.actionForm.target_id = ''
      this.targetError = ''
    },
    onTargetItemSelect() {
      const selectedId = this.actionForm.target_id
      if (!selectedId) return

      if (this.actionForm.target === 'product_detail') {
        const found = this.productList.find((p) => String(p.uid || p.id) === String(selectedId))
        if (found) {
          this.actionForm.name = found.name || ''
          this.actionForm.title = found.name || ''
        }
      } else if (this.actionForm.target === 'video_detail') {
        const found = this.videoList.find((v) => String(v.id) === String(selectedId))
        if (found) {
          this.actionForm.name = found.video_name || ''
          this.actionForm.title = found.video_name || ''
        }
      }
    },
    onImageSelected(e) {
      this.imageError = ''
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        this.imageError = 'File harus berupa gambar (JPG/PNG/WEBP).'
        return
      }
      this.imageFile = file
      this.revokeBlob()
      this.previewUrl = URL.createObjectURL(file)
    },
    clearImage() {
      this.imageFile = null
      this.revokeBlob()
      this.previewUrl = ''
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = ''
      }
    },
    revokeBlob() {
      if (this.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.previewUrl)
      }
    },
    async submit() {
      this.imageError = ''
      this.targetError = ''
      this.paramsError = ''

      if (this.form.type === 'image' && !this.imageFile && !this.previewUrl) {
        this.imageError = 'Silakan pilih gambar untuk notice bertipe image.'
        return
      }

      let parsedParams = null
      if (this.hasAction) {
        if (!this.actionForm.target) {
          this.targetError = 'Target wajib dipilih.'
          return
        }
        const trimmedParams = (this.actionForm.paramsText || '').trim()
        if (trimmedParams) {
          try {
            parsedParams = JSON.parse(trimmedParams)
          } catch (_) {
            this.paramsError = 'Format JSON pada Params tidak valid.'
            return
          }
        }
      }

      const fData = new FormData()
      if (this.routeUuid !== 'add' && (this.form.id || this.routeUuid)) {
        fData.append('id', this.form.id || this.routeUuid)
      }
      fData.append('type', this.form.type)
      fData.append('captions', this.form.captions ?? '')
      fData.append('isActive', String(this.form.isActive))

      if (this.form.type === 'image' && this.imageFile instanceof File) {
        fData.append('notice_image', this.imageFile)
      }

      if (this.hasAction) {
        fData.append('target', this.actionForm.target)
        if (this.actionForm.target_id) fData.append('target_id', this.actionForm.target_id)
        if (this.actionForm.name) fData.append('name', this.actionForm.name)
        if (this.actionForm.title) fData.append('title', this.actionForm.title)
        if (this.actionForm.url) fData.append('url', this.actionForm.url)
        if (this.actionForm.button_label) fData.append('button_label', this.actionForm.button_label)
        if (parsedParams !== null) {
          fData.append(
            'params',
            typeof parsedParams === 'object' ? JSON.stringify(parsedParams) : parsedParams,
          )
        }
      }

      this.loading = true
      const request =
        this.routeUuid === 'add' ? apiServices.createNotice(fData) : apiServices.updateNotice(fData)

      request
        .then(() => {
          this.loading = false
          this.$toast.success(
            this.routeUuid === 'add'
              ? '201 : Sukses menambahkan notice'
              : '200 : Sukses update notice',
          )
          this.$router.go(-1)
        })
        .catch((e) => {
          this.loading = false
          const status = e.response?.data?.status || e.response?.status || 500
          const msg =
            e.response?.data?.message ||
            e.response?.data?.resp ||
            e.response?.data?.data ||
            e.message
          this.$toast.error(`Error : ${status} - ${msg}`)
        })
    },
  },
  beforeUnmount() {
    this.revokeBlob()
  },
}
</script>

<style scoped>
.image-box {
  width: 100%;
  height: 240px;
  border: 1px dashed #ced4da;
  border-radius: 0.5rem;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.image-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #212529;
}
.image-box.is-invalid {
  border-color: #dc3545;
}
.placeholder-text {
  color: #6c757d;
  font-size: 0.95rem;
}
.form.has-overlay {
  position: relative;
  overflow: hidden;
}
.form .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  backdrop-filter: blur(2px);
}
</style>
