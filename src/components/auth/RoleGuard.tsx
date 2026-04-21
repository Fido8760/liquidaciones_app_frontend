import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorQuery from "../ui/ErrorQuery";
import { useAuth } from "../../hooks/useAuth";

type RoleGuardProps = {
    allowedRoles: string[];
    redirectTo?: string;
};

export default function RoleGuard({ allowedRoles, redirectTo = "/" }: RoleGuardProps) {
    const { data: user, isLoading, isError } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner mensaje="Validando permisos..." />;
    }

    if (isError || !user) {
        return <ErrorQuery mensaje="No se pudieron validar tus permisos." onRetry={() => window.location.reload()} />;
    }

    if (!allowedRoles.includes(user.rol)) {
        return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    return <Outlet />;
}
