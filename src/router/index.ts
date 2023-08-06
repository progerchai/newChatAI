import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/Home/HomeView.vue';
import AboutView from '../views/AboutUs/index.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
});

export default router;
