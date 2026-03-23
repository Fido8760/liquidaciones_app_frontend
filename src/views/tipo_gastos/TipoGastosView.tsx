import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth"
import { createTipoGasto, deleteTipoGasto, getTipoGastos, toggleActivoTipoGasto, updateTipoGasto } from "../../api/gastos/tipo-gastos/TipoGastosAPI";
import { Navigate } from "react-router-dom";
import TipoGastosTable from "../../components/tipo_gastos/TipoGastosTable";
import { useState } from "react";
import type { TipoGasto } from "../../types";
import { toast } from "react-toastify";
import ModalTipoGasto from "../../components/tipo_gastos/ModalTipoGasto";
import Swal from "sweetalert2";

export default function TipoGastosView() {
    const { data: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const[showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<TipoGasto | null>(null);
    const [nombre, setNombre] = useState('');
    const invalidar = () => queryClient.invalidateQueries({ queryKey: ['tipo-gastos']});

    const { mutate: toggle } = useMutation({
        mutationFn: toggleActivoTipoGasto,
        onError: (error) => toast.error(error.message),
        onSuccess: () => invalidar()
    });

    const { mutate: eliminar } = useMutation({
        mutationFn: deleteTipoGasto,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
            invalidar();
        }
    });

    const { mutate: guardar, isPending } = useMutation({
        mutationFn: editando ? (nombre: string) => updateTipoGasto({ id: editando.id, nombre }) : createTipoGasto,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success(editando ? 'Tipo Actualizado' : 'Tipo Creado');
            invalidar();
            cerrarModal();
        }
    });

    const abrirCrear = () => {
        setEditando(null);
        setNombre('');
        setShowModal(true);
    };

    const abrirEditar = (tipo: TipoGasto) => { 
        setEditando(tipo);
        setNombre(tipo.nombre);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setEditando(null);
        setNombre('');
    };

    const handleSubmit = () => {
        if(!nombre.trim()) {
            return toast.error('El nombre es obligatorio')
        }
        guardar(nombre);
    }

    const { data: tipoGastos, isError, isLoading } = useQuery({
        queryKey: ['tipo-gastos'],
        queryFn: getTipoGastos,
        enabled: !!currentUser
    });


    const handleEliminar = (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) eliminar(id);
        });
    };

    if(currentUser && currentUser.rol !== 'SISTEMAS' ) {
        return <Navigate to={"/"} replace />;
    }

    if(isLoading) return (
        <div className="flex justify-center items-center h-screen text-gray-500">
            <svg className="animate-spin h-8 w-8 mr-3 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
        </div>
    );

    if( currentUser?.rol !== 'SISTEMAS' ) {
        return <Navigate to={"/"} replace />
    }

    if (isError) return <p className="p-10 text-center text-red-500 font-bold">Error al cargar la liquidación. Verifica tu conexión.</p>
    
    if( tipoGastos ) return (
        <>
            <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className=" text-3xl font-bold leading-6 text-gray-900 dark:text-white">Tipos de Gasto</h1>
                        <p className=" mt-2 text-sm text-gray-700 dark:text-gray-400">Catálogo de tipos de gasto disponibles para las liquidaciones.</p>
                    </div>
                </div>
                <div className=" mt-8 flow-root">
                    <TipoGastosTable 
                        tipoGastos={tipoGastos.data} 
                        total={tipoGastos.total} 
                        onAgregar={abrirCrear} 
                        onEditar={abrirEditar} 
                        onEliminar={(id) => handleEliminar(id)} 
                        onToggle={toggle} 
                    />
                </div>
            </div>
            <ModalTipoGasto
                isOpen={showModal}
                onClose={cerrarModal}
                onSubmit={handleSubmit}
                nombre={nombre}
                setNombre={setNombre}
                isPending={isPending}
                editando={!!editando}
            />
        
        </>
    )
}
