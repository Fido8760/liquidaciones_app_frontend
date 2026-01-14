import { isAxiosError } from "axios";
import api from "../../lib/axios";
import { userSchema, type ConfirmToken, type ForgotPasswordForm, type NewPasswordForm, type UserLoginForm } from "../../types";

export async function authenticateUser(formData: UserLoginForm) {
    try {
        const url = '/auth/login';
        const { data } = await api.post<string>(url, formData);
        localStorage.setItem('AUTH_TOKEN_LIQUIDACIONES', data);
        return data;
        
    } catch (error) {
        if ( isAxiosError(error) && error.response ) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
    }
    
}

export async function getUser() {
    try {
        const url = '/auth/user';
        const { data } = await api.get(url);
        const response = userSchema.safeParse(data);
        
        if ( response.success ) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
    }
        throw new Error("Error al obtener el perfil del usuario");
    }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
    try {
        const url = '/auth/forgot-password';
        const { data } = await api.post<{message: string}>(url, formData)
        return data.message;
        
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error al enviar las instrucciones")
        
    }
}

export async function validateToken(formData: ConfirmToken) {
    try {
        const url = '/auth/validate-token';
        const { data } = await api.post<{message: string}>(url, formData)
        return data.message;
        
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error al enviar las instrucciones")
        
    }
}

export async function updatePasswordWithToken({formData, token}: {formData: NewPasswordForm, token: ConfirmToken['token']}) {
    try {
        const url = `/auth/reset-password/${token}`;
        const { data } = await api.post<{message: string}>(url, formData)
        return data.message;
        
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error al enviar las instrucciones")
        
    }
}