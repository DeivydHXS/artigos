import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useLoadContext } from "../hooks/useContext";
import { AuthContext } from "../contexts/AuthContext";

const MainLayout = () => {
  const { user } = useLoadContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="h-screen flex flex-col items-center gap-2">
      <Navbar />
      <section className="w-[80vw] flex justify-center">
        <Outlet />
      </section>
    </main>
  );
};

export default MainLayout;
