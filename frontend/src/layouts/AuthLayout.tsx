import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <main className="h-screen flex flex-col gap-2 items-center justify-center">
            <Outlet />
        </main>
    );
};

export default AuthLayout;