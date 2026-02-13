import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Routes from "./routes"
import { AlertContextProvider } from "./contexts/AlertContext"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <AuthProvider>
        <AlertContextProvider>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </AlertContextProvider>
      </AuthProvider>
      <Toaster position="top-right"/>
    </>
  )
}

export default App
