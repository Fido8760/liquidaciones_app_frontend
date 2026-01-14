import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout() {
    return (
        <>
            <div className=' min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
                <div className=' sm:mx-auto sm:w-full sm:max-w-md'>
                    <div className='flex justify-center'>
                        <div className=' w-64'>
                            <Logo />
                        </div>
                    </div>
                    <h2 className=' mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100'>Sistemas de Administración de Liquidaciones</h2>
                </div>
                <div className=' mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
                    <div className=' bg-white dark:bg-gray-900 px-6 py-12 shadow-xl sm:rounded-xl sm:px-12 border border-gray-200 dark:border-gray-800'>
                        <Outlet />
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />


        
        </>
    )
}
