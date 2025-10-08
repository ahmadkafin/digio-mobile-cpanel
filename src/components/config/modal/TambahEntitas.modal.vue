<template>
  <div
    class="modal fade"
    id="entitasModal"
    tabindex="-1"
    aria-labelledby="entitasModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content bg-dark">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-light" id="entitasModalLabel">Tambah Entitas</h1>
          <button type="button" data-bs-dismiss="modal" class="btn-close" aria-label="Close">
            <font-awesome-icon :icon="['fas', 'xmark-circle']" />
          </button>
        </div>
        <div class="modal-body">
          <!-- <input
            type="text"
            class="form-control"
            placeholder="Nama Entitas"
            id="entitas"
            name="entitas"
          /> -->
          <select name="entitas" id="entitas" class="form-select">
            <option value="0" selected disabled>Select Entitas</option>
            <option :value="item.role" v-for="item in groupedByRole">{{ item.role }}</option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="addEntitas">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'TambahEntitasModal',
  components: { FontAwesomeIcon },
  props: ['groupDigio'],
  data() {
    return {
      isLoading: false,
      entities: [],
    }
  },
  computed: {
    groupedByRole() {
      return this.groupByRole(this.groupDigio)
    },
  },
  methods: {
    addEntitas() {
      const name = document.getElementById('entitas').value
      this.isLoading = true
      apiServices
        .addEntity({ name: name })
        .then((res) => {
          this.isLoading = false
          this.$toast.success('201 - Berhasil menambahkan entitas')
          this.$emit('fetchGroup')
          document.getElementById('entitas').value = ''
        })
        .catch((e) => {
          this.isLoading = false
          this.loading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
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
</style>
