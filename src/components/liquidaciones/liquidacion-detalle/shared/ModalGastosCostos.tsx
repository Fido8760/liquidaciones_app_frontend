import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GastoCombustible from '../gastoCombustible/GastoCombustible';
import CostoFlete from '../flete/Flete';
import Anticipo from '../anticipo/Anticipo';
import Gasto from '../gasto/Gasto';


export default function ModalGastosCostos( ) {

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalGasto = queryParams.get('modalGasto')
    const show = modalGasto ? true : false

    const param = useParams()
    const liquidacionId = +param.liquidacionId!
    
    const cerrarModal = () => {
        navigate(location.pathname, { replace: true})
    }

    const renderFormulario = () => {
        switch(modalGasto) {
            case 'combustible':
                return <GastoCombustible onSuccess={cerrarModal} liquidacionId={liquidacionId} />
            
            case 'flete':
                return <CostoFlete onSuccess={cerrarModal} liquidacionId={liquidacionId} />
            
            
            case 'anticipo':
                return <Anticipo onSuccess={cerrarModal} liquidacionId={liquidacionId} />

            case 'gasto':
                return <Gasto onSuccess={cerrarModal} liquidacionId={liquidacionId} />
                
            default:
                return null
        }
    }


    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={cerrarModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 text-left align-middle shadow-2xl transition-all p-8 space-y-6">
                                    <div className="flex justify-between items-center border-b pb-4">
                                        <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                            {modalGasto === 'combustible' && 'Registrar Gasto de Combustible'}
                                            {modalGasto === 'flete' && 'Ingresa el costo de los fletes'}
                                            {modalGasto === 'anticipo' && 'Ingresa los anticipos de viaje'}
                                            {modalGasto === 'gasto' && 'Ingresa los gastos de viaje (Casetas, Alimentos, Infracciones, etc)'}
                                        </Dialog.Title>
                                        <button
                                            onClick={cerrarModal}
                                            className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div>{renderFormulario()}</div>
                                </Dialog.Panel>


                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}