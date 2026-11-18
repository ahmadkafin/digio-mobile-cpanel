<template>
  <div class="container py-4">
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

      <NoticesComponents
        v-if="param === 'notices'"
        :notices="notices"
        :isLoading="isLoading"
        :noData="noData"
        :currentPage="noticeQuery.page"
        :totalPages="noticePagination.pages"
        @changePage="changeNoticePage"
        @goTo="goTo($event)"
        @searchData="searchData($event)"
        @apiSwitch="switchNotice($event)"
        @apiDelete="deleteNotice($event)"
      />
    </div>
  </div>
</template>

<script>
import FieldMapComponents from '@/components/config/FieldMap.components.vue'
import InfrabooksComponents from '@/components/config/Infrabooks.components.vue'
import NoticesComponents from '@/components/config/Notices.components.vue'
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
      notices: [],
      allProducts: [],
      allInfrabooks: [],
      allStandalone: [],
      allOverride: [],
      allNotices: [],
      noticeQuery: {
        page: 1,
        paginate: 5,
      },
      noticePagination: {
        pages: 0,
        total: 0,
      },
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
    NoticesComponents,
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
      case this.param === 'notices':
        this.fetchDataNotices()
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
      if (param && typeof param === 'object') {
        this.$router.push({
          name: 'form',
          params: { path: this.param, uuid: param.id },
          state: { notice: JSON.parse(JSON.stringify(param)) },
        })
        return
      }
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
            this.standalone = this.allStandalone.slice()
            return
          case this.param === 'notices':
            this.notices = this.allNotices.slice()
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
        case this.param === 'notices':
          this.notices = this.allNotices.filter(
            (n) =>
              String(n?.captions ?? '')
                .toLowerCase()
                .includes(q) ||
              String(n?.type ?? '')
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
    fetchDataNotices() {
      this.title = 'Config Notices'
      this.isLoading = true
      this.noData = false
      apiServices
        .getNotices(this.noticeQuery)
        .then((res) => {
          this.isLoading = false
          const raw = res.data?.data ?? res.data
          const list = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.docs)
              ? raw.docs
              : raw && typeof raw === 'object' && raw.id
                ? [raw]
                : []
          this.noticePagination = {
            pages: raw?.pages ?? (list.length > 0 ? 1 : 0),
            total: raw?.total ?? list.length,
          }
          this.allNotices = list
          this.notices = list.slice()
        })
        .catch((e) => {
          this.isLoading = false
          if (e.response?.data?.status === 404 || e.response?.status === 404) {
            this.noData = true
          } else {
            const status = e.response?.data?.status || e.response?.status || 500
            const msg = e.response?.data?.message || e.response?.data?.resp || e.message
            this.$toast.error(`Error : ${status} - ${msg}`)
          }
        })
    },
    changeNoticePage(page) {
      this.noticeQuery.page = page
      this.fetchDataNotices()
    },
    switchNotice(item) {
      apiServices
        .switchNotice({ id: item.id, isActive: !item.isActive })
        .then(() => {
          this.$toast.success('Successfully updated notice status')
          this.fetchDataNotices()
        })
        .catch((e) => {
          const status = e.response?.data?.status || e.response?.status || 500
          const msg = e.response?.data?.message || e.response?.data?.resp || e.message
          this.$toast.error(`Error : ${status} - ${msg}`)
        })
    },
    deleteNotice(id) {
      const confrm = confirm('Apakah yakin akan menghapus notice ini?')
      if (confrm) {
        apiServices
          .deleteNotice(id)
          .then(() => {
            this.$toast.success('Successfully deleted notice')
            this.fetchDataNotices()
          })
          .catch((e) => {
            const status = e.response?.data?.status || e.response?.status || 500
            const msg = e.response?.data?.message || e.response?.data?.resp || e.message
            this.$toast.error(`Error : ${status} - ${msg}`)
          })
      }
    },
  },
}
</script>

<style scoped></style>
