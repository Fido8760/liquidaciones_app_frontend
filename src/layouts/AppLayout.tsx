import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../components/Logo";
import CustomNavLink from "./CustomNavLink";
import { useAuth } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorQuery from "../components/ui/ErrorQuery";

export default function AppLayout() {
    const { data: user, isError, isLoading } = useAuth();
    const queryClient = useQueryClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);
    const navigate = useNavigate();

    const homePath = user?.rol === 'VENTAS' ? '/programacion-salidas' : '/';
    const mostrarInicio = user?.rol !== 'VENTAS';
    const mostrarOperadores = user?.rol !== 'CAPTURISTA' && user?.rol !== 'VENTAS';
    const mostrarLiquidaciones = user?.rol !== 'VENTAS';
    const mostrarProgramacion = user?.rol !== 'CAPTURISTA';

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN_LIQUIDACIONES');
        queryClient.invalidateQueries({ queryKey: ['auth-user'] });
        navigate('/auth/login');
    };

    useEffect(() => {
        if (isError) {
            toast.error('Tu sesión ha expirado. Redirigiendo al login...', {
                autoClose: 2000,
            });

            const timer = setTimeout(() => {
                window.location.href = '/auth/login';
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isError]);

    if (isLoading) {
        return (
            <LoadingSpinner mensaje="Verificando las credenciales..." />
        );
    }

    if (isError) {
        return (
            <ErrorQuery mensaje="No se pudo verificar tu sesión. Redirigiendo al login..." onRetry={() => window.location.href = '/auth/login'} />
        );
    }

    if (user) return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
            <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
                <nav className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
                    <a href={homePath} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-48 md:w-56">
                            <Logo />
                        </div>
                    </a>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-expanded={isMenuOpen}
                        aria-controls="navbar-menu"
                        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        <span className="sr-only">{isMenuOpen ? "Cerrar menú" : "Abrir menú"}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>

                    <div className="hidden w-full md:flex md:w-auto md:items-center md:gap-6">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
                            {mostrarInicio && <CustomNavLink to="/" end>Inicio</CustomNavLink>}
                            {mostrarOperadores && <CustomNavLink to="/operadores">Operadores</CustomNavLink>}
                            {mostrarLiquidaciones && <CustomNavLink to="/liquidaciones">Liquidaciones</CustomNavLink>}
                            {user.rol === 'SISTEMAS' && <CustomNavLink to="/usuarios">Usuarios</CustomNavLink>}
                            {mostrarProgramacion && <CustomNavLink to="/programacion-salidas" end>Programación de Salidas</CustomNavLink>}
                        </ul>

                        <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-gray-700">
                            <div className="text-right">
                                <div className=" flex items-center gap-2 justify-end">
                                    <p className=" text-sm font-bold text-gray-900 dark:text-white">{user.nombre} {user.apellido}</p>
                                    <span className=" inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                        {user.rol}
                                    </span>
                                </div>
                                <p className=" text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg transition-colors"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </nav>

                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300"
                        onClick={closeMenu}
                        aria-hidden="true"
                    />
                )}
                <div
                    id="navbar-menu"
                    className={`absolute top-full left-0 w-full bg-white dark:bg-gray-900 md:hidden 
                            transition-all duration-300 ease-in-out border-b border-gray-200 
                            dark:border-gray-800 shadow-lg z-30 ${
                                isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                            }`}
                >
                    <ul className="font-medium flex flex-col p-4 space-y-2">
                        <li className="mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    Hola, {user.nombre} {user.apellido}
                                </p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                                    {user.rol}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </li>

                        {mostrarInicio && <CustomNavLink to="/" onClick={closeMenu} end>Inicio</CustomNavLink>}
                        {mostrarOperadores && <CustomNavLink to="/operadores" onClick={closeMenu}>Operadores</CustomNavLink>}
                        {mostrarLiquidaciones && <CustomNavLink to="/liquidaciones" onClick={closeMenu}>Liquidaciones</CustomNavLink>}
                        {user.rol === 'SISTEMAS' && <CustomNavLink to="/usuarios">Usuarios</CustomNavLink>}
                        {mostrarProgramacion && <CustomNavLink to="/programacion-salidas" onClick={closeMenu} end>Programación Salidas</CustomNavLink>}

                        <li className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={() => { closeMenu(); logout(); }}
                                className="w-full text-left block py-2 px-3 text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-800 rounded font-medium"
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </header>

            <main className="w-full flex-grow">
                <Outlet />
            </main>

            <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Muebles y Mudanzas Amado - Todos los derechos reservados.</p>
            </footer>

            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                theme="colored"
                limit={3}
                className="md:bottom-4 md:right-4 bottom-16 right-4"
            />
        </div>
    );

    return null;
}
