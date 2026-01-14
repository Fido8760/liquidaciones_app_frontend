import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import type { UserFormData } from "../../types";
import ErrorMessage from "../ErrorMessage";

const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white";
const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

type UserFormRegisterProps = {
    register: UseFormRegister<UserFormData>
    errors: FieldErrors<UserFormData>
    watch?: UseFormWatch<UserFormData>
    isEdit?: boolean
}
export default function UserForm({ register, errors, watch, isEdit }: UserFormRegisterProps) {
    const password = !isEdit && watch ? watch("password") : "";

    return (
        <div className=" space-y-8">
            <fieldset className=" p-4 border dark:border-gray-700 rounded-lg">
                <legend className=" px-2 text-base font-semibold text-gray-800 dark:text-gray-200">Información personal</legend>
                <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
                    <div>
                        <label htmlFor="nombre" className={labelStyles}>Nombre *</label>
                        <input 
                            type="text" 
                            id="nombre"
                            className={inputStyles}
                            placeholder="Nombre" 
                            {...register("nombre", {
                                required: "El nombre es obligatorio"
                            })}
                        />
                        <ErrorMessage>{errors.nombre?.message}</ErrorMessage>
                    </div>
                    <div>
                        <label htmlFor="apellido" className={labelStyles}>Apellido *</label>
                        <input 
                            type="text" 
                            id="apellido"
                            className={inputStyles}
                            placeholder="Apellido" 
                            {...register("apellido", {
                                required: "El apellido es obligatorio"
                            })}
                        />
                        <ErrorMessage>{errors.apellido?.message}</ErrorMessage>
                    </div>
                </div>
            </fieldset>

            <fieldset className=" p-4 border dark:border-gray-700 rounded-lg">
                <legend className=" px-2 text-base font-semibold text-gray-800 dark:text-gray-200">Acceso y Rol</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
                    <div className="md:col-span-1">
                        <label htmlFor="email" className={labelStyles}>Email *</label>
                       <input id="email" type="email" className={inputStyles} placeholder="correo@ejemplo.com"
                            {...register("email", { 
                                required: "El email es obligatorio",
                                pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" }
                            })} />
                        <ErrorMessage>{errors.email?.message}</ErrorMessage>
                    </div>
                    <div>
                        <label htmlFor="rol" className={labelStyles}>Rol de Usuario</label>
                        <select id="rol" className={inputStyles} {...register("rol", {
                            required: "El rol es obligatorio"
                        })}>
                            <option value="CAPTURISTA">Capturista</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="DIRECTOR">Director</option>
                            <option value="SISTEMAS">Sistemas</option>
                        </select>
                        <ErrorMessage>{errors.rol?.message}</ErrorMessage>
                    </div>

                    {!isEdit && (
                        <>
                        
                        
                            <div>
                                <label htmlFor="password" className={labelStyles}>Password</label>
                                <input type="password" id="password" className={inputStyles} placeholder="Mínimo 6 caracteres" {...register("password", {
                                    required: "El password el obligatorio",
                                    minLength: { value: 6, message: "Mínimo 6 caracteres"}
                                })}/>
                                <ErrorMessage>{errors.password?.message}</ErrorMessage>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className={labelStyles}>


                                    Confirmar Password
                                </label>
                                <input id="confirmPassword" type="password" className={inputStyles} placeholder="Repite el password"
                                    {...register("confirmPassword", { 
                                        required: "Debes confirmar el password",
                                        validate: value => value === password || "Los passwords no coinciden"
                                    })} />
                                <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
                            </div>
                        </>
                    )}
                </div>
            </fieldset>
        </div>
    )
}
