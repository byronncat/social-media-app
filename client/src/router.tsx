import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  AuthenticationHoc,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '@authentication'
import { RootLayout, HomePage, ExplorePage, ProfilePage } from '@core'
import { ErrorPage } from '@global'

export default function Router() {
  const router = createBrowserRouter([
    {
      path: '*',
      element: <ErrorPage />,
    },
    {
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: 'explore', element: <ExplorePage /> },
        { path: 'profile/:uid', element: <ProfilePage /> },
      ],
    },
    {
      element: <AuthenticationHoc />,
      errorElement: <ErrorPage />,
      children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'reset-password', element: <ResetPasswordPage /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
