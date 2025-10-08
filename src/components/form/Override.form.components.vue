<template>
  <div v-if="isLoading" class="d-flex justify-content-center">
    <span class="loader"></span>
  </div>
  <template v-else>
    <h4>Pilih menu digio</h4>
    <Form
      ref="formStandalone"
      :initial-values="formInit"
      @submit="submitMenuMapping"
      class="form has-overlay"
    >
      <div class="overlay" v-show="loading">
        <div class="d-flex justify-content-center">
          <span class="loader"></span>
        </div>
      </div>

      <div class="row my-2">
        <div class="col d-grid">
          <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input
              type="checkbox"
              class="btn-check"
              id="isBasedOnParentId"
              autocomplete="off"
              :disabled="isBasedOnType || isStandAlone"
              @click="changeBasedOnParentId"
            />
            <label class="btn btn-outline-primary" for="isBasedOnParentId">
              Override berdasarkan Parent ID
            </label>
          </div>
        </div>

        <div class="col d-grid">
          <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input
              type="checkbox"
              class="btn-check"
              id="type-btn"
              autocomplete="off"
              :disabled="isBasedOnParentId || isStandAlone"
              @click="changeBasedOnType"
            />
            <label class="btn btn-outline-primary" for="type-btn">
              Override berdasarkan tipe?
            </label>
          </div>
        </div>

        <div class="col d-grid">
          <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input
              type="checkbox"
              class="btn-check"
              id="standalone"
              autocomplete="off"
              :disabled="isBasedOnParentId || isBasedOnType"
              @click="changeStandAlone"
            />
            <label class="btn btn-outline-primary" for="standalone"> Standalone menu? </label>
          </div>
        </div>

        <div class="col d-grid">
          <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input
              type="checkbox"
              class="btn-check"
              id="isDocBtn"
              autocomplete="off"
              @click="changeIsDocument"
              :disabled="isStandAlone"
            />
            <label class="btn btn-outline-primary" for="isDocBtn"> Apakah Dokumen? </label>
          </div>
        </div>
      </div>

      <DigioMenuHelperFormComponents :rootParentId="0" @pick="handlePick($event)" />
      <div class="row g-3">
        <div class="col-6 col-md-6 col-xs-12">
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
          </Field>
        </div>
        <div class="col-6 col-md-6 col-xs-12">
          <Field name="digio_menu_id" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="digio_menu_id"
              readonly
              hidden
              placeholder="Digio Menu ID"
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
          </Field>
        </div>
        <template v-if="!isBasedOnType && !isBasedOnParentId">
          <!-- name and label -->
          <div class="col-6 col-md-6 col-xs-12">
            <label for="name" class="form-label">Digio Menu Name</label>
            <Field name="name" v-slot="{ field, meta, errors }">
              <input
                v-bind="field"
                type="text"
                class="form-control"
                id="name"
                placeholder="Digio Menu"
                :class="{
                  'is-invalid': meta.touched && meta.invalid,
                  'is-valid': meta.touched && meta.valid,
                }"
              />
            </Field>
          </div>
          <div class="col-6 col-md-6 col-xs-12">
            <label for="mobile_name" class="form-label">Digio Mobile Menu Name</label>
            <Field name="mobile_name" v-slot="{ field, meta, errors }">
              <input
                v-bind="field"
                type="text"
                class="form-control"
                id="mobile_name"
                placeholder="Digio Mobile Menu Name"
                :class="{
                  'is-invalid': meta.touched && meta.invalid,
                  'is-valid': meta.touched && meta.valid,
                }"
              />
            </Field>
          </div>
        </template>

        <div class="col-12 col-md-12 col-xs-12" v-if="isBasedOnType">
          <label for="contenttype" class="form-label">
            Tipe (semua menu yang mempunyai contenttype ini akan di override)
          </label>
          <Field name="contenttype" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="contenttype"
              placeholder="Tipe menu"
              readonly
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
          </Field>
        </div>

        <div class="col-12 col-md-12 col-xs-12" v-if="isBasedOnParentId">
          <label for="digio_parent_menu_id" class="form-label"> Parent ID </label>
          <Field name="digio_parent_menu_id" v-slot="{ field, meta, errors }">
            <input
              v-bind="field"
              type="text"
              class="form-control"
              id="digio_parent_menu_id"
              placeholder="Parent ID"
              readonly
              :class="{
                'is-invalid': meta.touched && meta.invalid,
                'is-valid': meta.touched && meta.valid,
              }"
            />
          </Field>
        </div>

        <!-- URL -->
        <div class="col-sm-12 col-lg-6 mb-2">
          <label for="url" class="form-label">URL</label>
          <div class="input-group">
            <Field name="url" v-slot="{ field, meta, errors }">
              <input
                v-bind="field"
                type="text"
                class="form-control"
                id="url"
                placeholder="URL"
                v-debounce:1s="initXandY"
                :readonly="isStandAlone"
                :class="{
                  'is-invalid': meta.touched && meta.invalid,
                  'is-valid': meta.touched && meta.valid,
                }"
              />
            </Field>
          </div>
        </div>

        <div class="col-sm-12 col-lg-6 mb-2">
          <label for="type" class="form-label"> menu type </label>
          <Field name="type" v-slot="{ field, meta, errors }">
            <select id="type" class="form-select" v-bind="field">
              <option value="0" selected disabled>Select Type</option>
              <option value="@native">@native</option>
              <option value="@webview">@webview</option>
              <option value="@document">@document</option>
              <option value="@others">@others</option>
            </select>
          </Field>
        </div>

        <!-- x and y -->
        <template v-if="!isStandAlone">
          <div class="col-6 col-md-6 col-xs-12">
            <label for="x" class="form-label"
              >Path 1
              <span style="font-size: 10px">
                (jika path dinamis silakan hapus bagian yang dinamis contoh :
                /msds/Distribusi(dinamis)/3(dinamis))
              </span>
            </label>
            <Field name="x" v-slot="{ field, meta, errors }">
              <input
                v-bind="field"
                type="text"
                class="form-control"
                id="x"
                placeholder="Path 1"
                :class="{
                  'is-invalid': meta.touched && meta.invalid,
                  'is-valid': meta.touched && meta.valid,
                }"
              />
            </Field>
          </div>
          <div class="col-6 col-md-6 col-xs-12">
            <label for="y" class="form-label">Path 2</label>
            <Field name="y" v-slot="{ field, meta, errors }">
              <input
                v-bind="field"
                type="text"
                class="form-control"
                id="y"
                placeholder="Path 2 or Query String"
                :readonly="isDocument"
                :class="{
                  'is-invalid': meta.touched && meta.invalid,
                  'is-valid': meta.touched && meta.valid,
                }"
              />
            </Field>
          </div>
        </template>
      </div>
      <div class="row mt-3">
        <div class="d-grid">
          <button class="btn btn-info">Submit</button>
        </div>
      </div>
    </Form>
  </template>
