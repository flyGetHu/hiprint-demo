import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '物流面单打印系统'
    }
  },
  {
    path: '/designer',
    name: 'Designer',
    component: () => import('../views/Designer.vue'),
    meta: {
      title: '面单设计器 - 物流面单打印系统'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '物流面单打印系统'
  next()
})

export default router
