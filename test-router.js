import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home' }, { path: '/detail', name: 'detail' }]
})

await router.push('/')
await router.push({ name: 'detail', state: { payload: 'hello' } })
console.log(history.state)
