import type { Liquidacion } from '../../types'; // Asegúrate de que Liquidacion tenga un 'id'
import LiquidacionesKanban from './LiquidacionesKanban';
import LiquidacionesListMobile from './mobile/LiquidacionesListMobile';

type LiquidacionesListProps = {
    liquidaciones: Liquidacion[];
}


export default function LiquidacionesList({ liquidaciones }: LiquidacionesListProps) {
    return (
        <>
            <div className=' hidden md:block h-full'>
                <LiquidacionesKanban liquidaciones={liquidaciones}/>
            </div>

            <div className='md:hidden h-full'>
                <LiquidacionesListMobile liquidaciones={liquidaciones} />
            </div>
        </>
    );
}