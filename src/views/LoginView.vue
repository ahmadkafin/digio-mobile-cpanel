<template>
  <div class="container">
    <div class="position-relative page-wrap">
      <img
        src="@@/assets/images/new_icon_new_font.png"
        alt="logo"
        class="rounded mx-auto d-block custom-image"
      />
      <FormComponent @submitData="submitData($event)" :isLoading="isLoading" />
    </div>
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
  min-height: 100dvh;
}

.custom-image {
  width: clamp(140px, 40vw, 260px);
  margin-top: 4dvh;
  width: 80%;
}

@media (min-width: 768px) {
  .custom-image {
    width: clamp(160px, 24vw, 300px);
    margin-top: 5dvh;
  }
}

@media (min-width: 1024px) {
  .custom-image {
    width: clamp(180px, 16vw, 320px);
    margin-top: 6dvh;
  }
}
</style>
