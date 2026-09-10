import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import ConfigView from '@/views/ConfigView.vue';
import FormView from '@/views/FormView.vue';
import apiServices from '@/services/api.services';
import { useToast } from 'vue-toast-notification';
import VideoProductsView from '@/views/VideoProductsView.vue';
import VideoProductsDetailView from '@/views/VideoProductsDetailView.vue';
import VideoProductsAddView from '@/views/VideoProductsAddView.vue';

const ALLOWED_PARENT_ORIGIN = 'https://digio.pgn.co.id';
const ALLOWED_REFERRER = 'https://digio.pgn.co.id/digio/pages/admin/mobilecpanel.aspx';

// I4/S1 fix: listen for postMessage auth from parent frame.
// Parent should send: window.frames[0].postMessage({ type: 'iframeAuth', uuid: '<token>' }, '*')
window.addEventListener('message', async (event) => {
  if (event.origin !== ALLOWED_PARENT_ORIGIN) return;
  if (event.data?.type !== 'iframeAuth' || !event.data?.uuid) return;
  try {
    await store.dispatch('loginIframe', event.data.uuid);
    // Navigate to home after postMessage auth succeeds
    if (router.currentRoute.value.name !== 'home') {
      router.push({ name: 'home' });
    }
  } catch (err) {
    console.error('postMessage loginIframe failed', err);
  }
});

const routes = [
  {
    path: '/',
    redirect: {
      name: 'home'
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'home',
    meta: { requiresAuth: true },
    component: HomeView
  },
  {
    path: '/config/:path',
    name: 'config',
    meta: { requiresAuth: true },
    component: ConfigView
  },
  {
    path: '/config/:path/form/:uuid',
    name: 'form',
    meta: { requiresAuth: true },
    component: FormView
  },
  {
    path: '/config/:path/video',
    name: 'video',
    meta: { requiresAuth: true },
    component: VideoProductsView
  },
  {
    path: '/config/:path/view',
    name: 'video-detail',
    meta: { requiresAuth: true },
    component: VideoProductsDetailView,
  },
  {
    path: '/config/video/add',
    name: 'video-add',
    meta: { requiresAuth: true },
    component: VideoProductsAddView,
  },
  {
    path: '/login',
    name: 'login',
    meta: { guest: true },
    component: LoginView
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  // I3 fix: wrap parent DOM access in try/catch — throws DOMException on cross-origin frames
  try {
    const contentMaster = window.parent.document.querySelector('#contentMaster');
    if (contentMaster) {
      contentMaster.style.overflowX = 'hidden';
    }
  } catch (_) {
    // Cross-origin parent frame — cannot access parent DOM, which is expected
  }

  const uuid = to.query?.uuid;
  if (uuid) {
    // I4/S1: referrer can be empty in modern browsers (Referrer-Policy: strict-origin-when-cross-origin).
    // Accept login if referrer matches OR if referrer is empty (postMessage is the preferred secure path).
    const ref = document.referrer;
    const referrerAllowed = ref === ALLOWED_REFERRER || ref === '';
    if (referrerAllowed) {
      try {
        await store.dispatch('loginIframe', uuid);
        return { name: 'home' };
      } catch (err) {
        console.error('loginIframe failed', err);
        return { name: 'login' };
      }
    } else {
      useToast().error("hmmm... seems you're not on digio")
    }
  } else {
    const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
    const guestOnly = to.matched.some(r => r.meta.guest)
    const loggedIn = !!localStorage.getItem('userdata')

    if (requiresAuth && !loggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (guestOnly && loggedIn) {
      return { name: 'home' }
    }
  }
})

export default router
