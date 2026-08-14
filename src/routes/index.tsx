import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import LoginPage from '~/pages/auth/LoginPage';
import RegisterPage from '~/pages/auth/RegisterPage';
import ForgetPasswordPage from '~/pages/auth/ForgetPasswordPage';
import ResetPasswordPage from '~/pages/auth/ResetPasswordPage';
import GitHubOAuth from '~/pages/auth/GitHubOAuth';
import LarkOAuth from '~/pages/auth/LarkOAuth';
import OidcOAuth from '~/pages/auth/OidcOAuth';
import NotFoundPage from '~/pages/NotFoundPage';
import AuthGuard from '~/components/AuthGuard';
import AdminGuard from '~/components/AdminGuard';
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
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'reset', element: <ForgetPasswordPage /> },
      { path: 'user/reset', element: <ResetPasswordPage /> },
      { path: 'oauth/github', element: <GitHubOAuth /> },
      { path: 'oauth/lark', element: <LarkOAuth /> },
      { path: 'oauth/oidc', element: <OidcOAuth /> },
      {
        path: 'panel',
        element: <AuthGuard />,
        children: [
          {
            element: <PanelLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'dashboard', element: <DashboardPage /> },
              {
                path: 'channel',
                element: (
                  <AdminGuard>
                    <ChannelsPage />
                  </AdminGuard>
                ),
              },
              { path: 'token', element: <TokensPage /> },
              { path: 'log', element: <LogsPage /> },
              {
                path: 'redemption',
                element: (
                  <AdminGuard>
                    <RedemptionPage />
                  </AdminGuard>
                ),
              },
              { path: 'topup', element: <TopupPage /> },
              {
                path: 'user',
                element: (
                  <AdminGuard>
                    <UsersPage />
                  </AdminGuard>
                ),
              },
              { path: 'profile', element: <ProfilePage /> },
              {
                path: 'setting',
                element: (
                  <AdminGuard>
                    <SettingsPage />
                  </AdminGuard>
                ),
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
