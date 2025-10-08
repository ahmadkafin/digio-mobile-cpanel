<template>
  <div
    class="modal fade"
    id="copyStandalooneModal"
    tabindex="-1"
    aria-labelledby="copyStandalooneModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content bg-dark">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-light" id="copyStandalooneModalLabel">
            Copy Standalone
          </h1>
          <button type="button" data-bs-dismiss="modal" class="btn-close" aria-label="Close">
            <font-awesome-icon :icon="['fas', 'xmark-circle']" />
          </button>
        </div>
        <Form ref="copy-standalone-form" :initial-values="formInit">
          <div class="modal-body has-overlay">
            <!-- loading -->
            <div class="overlay" v-show="isLoading">
              <div class="d-flex justify-content-center">
                <span class="loader"></span>
              </div>
            </div>
            <!-- end loading -->

            <div class="row px-2 my-3">
              <Field name="group_digio" v-slot="{ field }">
                <label for="group_digio" class="text-light">Group Digio</label>
                <select id="group_digio" v-bind="field" class="form-select" @change="fetchMenu">
                  <option value="0" selected disabled>Select group Digio</option>
                  <option v-for="group in group_digio" :key="group.role" :value="group.role">
                    {{ group.role }}
                  </option>
                </select>
              </Field>
            </div>

            <div class="row px-2 my-3">
              <Field name="menu" v-slot="{ field }">
                <label for="menu" class="text-light">Menu Standalone</label>
                <select id="menu" v-bind="field" class="form-select" @change="fetchMenuData">
                  <option value="0" selected disabled>Select Menu</option>
                  <option
                    v-for="menu in menus"
                    :key="menu.uuid"
                    :value="{ name: menu.name, uuid: menu.uuid }"
                  >
                    {{ menu.name }}
                  </option>
                </select>
              </Field>
            </div>

            <div class="row px-2 my-3">
              <div class="col-12">
                <label for="child_menu" class="text-light">Child Menu Standalone</label>
                <div
                  class="form-control bg-secondary text-light"
                  style="height: 500px; overflow-y: scroll"
                >
                  <div v-if="child_menus.length === 0" class="text-center">No data available</div>
                  <div v-else>
                    <div v-for="child in child_menus" :key="child.uuid" class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="child_menus"
                        :id="child.uuid"
                        @change="getChildMenu($event, child)"
                      />
                      <label class="form-check-label" :for="child.uuid">
                        {{ child.name }} {{ child.has_child ? '- (Include Child)' : '' }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="submitToCopy">Copy Now</button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, Form, ErrorMessage, useField } from 'vee-validate'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import apiServices from '@/services/api.services'

export default {
  name: 'CopyStandaloneModal',
  props: ['group_digio', 'menu_name', 'group_to_assign', 'menu_name_to_assign'],
  components: { FontAwesomeIcon, Form, Field },
  data() {
    return {
      menus: [],
      child_menus: [],
      isLoading: false,
      group_name: '',
      menu_uuid: '',
      generated: [],
    }
  },
  computed: {
    formInit() {
      return {
        group_digio: '0',
        menu: '0',
      }
    },
  },
  methods: {
    fetchMenu() {
      const group_name = this.$refs['copy-standalone-form'].values.group_digio
      apiServices
        .getStandAlone({
          name: group_name,
          parent_menu_id: '0',
        })
        .then((response) => {
          this.menus = response.data.data
        })
        .catch((error) => {
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.parentMenu = []
          this.$toast.error(eMessage)
        })
    },
    fetchMenuData() {
      this.group_name = this.$refs['copy-standalone-form'].values.group_digio
      this.menu_uuid = this.$refs['copy-standalone-form'].values.menu
      this.isLoading = true
      apiServices
        .getMenuStandAlone({
          parent_menu_id: this.menu_uuid.uuid,
          name: this.group_name,
        })
        .then((response) => {
          this.isLoading = false
          this.child_menus = response.data.data
        })
        .catch((e) => {
          this.isLoading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.child_menus = []
          this.$toast.error(eMessage)
        })
    },
    getChildMenu(evt, child_menu) {
      const checked = evt.target.checked
      const childCopy = { ...child_menu }
      delete childCopy.parent_menu_id
      delete childCopy.group
      if (childCopy.linked_mapping != null) {
        childCopy.linked_to = child_menu.linked_mapping.uuid
      }
      if (checked) {
        const toPush = {
          ...childCopy,
          parent_menu_id: this.menu_name_to_assign.uuid,
          group: this.group_to_assign.name,
        }
        const exists = this.generated.findIndex((g) => g.uuid === childCopy.uuid) !== -1
        if (!exists) this.generated.push(toPush)
      } else {
        this.generated = this.generated.filter((g) => g.uuid !== childCopy.uuid)
      }
    },
    submitToCopy() {
      // alert(this.group_to_assign.name)
      this.isLoading = true
      apiServices
        .createCopy({
          group_uid: this.group_to_assign.name,
          payloadBody: this.generated,
        })
        .then(() => {
          this.isLoading = false
          this.$emit('fetchMenuData')
          this.$toast.success('Copy Success')
          this.generated = []
          this.$refs['copy-standalone-form'].resetForm({
            values: this.formInit,
          })
          this.menus = []
          this.child_menus = []
          this.group_name = ''
          this.menu_uuid = ''
        })
        .catch((e) => {
          this.isLoading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.$toast.error(eMessage)
        })
    },
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
</style>
