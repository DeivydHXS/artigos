import type React from "react";
import { Route, Routes as WebRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ShowArticle from "../pages/ShowArticle";
import Profile from "../pages/Profile";
import Articles from "../pages/Articles";
import Write from "../pages/Write";
import Favorites from "../pages/Favorites";
import NotFound from "../pages/NotFound";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import ResetPassword from "../pages/ResetPassword";
import LoginProblems from "../pages/LoginProblems";

const Routes: React.FC = () => {

    return (
        <WebRoutes>
            <Route element={<MainLayout />}>
                <Route path='' index element={<Home />} />
                <Route path='article/:articleId' element={<ShowArticle />} />
                <Route path='profile' element={<Profile />} />
                <Route path='articles' element={<Articles />} />
                <Route path='write' element={<Write />} />
                <Route path='write/:articleId' element={<Write />} />
                <Route path='favorites' element={<Favorites />} />
            </Route>
            <Route element={<AuthLayout />}>
                <Route index path='login' element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="email/verify/:user_id/:hash" element={<VerifyEmail />} />
                <Route path="login-problems" element={<LoginProblems />} />
                <Route path="reset-password/:email/:hash" element={<ResetPassword />} />
            </Route>
            <Route path='*' element={<NotFound />} />
        </WebRoutes>
    );

};

export default Routes;
