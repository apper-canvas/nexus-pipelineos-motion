import DashboardPage from '@/components/pages/DashboardPage';
import ContactsPage from '@/components/pages/ContactsPage';
import CompaniesPage from '@/components/pages/CompaniesPage';
import DealsPage from '@/components/pages/DealsPage';
import TasksPage from '@/components/pages/TasksPage';
import ReportsPage from '@/components/pages/ReportsPage';
import HomePage from '@/components/pages/HomePage';
import EmailTemplatesPage from '@/components/pages/EmailTemplatesPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: DashboardPage
  },
  emailTemplates: {
    id: 'emailTemplates',
    label: 'Email Templates',
    path: '/email-templates',
    icon: 'Mail',
    component: EmailTemplatesPage
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
component: ContactsPage
  },
  companies: {
    id: 'companies',
    label: 'Companies',
    path: '/companies',
    icon: 'Building2',
component: CompaniesPage
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Target',
component: DealsPage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
component: TasksPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'FileText',
component: ReportsPage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
component: NotFoundPage
  }
};

export const routeArray = Object.values(routes);