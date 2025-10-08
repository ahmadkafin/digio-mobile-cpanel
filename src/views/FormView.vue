<template>
  <div class="container mt-3">
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
    </div>
  </div>
</template>
<script>
import InfrabooksFormComponents from '@/components/form/Infrabooks.form.components.vue'
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
      console.log('override')
    },
  },
}
</script>
