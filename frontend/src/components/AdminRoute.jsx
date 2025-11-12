import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader, Container, Text, Alert } from '@mantine/core'
import { useQuery } from 'react-query'
import api from '../lib/api'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  
  // Fetch user profile to check admin status
  const { data: userProfile, isLoading: profileLoading } = useQuery(
    'user-profile',
    async () => {
      try {
        // Try to access admin stats endpoint - if user is admin, this will work
        const response = await api.get('/admin/stats')
        return { isAdmin: true }
      } catch (error) {
        if (error.response?.status === 403) {
          return { isAdmin: false }
        }
        throw error
      }
    },
    {
      enabled: isAuthenticated && !authLoading,
      retry: false,
    }
  )
  
  if (authLoading || profileLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader size="lg" />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (userProfile && !userProfile.isAdmin) {
    return (
      <Container size="md" style={{ marginTop: '2rem' }}>
        <Alert color="red" title="Access Denied">
          <Text>You must be an administrator to access this page.</Text>
        </Alert>
      </Container>
    )
  }
  
  return children
}

export default AdminRoute

