import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'; 

export const confirmationAlert = Swal.mixin({
    customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mx-2',
        cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg mx-2'
    },
    buttonsStyling: false, 
    background: document.body.classList.contains('dark') ? '#1f2937' : '#fff',
    color: document.body.classList.contains('dark') ? '#f9fafb' : '#111827',
});