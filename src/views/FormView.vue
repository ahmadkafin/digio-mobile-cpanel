<template>
  <div class="container py-4">
    <div class="card p-5 bg-dark">
      <h5 class="d-flex align-items-center gap-2 mb-3 flex-nowrap text-light">
        <span @click="goBack" class="goback-btn d-inline-flex align-items-center">
          <font-awesome-icon :icon="['fas', 'arrow-left-long']" />
        </span>
        <span class="past-page">Home</span>
        <span class="breadcrumbs d-inline-flex align-items-center">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </span>
        <span class="text-truncate past-page">{{ title }}</span>
        <span class="breadcrumbs d-inline-flex align-items-center">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </span>
        <span class="text-truncate">{{ subtitle }}</span>
      </h5>
      <ProductsFormComponents
        v-if="path === 'products'"
        :isLoading="isLoading"
        :product="product"
      />
      <InfrabooksFormComponents
        v-if="path === 'infrabooks'"
        :isLoading="isLoading"
        :infrabook="infrabook"
      />
      <StandaloneFormComponents
        v-if="path === 'standalone'"
        :isLoading="isLoading"
        :standalone="standalone"
      />
      <OverrideFormComponents
        v-if="path === 'overridedigio'"
        :isLoading="isLoading"
        :override="override"
      />
      <NoticesFormComponents
        v-if="path === 'notices'"
        :isLoading="isLoading"
        :notice="notice"
      />
    </div>
  </div>
</template>
<script>
import InfrabooksFormComponents from '@/components/form/Infrabooks.form.components.vue'
import NoticesFormComponents from '@/components/form/Notices.form.components.vue'
import OverrideFormComponents from '@/components/form/Override.form.components.vue'
import ProductsFormComponents from '@/components/form/Products.form.components.vue'
import StandaloneFormComponents from '@/components/form/Standalone.form.components.vue'
import apiServices from '@/services/api.services'

export default {
  name: 'FormView',
  components: {
    ProductsFormComponents,
    InfrabooksFormComponents,
    StandaloneFormComponents,
    OverrideFormComponents,
    NoticesFormComponents,
  },
  data() {
    return {
      path: this.$route.params.path,
      uuid: this.$route.params.uuid,
      title: '',
      subtitle: '',
      product: '',
      infrabook: '',
      standalone: '',
      override: '',
      notice: null,
      isLoading: false,
    }
  },
  mounted() {
    this.title = 'Config ' + this.path.toUpperCase()
    if (this.uuid != 'add') {
      switch (true) {
        case this.path === 'products':
          this.fetchProduct()
          break
        case this.path === 'infrabooks':
          this.fetchInfrabook()
          break
        case this.path === 'standalone':
          this.fetchStandAlone()
          break
        case this.path === 'overridedigio':
          this.fetchOverride()
          break
        case this.path === 'notices':
          this.fetchNotice()
          break
        default:
          null
      }
    } else {
      this.subtitle = 'Create'
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    fetchProduct() {
      this.isLoading = true
      apiServices
        .findProduct(this.uuid)
        .then((response) => {
          this.isLoading = false
          this.product = response.data.data
          this.subtitle = this.product.name
        })
        .catch((e) => {
          this.isLoading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.data}`
          this.$toast.error(eMessage)
        })
    },
    fetchInfrabook() {
      this.isLoading = true
      apiServices
        .findInfrabook(this.uuid)
        .then((response) => {
          this.isLoading = false
          this.infrabook = response.data.data
          this.subtitle = this.infrabook.name
        })
        .catch((e) => {
          this.isLoading = false
          const eMessage = `Error : ${e.response.data.status} - ${e.response.data.data}`
          this.$toast.error(eMessage)
        })
    },
    fetchOverride() {
      // TODO: Implement fetchOverride if/when the override edit form is built
    },
    fetchStandAlone() {
      // TODO: Standalone editing is handled via the StandaloneComponents table.
      // Add data-loading logic here if a dedicated standalone edit form is added.
      this.subtitle = 'Edit'
    },
    fetchNotice() {
      this.subtitle = 'Edit'
      const stateNotice = window.history.state?.notice
      if (stateNotice && String(stateNotice.id) === String(this.uuid)) {
        this.notice = stateNotice
        this.subtitle = stateNotice.captions || 'Edit Notice'
        return
      }
      this.isLoading = true
      apiServices
        .getNotices({ page: 1, paginate: 100 })
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
          const found = list.find((n) => String(n.id) === String(this.uuid))
          if (found) {
            this.notice = found
            this.subtitle = found.captions || 'Edit Notice'
          }
        })
        .catch((e) => {
          this.isLoading = false
          const status = e.response?.data?.status || e.response?.status || 500
          const msg = e.response?.data?.message || e.response?.data?.data || e.message
          this.$toast.error(`Error : ${status} - ${msg}`)
        })
    },
  },
}
</script>
