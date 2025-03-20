import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '../stores/token'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/Users/user.vue'

const routes = [
  {
    path: '/',
    redirect: '/library'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('../views/library/home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  const isAuthenticated = !!tokenStore.token

  console.log('路由守卫 - 目标路径:', to.path)
  console.log('路由守卫 - 是否已认证:', isAuthenticated)

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('需要登录，重定向到登录页面')
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    console.log('已登录，重定向到图书馆页面')
    next('/library')
  } else {
    next()
  }
})

export default router 