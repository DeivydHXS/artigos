import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Routes from './routes'
import { AlertContextProvider } from './contexts/AlertContext'

function App() {
  return (
    <AuthProvider>
      <AlertContextProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AlertContextProvider>
    </AuthProvider>
  )
}

export default App
