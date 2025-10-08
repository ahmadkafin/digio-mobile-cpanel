<template>
  <div class="container mt-3">
    <div class="card p-5 bg-dark">
      <div class="d-flex justify-content-between mb-3">
        <h5 class="d-flex align-items-center gap-2 mb-3 flex-nowrap text-light">
          <span @click="goBack" class="goback-btn d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'arrow-left-long']" />
          </span>
          <span class="past-page">Home</span>
          <span class="breadcrumbs d-inline-flex align-items-center">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </span>
          <span class="text-truncate">{{ title }}</span>
        </h5>
        <div class="d-grid">
          <button
            class="btn btn-sm btn-success"
            @click="goTo('add')"
            v-if="param !== 'standalone' && param !== 'fieldmap'"
          >
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
      </div>
      <ProductsComponents
        v-if="param === 'products'"
        :products="products"
        :isLoading="isLoading"
        :noData="noData"
        @searchData="searchData($event)"
        @goTo="goTo($event)"
        @apiDelete="deleteProduct($event)"
      />

      <InfrabooksComponents
        v-if="param === 'infrabooks'"
        :infrabooks="infrabooks"
        :isLoading="isLoading"
        :noData="noData"
        @goTo="goTo($event)"
        @searchData="searchData($event)"
        @apiDelete="deleteInfra($event)"
      />

      <StandaloneComponents
        v-if="param === 'standalone'"
        :standalone="standalone"
        :isLoading="isLoading"
        :noData="noData"
      />

      <OverrideComponents
        v-if="param === 'overridedigio'"
        :isLoading="isLoading"
        :noData="noData"
        :override="override"
        @fetchOverride="fetchOverrideDigioMenu"
      />

      <FieldMapComponents v-if="param === 'fieldmap'" />
    </div>
  </div>
</template>

<script>
import FieldMapComponents from '@/components/config/FieldMap.components.vue'
import InfrabooksComponents from '@/components/config/Infrabooks.components.vue'
import OverrideComponents from '@/components/config/Override.components.vue'
import ProductsComponents from '@/components/config/Products.components.vue'
import StandaloneComponents from '@/components/config/Standalone.components.vue'
import apiServices from '@/services/api.services'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'ConfigView',
  data() {
    return {
      param: this.$route.params.path,
      isLoading: false,
      title: '',
      products: [],
      infrabooks: [],
      standalone: [],
      override: [],
      allProducts: [],
      allInfrabooks: [],
      allStandalone: [],
      allOverride: [],
      searchValue: '',
      noData: false,
    }
  },
  components: {
    FontAwesomeIcon,
    ProductsComponents,
    InfrabooksComponents,
    StandaloneComponents,
    OverrideComponents,
    FieldMapComponents,
  },
  mounted() {
    switch (true) {
      case this.param === 'products':
        this.fetchDataProduct('')
        break
      case this.param === 'standalone':
        this.fetchDataStandAlone()
        break
      case this.param === 'overridedigio':
        this.fetchOverrideDigioMenu()
        break
      case this.param === 'infrabooks':
        this.fetchDataInfrabooks()
        break
      case this.param === 'fieldmap':
        this.fetchDataFieldMaps()
        break
      default:
        null
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    goTo(param) {
      console.log(param)
      this.$router.push({ name: 'form', params: { path: this.param, uuid: param } })
    },
    searchData(value) {
      const q = String(value || '').toLowerCase()
      if (!q) {
        switch (true) {
          case this.param === 'products':
            this.products = this.allProducts.slice()
            return
          case this.param === 'infrabooks':
            this.infrabooks = this.allInfrabooks.slice()
            return
          case this.param === 'standalone':
            this.infrabooks = this.allStandalone.slice()
            return
          default:
            return
        }
      }
      switch (true) {
        case this.param === 'products':
          this.products = this.allProducts.filter((p) =>
            String(p?.name ?? '')
              .toLowerCase()
              .includes(q),
          )
          break
        case this.param === 'infrabooks':
          this.infrabooks = this.allInfrabooks.filter((p) =>
            String(p?.name ?? '')
              .toLowerCase()
              .includes(q),
          )
          break
        default:
          break
      }
    },
    fetchDataProduct() {
      this.title = 'Config Product'
      this.isLoading = true
      apiServices
        .getProducts()
        .then((res) => {
          this.isLoading = false
          const list = Array.isArray(res.data?.data) ? res.data.data : []
          this.allProducts = list
          this.products = list.slice()
        })
        .catch((e) => {
          if (e.response.data.status === 404) {
            this.noData = true
            this.isLoading = false
          } else {
            this.isLoading = false
            const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
            this.$toast.error(eMessage)
          }
        })
    },
    deleteProduct(uid) {
      let confrm = confirm('Apakah yakin akan menghapus produk ini?')
      if (confrm) {
        apiServices
          .deleteProducts(uid)
          .then((res) => {
            if (res.status === 200) {
              const msg = res.data.data
              this.$toast.success(`${res.status} - ${msg}`)
              this.fetchDataProduct()
            } else {
              this.$toast.success('204 : Successfully delete products')
              this.fetchDataProduct()
            }
          })
          .catch((e) => {
            const eMessage = `Error : ${e.response.data.status} - ${e.response.data.message}`
            this.$toast.error(eMessage)
          })
      }
    },
    deleteInfra(uuid) {
      let confrm = confirm('Apakah yakin akan menghapus produk ini?')
      if (confrm) {
        apiServices
          .deleteInfra(uuid)
          .then((res) => {
            if (res.status === 200) {
              const msg = res.data.data
              this.$toast.success(`${res.status} - ${msg}`)
              this.fetchDataInfrabooks()
            } else {
              this.$toast.success('204 : Successfully delete Infrabooks')
              this.fetchDataInfrabooks()
            }
          })
          .catch((e) => {
            const eMessage = `Error : ${e.response.data.status} - ${e.response.data.message}`
            this.$toast.error(eMessage)
          })
      }
    },
    fetchDataStandAlone() {
      this.title = 'Config Standalone'
    },
    fetchOverrideDigioMenu() {
      this.title = 'Override Digio Menu'
      this.isLoading = true
      apiServices
        .getOverride()
        .then((res) => {
          this.isLoading = false
          const list = Array.isArray(res.data?.data) ? res.data.data : []
          this.allOverride = list
          this.override = list.slice()
        })
        .catch((e) => {
          if (e.response.data.status === 404) {
            this.noData = true
            this.isLoading = false
          } else {
            this.isLoading = false
            const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
            this.$toast.error(eMessage)
          }
        })
    },
    fetchDataInfrabooks() {
      this.title = 'Config Infrabooks'
      this.isLoading = true
      apiServices
        .getInfrabooks()
        .then((res) => {
          this.isLoading = false
          const list = Array.isArray(res.data?.data) ? res.data.data : []
          this.allInfrabooks = list
          this.infrabooks = list.slice()
        })
        .catch((e) => {
          if (e.response.data.status === 404) {
            this.noData = true
            this.isLoading = false
          } else {
            this.isLoading = false
            const eMessage = `Error : ${e.response.data.status} - ${e.response.data.resp}`
            this.$toast.error(eMessage)
          }
        })
    },
    fetchDataFieldMaps() {
      this.title = 'Config FieldMap Menu'
    },
  },
}
</script>

<style scoped></style>
