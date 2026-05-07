import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { AppBootstrap } from './AppBootstrap';

export function AppProvider() {
  return (
    <AppBootstrap>
      <RouterProvider router={router} />
    </AppBootstrap>
  );
}
