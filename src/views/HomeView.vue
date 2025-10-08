<template>
  <div class="container mt-3">
    <div class="card p-5 bg-dark">
      <div class="d-flex align-items-start">
        <SideMenuComponents @callHome="loadHome" @callProfile="loadProfile" />
        <BodyComponents />
      </div>
    </div>
  </div>
</template>

<script>
import BodyComponents from '@/components/home/Body.components.vue'
import SideMenuComponents from '@/components/home/SideMenu.components.vue'
import apiServices from '@/services/api.services'
import { API_ENDPOINTS } from '@/utils/endpoint.utils'
export default {
  name: 'HomeView',
  components: { SideMenuComponents, BodyComponents },
  data() {
    return {
      test: API_ENDPOINTS.login,
    }
  },
  methods: {
    loadHome() {
      // apiServices.getMenu('0').then((response) => {
      //   console.log(response.data)
      // })
    },
    loadProfile() {
      // apiServices.getMenu('0').then((response) => {
      //   console.log(response.data)
      // })
    },
  },
}
</script>
<style scoped>
.custom-bg-card-home {
  background-color: black !important;
}
</style>
