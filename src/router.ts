import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    scrollToTop?: boolean
    keepAlive?: boolean
  }
}

import InfoList from './views/InfoList.vue'
import viedo from './views/viedo.vue'
import NotFind from './views/NotFind.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: InfoList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/info/:id',
    component: viedo,
    props: route => ({
      id: route.params.id,
    }),
    meta: { scrollToTop: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFind,
    meta: { scrollToTop: true }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    let position: { left: number, top: number } = {
      left: 0,
      top: 0,
    }
    if (to.meta.scrollToTop) {
      position.left = 0
      position.top = 0
    } else {
      return false
    }
    return position
  },
  routes
})

export default router
