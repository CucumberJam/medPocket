import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'signup',
      component: ()=> import("@/views/SignUp.vue")
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import("@/views/SignIn.vue")
    },
    {
      path: '/resetpass',
      name: 'resetpass',
      component: () => import("@/views/ForgotPasswordView.vue")
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import("@/views/ProfileView.vue"),
      children: [
        {
          path: '/analyses',
          name: 'analyses',
          component: () => import("@/components/analyses/MainAnalyseComponent.vue")
        },
        {
          path: '/medications',
          name: 'medications',
          component: () => import("@/components/medications/MainMedComponent.vue")
        }
      ]
    }
  ]
})

export default router
