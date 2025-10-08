import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "core-js"
import "jquery"
import "popper.js"
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import { FontAwesomeIcon } from './plugins/fontawesome.plugins';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import axios from 'axios';
import vueDebounce from 'vue-debounce';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASEURL;

axios.interceptors.response.use(undefined, (error) => {
    if (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            store.dispatch('logout');
            localStorage.removeItem('userdata');
            return router.push("/login");
        } else if (error.response.status === 404) {
            return Promise.reject(error);
        } else if (error.response.status === 400) {
            return Promise.reject(error);
        } else if (error.response.status === 409) {
            return Promise.reject(error);
        } else if (error.response.status === 413) {
            return Promise.reject(error);
        } else if (error.response.status === 500) {
            return Promise.reject(error);
        }
    }
});

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ToastPlugin)
app.component("font-awesome-icon", FontAwesomeIcon)
app.component("QuilEditor", QuillEditor)
app.directive('debounce', vueDebounce({ lock: true }));
app.mount('#app')
