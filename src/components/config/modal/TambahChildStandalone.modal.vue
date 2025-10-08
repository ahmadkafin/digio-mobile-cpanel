<template>
  <div
    class="modal fade"
    id="modalChildStandalone"
    tabindex="-1"
    aria-labelledby="modalChildStandaloneLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content bg-dark">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-light" id="modalChildStandaloneLabel">Add Child</h1>

          <button type="button" data-bs-dismiss="modal" class="btn-close" aria-label="Close">
            <font-awesome-icon :icon="['fas', 'xmark-circle']" />
          </button>
        </div>

        <Form ref="formChildStandalone" :initial-values="formInit" @submit="createMenuChild">
          <!-- <div class="modal-body" v-if="!isLoading">
            <div class="d-flex justify-content-center">
              <span class="loader"></span>
            </div>
          </div> -->

          <div class="modal-body has-overlay">
            <div class="overlay" v-show="isLoading">
              <div class="d-flex justify-content-center">
                <span class="loader"></span>
              </div>
            </div>

            <!-- group -->
            <div class="row">
              <div class="col-12">
                <Field name="group_uid" v-slot="{ field, meta, errors }">
                  <input
                    v-bind="field"
                    type="text"
                    id="group_uid"
                    class="form-control"
                    readonly
                    hidden
                  />
                </Field>
              </div>
              <div class="col-12">
                <Field name="group_name" v-slot="{ field, meta, errors }">
                  <label for="group_name" class="text-light">Group Name</label>
                  <input v-bind="field" type="text" class="form-control" readonly />
                </Field>
              </div>
            </div>
            <!-- end of group -->

            <!-- menu name -->
            <div class="row" v-if="!is_child">
              <div class="col-12 mb-3">
                <Field name="menu_uuid" v-slot="{ field, meta, errors }">
                  <input
                    v-bind="field"
                    type="text"
                    id="menu_uuid"
                    class="form-control"
                    readonly
                    hidden
                  />
                </Field>
              </div>
              <div class="col-12 mb-3">
                <Field name="menu_name" v-slot="{ field, meta, errors }">
                  <label for="menu_name" class="text-light">Menu Parent Name</label>
                  <input v-bind="field" type="text" class="form-control" readonly />
                </Field>
              </div>
            </div>

            <div class="row mt-3" v-else>
              <div class="col-12">
                <Field name="menu" v-slot="{ field }">
                  <label for="menu" class="text-light">Menu Parent Name</label>
                  <select id="menuDropDown" v-bind="field" class="form-select">
                    <option value="0" disabled selected>Select Menu</option>
                    <option
                      :value="{ uuid: item.uuid, name: item.name }"
                      v-for="item in parent_menus"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </Field>
              </div>
            </div>
            <!-- end of menu name -->
            <hr />

            <!-- check for is child and has child -->
            <div class="row">
              <div class="col-sm-12 col-md-6 mb-3">
                <Field
                  name="has_child"
                  type="checkbox"
                  v-slot="{ field }"
                  :value="true"
                  :unchecked-value="false"
                >
                  <div
                    class="btn-group d-grid"
                    role="group"
                    aria-label="Basic checkbox toggle button group"
                  >
                    <input
                      v-bind="field"
                      type="checkbox"
                      class="btn-check"
                      :id="idHasChild"
                      autocomplete="off"
                      :disabled="is_child ? true : false"
                      @change="changeIsParent"
                    />
                    <label class="btn btn-outline-primary" :for="idHasChild"> Is Parent? </label>
                  </div>
                </Field>
              </div>

              <div class="col-sm-12 col-md-6 mb-3">
                <div
                  class="btn-group d-grid"
                  role="group"
                  aria-label="Basic checkbox toggle button group"
                >
                  <input
                    type="checkbox"
                    class="btn-check"
                    autocomplete="off"
                    id="isChild"
                    @change="changeIsChild"
                    :disabled="is_parent ? true : false"
                  />
                  <label class="btn btn-outline-primary" for="isChild"> Is Child? </label>
                </div>
              </div>
            </div>
            <!-- end for check for is child and has child -->

            <div class="row">
              <div class="col-sm-12 col-md-12 mb-3">
                <Field name="name" v-slot="{ field, meta, errors }">
                  <label for="name" class="text-light">Menu Name</label>
                  <input v-bind="field" type="text" class="form-control" placeholder="Menu Name" />
                </Field>
              </div>
            </div>

            <div class="row mb-2">
              <div :class="[!is_child ? ['col-lg-6', 'col-sm-12'] : 'col-12']">
                <label for="menu_type" class="text-light">Menu Type</label>
                <Field name="menu_type" v-slot="{ field }">
                  <select
                    id="menuType"
                    class="form-select"
                    v-bind="field"
                    @change="changeUrlToNative"
                  >
                    <option value="0" selected disabled>Select Type</option>
                    <option value="@native">@native</option>
                    <option value="@webview">@webview</option>
                    <option value="@parent">@parent</option>
                  </select>
                </Field>
              </div>
              <div class="col-lg-6 col-sm-12" v-if="!is_child">
                <label for="linked_to" class="text-light">Linked to</label>
                <Field name="linked_to" v-slot="{ field }">
                  <select id="linkedTo" class="form-select" v-bind="field">
                    <option value="0" selected disabled>Linked To</option>
                    <option :value="item.uuid" v-for="item in parentMenu">{{ item.name }}</option>
                  </select>
                </Field>
              </div>
              <div class="col-lg-6 col-sm-12"></div>
            </div>

            <!-- NAME, URL, X and Y -->
            <div class="row">
              <div class="col-sm-12 col-md-12 mb-3">
                <Field name="url" v-slot="{ field, meta, errors }">
                  <label for="url" class="text-light">URL</label>
                  <input
                    v-bind="field"
                    type="text"
                    class="form-control"
                    placeholder="URL (kosongkan jika native)"
                  />
                </Field>
              </div>

              <div class="col-sm-12 col-md-6 mb-3" v-if="!is_native && !is_parent">
                <Field name="x" v-slot="{ field, meta, errors }">
                  <label for="x" class="text-light">Path 1</label>
                  <input v-bind="field" type="text" class="form-control" placeholder="Path 1" />
                </Field>
              </div>

              <div class="col-sm-12 col-md-6 mb-3" v-if="!is_native && !is_parent">
                <Field name="y" v-slot="{ field, meta, errors }">
                  <label for="y" class="text-light">Path 2</label>
                  <input v-bind="field" type="text" class="form-control" placeholder="Path 2" />
                </Field>
              </div>
            </div>
            <!-- END OF NAME, URL, X and Y -->

            <!-- ICON -->
            <div class="row" v-show="!is_child">
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
  name: 'TambahChildStandalone',
  components: { FontAwesomeIcon, Form, Field },
  props: ['override', 'groupName', 'dropDownPMenu', 'parentMenu'],
  data() {
    return {
      group_name: '',
      group_uuid: '',
      menu_name: '',
      menu_uuid: '',
      is_parent: false,
      is_child: false,
      is_native: false,
      parent_menus: [],
      idHasChild: `btnIfHaveChild-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      isLoading: false,
    }
  },
  computed: {
    formInit() {
      return {
        group_uid: '',
        group_name: '',
        menu_uuid: '',
        menu_name: '',
        url: '',
        x: '',
        y: '',
        image: null,
        has_child: false,
        menu: '',
        menu_type: '0',
        linked_to: '0',
      }
    },
  },
  watch: {
    groupName: {
      immediate: true,
      handler(newVal) {
        this.group_name = newVal?.name || ''
        this.group_uuid = newVal?.uuid || ''

        this.$nextTick(() => {
          if (this.$refs.formChildStandalone?.setFieldValue) {
            if (!this.is_child) {
              this.$refs.formChildStandalone.setFieldValue('group_name', this.group_name)
              this.$refs.formChildStandalone.setFieldValue('group_uid', this.group_uuid)
            }
          }
        })
      },
    },
    dropDownPMenu: {
      immediate: true,
      handler(newVal) {
        this.menu_name = newVal?.name || ''
        this.menu_uuid = newVal?.uuid || ''

        this.$nextTick(() => {
          if (this.$refs.formChildStandalone?.setFieldValue) {
            this.$refs.formChildStandalone.setFieldValue('menu_name', this.menu_name)
            this.$refs.formChildStandalone.setFieldValue('menu_uuid', this.menu_uuid)
          }
        })
      },
    },
  },
  methods: {
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
    changeUrlToNative() {
      const isNative = this.$refs.formChildStandalone.getValues()
      console.log(isNative.menu_type)
      if (isNative.menu_type === '@native') {
        console.log('rendererd ')
        this.$refs.formChildStandalone.setFieldValue('url', '@native')
        this.is_native = true
      } else if (isNative.menu_type === '@webview' && this.is_parent) {
        this.$refs.formChildStandalone.setFieldValue('url', '@parent')
        this.is_native = false
      } else {
        this.is_native = false
      }
    },
    revokeBlob() {
      if (this.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(this.previewUrl)
    },
    createMenuChild(data, { resetForm }) {
      const fData = new FormData()
      this.isLoading = true
      fData.append('parent_menu_id', this.is_child ? data.menu.uuid : data.menu_uuid)
      fData.append('group_uid', data.group_name)
      fData.append('name', data.name)
      fData.append('url', data.url)
      fData.append('x', this.is_native ? null : data.x)
      fData.append('y', this.is_native ? null : data.y)
      fData.append('level', this.is_child ? 2 : 1)
      fData.append('has_child', data.has_child ? true : false)
      fData.append('is_active', true)
      fData.append('menu_type', data.menu_type)
      fData.append('linked_to', data.linked_to)
      fData.append('type', this.is_child ? data.menu.name : data.menu_name)

      if (data.image instanceof File) {
        fData.append('image', data.image)
      }
      apiServices
        .createStandAlone(fData)
        .then((res) => {
          this.isLoading = false
          this.$toast.success('201 - Berhasil menambahkan menu')
          this.$emit('fetchMenuData')
          this.resetButKeep(['group_uid', 'parent_menu_id', 'group_name', 'menu_name', 'menu_uuid'])
          this.$refs.formChildStandalone.setFieldValue('has_child', false)
          this.is_parent = false
          this.revokeBlob()
          this.setInitialPreview()
          if (this.$refs.imageInput) this.$refs.imageInput.value = ''
        })
        .catch((e) => {
          this.isLoading = false
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
    changeIsChild() {
      this.is_child = !this.is_child
      if (!this.is_child) {
        console.log('render')
        this.$refs.formChildStandalone.setFieldValue('menu_name', this.menu_name)
        this.$refs.formChildStandalone.setFieldValue('menu_uuid', this.menu_uuid)
        this.$refs.formChildStandalone.setFieldValue('linked_to', '0')
      } else {
        this.$refs.formChildStandalone.setFieldValue('menu', '0')
        this.$refs.formChildStandalone.setFieldValue('linked_to', '0')
        this.loadParentMenus()
      }
    },
    changeIsParent() {
      this.is_parent = !this.is_parent
      if (this.is_parent) {
        this.$refs.formChildStandalone.setFieldValue('menu_type', '@parent')
        this.$refs.formChildStandalone.setFieldValue('url', '@parent')
      } else {
        this.$refs.formChildStandalone.setFieldValue('menu_type', '0')
        this.$refs.formChildStandalone.setFieldValue('url', '')
      }
    },
    loadParentMenus() {
      apiServices
        .getMenuStandAlone({
          parent_menu_id: this.menu_uuid,
          name: this.group_name,
        })
        .then((response) => {
          this.parent_menus = response.data.data
        })
        .catch((e) => {
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.menuData = ''
          this.$toast.error(eMessage)
        })
    },

    resetButKeep(keys = []) {
      const form = this.$refs.formChildStandalone
      if (!form) return
      const current = form.values || {}
      const kept = keys.reduce((acc, k) => {
        acc[k] = current[k]
        return acc
      }, {})

      form.resetForm({
        values: {
          ...this.formInit,
          ...kept,
          image: null,
        },
      })

      // bereskan input file & preview (kalau ada)
      if (this.$refs.imageInput) this.$refs.imageInput.value = ''
      this.previewUrl = ''
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

hr {
  color: white;
}
</style>
