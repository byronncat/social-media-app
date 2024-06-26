import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import {
  AuthenticationHoc,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  useAuthenticationContext,
} from '@authentication';
import { DashboardHoc, HomePage, ExplorePage, ProfilePage } from '@core';
import { ErrorPage } from '@global';
import { ROUTE } from '@route';

const Router = () => {
  const { isLoggedIn: isAuthenticated } = useAuthenticationContext();
  const router = createBrowserRouter([
    {
      path: '*',
      element: <ErrorPage />,
    },
    {
      element: isAuthenticated ? (
        <DashboardHoc />
      ) : (
        <Navigate to={ROUTE.LOGIN} />
      ),
      errorElement: <ErrorPage />,
      children: [
        { path: ROUTE.HOME, element: <HomePage /> },
        { path: ROUTE.EXPLORE, element: <ExplorePage /> },
        { path: ROUTE.PROFILE, element: <ProfilePage /> },
      ],
    },
    {
      element: isAuthenticated ? (
        <Navigate to={ROUTE.HOME} />
      ) : (
        <AuthenticationHoc />
      ),
      errorElement: <ErrorPage />,
      children: [
        { path: ROUTE.LOGIN, element: <LoginPage /> },
        { path: ROUTE.REGISTER, element: <RegisterPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'reset-password', element: <ResetPasswordPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
