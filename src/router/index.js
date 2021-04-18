import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import UserList from "../views/UserList"
import ExperienceList from "../views/ExperienceList"
import AboutTab from "../views/AboutTab"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/',
        name: 'userList',
        component: UserList
      },
      {
        path: '/experienceList',
        name: 'experienceList',
        component: ExperienceList
      },
      {
        path: '/about',
        name: 'about',
        component: AboutTab,
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
