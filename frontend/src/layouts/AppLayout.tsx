import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLoadContext } from "../hooks/useContext";
import { AuthContext } from "../contexts/AuthContext";

const AppLayout = () => {
  const { user, loading } = useLoadContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex justify-center px-6 py-8">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
