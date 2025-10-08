<template>
  <div
    class="modal fade"
    id="modalOverride"
    tabindex="-1"
    aria-labelledby="modalOverrideLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content bg-dark">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-light" id="modalOverrideLabel">Tambah Override</h1>
          <button type="button" data-bs-dismiss="modal" class="btn-close" aria-label="Close">
            <font-awesome-icon :icon="['fas', 'xmark-circle']" />
          </button>
        </div>
        <Form ref="formStandalone" :initial-values="formInit" @submit="createMenuParent">
          <div class="modal-body">
            <div class="col-12 mb-3">
              <Field name="group_name" v-slot="{ field, meta, errors }">
                <input v-bind="field" type="text" class="form-control" readonly />
              </Field>
            </div>

            <!-- dropdown override -->
            <template v-if="!isNotOverride">
              <div class="col-12 mb-3">
                <Field name="name" v-slot="{ field, meta, errors }">
                  <select
                    v-bind="field"
                    id="name"
                    class="form-select"
                    :disabled="isNotOverride ? true : false"
                  >
                    <option value="" selected disabled>Select Override</option>
                    <option
                      :value="{
                        uuid: item.uuid,
                        name: item.name,
                        digio_menu_id: item.digio_menu_id,
                      }"
                      v-for="item in override"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </Field>
              </div>
            </template>
            <!-- end of dropdown override -->

            <!-- checkbox -->
            <div class="col-12">
              <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                <input
                  type="checkbox"
                  class="btn-check"
                  id="btncheckIsNotOverride"
                  autocomplete="off"
                  @click="changeOverride"
                />
                <label class="btn btn-outline-primary" for="btncheckIsNotOverride">
                  Override Tidak Ada?
                </label>

                <input type="checkbox" class="btn-check" id="btnIfHaveChild" autocomplete="off" />
                <label class="btn btn-outline-primary" for="btnIfHaveChild"> Have Child? </label>
              </div>
            </div>
            <!-- end of checkbox -->

            <template v-if="isNotOverride">
              <div class="col-12 mt-2">
                <Field name="name" v-slot="{ field, meta, errors }">
                  <input type="text" class="form-control" placeholder="name" v-bind="field" />
                </Field>
              </div>
            </template>
          </div>

          <div class="col-12 px-3 mb-2">
            <Field name="menu_type" v-slot="{ field }">
              <label for="menuType">Menu Type</label>
              <select id="menuType" class="form-select" v-bind="field" @change="changeUrlToNative">
                <option value="0" selected disabled>Select Type</option>
                <option value="@native">@native</option>
                <option value="@webview">@webview</option>
              </select>
            </Field>
          </div>

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

                <small v-if="meta.touched && errors[0]" class="text-danger">{{ errors[0] }}</small>
              </div>
            </Field>
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
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Form, ErrorMessage, Field } from 'vee-validate'

export default {
  name: 'OverrideModal',
  components: { FontAwesomeIcon, Form, Field },
  props: ['override', 'groupName'],
  watch: {
    groupName: {
      immediate: true,
      handler(newVal) {
        this.group_name = newVal?.name || ''
        this.group_uuid = newVal?.uuid || ''

        this.$nextTick(() => {
          if (this.$refs.formStandalone?.setFieldValue) {
            this.$refs.formStandalone.setFieldValue('group_name', this.group_name)
            this.$refs.formStandalone.setFieldValue('group_uid', this.group_uuid)
          }
        })
      },
    },
  },
  computed: {
    formInit() {
      return {
        uuid: '',
        group_name: '',
        name: this.override?.name || '',
        image: null,
        menu_type: '0',
      }
    },
  },
  data() {
    return {
      group_name: '',
      group_uuid: '',
      menu: '0',
      isNotOverride: false,
    }
  },
  methods: {
    changeOverride() {
      this.isNotOverride = !this.isNotOverride
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
    createMenuParent(data) {
      const fData = new FormData()
      const name = !this.isNotOverride ? data.name.name : data.name

      fData.append('parent_menu_id', '0')
      fData.append('group_uid', data.group_name)
      fData.append('name', name)
      fData.append('url', '#')
      fData.append('x', '#')
      fData.append('y', '#')
      fData.append('level', 0)
      fData.append('has_child', true)
      fData.append('is_active', true)
      fData.append('type', name)
      fData.append('mapping_menu_id', !this.isNotOverride ? data.name.uuid : null)
      fData.append('menu_type', data.menu_type)

      if (data.image instanceof File) {
        fData.append('image', data.image)
      }

      apiServices
        .createStandAlone(fData)
        .then((res) => {
          this.$toast.success('201 - Berhasil menambahkan menu')
          this.$emit('fetchMenu')
        })
        .catch((e) => {
          this.isLoading = false
          this.loading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.$toast.error(eMessage)
        })

      // ==== DEBUG DI CONSOLE ====
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
</style>
