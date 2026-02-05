export const comisionDefaultUnidad = (tipoUnidad: string): number => {
    switch (tipoUnidad) {
         case 'TRACTOCAMION':
            return 18;
        case 'MUDANCERO':
            return 20;
        case 'CAMIONETA':
            return 0;
        default:
            return 0;
    }
}