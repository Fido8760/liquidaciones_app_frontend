import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnidades } from "../../api/liquidaciones/LiquidacionAPI";
import { asignarUnidad } from "../../api/salidas/ProgramacionSalidas";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useEffect } from "react";

type AsignarUnidadForm = {
  unidadId: number;
};

type ModalAsignarUnidadProps = {
  salidaId: number | null;
  tipoUnidadSolicitado: string | undefined;
  onClose: () => void;
  isOpen: boolean;
};

export default function ModalAsignarUnidad({
  isOpen,
  salidaId,
  tipoUnidadSolicitado,
  onClose,
}: ModalAsignarUnidadProps) {

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AsignarUnidadForm>();

  // 🔄 Resetear formulario al abrir
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const { data: unidades, isLoading } = useQuery({
    queryKey: ["unidades"],
    queryFn: getUnidades,
    enabled: !!salidaId,
  });

    const { mutate, isPending } = useMutation({
        mutationFn: (dto: AsignarUnidadForm) =>
            asignarUnidad({ id: salidaId!, dto }),

        onError: (error: Error) => toast.error(error.message),

        onSuccess: () => {
            toast.success("Unidad asignada correctamente");
            queryClient.invalidateQueries({
            queryKey: ["programacion-salidas", "dia"],
            });
            onClose();
            reset();
        },
    });

    const onSubmitAsignacion = (data: AsignarUnidadForm) => {
    mutate(data);
    };

    if (!isOpen || !salidaId) return null;

    const unidadesFiltradas =
        unidades?.unidades.filter(
        (u) => u.tipo_unidad === tipoUnidadSolicitado
        ) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Asignar Unidad
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmitAsignacion)}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                            Unidades disponibles ({tipoUnidadSolicitado})
                        </label>

                        <select
                            className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                            {...register("unidadId", {
                                required: "Debes seleccionar una unidad",
                                valueAsNumber: true,
                            })}
                        >
                            <option value="">-- Seleccione --</option>
                            {unidadesFiltradas.map((u) => (
                                <option value={u.id} key={u.id}>
                                {u.no_unidad} - {u.u_placas}
                                </option>
                            ))}
                        </select>

                        {errors.unidadId && (
                            <ErrorMessage>{errors.unidadId.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                            type="button"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isPending || isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                            {isPending ? "Asignando..." : "Confirmar Asignación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}