import imageCompression from "browser-image-compression";

export async function prepararArchivo(evidencia: FileList): Promise<File | null> {
    if(!evidencia || evidencia.length === 0) return null;
    const file = evidencia[0];

    if(file.type.startsWith('image/')){
        const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: 'image/webp'
        });
        return new File([compressed], 'evidencia.webp', { type: 'image/webp' });
    }

    return file;
}