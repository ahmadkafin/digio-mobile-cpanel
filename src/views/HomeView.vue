<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 py-5">
    <div class="container">
      <div class="card p-5 bg-dark custom-bg-card-home shadow-lg">
        <div class="d-flex align-items-start">
          <SideMenuComponents @callHome="loadHome" @callProfile="loadProfile" />
          <BodyComponents />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BodyComponents from '@/components/home/Body.components.vue'
import SideMenuComponents from '@/components/home/SideMenu.components.vue'
import apiServices from '@/services/api.services'
export default {
  name: 'HomeView',
  components: { SideMenuComponents, BodyComponents },
  mounted() {
    this.validToken()
  },
  methods: {
    validToken() {
      apiServices
        .validToken()
        .then((r) => {
          // this.$toast.success('token valid')
        })
        .catch((r) => {
          this.$toast.error('token invalid')
        })
    },
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
/* .custom-bg-card-home {
  background-color: blue !important;
} */
</style>
