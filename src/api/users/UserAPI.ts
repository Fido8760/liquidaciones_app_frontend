import { isAxiosError } from "axios";
import api from "../../lib/axios";
import { userResponseSchema, userSchema, type User, type UserFormData, type UserState } from "../../types";

export async function getAllUsers() {
    try {
        const url = '/users';
        const { data } = await api.get(url);
        const response = userResponseSchema.safeParse(data);
        if (!response.success) {
            throw new Error("Respuesta inválida del servidor");
        }
        return response.data;
        
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

export async function createUsers(formData: UserFormData) {
    try {
        const url = '/users';
        const { data } = await api.post<{message: string}>(url, formData);
        return data
        
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
        
    }
}

export async function getUserById(id: User['id']) {
    try {
        const url = `/users/${id}`;
        const { data } = await api.get<User>(url);
        const response = userSchema.safeParse(data);
        if (!response.success) {
            throw new Error("Respuesta inválida del servidor");
        }
        return response.data;
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
    }
}

type UpdateUserAPIType = {
    formData: UserFormData,
    userId: User['id']
}

export async function updateUser({ formData, userId}: UpdateUserAPIType ) {
    try {
        const url = `/users/${userId}`;
        const { data } = await api.put<{message: string}>(url, formData);
        return data
 
    } catch (error) {

         if (isAxiosError(error) && error.response) {
            const errorData = error.response.data as { message: string };
            const errorMessage = errorData.message
            throw new Error(errorMessage)
        }
        throw new Error("Error desconocido")
    }
}

type ChangeUserStateParams = {
    userId: User['id'];
    formData: UserState;
};

export async function changeUserState({ userId, formData }: ChangeUserStateParams) {
  try {
    const url = `/users/${userId}/estado`;
    const { data } = await api.patch<{ message: string }>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data as { message: string };
      throw new Error(errorData.message);
    }
    throw new Error("Error desconocido");
  }
}
