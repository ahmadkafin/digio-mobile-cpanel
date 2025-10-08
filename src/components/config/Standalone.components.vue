<template>
  <!-- Modal -->
  <!-- <TambahEntitasModal :groupDigio="groupDigio" @fetchGroup="fetchGroup" /> -->
  <OverrideModal :override="override" :groupName="groupName" @fetchMenu="fetchMenu" />
  <TambahChildStandaloneModal
    :override="override"
    :groupName="groupName"
    :dropDownPMenu="dropdownPMenu"
    :parentMenu="parentMenu"
    @fetchMenuData="fetchMenuData"
  />
  <CopyStandaloneModal
    :group_digio="groupedByRole"
    :group_to_assign="groupName"
    :menu_name_to_assign="dropdownPMenu"
    @fetchMenuData="fetchMenuData"
  />
  <!-- end modal -->
  <div class="row">
    <div class="px-2">
      <div v-if="loading" class="d-flex justify-content-center">
        <span class="loader"></span>
      </div>
      <template v-else>
        <div class="text-center text-light" v-if="emptyData">No Data</div>
        <template v-else>
          <div class="row px-2 mx-2 my-3">
            <div class="col-12">
              <div class="input-group mb-3">
                <select
                  name="name"
                  id="group"
                  class="form-select"
                  @change="fetchMenu"
                  v-model="groupName"
                >
                  <option value="0" selected disabled>Select Entitas</option>
                  <option :value="{ name: item.role }" v-for="item in groupedByRole">
                    {{ item.role }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row px-2 mx-2 text-light mb-5" v-if="filteredRoles.length != 0">
            <div class="d-flex justify-content-center">
              <span> Pada Entitas ini terdapat group sebagai berikut*</span>
            </div>
            <div class="d-flex justify-content-center mb-2">
              <small style="font-size: 0.7em">
                (*: semua group name dibawah ini akan mendapatkan menu yang tertera)
              </small>
            </div>
            <hr />
            <div class="d-flex flex-wrap gap-2 justify-content-between">
              <div v-for="g in filteredRoles" :key="g" class="col-lg-3 col-sm-6">
                <span class="badge bg-primary">
                  {{ g }}
                </span>
              </div>
            </div>
          </div>
          <!-- menu override -->
          <div class="row px-2 mx-2 my-3">
            <div class="col-12">
              <div class="input-group">
                <select
                  name="name"
                  id=""
                  class="form-select"
                  v-model="dropdownPMenu"
                  :disabled="groupName === '0' ? true : false"
                  @change="fetchMenuData"
                >
                  <option value="0" selected disabled>Select Menu</option>
                  <option :value="{ name: item.name, uuid: item.uuid }" v-for="item in parentMenu">
                    {{ item.name }}
                  </option>
                </select>
                <button
                  type="button"
                  class="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#modalOverride"
                  :disabled="groupName === '0' ? true : false"
                  @click="fetchOverride"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" />
                  Menu Override
                </button>
              </div>
            </div>
          </div>
          <!-- end menu override -->
        </template>

        <div class="row mt-4 px-4">
          <div class="col-sm-12 col-md-6">
            <div class="d-grid">
              <button
                class="btn btn-success btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#modalChildStandalone"
                :disabled="dropdownPMenu === '0' ? true : false"
              >
                <font-awesome-icon :icon="['fas', 'plus']" />
                Add Child
              </button>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="d-grid">
              <button
                class="btn btn-warning btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#copyStandalooneModal"
                :disabled="dropdownPMenu === '0' ? true : false"
              >
                <font-awesome-icon :icon="['fas', 'copy']" />
                Copy Menu
              </button>
            </div>
          </div>
        </div>

        <div class="row px-2 mx-2 my-3 text-center">
          <span class="text-light" v-if="menuData.length === 0">NO DATA</span>
        </div>

        <div class="d-flex justify-content-center px-4">
          <div ref="table" :key="dropdownPMenu?.uuid" id="myTable" style="width: 100%"></div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import apiServices from '@/services/api.services'
import TambahEntitasModal from './modal/TambahEntitas.modal.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import OverrideModal from './modal/Override.modal.vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import 'tabulator-tables/dist/css/tabulator.min.css'
import TambahChildStandaloneModal from './modal/TambahChildStandalone.modal.vue'
import CopyStandaloneModal from './modal/CopyStandalone.modal.vue'

export default {
  name: 'StandaloneComponents',
  props: ['standalone', 'noData', 'isLoading'],
  components: {
    FontAwesomeIcon,
    TambahEntitasModal,
    OverrideModal,
    TambahChildStandaloneModal,
    CopyStandaloneModal,
  },
  data() {
    return {
      group: [],
      groupDigio: [],
      parentMenu: [],
      filteredRoles: [],
      groupName: '0',
      emptyData: false,
      loading: false,
      override: [],
      tabulator: null,
      menuData: [],
      dropdownPMenu: '0',
    }
  },
  computed: {
    groupedByRole() {
      return this.groupByRole(this.groupDigio)
    },
  },
  mounted() {
    this.fetchGroup()
    this.fetchDigioGroup()
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
    fetchGroup() {
      this.loading = true
      apiServices
        .getGroup()
        .then((res) => {
          this.loading = false
          this.group = res.data.data
        })
        .catch((e) => {
          if (e.response.data.status === 404) {
            this.emptyData = true
            this.loading = false
          } else {
            this.loading = false
            const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
            this.$toast.error(eMessage)
          }
        })
    },
    fetchMenu() {
      this.dropdownPMenu = '0'
      apiServices
        .getStandAlone({
          name: this.groupName.name,
          parent_menu_id: '0',
        })
        .then((res) => {
          this.parentMenu = res.data.data
        })
        .catch((e) => {
          this.loading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.parentMenu = []
          this.$toast.error(eMessage)
        })
      const roles = [
        ...new Set(
          this.groupedByRole
            .filter((e) => e.role.toLowerCase() === this.groupName.name.toLowerCase())
            .flatMap((e) => e.groupNames),
        ),
      ].sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }))
      this.filteredRoles = roles
    },
    fetchOverride() {
      apiServices
        .getOverride()
        .then((res) => {
          this.override = res.data.data
          this.override = this.override.filter((p) => p.url === '@standalone')
          console.log(this.override)
        })
        .catch((e) => {
          if (e.response.data.status === 404) {
            this.emptyData = true
            this.loading = false
          } else {
            this.loading = false
            const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
            this.$toast.error(eMessage)
          }
        })
    },
    fetchMenuData() {
      apiServices
        .getMenuStandAlone({
          parent_menu_id: this.dropdownPMenu.uuid,
          name: this.groupName.name,
        })
        .then((response) => {
          this.menuData = response.data.data
          if (this.tabulator && typeof this.tabulator.destroy === 'function') {
            try {
              this.tabulator.destroy()
            } catch (err) {
              console.warn('Error destroying old Tabulator instance:', err)
            }
            this.tabulator = null
          }

          // defensive: pastikan ref ada
          if (!this.$refs.table) {
            console.error('Ref table tidak ditemukan!')
            return
          }

          this.tabulator = new Tabulator(this.$refs.table, {
            data: JSON.parse(JSON.stringify(this.menuData)),
            reactiveData: true,
            layout: 'fitColumns',
            responsiveLayout: 'collapse',
            placeholder: 'No Data',
            dataTree: true,
            dataTreeStartExpanded: false,
            dataTreeChildField: 'children',
            tableBuilt: () => {
              console.log('Tabulator tableBuilt event fired')
            },
            cellEdited: (cell) => {
              console.log('CONFIG cellEdited ->', cell.getField(), cell.getValue())
              // delegate ke method Vue
              this.handleEdited(cell)
            },
            columns: [
              {
                title: '#',
                field: 'image',
                formatter: (cell) => {
                  let url = cell.getValue()
                  if (url === null) {
                    let parent = cell.getRow().getTreeParent()
                    while (parent) {
                      const pimg = parent.getData()?.image
                      if (pimg) {
                        url = pimg
                        break
                      }
                      parent = parent.getTreeParent()
                    }
                  } else {
                    return `
                    <img src="https://digio.pgn.co.id/digiomobilebe/static/images/standalone/${url}" class="img-thumbnail" style="height:50px; width:auto; object-fit:contain;" />`
                  }
                },
                width: 80,
                hozAlign: 'center',
                headerHozAlign: 'center',
              },
              { title: 'Name', field: 'name' },
              {
                title: 'Has Child',
                field: 'has_child',
                hozAlign: 'center',

                width: 80,
                formatter: (cell) => {
                  const data = cell.getRow().getData()
                  return `
                    <span>
                      ${data.has_child ? '✅' : '❌'}
                    </span>
                  `
                },
              },
              {
                title: 'URL',
                field: 'url',
                editor: 'input',
                editable: true,
                // start edit on single click supaya user tidak perlu double click
                cellClick: function (e, cell) {
                  try {
                    cell.edit()
                  } catch (err) {
                    console.warn('cell.edit() failed:', err)
                  }
                },
              },
              {
                title: 'Path 1',
                field: 'x',
                editor: 'input',
                editable: true,
                // start edit on single click supaya user tidak perlu double click
                cellClick: function (e, cell) {
                  try {
                    cell.edit()
                  } catch (err) {
                    console.warn('cell.edit() failed:', err)
                  }
                },
              },
              {
                title: 'Path 2',
                field: 'y',
                editor: 'input',
                editable: true,
                // start edit on single click supaya user tidak perlu double click
                cellClick: function (e, cell) {
                  try {
                    cell.edit()
                  } catch (err) {
                    console.warn('cell.edit() failed:', err)
                  }
                },
              },
              {
                title: 'Active?',
                field: 'is_active',
                width: 100,
                hozAlign: 'center',
                formatter: (cell) => {
                  const data = cell.getRow().getData()
                  return `
                    <span>
                      ${data.is_active ? '✅' : '❌'}
                    </span>
                  `
                },
                headerHozAlign: 'center',
              },
              {
                title: 'Revoked?',
                field: 'is_revoked',
                width: 100,
                hozAlign: 'center',
                headerHozAlign: 'center',
                formatter: (cell) => {
                  const data = cell.getRow().getData()
                  return `
                    <span>
                      ${data.is_revoked ? '✅' : '❌'}
                    </span>
                  `
                },
              },
              {
                title: 'Linked To',
                field: 'linked_mapping',
                formatter: (cell) => {
                  const data = cell.getRow().getData()
                  return `<span>${data.linked_mapping === null ? '-' : data.linked_mapping.name}`
                },
              },
              {
                title: 'Order Index',
                field: 'order_index',
                editor: 'input',
                editable: true,
                // start edit on single click supaya user tidak perlu double click
                cellClick: function (e, cell) {
                  try {
                    cell.edit()
                  } catch (err) {
                    console.warn('cell.edit() failed:', err)
                  }
                },
              },
              {
                title: 'Actions',
                field: 'uuid',
                hozAlign: 'center',
                width: 200,
                headerHozAlign: 'center',
                formatter: (cell) => {
                  const row = cell.getRow()
                  const data = row.getData()

                  const container = document.createElement('div')
                  container.className = 'btn-group me-2'

                  if (data.has_child) {
                    const btnChild = document.createElement('button')
                    btnChild.className = 'btn btn-info btn-sm'
                    btnChild.innerText = 'Childs'
                    btnChild.addEventListener('click', () => {
                      const d = row.getData()
                      if (d.__childrenLoaded) {
                        row.treeToggle()
                        return
                      }
                      this.showChild(data.uuid, row, btnChild)
                    })
                    container.appendChild(btnChild)
                  }

                  // const btnEdit = document.createElement('button')
                  // btnEdit.className = 'btn btn-warning btn-sm'
                  // btnEdit.innerText = 'Edit'
                  // btnEdit.addEventListener('click', () => {
                  //   this.editRow(data.uuid)
                  // })

                  const btnDelete = document.createElement('button')
                  btnDelete.className = 'btn btn-danger btn-sm'
                  btnDelete.innerText = 'Delete'
                  btnDelete.addEventListener('click', () => {
                    row.delete()
                    this.deleteRow({
                      uuid: data.uuid,
                      has_child: data.has_child,
                      name: data.name,
                      image: data.image,
                    })
                  })

                  // container.appendChild(btnEdit)
                  container.appendChild(btnDelete)
                  return container
                },
              },
            ],
          })
          this.tabulator.on('cellEdited', (cell) => {
            console.log('ON event cellEdited ->', cell.getField(), cell.getValue())
            // if (
            //   cell.getField() !== 'url' ||
            //   cell.getField() !== 'x' ||
            //   cell.getField() !== 'y' ||
            //   cell.getField() !== 'order_index'
            // )
            //   return
            // delegate ke same method so we don't duplicate logic
            this.handleEdited(cell)
          })
          console.log('Tabulator instance created:', this.tabulator)
        })
        .catch((e) => {
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.menuData = ''
          this.$toast.error(eMessage)
        })
    },
    async showChild(uuid, row, btnChild) {
      // alert(uuid)
      try {
        btnChild.disabled = true
        btnChild.textContent = 'Loading...'
        const res = await apiServices.getMenuStandAlone({
          parent_menu_id: uuid,
          name: this.groupName.name,
        })
        const children = res?.data?.data || []
        const current = row.getData()
        row.update({
          ...current,
          children,
          __childrenLoaded: true,
        })
        row.treeExpand()
      } catch (e) {
        this.$toast.error(e.response?.data?.resp || e.message)
      } finally {
        btnChild.disabled = false
        btnChild.textContent = 'Not Found'
      }
    },
    deleteRow(data) {
      try {
        apiServices.deleteMenuStandalone(data).then(() => {
          this.$toast.success(`204 - Sukses menghapus ${data.name}`)
          // this.fetchMenuData()
        })
        // let cnfrm = confirm(
        //   data.has_child
        //     ? `Apakah anda akan menghapus menu ${data.name} ini? jika ya maka semua child akan terhapus`
        //     : `Apakah anda akan menghapus menu ${data.name} ini?`,
        // )
        // if (cnfrm) {
        //   apiServices.deleteMenuStandalone(data).then(() => {
        //     this.$toast.success(`204 - Sukses menghapus ${data.name}`)
        //     // this.fetchMenuData()
        //   })
        // }
      } catch (e) {
        const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
        this.$toast.error(eMessage)
      }
    },
    editRow(uuid) {
      alert(`edit  ${uuid}`)
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
    handleEdited(cell) {
      // Get the full data object for the row that was edited
      const updatedRowData = cell.getRow().getData()

      // Log the entire row data to the console
      console.log('Row updated:', updatedRowData)

      // Access specific values like uuid
      const { uuid, name, url, x, y, order_index } = updatedRowData
      console.log(`Edited row UUID: ${uuid}`)
      console.log(`Edited name: ${name}`)
      console.log(`Edited progress: ${url}`)
      console.log(`Edited progress: ${x}`)
      console.log(`Edited progress: ${y}`)
      console.log(`Edited progress: ${order_index}`)

      apiServices
        .updateStandalone({
          uuid: uuid,
          url: url,
          x: x,
          y: y,
          order_index: order_index,
        })
        .then(() => {
          this.$toast.success('Edited!')
        })
        .catch((e) => {
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
          this.$toast.error(eMessage)
        })
    },
  },
}
</script>
<style scoped>
.table-img {
  height: 30px;
  width: auto;
  object-fit: contain;
  padding: 0 !important;
  margin: 0 !important;
}

.tabulator {
  width: 100% !important;
  margin: 0 !important;
  border: none; /* kalau mau tanpa border kiri-kanan */
}

.tabulator .tabulator-header,
.tabulator .tabulator-tableholder {
  border-left: none !important;
  border-right: none !important;
}

#myTable.tabulator {
  border-radius: 12px;
  overflow: hidden; /* penting agar clip */
  border: 1px solid #dee2e6; /* atau pakai .border */
}

#myTable .tabulator-header {
  /* opsional */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}

#myTable .tabulator-tableholder {
  /* opsional */
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
