import { ThemeProvider, ToastProvider, Toast } from '@librechat/client';
import * as RadixToast from '@radix-ui/react-toast';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { router } from './routes';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RadixToast.Provider>
          <ToastProvider>
            <RouterProvider router={router} />
            <Toast />
            <RadixToast.Viewport className="pointer-events-none fixed inset-0 z-[1000] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5" />
          </ToastProvider>
        </RadixToast.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
