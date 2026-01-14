import { useState } from "react"
import NewPasswordToken from "../../components/auth/NewPasswordToken";
import NewPasswordForm from "../../components/auth/NewPasswordForm";
import type { ConfirmToken } from "../../types";

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken['token']>('');
    const [isValidToken, setIsValidToken] = useState(false);
    return (
        <>
            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Restablecer Password
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Ingresa el token que te llegó por correo electrónico, después ingresa tu contraseña nueva.
                </p>
            </div>

            { !isValidToken ? (
                <NewPasswordToken 
                    token={token}
                    setToken={setToken}
                    setIsValidToken={setIsValidToken}
                />
            ) : (
                <NewPasswordForm 
                    token={token}
                />
            )}
        
        </>
    )
}
