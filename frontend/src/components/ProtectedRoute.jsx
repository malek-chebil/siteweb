import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader, Container, Text } from '@mantine/core'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader size="lg" />
      </Container>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default ProtectedRoute

