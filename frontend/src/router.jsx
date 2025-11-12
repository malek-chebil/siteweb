import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './layouts/Layout'
import { AdminLayout } from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ListingDetailPage from './pages/ListingDetailPage'
import ListingEditorPage from './pages/ListingEditorPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import MyListingsPage from './pages/MyListingsPage'
import FavoritesPage from './pages/FavoritesPage'
import UserProfilePage from './pages/UserProfilePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminModerationPage from './pages/AdminModerationPage'
import AdminUsersPage from './pages/AdminUsersPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ErrorBoundary from './components/ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: (
          <ErrorBoundary>
            <SearchPage />
          </ErrorBoundary>
        ),
      },
      {
        path: 'listing/:id',
        element: <ListingDetailPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallbackPage />,
      },
              {
                path: 'my-listings',
                element: (
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'favorites',
                element: (
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'profile',
                element: (
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                ),
              },
      {
        path: 'listing/new',
        element: (
          <ProtectedRoute>
            <ListingEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'listing/:id/edit',
        element: (
          <ProtectedRoute>
            <ListingEditorPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'moderation',
        element: <AdminModerationPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
    ],
  },
])

