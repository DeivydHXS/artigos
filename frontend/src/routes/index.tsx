import React, { Suspense, lazy } from "react";
import { Route, Routes as WebRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import NotFound from "../pages/NotFound";

const Feed = lazy(() => import("../pages/Feed"));
const ShowArticle = lazy(() => import("../pages/ShowArticle"));
const Profile = lazy(() => import("../pages/Profile"));
const Articles = lazy(() => import("../pages/Articles"));
const Write = lazy(() => import("../pages/Write"));
const Favorites = lazy(() => import("../pages/Favorites"));

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const LoginProblems = lazy(() => import("../pages/LoginProblems"));

const Routes: React.FC = () => {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <WebRoutes>
                <Route element={<MainLayout />}>
                    <Route index path="feed" element={<Feed />} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="favorites" element={<Favorites />} />
                    <Route path="articles/:articleId" element={<ShowArticle />} />
                    <Route path="write" element={<Write />} />
                    <Route path="write/:articleId" element={<Write />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="email/verify/:user_id/:hash" element={<VerifyEmail />} />
                    <Route path="login-problems" element={<LoginProblems />} />
                    <Route path="reset-password/:email/:hash" element={<ResetPassword />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </WebRoutes>
        </Suspense>
    );
};

export default Routes;
