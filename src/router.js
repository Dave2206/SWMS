// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ComplainPage from './components/ComplainPage.vue';
import LandingPage from './components/LandingPage.vue'; 

const routes = [
  {
    path: '/',
    name: 'Landingpage',
    component: LandingPage, // The main page component
  },
  {
    path: '/ComplainPage',
    name: 'ComplainPage',
    component: ComplainPage
}
];

const router = createRouter({
  history: createWebHistory(), // Use browser history
  routes,
});

export default router;
