import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Subcourse from '../components/course/Subcourse'
import Subinfo from '../components/info/Subinfo'
import Subsc from '../components/sc/Subsc'
import Subuser from '../components/user/Subuser'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [{
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    }, {
      path: '/subcourse',
      name: 'Subcourse',
      component: Subcourse
    }, {
      path: '/subinfo',
      name: 'Subinfo',
      component: Subinfo
    }, {
      path: '/subsc',
      name: 'Subsc',
      component: Subsc
    }, {
      path: '/subuser',
      name: 'Subuser',
      component: Subuser
    }]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const uid = window.sessionStorage.getItem('uid')
  if (!uid) return next('/login')
  next()
})

export default router
