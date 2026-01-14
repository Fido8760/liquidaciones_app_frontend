import { useNavigate } from "react-router-dom";
import type { Liquidacion } from "../../../../types";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnticipo } from "../../../../api/AnticipoAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2"
import { formatCurrency } from "../../../../utils/formatCurrency";
import { useLiquidacionPermissions } from "../../../../hooks/useLiquidacionPermissions";

type DetalleAnticipoProps = { liquidacion: Liquidacion };

export default function DetalleAnticipo({ liquidacion }: DetalleAnticipoProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { canEdit } = useLiquidacionPermissions(liquidacion)

    const { mutate } = useMutation({
      mutationFn: deleteAnticipo,
      onError: (error) => {
          toast.error(error.message)
      },
      onSuccess: (data) => {
          toast.success(data)
          queryClient.invalidateQueries({ queryKey: ['liquidacion', liquidacion.id]})
      }
  })

  const handleDeleteClick = (deduccionId: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(deduccionId)
            }
        })
  }

  if (liquidacion.anticipos) return (
    <div className="p-4">
      <nav className=" my-5 flex gap-3 justify-between items-center">
        <p className="text-sm font-semibold mb-4 dark:text-white">
          Detalle de los anticipos
        </p>
        {canEdit && (
          <button
            type="button"
            className=" bg-purple-400 hover:bg-purple-500 cursor-pointer px-5 py-1 text-white text-sm font-bold transition-colors rounded-lg"
            onClick={() => navigate("?modalGasto=anticipo")}
          >Agregar Anticipo</button>
        )}
      </nav>
      <ul className="space-y-2">
        {liquidacion.anticipos.length > 0 ? (
          liquidacion.anticipos.map((anticipo) => (
            <li
              key={anticipo.id}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 border rounded-xl p-4 shadow-sm dark:border-gray-400"
            >
              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <p className="dark:text-white">
                  <span className="font-medium dark:text-amber-200">
                    Monto:
                  </span>{" "}
                  {formatCurrency(anticipo.monto)}
                </p>
                <p className="dark:text-white">
                  <span className="font-medium dark:text-gray-300">
                    Descripción:
                  </span>{" "}
                  {anticipo.tipo}
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                {canEdit && (
                  <>
                    <button
                      type="button"
                      onClick={() =>navigate(location.pathname + `?editar=anticipo&anticipoId=${anticipo.id}`) }
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      aria-label="Editar gasto"
                    ><PencilIcon className=" h-4 w-4" /> Editar{" "}</button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(anticipo.id)}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      aria-label="Eliminar gasto"
                    ><TrashIcon className=" h-4 w-4" /> Eliminar{" "}</button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            No hay gastos de casetas registrados
          </p>
        )}
      </ul>
    </div>
  );
}
