import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import LoginPage from '~/pages/auth/LoginPage';
import RegisterPage from '~/pages/auth/RegisterPage';
import PanelLayout from '~/layout/layout';
import DashboardPage from '~/pages/DashboardPage';
import ChannelsPage from '~/pages/ChannelsPage';
import TokensPage from '~/pages/TokensPage';
import LogsPage from '~/pages/LogsPage';
import RedemptionPage from '~/pages/RedemptionPage';
import TopupPage from '~/pages/TopupPage';
import UsersPage from '~/pages/UsersPage';
import ProfilePage from '~/pages/ProfilePage';
import SettingsPage from '~/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'panel',
        element: <PanelLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'channel', element: <ChannelsPage /> },
          { path: 'token', element: <TokensPage /> },
          { path: 'log', element: <LogsPage /> },
          { path: 'redemption', element: <RedemptionPage /> },
          { path: 'topup', element: <TopupPage /> },
          { path: 'user', element: <UsersPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'setting', element: <SettingsPage /> },
        ],
      },
      { index: true, element: <LoginPage /> },
    ],
  },
]);
