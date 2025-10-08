<template>
  <Form
    @submit="submitData"
    :validation-schema="schema"
    :initial-values="{ directory: 'pertamina' }"
  >
    <div class="position-absolute top-50 start-50 translate-middle login-wrapper">
      <div class="mb-3">
        <Field name="directory" v-slot="{ field, meta, errors }">
          <select
            id="directory"
            class="form-select"
            v-bind="field"
            :class="{
              'is-invalid': meta.touched && meta.invalid,
              'is-valid': meta.touched && meta.valid,
            }"
          >
            <option value="pertamina" selected>Pertamina</option>
            <option value="pgasol">Pgasol</option>
          </select>
        </Field>
      </div>

      <div class="mb-3">
        <Field name="username" v-slot="{ field, meta, errors }">
          <input
            v-bind="field"
            type="text"
            class="form-control"
            id="username"
            placeholder="Username"
            :class="{
              'is-invalid': meta.touched && meta.invalid,
              'is-valid': meta.touched && meta.valid,
            }"
          />
          <small v-if="meta.touched && errors[0]" class="text-danger">
            {{ errors[0] }}
          </small>
        </Field>
      </div>

      <div class="mb-3">
        <Field name="password" v-slot="{ field, meta, errors }">
          <input
            type="password"
            id="password"
            placeholder="Password"
            class="form-control"
            v-bind="field"
            :class="{
              'is-invalid': meta.touched && meta.invalid,
              'is-valid': meta.touched && meta.valid,
            }"
          />
          <small v-if="meta.touched && errors[0]" class="text-danger">
            {{ errors[0] }}
          </small>
        </Field>
      </div>

      <div :class="['position-relative', isLoading ? 'mt-2 py-5' : '']">
        <div v-show="isLoading" class="overlay">
          <span class="loader"></span>
        </div>

        <div :class="['d-grid', 'gap-2', isLoading ? 'hide-button' : '']">
          <button class="btn btn-success btn-sm" :disabled="isLoading">Submit</button>
          <!-- <div ref="googleBtn"></div> -->
        </div>
      </div>
    </div>
  </Form>
</template>
<script>
import { Form, ErrorMessage, Field } from 'vee-validate'
import * as yup from 'yup'
export default {
  name: 'FormComponent',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: ['isLoading'],
  mounted() {
    const waitGoogle = () =>
      new Promise((res) => {
        if (window.google?.accounts?.id) return res()
        const i = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(i)
            res()
          }
        }, 50)
      })

    waitGoogle().then(() => {
      window.google.accounts.id.initialize({
        client_id: this.gSignId,
        callback: this.handleCredentialResponse,
        ux_mode: 'popup',
      })
      window.google.accounts.id.renderButton(
        this.$refs.googleBtn,
        { theme: 'outline', size: 'large', type: 'standard' }, // opsi tombol
      )
      // Optional: One Tap
      // window.google.accounts.id.prompt()
    })
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required('Username is required'),
      password: yup.string().required('Password is required'),
      directory: yup.string().oneOf(['pertamina', 'pgasol']).required('Directory is required'),
    })
    return {
      loading: false,
      messages: '',
      schema,
      username: '',
      gSignId: import.meta.env.VITE_APP_G_CLIENT_ID,
    }
  },
  methods: {
    submitData(user) {
      this.$emit('submitData', user)
    },
    handleCredentialResponse(response) {
      // kirim response.credential (JWT) ke backend kamu untuk verifikasi
      this.$emit('googleAuth', response.credential)
    },
  },
}
</script>

<style scoped>
.login-wrapper {
  width: clamp(300px, 90vw, 480px);
  background-color: rgb(231 152 0);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(2px);
}

.hide-button {
  display: none !important;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

@media (min-width: 768px) {
  .login-wrapper {
    width: clamp(360px, 70vw, 520px);
    padding: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .login-wrapper {
    width: clamp(420px, 40vw, 560px);
    padding: 1.5rem;
  }
}
</style>
