import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">

      {/* Logo fixa no topo */}
      <div className="absolute top-8 text-2xl font-bold">
        <span className="text-primary">Commit</span>.dev
      </div>

      <Outlet />

    </main>
  );
};

export default AuthLayout;
