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

import { BASE_API_URL } from '@/utils/baseUrl.utils';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = BASE_API_URL;

axios.interceptors.response.use(undefined, (error) => {
    if (!error?.response) {
        // Network error, CORS block, timeout — no response from server
        return Promise.reject(error);
    }
    const { status } = error.response;
    if (status === 401 || status === 403) {
        store.dispatch('logout');
        localStorage.removeItem('userdata');
        return router.push('/login');
    }
    return Promise.reject(error);
});

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ToastPlugin)
app.component("font-awesome-icon", FontAwesomeIcon)
app.component("QuilEditor", QuillEditor)
app.directive('debounce', vueDebounce({ lock: true }));
app.mount('#app')
