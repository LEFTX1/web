import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/init',
  name: 'Init',
  component: () => import('@/view/init/index.vue')
},
{
  path: '/login',
  name: 'Login',
  component: () => import('@/view/login/index.vue')
},
{
  path: '/form/login',
  name: 'FormLogin',
  component: () => import('@/view/formvalidator/login.vue')
},
{
  path: '/form/addcourse',
  name: 'FormAddCourse',
  component: () => import('@/view/formvalidator/addcourse.vue')
},
{
  path: '/form/test',
  name: 'FormTest',
  component: () => import('@/view/formvalidator/test.vue')
},
{
  path: '/form/reg',
  name: 'FormReg',
  component: () => import('@/view/formvalidator/reg.vue')
},
{
  path: '/:catchAll(.*)',
  meta: {
    closeTab: true,
  },
  component: () => import('@/view/error/index.vue')
}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
