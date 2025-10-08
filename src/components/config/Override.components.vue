<template>
  <div class="row">
    <div class="px-2">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="search" id="search-value" />
        <span class="input-group-text" id="basic-addon">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </span>
      </div>

      <div v-if="isLoading" class="d-flex justify-content-center">
        <span class="loader"></span>
      </div>

      <template v-else>
        <div class="table-responsive">
          <table class="table table-light table-striped-columns table-hover rounded">
            <thead>
              <tr class="text-center">
                <th scope="col">#</th>
                <th scope="col">Name/Type</th>
                <th scope="col">URL</th>
                <th scope="col">Path 1</th>
                <th scope="col">Path 2</th>
                <th scope="col">Based on Type?</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="(item, index) in override" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ item.name === null ? item.contenttype : item.name }}</td>
                <td>{{ item.url === '#' ? 'Standalone' : item.url }}</td>
                <td>{{ item.x !== null ? item.x : '-' }}</td>
                <td>{{ item.y !== null ? item.y : '-' }}</td>
                <td v-if="item.y === '@contentstring'" class="text-center">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success" />
                </td>
                <td v-else class="text-center">
                  <font-awesome-icon :icon="['fas', 'xmark-circle']" class="text-danger" />
                </td>
                <td class="text-center">
                  <span class="badge bg-info mx-1">update</span>
                  <span
                    class="badge bg-danger mx-1"
                    style="cursor: pointer"
                    @click="deleteOverride(item.uuid)"
                  >
                    delete
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'OverrideComponents',
  props: ['override', 'isLoading', 'noData'],
  components: { FontAwesomeIcon },
  methods: {
    async deleteOverride(uuid) {
      await apiServices
        .deleteOverride({ uuid: uuid })
        .then((response) => {
          this.$emit('fetchOverride')
          this.$toast.success('204 - Successfully delete override menu')
        })
        .catch((e) => {
          this.$toast.error('Error')
        })
    },
  },
}
</script>

<style scoped>
table {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid black;
}
</style>
