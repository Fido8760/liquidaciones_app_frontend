import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../components/Logo";
import CustomNavLink from "./CustomNavLink";
import { useAuth } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";


export default function AppLayout() {
    const { data: user, isError, isLoading } = useAuth();
    const queryClient = useQueryClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);


    
    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN_LIQUIDACIONES');
        queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    }
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
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                {/* Spinner simple */}
                <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Cargando...</p>
                </div>
            </div>
        )
    }


    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">Sesión Expirada</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Redirigiendo al login...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si llegamos aquí, 'data' contiene tu objeto User validado por Zod
    if (user) return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
            <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
                <nav className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
                    
                    {/* LOGO */}
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-48 md:w-56">
                            <Logo />
                        </div>
                    </a>

                    {/* BOTÓN HAMBURGUESA (Móvil) */}
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

                    {/* MENÚ ESCRITORIO + PERFIL USUARIO */}
                    <div className="hidden w-full md:flex md:w-auto md:items-center md:gap-6">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
                            <CustomNavLink to="/" end>Inicio</CustomNavLink>
                            <CustomNavLink to="/operadores">Operadores</CustomNavLink>
                            <CustomNavLink to="/liquidaciones">Liquidaciones</CustomNavLink>
                            {user.rol === 'SISTEMAS' && (
                                <CustomNavLink to="/usuarios">Usuarios</CustomNavLink>
                            )}
                        </ul>

                        {/* SECCIÓN DE USUARIO (SOLO ESCRITORIO) */}
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
                        {/* Info Usuario Móvil */}
                        <li className="mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    Hola, {user.nombre} {user.apellido}
                                </p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                                            bg-purple-100 text-purple-700 
                                            dark:bg-purple-900/30 dark:text-purple-400
                                            border border-purple-200 dark:border-purple-800">
                                    {user.rol}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </li>

                        <CustomNavLink to="/" onClick={closeMenu} end>Inicio</CustomNavLink>
                        <CustomNavLink to="/operadores" onClick={closeMenu}>Operadores</CustomNavLink>
                        <CustomNavLink to="/liquidaciones" onClick={closeMenu}>Liquidaciones</CustomNavLink>
                        {user.rol === 'SISTEMAS' && (
                            <CustomNavLink to="/usuarios">Usuarios</CustomNavLink>
                        )}
                                                
                        {/* Botón Salir Móvil */}
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

            <main className="max-w-screen-3xl mx-auto p-4 md:p-6 lg:p-12 w-full flex-grow">
                <Outlet />
            </main>

            <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Muebles y Mudanzas Amado — Todos los derechos reservados.</p>
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
}