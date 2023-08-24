import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutUs/index.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/User/login.vue'),
    },
  ],
});

export default router;
