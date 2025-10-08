<template>
  <div v-if="isLoading" class="d-flex justify-content-center">
    <span class="loader"></span>
  </div>

  <template v-else>
    <Form
      :key="infrabook?.uuid || 'newInfrabook'"
      :initial-values="formInit"
      ref="formInfrabook"
      class="form has-overlay"
    >
      <div class="overlay" v-show="loading">
        <div class="d-flex justify-content-center">
          <span class="loader"></span>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12">
          <Field name="uuid" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="uuid"
              readonly
              hidden
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
            <small v-if="meta.touched && errors[0]" class="text-danger">{{ errors[0] }}</small>
          </Field>
        </div>

        <div class="col-6">
          <Field name="name" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="name"
              placeholder="Book Name"
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
            <small v-if="meta.touched && errors[0]" class="text-danger">{{ errors[0] }}</small>
          </Field>
        </div>

        <div class="col-6 d-flex align-items-center">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="autoPoster" v-model="autoPoster" />
            <label class="form-check-label text-light" for="autoPoster">
              Apakah akan generate poster dari PDF?
            </label>
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <label class="form-label">File PDF</label>
            <Field name="file_path" v-slot="{ meta, errors }">
              <input
                class="form-control"
                type="file"
                accept="application/pdf"
                @change="onPdfSelected"
                :class="{
                  'is-invalid': meta.touched && meta.invalid,
                  'is-valid': meta.touched && meta.valid,
                }"
              />
            </Field>
            <small v-if="pdfError" class="text-danger d-block">{{ pdfError }}</small>
          </div>
          <div class="col-6" v-if="!autoPoster">
            <label class="form-label">Poster (Image)</label>
            <Field name="poster_path" v-slot="{ meta }">
              <input
                class="form-control"
                type="file"
                accept="image/*"
                :disabled="autoPoster"
                @change="onImageSelected"
                :class="{
                  'is-invalid': meta.touched && !imageFile && !imagePreviewUrl,
                  'is-valid': imageFile || imagePreviewUrl,
                }"
              />
            </Field>
            <small class="form-text"
              >Pilih gambar poster secara manual jika tidak generate dari PDF.</small
            >
          </div>
        </div>

        <div class="row">
          <div class="col-6" v-if="pdfObjectUrl">
            <div class="form-text mb-1">Preview PDF</div>
            <div class="ratio ratio-16x9 border rounded">
              <iframe :src="pdfObjectUrl" style="border: 0"></iframe>
            </div>
          </div>

          <div class="col-6 text-center" v-if="imagePreviewUrl">
            <div class="form-text mb-1">Preview Poster</div>
            <img
              :src="imagePreviewUrl"
              alt="poster preview"
              class="img-thumbnail rounded border"
              style="height: 325px"
            />
          </div>
        </div>

        <div :class="['d-grid', 'gap-2']">
          <button type="button" class="btn btn-success" @click="submit" :disabled="isSubmit">
            Simpan
          </button>
        </div>
      </div>
    </Form>
  </template>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'

