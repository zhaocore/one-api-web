import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import DemoPage from '~/pages/DemoPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <DemoPage />,
      },
    ],
  },
]);
