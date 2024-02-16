import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from "@/views/SignUp.vue";
import SignIn from "@/views/SignIn.vue";
import ProfileView from "@/views/ProfileView.vue";
import MainAnalyseComponent from "@/components/analyses/MainAnalyseComponent.vue";
import MainMedComponent from "@/components/medications/MainMedComponent.vue";

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
      component: SignUp
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      children: [
        {
          path: '/analyses',
          name: 'analyses',
          component: MainAnalyseComponent
        },
        {
          path: '/medications',
          name: 'medications',
          component: MainMedComponent
        }
      ]
    }
  ]
})

export default router
