<template>
  <!-- modal -->
  <TambahFieldMapModal @fetchMenuFieldMap="fetchMenuFieldMap" />
  <!-- end of modal -->
  <div class="row">
    <div class="px-2">
      <div v-if="isLoading" class="d-flex justify-content-center">
        <span class="loader"></span>
      </div>
      <template v-else>
        <div class="row px-2 mx-2 my-3">
          <!-- start menu fieldmap -->
          <div class="col-12">
            <div class="input-group mb-3">
              <select
                name=""
                id=""
                v-model="fieldmapMenu"
                class="form-select"
                @change="fetchGroupWithFieldMap"
              >
                <option value="0" selected disabled>Select Menu</option>
                <option :value="item.uuid" v-for="item in fieldmapMenus" :key="item.uuid">
                  {{ item.name }}
                </option>
              </select>
              <button
                type="button"
                class="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#fieldmapmodal"
              >
                <font-awesome-icon :icon="['fas', 'plus']" />
                Fieldmap
              </button>
            </div>
          </div>
          <!-- endof menu field map -->
        </div>

        <div class="row px-4 form has-overlay">
          <div class="overlay" v-show="loadingGroup">
            <div class="d-flex justify-content-center">
              <span class="loader"></span>
            </div>
          </div>

          <div class="d-grid col-3 my-1" v-for="item in groups" :key="item.role">
            <input
              type="checkbox"
              class="btn-check"
              :id="item.role.trim().replaceAll(' ', '_')"
              autocomplete="off"
              :checked="isChecked(item.fieldmaps)"
              @change="changeState($event.target.checked, item.role)"
            />
            <label class="btn btn-outline-warning" :for="item.role.trim().replaceAll(' ', '_')">
              {{ item.role }}
            </label>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import apiServices from '@/services/api.services'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator.min.css'
import TambahFieldMapModal from './modal/TambahFieldMap.modal.vue'

export default {
  name: 'FieldMapComponents',
  components: { TambahFieldMapModal },
  data() {
    return {
      isLoading: false,
      loadingGroup: false,
      groupName: '0',
      groupDigio: [],
      filteredRoles: [],
      fieldmapMenu: '0',
      fieldmapMenus: [],
      groupMenus: [],
      tabulator: null,
      groups: [],
    }
  },
  computed: {
    groupedByRole() {
      return this.groupByRole(this.groupDigio)
    },
  },
  mounted() {
    this.fetchDigioGroup()
    this.fetchMenuFieldMap()
  },
  methods: {
    fetchDigioGroup() {
      apiServices
        .getGroupDigio()
        .then((response) => {
          this.groupDigio = response.data.data[0]
        })
        .catch((e) => {
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.$toast.error(eMessage)
        })
    },
    fetchMenuByGroup() {
      const data = {
        name: this.groupName.name,
      }
      apiServices
        .getFieldMapByGroup(data)
        .then((response) => {
          this.groupMenus = response.data.data
          this.tabulator = new Tabulator(this.$refs.table, {
            data: this.groupMenus,
            reactiveData: true,
            layout: 'fitColumns',
            responsiveLayout: 'collapse',
            placeholder: 'No Data',
            columns: [
              {
                title: '#',
                field: 'icon',
                formatter: (cell) => {
                  let url = cell.getValue()
                  if (url === null) {
                    let parent = cell.getRow().getTreeParent()
                    while (parent) {
                      const pimg = parent.getData()?.icon
                      if (pimg) {
                        url = pimg
                        break
                      }
                      parent = parent.getTreeParent()
                    }
                  } else {
                    return `
                    <img src="https://digio.pgn.co.id/digiomobilebe/dev/static/images/fieldmap/${url}" class="img-thumbnail" style="height:50px; width:auto; object-fit:contain;" />`
                  }
                },
                width: 80,
                hozAlign: 'center',
                headerHozAlign: 'center',
              },
              { title: 'Name', field: 'name' },
              { title: 'Group', field: 'group' },
              { title: 'Url', field: 'url' },
              { title: 'Menu Active?', field: 'is_active' },
              { title: 'Group Revoked?', field: 'is_revoked' },
              { title: 'Action', field: 'uuid' },
            ],
          })
        })
        .catch((e) => {
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.groupMenus = []
          this.$toast.error(eMessage)
        })
    },
    groupByRole(rows) {
      const norm = (s) =>
        (s ?? '')
          .toString()
          .replace(/\u00A0/g, ' ')
          .trim()
          .replace(/\s+/g, ' ')
      const map = new Map()
      for (const r of rows) {
        const role = norm(r.role)
        const name = norm(r.groupNames)
        if (!role) continue // skip kalau role kosong
        if (!map.has(role)) map.set(role, new Set())
        if (name) map.get(role).add(name) // dedup nama group
      }
      return Array.from(map, ([role, names]) => ({
        role,
        groupNames: Array.from(names).sort(),
        count: names.size,
      }))
    },
    generateGroupNames() {
      const roles = [
        ...new Set(
          this.groupedByRole
            .filter((e) => e.role.toLowerCase() === this.groupName.name.toLowerCase())
            .flatMap((e) => e.groupNames),
        ),
      ].sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }))
      this.filteredRoles = roles
      this.fetchMenuByGroup()
    },
    fetchGroupWithFieldMap() {
      this.loadingGroup = true
      apiServices
        .getGroupWithFieldMap({ uuid: this.fieldmapMenu })
        .then((response) => {
          this.groups = response.data.data
          this.loadingGroup = false
        })
        .catch((e) => {
          this.loadingGroup = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.$toast.error(eMessage)
        })
    },
    isChecked(fieldmap) {
      if (fieldmap != null) {
        return true
      } else {
        return false
      }
    },
    changeState(state, groupName) {
      if (state) {
        this.assignToFieldMap(groupName)
      } else {
        this.deleteGroupFieldMap(groupName)
      }
    },
    fetchMenuFieldMap() {
      this.isLoading = true
      apiServices
        .getAllFieldMap()
        .then((response) => {
          this.fieldmapMenus = response.data.data
          this.isLoading = false
        })
        .catch((e) => {
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.isLoading = false
          this.$toast.error(eMessage)
        })
    },
    assignToFieldMap(groupName) {
      this.loadingGroup = true
      apiServices
        .assignTo({
          field_map_uuid: this.fieldmapMenu,
          group_name: groupName,
        })
        .then(() => {
          this.loadingGroup = false
          this.$toast.success('201 - assigned')
        })
        .catch((e) => {
          this.loadingGroup = false
          const eMessage = `Error : ${error.response.data.status} - ${e.response.data.message}`
          this.$toast.error(eMessage)
        })
    },
    deleteGroupFieldMap(groupName) {
      this.loadingGroup = true
      apiServices
        .deleteGroupFieldMap({
          field_map_uuid: this.fieldmapMenu,
          group_name: groupName,
        })
        .then(() => {
          this.loadingGroup = false
          this.$toast.success('200 - un-assigned')
        })
        .catch((e) => {
          this.loadingGroup = false
          const eMessage = `Error : ${error.response.data.status} - ${e.response.data.message}`
          this.$toast.error(eMessage)
        })
    },
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
