import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/auth/AuthApi";

export const useAuth = () => {
    const  { data, isError, isLoading } = useQuery({
        queryKey: ['auth-user'],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false,
    })
    return { data, isError, isLoading }
}