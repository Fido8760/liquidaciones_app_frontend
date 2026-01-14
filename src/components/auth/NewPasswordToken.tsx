import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { Link } from 'react-router-dom';
import type { ConfirmToken } from '../../types';
import { useMutation } from '@tanstack/react-query';
import { validateToken } from '../../api/auth/AuthApi';
import { toast } from 'react-toastify';

type NewPasswordTokenProps = {
    token: ConfirmToken['token']
    setToken: React.Dispatch<React.SetStateAction<string | null>>
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewPasswordToken({token, setToken, setIsValidToken}: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data)
            setIsValidToken(true)
        }
    })    
    const handleChange = (token: string) => {
        setToken(token)
    }

    const handleComplete = (token: string) => {
        mutate({token})
    }

    return (
        <>
            <form className=" space-y-6 mt-4">
                <label className="block text-center text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                    Ingresa el código aquí
                </label>
                
                <div className="flex justify-center gap-4">
                    <PinInput 
                        value={token || ''} 
                        onChange={handleChange} 
                        onComplete={handleComplete}
                    >
                        <PinInputField className="h-12 w-12 rounded-lg border-0 text-center text-lg font-bold shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800 text-gray-900 dark:text-white transition-all" />
                        <PinInputField className="h-12 w-12 rounded-lg border-0 text-center text-lg font-bold shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800 text-gray-900 dark:text-white transition-all" />
                        <PinInputField className="h-12 w-12 rounded-lg border-0 text-center text-lg font-bold shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800 text-gray-900 dark:text-white transition-all" />
                        <PinInputField className="h-12 w-12 rounded-lg border-0 text-center text-lg font-bold shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800 text-gray-900 dark:text-white transition-all" />
                        <PinInputField className="h-12 w-12 rounded-lg border-0 text-center text-lg font-bold shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800 text-gray-900 dark:text-white transition-all" />
                        <PinInputField className="h-12 w-12 rounded-lg border-0 text-center text-lg font-bold shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 dark:focus:ring-purple-500 dark:bg-gray-800 text-gray-900 dark:text-white transition-all" />
                        
                    </PinInput>
                </div>
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/olvide-password'
                    className="text-center text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm font-medium"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </>
    )
}