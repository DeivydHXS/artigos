import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
    

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