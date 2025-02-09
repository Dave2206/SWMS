// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ComplainPage from './components/ComplainPage.vue';
import LandingPage from './components/LandingPage.vue'; 
import AnnouncementPage from './components/AnnouncementPage.vue';
import ConcernPage from './components/ConcernPage.vue';
import MessagePage from './components/MessagePage.vue';
import ReportPage from './components/ReportPage.vue';
import AccountManagementPage from './components/AccountManagementPage.vue';
import DashboardPage  from './components/DashboardPage.vue';
import RoutesPage  from './components/AssignedRoutesPage.vue';

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
  },
  {
    path: '/AnnouncementPage',
    name: 'AnnouncementPage',
    component: AnnouncementPage
  },
  {
    path: '/ConcernPage',
    name: 'ConcernPage',
    component: ConcernPage
  },
  {
    path: '/MessagePage',
    name: 'MessagePage',
    component: MessagePage
  },
  {
    path: '/ReportPage',
    name: 'ReportPage',
    component: ReportPage
  },
  {
    path: '/AccountManagementPage',
    name: 'AccountManagementPage',
    component: AccountManagementPage
  },
  {
    path: '/DashboardPage',
    name: 'DashboardPage',
    component: DashboardPage
  },
  {
    path: '/RoutesPage',
    name: 'RoutesPage',
    component: RoutesPage
  },
];

const router = createRouter({
  history: createWebHistory(), // Use browser history
  routes,
});

export default router;
