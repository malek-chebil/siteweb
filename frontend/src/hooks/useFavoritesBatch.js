import { useQuery } from 'react-query'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

/**
 * Hook to check multiple listings' favorite status in a single API call.
 * This optimizes performance by reducing the number of API calls from N to 1.
 * 
 * @param {number[]} listingIds - Array of listing IDs to check
 * @returns {Object} Object mapping listing_id to is_favorited boolean
 */
export const useFavoritesBatch = (listingIds = []) => {
  const { isAuthenticated } = useAuth()

  const { data, isLoading } = useQuery(
    ['favorites-batch', listingIds.sort((a, b) => a - b).join(',')],
    async () => {
      if (!listingIds.length) return {}
      
      const response = await api.post('/favorites/check-batch', { listing_ids: listingIds })
      return response.data
    },
    {
      enabled: isAuthenticated && listingIds.length > 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    }
  )

  return {
    favoritesMap: data || {},
    isLoading,
  }
}

