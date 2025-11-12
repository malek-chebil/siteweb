import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/carousel/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'
import './index.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from 'react-query'
import { theme } from './styles/theme'
import './i18n'
import { AuthProvider } from './context/AuthContext.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MantineProvider theme={theme}>
            <Notifications />
            <App />
          </MantineProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

