import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LiquidacionForm from "../../components/liquidaciones/LiquidacionForm";
import type { LiquidacionFormData } from "../../types";
import { createLiquidacion, getOperadores, getUnidades } from "../../api/LiquidacionAPI";

export default function CrearLiquidacionView() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    const initialValues: LiquidacionFormData = {
        fecha_fin: "",
        fecha_llegada: "",
        fecha_inicio: "",
        rendimiento: 0,
        kilometros_recorridos: 0,
        cliente: "",
        unidadId: 0,
        operadorId: 0,
        folio_liquidacion: ""
    }

    const { data: unidades, isLoading: isUnidadesLoading } = useQuery({
        queryKey: ['unidades'],
        queryFn: getUnidades
    });
    
    const { data: operadores, isLoading: isOperadoresLoading } = useQuery({
        queryKey: ['operadores'],
        queryFn: getOperadores
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createLiquidacion,
        onError: (error) => {
            if (Array.isArray(error.message)) {
                error.message.forEach((msg: string) => toast.error(msg));
            } else {
                toast.error(error.message || 'Error al crear la liquidación');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liquidaciones']})
            toast.success('Liquidación creada correctamente')
            navigate('/')
        }
    }) 

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });
    const handleForm = (formData: LiquidacionFormData) => mutate(formData);
    
    // 3. ESTADO DE CARGA UNIFICADO Y PROFESIONAL (SKELETON)
    if (isUnidadesLoading || isOperadoresLoading) {
        return (
            <div className="max-w-4xl mx-auto animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-10"></div>
                <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg p-8 rounded-lg border border-gray-100 dark:border-gray-700 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded mt-8"></div>
                </div>
            </div>
        );
    }
    
    // Solo renderizar si tenemos los datos necesarios
    if (unidades && operadores) return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Liquidación</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Completa los campos para registrar una nueva liquidación.</p>
                </div>
                <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow">
                    Volver al Tablero
                </Link>
            </div>
            
            <form
                className="mt-8 bg-white dark:bg-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 p-8 rounded-xl border border-gray-200 dark:border-gray-700"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <LiquidacionForm
                    register={register}
                    errors={errors}
                    unidades={unidades}
                    operadores={operadores}
                />
                
                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isPending} // 4. DESHABILITAR MIENTRAS SE CREA
                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creando...
                            </>
                        ) : 'Crear Liquidación'}
                    </button>
                </div>
            </form>
        </div>
    );
}