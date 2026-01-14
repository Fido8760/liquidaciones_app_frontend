import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditarGastoCombustible from '../gastoCombustible/EditarGastoCombustible';
import EditarGastoCaseta from '../gastoCasetas/EditarGastoCaseta';
import EditarGastoVarios from '../gastoViaje/EditarGastoVarios';
import EditarCostoFlete from '../costoFlete/EditarCostoFlete';
import EditarDeduccion from '../deducciones/EditarDeduccion';
import EditarAnticipo from '../anticipo/EditarAnticipo';


export default function ModalEditarGastosCostos() {

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalGasto = queryParams.get('editar')
    const show = modalGasto ? true : false

    const param = useParams()
    const liquidacionId = +param.liquidacionId!
    
    const cerrarModal = () => {
        navigate(location.pathname, { replace: true})
    }

    const renderFormulario = () => {
        switch(modalGasto) {
            case 'combustible':
                return <EditarGastoCombustible onSuccess={cerrarModal} liquidacionId={liquidacionId} />
            
            case 'caseta':
                return <EditarGastoCaseta onSuccess={cerrarModal} liquidacionId={liquidacionId} />
            
            case 'varios':
                return <EditarGastoVarios onSuccess={cerrarModal} liquidacionId={liquidacionId} />
            
            case 'flete':
                return <EditarCostoFlete onSuccess={cerrarModal} liquidacionId={liquidacionId} />
            
            case 'deduccion':
                return <EditarDeduccion onSuccess={cerrarModal} liquidacionId={liquidacionId} />
            
            case 'anticipo':
                return <EditarAnticipo onSuccess={cerrarModal} liquidacionId={liquidacionId} />
                
            
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
                                            {modalGasto === 'combustible' && 'Edita el combustible'}
                                            {modalGasto === 'caseta' && 'Edita los gasto en casetas'}
                                            {modalGasto === 'varios' && 'Edita otros gastos de viaje'}
                                            {modalGasto === 'flete' && 'Edita el costo del flete'}
                                            {modalGasto === 'deduccion' && 'Edita las deduciones del viaje'}
                                            {modalGasto === 'anticipo' && 'Edita los anticipos'}
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