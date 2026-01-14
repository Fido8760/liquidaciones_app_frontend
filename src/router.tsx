import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./views/DashboardView";
import CrearLiquidacionView from "./views/liquidaciones/CrearLiquidacionView";
import DetalleLiquidacionView from "./views/liquidaciones/DetalleLiquidacionView";
import EditarLiquidacionView from "./views/liquidaciones/EditarLiquidacionView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import NewPasswordView from "./views/auth/NewPasswordView";
import UsersView from "./views/users/UsersView";
import UserCreateView from "./views/users/UserCreateView";
import UserEditView from "./views/users/UserEditView";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView />} index />
                    <Route path="/liquidaciones/crear" element={<CrearLiquidacionView />} />
                    <Route path="/liquidaciones/:liquidacionId" element={<DetalleLiquidacionView />} />
                    <Route path="/liquidaciones/:liquidacionId/editar" element={<EditarLiquidacionView />} />
                    <Route path="/usuarios" element={<UsersView />} />
                    <Route path="/usuarios/crear" element={<UserCreateView />} />
                    <Route path="/usuarios/:userId/editar" element={<UserEditView />} />
                </Route>

                <Route element={<AuthLayout />}>

                    <Route path="/auth/login" element={<LoginView />} />
                    <Route path="/auth/olvide-password" element={<ForgotPasswordView />} />
                    <Route path="/auth/nuevo-password" element={<NewPasswordView />} />
                
                </Route>
            </Routes>
        </BrowserRouter>
    )
}