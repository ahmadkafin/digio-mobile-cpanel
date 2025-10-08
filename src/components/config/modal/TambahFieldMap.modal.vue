<template>
  <div
    class="modal fade"
    id="fieldmapmodal"
    tabindex="-1"
    aria-labelledby="fieldmapmodalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-dark">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-light" id="fieldmapmodalLabel">Tambah FieldMap</h1>
          <button type="button" data-bs-dismiss="modal" class="btn-close" aria-label="Close">
            <font-awesome-icon :icon="['fas', 'xmark-circle']" />
          </button>
        </div>
        <Form ref="fieldmapForm" :initial-values="formInit" @submit="submitFieldMap">
          <div class="modal-body has-overlay">
            <!-- loading -->
            <div class="overlay" v-show="isLoading">
              <div class="d-flex justify-content-center">
                <span class="loader"></span>
              </div>
            </div>
            <!-- end loading -->

            <!-- name -->
            <div class="row mb-4">
              <div class="col-12">
                <label for="name" class="text-light">Menu Name</label>
                <div class="input-group mb-3">
                  <Field name="name" v-slot="{ field }">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Display Name on Digio Mobile"
                      v-bind="field"
                      aria-describedby="addon-name"
                      required
                    />
                  </Field>
                  <span
                    :class="[
                      'input-group-text',
                      'based-on-digio',
                      isOverrideFromDigio ? 'active' : 'inactive',
                    ]"
                    id="addon-name"
                    @click="changeBaseOnDigio"
                  >
                    Base on DIGIO menu?
                  </span>
                </div>
              </div>
            </div>
            <!-- end of name -->

            <DigioMenuHelperFormComponents
              :rootParentId="0"
              @pick="handlePick($event)"
              v-show="isOverrideFromDigio"
            />

            <!-- url -->
            <div class="row mb-4" v-if="!isOverrideFromDigio">
              <div class="col-12">
                <label for="url" class="text-light">Full URL</label>
                <Field name="url" v-slot="{ field }">
                  <input type="text" class="form-control" placeholder="URL" v-bind="field" />
                </Field>
              </div>
            </div>
            <!-- end of url -->

            <template v-else>
              <div class="row mb-4">
                <div class="col-sm-12 col-md-6">
                  <label for="digio_menu_name" class="text-light">Digio Menu Name</label>
                  <Field name="digio_menu_name" v-slot="{ field }">
                    <input
                      type="text"
                      class="form-control"
                      v-bind="field"
                      readonly
                      placeholder="Digio Menu Name"
                    />
                  </Field>
                </div>
                <div class="col-sm-12 col-md-6">
                  <label for="digio_menu_id" class="text-light">Digio Menu ID</label>
                  <Field name="digio_menu_id" v-slot="{ field }">
                    <input
                      type="text"
                      class="form-control"
                      v-bind="field"
                      readonly
                      placeholder="Digio Menu ID"
                    />
                  </Field>
                </div>
              </div>
            </template>

            <!-- icon -->
            <div class="row">
              <div class="col-12 mb-3 px-3">
                <Field name="image" v-slot="{ field, meta, errors }">
                  <label for="image" class="text-light">Icon</label>
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
                    <small v-if="meta.touched && errors[0]" class="text-danger">
                      {{ errors[0] }}
                    </small>
                  </div>
                </Field>
              </div>
            </div>
            <!-- end of icon -->
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button class="btn btn-primary">Save</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import DigioMenuHelperFormComponents from '@/components/form/helper/DigioMenu.helper.form.components.vue'
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Field, Form, ErrorMessage } from 'vee-validate'

export default {
  name: 'TambahFieldMapModal',
  components: { FontAwesomeIcon, Form, Field, DigioMenuHelperFormComponents },
  computed: {
    formInit() {
      return { name: '', url: null, image: null, digio_menu_id: null, digio_menu_name: null }
    },
  },
  data() {
    return {
      picked: null,
      isOverrideFromDigio: false,
      isLoading: false,
    }
  },
  methods: {
    // image handler
    onFileChange(e, field) {
      const file = e.target.files?.[0]
      if (file) {
        field.onChange(file)
        this.revokeBlob()
        this.previewUrl = URL.createObjectURL(file)
      } else {
        field.onChange(null)
        this.revokeBlob()
        this.previewUrl = ''
      }
    },
    revokeBlob() {
      if (this.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(this.previewUrl)
    },
    changeBaseOnDigio() {
      this.isOverrideFromDigio = !this.isOverrideFromDigio
    },
    // call api
    submitFieldMap(data, { resetForm }) {
      const fData = new FormData()
      this.isLoading = true
      fData.append('name', data.name)
      fData.append('url', data.url ?? null)
      fData.append('digio_menu_id', data.digio_menu_id ?? null)

      if (data.image instanceof File) {
        fData.append('image', data.image)
      }
      // // ==== DEBUG DI CONSOLE ====
      // console.group('FormData debug')
      // console.log('has image?', fData.has('image'))
      // for (const [key, val] of fData.entries()) {
      //   if (val instanceof File) {
      //     console.log(`${key} = File{name:${val.name}, type:${val.type}, size:${val.size}}`)
      //   } else {
      //     console.log(`${key} =`, val)
      //   }
      // }
      // console.groupEnd()
      apiServices
        .createFieldMap(fData)
        .then((res) => {
          this.isLoading = false
          this.$toast.success('201 - Berhasil menambahkan fieldmap')
          this.$emit('fetchMenuFieldMap')
          resetForm()
          this.revokeBlob()
          this.setInitialPreview()
        })
        .catch((e) => {
          this.isLoading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.$toast.error(eMessage)
        })
    },
    handlePick(value) {
      this.picked = value
      const label = value.label
      const digio_menu_id = value.menuid
      const form = this.$refs.fieldmapForm
      if (form?.setFieldValue) {
        form.setFieldValue('digio_menu_id', digio_menu_id)
        form.setFieldValue('digio_menu_name', label)
      }
    },
  },
  beforeUnmount() {
    this.revokeBlob()
  },
}
</script>

<style scoped>
.btn-close {
  color: white !important;
  --bs-btn-close-bg: url();
  margin-bottom: 0px;
}

.btn-close > .svg-inline--fa.fa-circle-xmark {
  height: 2em;
}

.modal-body.has-overlay {
  position: relative;
  overflow: hidden;
}

.modal-body .overlay {
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

.modal-body .overlay {
  opacity: 1;
  transition: opacity 0.2s ease;
}
.modal-body .overlay[style*='display: none'] {
  opacity: 0;
}

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

.based-on-digio {
  cursor: pointer;
}

.based-on-digio.inactive:hover {
  background-color: #ff9a2e;
  color: white;
}

.based-on-digio.active {
  background-color: #ff9a2e;
  color: white;
}

.based-on-digio.active:hover {
  background-color: #f8f9fa;
  color: black;
}
</style>
