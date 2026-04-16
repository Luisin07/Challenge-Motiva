import { createBrowserRouter } from 'react-router';
import Dashboard from './pages/Dashboard';
import TrechoDetail from './pages/TrechoDetail';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Dashboard,
  },
  {
    path: '/trecho/:id',
    Component: TrechoDetail,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
