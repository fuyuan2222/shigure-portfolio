import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PortfolioAllView from '../views/PortfolioAllView.vue'
import AboutView from '../views/AboutView.vue'
import LinksView from '../views/LinksView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioAllView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/links',
      name: 'links',
      component: LinksView,
    },
  ],
})

export default router