</template>
<script>
import DigioMenuHelperFormComponents from './helper/DigioMenu.helper.form.components.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { v4 } from 'uuid'
import apiServices from '@/services/api.services'
export default {
  name: 'OverrideFormComponent',
  props: ['isLoading', 'override', 'infrabook'],
  components: { DigioMenuHelperFormComponents, Form, Field, ErrorMessage },
  computed: {
    formInit() {
      return {
        uuid: this.infrabook?.uuid ?? v4(),
        name: this.infrabook?.name ?? '',
        contenttype: this.infrabook?.type ?? null,
        digio_menu_id: this.infrabook?.digio_menu_id ?? null,
        type: this.infrabook?.type ?? '0',
        url: this.infrabook?.url ?? '',
        x: this.infrabook?.x ?? '',
        y: this.infrabook?.y ?? '',
        parent_id: this.infrabook?.digio_parent_menu_id ?? null,
      }
    },
  },
  data() {
    return {
      parentId: 0,
      menudigio: [],
      picked: null,
      isStandAlone: false,
      isBasedOnType: false,
      isBasedOnParentId: false,
      isDocument: false,
      loading: false,
      uuid: v4(),
    }
  },
  mounted() {
    // this.fetchDigioMenu()
    this.generateUuid()
  },
  methods: {
    handlePick(value) {
      this.picked = value
      const label = value.label
      const digio_menu_id = value.menuid
      const parentId = value.parrentid
      const form = this.$refs.formStandalone
      if (form?.setFieldValue) {
        if (!this.isBasedOnType && !this.isBasedOnParentId) {
          form.setFieldValue('name', label)
          form.setFieldValue('mobile_name', label)
          form.setFieldValue('digio_menu_id', digio_menu_id)
        } else if (this.isBasedOnParentId && !this.isBasedOnType) {
          form.setFieldValue('digio_parent_menu_id', parentId)
        } else if (this.isBasedOnType && !this.isBasedOnParentId) {
          form.setFieldValue('contenttype', value.contenttype)
        }
      } else if (form?.resetForm) {
        form.resetForm({
          values: { ...(form.values || {}), label, digio_menu_id, name },
        })
      }
    },
    changeStandAlone() {
      this.isStandAlone = !this.isStandAlone
      const form = this.$refs.formStandalone
      if (form?.setFieldValue && this.isStandAlone) {
        form.setFieldValue('url', '@standalone')
        form.setFieldValue('type', '@native')
        form.setFieldValue('x', '')
        form.setFieldValue('y', '')
      } else {
        form.setFieldValue('url', '')
        form.setFieldValue('type', '0')
      }
    },
    changeBasedOnType() {
      this.isBasedOnType = !this.isBasedOnType
    },
    changeIsDocument() {
      this.isDocument = !this.isDocument
      const form = this.$refs.formStandalone
      if (this.isDocument) {
        form.setFieldValue('type', '@document')
        form.setFieldValue('y', '@contentstring')
      } else {
        form.setFieldValue('type', '0')
        form.setFieldValue('y', '')
      }
    },
    generateUuid() {
      this.uuid = v4()
    },
    changeBasedOnParentId() {
      this.isBasedOnParentId = !this.isBasedOnParentId
    },
    initXandY() {
      const raw = document.getElementById('url').value
      if (raw && raw !== '@standalone') {
        try {
          const u = new URL(raw, window.location.origin)

          if (!/^https?:$/.test(u.protocol)) {
            throw new Error('Protocol harus http/https.')
          }

          const host = `${u.protocol}//${u.host}`
          const segments = u.pathname.split('/').filter(Boolean)
          const path =
            segments.length <= 2
              ? segments.slice(0, 1).join('/')
              : segments.slice(0, segments.length - 1).join('/')
          const last = segments.at(-1) || ''
          const y = `${last}${u.search}`
          const form = this.$refs.formStandalone
          if (form?.setFieldValue && !this.isStandAlone) {
            form.setFieldValue('url', host)
            form.setFieldValue('x', path || '')
            !this.isDocument
              ? form.setFieldValue('y', y)
              : form.setFieldValue('y', '@contentstring')
          }
        } catch (e) {
          console.error('URL tidak valid:', e)
          this.$toast.error(`URL tidak valid : ${e?.message}`)
        }
      }
    },
    submitMenuMapping(data, { resetForm }) {
      this.loading = true
      data.is_document = this.isDocument
      data.is_override_by_parent = this.isBasedOnParentId
      console.log(data)
      apiServices
        .createOverride(data)
        .then((res) => {
          this.loading = false
          this.$toast.success('201 - berhasil mapping data')
          resetForm()
          const form = this.$refs.formStandalone
          form.setFieldValue('uuid', v4())
        })
        .catch((e) => {
          this.loading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.message}`
          this.$toast.error(eMessage)
        })
    },
  },
}
</script>
<style scoped>
.finder-columns {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px;
}
.finder-column {
  min-width: 240px;
  max-height: 60vh;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}
.finder-list {
  list-style: none;
  margin: 0;
  padding: 6px;
}
.finder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
}
.finder-item:hover {
  background: #f6f7f9;
}
.finder-item.selected {
  background: #eef5ff;
  font-weight: 600;
}
.chevron {
  opacity: 0.5;
}
.col-state {
  font-size: 13px;
  color: #6b7280;
  padding: 10px;
}

.input-group-text:has(.btn-check:checked + .btn) {
  background-color: rgb(231 152 0);
}

.btn-check.suffix:checked + .btn {
  background-color: transparent;
  color: white;
  border: 0px;
}

.btn-check.suffix + .btn {
  border: 0px;
}

.form-label {
  color: grey;
  font-size: 0.9em;
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