import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import apiServices from '@/services/api.services'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default {
  name: 'InfrabooksFormComponents',
  props: ['isLoading', 'infrabook'],
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      autoPoster: false,
      pdfObjectUrl: null,
      pdfArrayBuffer: null,
      imageFile: null,
      imagePreviewUrl: null,
      pdfError: null,
      pdfBaseUrl: `${import.meta.env.VITE_APP_API_BASEUR}/static/doc`,
      imageBaseUrl: `${import.meta.env.VITE_APP_API_BASEURL}/static/images/infra`,
      type: this.$route.params.uuid,
      isSubmit: false,
      loading: false,
    }
  },

  computed: {
    formInit() {
      return {
        uuid: this.infrabook?.uuid ?? '',
        name: this.infrabook?.name ?? '',
        poster_path: null,
        file_path: null,
      }
    },
  },
  watch: {
    infrabook: {
      immediate: true,
      handler() {
        this.prefillFromInfrabook()
      },
    },
    async autoPoster(val) {
      if (val) {
        if (this.pdfArrayBuffer) {
          this.generatePosterFromPdf(this.extractNameFromUrl(this.pdfObjectUrl || 'document.pdf'))
        } else if (this.pdfObjectUrl) {
          try {
            const res = await fetch(this.pdfObjectUrl, {
              mode: 'cors',
              headers: { origin: 'https://digio.pgn.co.id' },
            })
            if (!res.ok) throw new Error('fetch failed')
            this.pdfArrayBuffer = await res.arrayBuffer()
            this.generatePosterFromPdf(this.extractNameFromUrl(this.pdfObjectUrl))
          } catch (e) {
            this.pdfError =
              'Tidak bisa mengambil PDF untuk generate poster (CORS). Pilih PDF ulang.'
          }
        }
      } else {
        this.imagePreviewUrl = this.buildUrl(
          this.infrabook?.poster_path || this.infrabook?.image || null,
          this.imageBaseUrl,
        )
        this.imageFile = null
        this.$refs.formInfrabook?.setFieldValue?.('poster_path', null)
      }
    },
  },

  methods: {
    prefillFromInfrabook() {
      const book = this.infrabook || {}
      const pdfPath = book.file_path || book.pdf || book.file || null
      if (pdfPath) {
        this.setPdfPreviewUrl(this.buildUrl(pdfPath, this.pdfBaseUrl))
      } else {
        this.setPdfPreviewUrl(null)
      }

      const posterPath = book.poster_path || book.image || null
      this.imagePreviewUrl = this.buildUrl(posterPath, this.imageBaseUrl)
      this.imageFile = null
      this.pdfArrayBuffer = null
      this.pdfError = null
    },

    setPdfPreviewUrl(url) {
      if (this.pdfObjectUrlIsBlob && this.pdfObjectUrl) {
        URL.revokeObjectURL(this.pdfObjectUrl)
      }
      this.pdfObjectUrl = url
      this.pdfObjectUrlIsBlob = url?.startsWith('blob:')
    },

    isAbsoluteUrl(u) {
      return typeof u === 'string' && /^https?:\/\//i.test(u)
    },
    buildUrl(path, base) {
      if (!path) return null
      if (path.startsWith('blob:') || path.startsWith('data:') || this.isAbsoluteUrl(path)) {
        return path
      }
      if (!base) return encodeURI(path)
      const joined = base.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '')
      return encodeURI(joined)
    },
    extractNameFromUrl(u) {
      try {
        const url = new URL(u)
        return url.pathname.split('/').pop() || 'document.pdf'
      } catch (_) {
        return 'document.pdf'
      }
    },
    async onPdfSelected(e) {
      this.pdfError = null
      const file = e.target.files?.[0]
      if (!file) return

      if (file.type !== 'application/pdf') {
        this.pdfError = 'File harus berformat PDF.'
        return
      }
      this.$refs.formInfrabook?.setFieldValue?.('file_path', file)
      const blobUrl = URL.createObjectURL(file)
      this.setPdfPreviewUrl(blobUrl)
      this.pdfArrayBuffer = await file.arrayBuffer()

      if (this.autoPoster) {
        this.generatePosterFromPdf(file.name)
      }
    },
    async generatePosterFromPdf(originalPdfName = 'document.pdf') {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: this.pdfArrayBuffer })
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)

        const desiredWidth = 1200
        const viewport = page.getViewport({ scale: 1 })
        const scale = desiredWidth / viewport.width
        const scaledViewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = Math.floor(scaledViewport.width)
        canvas.height = Math.floor(scaledViewport.height)

        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        this.imagePreviewUrl = dataUrl

        const fileName = originalPdfName.replace(/\.pdf$/i, '') + '_page1.jpg'
        const posterFile = this.dataURLtoFile(dataUrl, fileName, 'image/jpeg')

        this.$refs.formInfrabook?.setFieldValue?.('poster_path', posterFile)
        this.imageFile = posterFile
      } catch (err) {
        console.error(err)
        this.pdfError = 'Gagal men-generate poster dari PDF.'
      }
    },

    // ---------- Poster manual dipilih ----------
    onImageSelected(e) {
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        this.pdfError = 'Poster harus berupa gambar (JPG/PNG).'
        return
      }
      this.imageFile = file
      this.$refs.formInfrabook?.setFieldValue?.('poster_path', file)

      const reader = new FileReader()
      reader.onload = () => (this.imagePreviewUrl = reader.result)
      reader.readAsDataURL(file)
    },

    dataURLtoFile(dataurl, filename, mime = 'image/jpeg') {
      const arr = dataurl.split(',')
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) u8arr[n] = bstr.charCodeAt(n)
      return new File([u8arr], filename, { type: mime })
    },

    // ---------- Submit ----------
    async submit({ resetForm }) {
      this.loading = true
      const vals = this.$refs.formInfrabook.getValues()
      const fd = new FormData()
      fd.append('uuid', vals.uuid || '')
      fd.append('name', vals.name || '')
      if (vals.file_path instanceof File) fd.append('file_path', vals.file_path)
      if (vals.poster_path instanceof File) fd.append('poster_path', vals.poster_path)
      if (this.type === 'add') {
        this.apiAdd(fd, resetForm)
      } else {
        this.apiUpdate(fd, resetForm)
      }
      // ==== DEBUG DI CONSOLE ====
      console.group('FormData debug')
      console.log('has image?', fd.has('poster_path'))
      for (const [key, val] of fd.entries()) {
        if (val instanceof File) {
          console.log(`${key} = File{name:${val.name}, type:${val.type}, size:${val.size}}`)
        } else {
          console.log(`${key} =`, val)
        }
      }
      console.groupEnd()
    },

    async apiAdd(data) {
      apiServices
        .createInfrabook(data)
        .then((res) => {
          this.loading = false
          this.isSubmit = false
          this.$toast.success('201 : Sukses menambahkan infrabooks')
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
    async apiUpdate(data) {
      apiServices
        .updateInfrabook(data)
        .then((res) => {
          this.loading = false
          this.isSubmit = false
          this.$toast.success('201 : Sukses update infrabooks')
          this.$router.go(-2)
        })
        .catch((e) => {
          this.isSubmit = false
          this.loading = false
          const eMessage = `Error : ${e.response.status} - ${e.response.data.code} - ${e.response.data.data}`
          console.log(e)
          this.$toast.error(eMessage)
        })
    },
  },

  beforeUnmount() {
    if (this.pdfObjectUrlIsBlob && this.pdfObjectUrl) URL.revokeObjectURL(this.pdfObjectUrl)
  },
}
</script>

<style scoped>
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
