export function esFechaHoy(fecha: string) {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = `${hoy.getMonth() + 1}`.padStart(2, "0");
    const day = `${hoy.getDate()}`.padStart(2, "0");

    return fecha === `${year}-${month}-${day}`;
}

export function puedeModificarProgramacion(rol: string | undefined, fechaSalida: string) {
    if (rol === "SISTEMAS") {
        return true;
    }

    return esFechaHoy(fechaSalida);
}
