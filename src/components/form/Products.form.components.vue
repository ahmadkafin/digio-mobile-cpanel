<template>
  <div v-if="isLoading" class="d-flex justify-content-center">
    <span class="loader"></span>
  </div>

  <template v-else>
    <Form
      :key="product?.uid || 'newProducts'"
      :initial-values="formInit"
      @submit="submit"
      ref="formProducts"
      class="form has-overlay"
    >
      <div class="overlay" v-show="loading">
        <div class="d-flex justify-content-center">
          <span class="loader"></span>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <Field name="uid" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="uid"
              readonly
              hidden
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
            <small v-if="meta.touched && errors[0]" class="text-danger">
              {{ errors[0] }}
            </small>
          </Field>
        </div>
        <!-- IMAGE -->

        <div class="col-12 mb-3">
          <Field name="image" v-slot="{ field, meta, errors }">
            <div>
              <div
                class="image-box"
                :class="{
                  'is-invalid': meta.touched && meta.invalid,
                  'is-valid': meta.touched && meta.valid,
                }"
                @click="$refs.imageInput.click()"
              >
                <img v-if="previewUrl" :src="previewUrl" alt="Preview" />
                <div v-else class="placeholder">Klik untuk pilih gambar</div>
              </div>

              <input
                ref="imageInput"
                type="file"
                class="d-none"
                accept="image/*"
                @change="onFileChange($event, field)"
              />

              <small v-if="meta.touched && errors[0]" class="text-danger">{{ errors[0] }}</small>
            </div>
          </Field>
        </div>

        <div class="col-6">
          <Field name="name" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="name"
              placeholder="Product Name"
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
            <small v-if="meta.touched && errors[0]" class="text-danger">
              {{ errors[0] }}
            </small>
          </Field>
        </div>

        <div class="col-6">
          <Field name="video" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="video"
              placeholder="Youtube Video"
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
            <small v-if="meta.touched && errors[0]" class="text-danger">
              {{ errors[0] }}
            </small>
          </Field>
        </div>

        <div class="col-12 mt-4 mb-5">
          <Field name="description" v-slot="{ field, meta, errors }">
            <div :class="['quill-wrap', { 'is-invalid': meta.touched && meta.invalid }]">
              <QuillEditor
                :key="quilProductsKey"
                theme="snow"
                :content="field.value"
                content-type="html"
                @update:content="(val) => field.onChange(val)"
                @blur="field.onBlur"
              />
            </div>
          </Field>
        </div>
      </div>

      <div :class="['d-grid', 'gap-2']">
        <button class="btn btn-success btn-sm" :disabled="isSubmit">Submit</button>
      </div>
    </Form>
  </template>
</template>
<script>
import apiServices from '@/services/api.services'
import { QuillEditor } from '@vueup/vue-quill'
import { Form, ErrorMessage, Field } from 'vee-validate'
import * as yup from 'yup'

const escapeHtml = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s ?? '')

export default {
  name: 'ProductsFormComponents',
  props: ['isLoading', 'product'],
  components: {
    Form,
    Field,
    ErrorMessage,
    QuillEditor,
  },
  mounted() {
    this.setInitialPreview()
  },
  watch: {
    product: {
      immediate: true,
      deep: true,
      handler() {
        this.setInitialPreview()
      },
    },
  },
  computed: {
    formInit() {
      return {
        uid: this.product?.uid ?? '',
        name: this.product?.name ?? '',
        video: this.product?.video && this.product.video !== 'null' ? this.product.video : '',
        description: this.legacyToHtml(this.product?.description ?? ''),
        image: null,
      }
    },
  },
  data() {
    return {
      type: this.$route.params.uuid,
      previewUrl: '',
      isSubmit: false,
      loading: false,
      quilProductsKey: 0,
    }
  },
  methods: {
    setInitialPreview() {
      this.revokeBlob()
      const img = this.product?.image
      if (img && img !== 'null') {
        this.previewUrl = `https://digio.pgn.co.id/digiomobilebe/static/images/products/${img}`
      } else {
        this.previewUrl = ''
      }
    },
    onFileChange(e, field) {
      const file = e.target.files?.[0]
      if (file) {
        field.onChange(file) // update value Vee-Validate
        this.revokeBlob()
        this.previewUrl = URL.createObjectURL(file) // tampilkan preview
      } else {
        field.onChange(null)
        this.revokeBlob()
        this.previewUrl = ''
      }
    },
    revokeBlob() {
      if (this.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(this.previewUrl)
    },
    legacyToHtml(raw) {
      if (!raw) return ''
      if (looksLikeHtml(raw)) return raw // kalau sudah HTML, langsung pakai

      const text = raw.replace(/\\n/g, '\n') // jika \n masih escaped
      const lines = text.split('\n')

      let html = ''
      let inList = false

      for (const line of lines) {
        const t = line.trim()
        const bul = t.match(/^<bul>\s*(.*)$/i) // marker bullet
        if (bul) {
          if (!inList) {
            html += '<ul>'
            inList = true
          }
          html += `<li>${escapeHtml(bul[1])}</li>`
        } else {
          if (inList) {
            html += '</ul>'
            inList = false
          }
          if (t) html += `<p>${escapeHtml(t)}</p>`
          else html += '<p><br></p>' // baris kosong
        }
      }
      if (inList) html += '</ul>'
      return html
    },
    async submit(data, { resetForm }) {
      const fData = new FormData()
      fData.append('uid', data.uid)
      fData.append('name', data.name)
      fData.append('video', data.video)
      fData.append('description', data.description)
      if (data.image instanceof File) {
        fData.append('image', data.image)
      }
      this.loading = true

      if (this.type === 'add') {
        this.apiAdd(fData, resetForm)
      } else {
        this.apiUpdate(fData, resetForm)
      }

      // ==== DEBUG DI CONSOLE ====
      //   console.group('FormData debug')
      //   console.log('has image?', fData.has('image'))
      //   for (const [key, val] of fData.entries()) {
      //     if (val instanceof File) {
      //       console.log(`${key} = File{name:${val.name}, type:${val.type}, size:${val.size}}`)
      //     } else {
      //       console.log(`${key} =`, val)
      //     }
      //   }
      //   console.groupEnd()
    },
    async apiAdd(data, resetForm) {
      apiServices
        .storeProducts(data)
        .then((res) => {
          this.loading = false
          this.isSubmit = false
          this.$toast.success('201 : Sukses menambahkan produk')

          resetForm()
          if (this.$refs.imageInput) this.$refs.imageInput.value = ''
          this.revokeBlob()
          this.setInitialPreview()
          this.quilProductsKey++
        })
        .catch((e) => {
          this.isSubmit = false
          this.loading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.message}`
          console.log(e)
          this.$toast.error(eMessage)
        })
    },
    async apiUpdate(data, resetForm) {
      apiServices
        .updateProducts(data)
        .then((res) => {
          this.loading = false
          this.isSubmit = false
          this.$toast.success('200 : Sukses update produk')
          this.$router.go(-1)
        })
        .catch((e) => {
          this.isSubmit = false
          this.loading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.message}`
          console.log(e)
          this.$toast.error(eMessage)
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
  height: 220px; /* tinggi fix */
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
  object-fit: cover;
}
.image-box.is-invalid {
  border-color: #dc3545;
}
.image-box.is-valid {
  border-color: #198754;
}
.placeholder {
  color: #6c757d;
  font-size: 0.9rem;
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

.form .overlay {
  opacity: 1;
  transition: opacity 0.2s ease;
}
.form .overlay[style*='display: none'] {
  opacity: 0;
}
</style>
