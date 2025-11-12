import { useQuery } from 'react-query'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

/**
 * Hook to check if the current user is an admin
 * @returns {Object} { isAdmin: boolean, isLoading: boolean }
 */
export const useIsAdmin = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()

  const { data: isAdmin, isLoading } = useQuery(
    'user-is-admin',
    async () => {
      try {
        // Try to access admin stats endpoint - if user is admin, this will work
        await api.get('/admin/stats')
        return true
      } catch (error) {
        if (error.response?.status === 403) {
          return false
        }
        // If it's a network error or other error, return false
        return false
      }
    },
    {
      enabled: isAuthenticated && !authLoading,
      retry: false,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  )

  return {
    isAdmin: isAdmin ?? false,
    isLoading: isLoading || authLoading,
  }
}


