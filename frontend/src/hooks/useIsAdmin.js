import { useQuery } from 'react-query'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

/**
 * Hook to check if the current user is an admin
 * @returns {Object} { isAdmin: boolean, isLoading: boolean }
 */
export const useIsAdmin = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()

  const { data: userProfile, isLoading } = useQuery(
    'user-profile',
    async () => {
      try {
        // Get user profile which includes is_admin field
        const response = await api.get('/users/me')
        return response.data
      } catch (error) {
        // If error, return null (user not authenticated or error)
        return null
      }
    },
    {
      enabled: isAuthenticated && !authLoading,
      retry: false,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  )

  return {
    isAdmin: userProfile?.is_admin ?? false,
    isLoading: isLoading || authLoading,
  }
}


