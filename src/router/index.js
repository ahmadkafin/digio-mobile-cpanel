import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import ConfigView from '@/views/ConfigView.vue';
import FormView from '@/views/FormView.vue';

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
    path: '/login',
    name: 'login',
    meta: { guest: true },
    component: LoginView
  },
];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/digiomobilecpanel/'),
  routes,
})

router.beforeEach((to) => {
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const guestOnly = to.matched.some(r => r.meta.guest)
  const loggedIn = !!localStorage.getItem('userdata')
  if (requiresAuth && !loggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (guestOnly && loggedIn) {
    return { name: 'home' }
  }

})

export default router
