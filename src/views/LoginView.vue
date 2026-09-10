<template>
  <div class="container d-flex flex-column justify-content-center align-items-center page-wrap">
    <img src="/assets/images/new_icon_new_font.png" alt="logo" class="rounded custom-image mb-4" />
    <FormComponent
      @submitData="submitData($event)"
      :isLoading="isLoading"
      class="w-100"
      style="max-width: 400px"
    />
  </div>
</template>

<script>
import FormComponent from '@/components/login/Form.components.vue'

export default {
  components: {
    FormComponent,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    submitData(data) {
      this.isLoading = true
      this.$store.dispatch('login', data).then(
        () => {
          this.isLoading = false
          this.$toast.success('Success login, Welcome Home')
          this.$router.push('/')
        },
        (error) => {
          this.isLoading = false
          const eMessage = `Error : ${error.response.data.status} - Invalid login credentials`
          this.$toast.error(eMessage)
        },
      )
    },
  },
}
</script>

<style scoped>
.page-wrap {
  min-height: 100%;
}

.custom-image {
  width: 200px;
  max-width: 80%;
}
</style>
