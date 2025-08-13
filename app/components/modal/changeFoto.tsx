'use client';

import { getCroppedImg } from "@/lib/cropUtils";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";

interface Crop {
    x: number;
    y: number;
}

interface Area {
    width: number;
    height: number;
    x: number;
    y: number;
}

export default function ChangeFoto(props: any) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const [salvando, setSalvando] = useState(false);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file) {
                const imageDateUrl = await readFile(file);
                setImageSrc(imageDateUrl);
            }
        }
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // const handleCropImage = async () => {
    //     if (!imageSrc || !croppedAreaPixels) return;
    //     try {
    //         const croppedImage = await getCroppedImg(
    //             imageSrc,
    //             croppedAreaPixels,
    //         );
    //         console.log('donee', { croppedImage });
    //         setCroppedImage(croppedImage);

    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result as string), false);
            reader.readAsDataURL(file);
        });
    };

    const handleSaveImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setSalvando(true);

            const croppedImg = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
            );
            // console.log('donee', { croppedImg });

            const response = await fetch('/api/cadastrar/foto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: props.userId,
                    croppedImage: croppedImg,
                }),
            });

            if (response.ok) {
                //alert('Imagem de perfil atualizada com sucesso!');
                props.close();
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error('Erro ao salvar imagem: ', errorData.error);
                alert('Erro ao salvar imagem: ' + errorData.error);
            }
        } catch (err) {
            console.error('Erro ao enviar imagem para a API: ', err);
            alert('Erro ao enviar imagem para a API.');
        } finally {
            setSalvando(false);
        }
    };

    const handleClose = () => {
        setImageSrc(null);
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.type = "text";
            inputRef.current.type = "file";
        }
        props.close();
    };

    return (
        <>
        <div className={`${props.isOpen ? '' : 'hidden'} fixed top-0 left-0 z-50`}>
            <div className="fixed bg-black opacity-40 w-full h-full" onClick={handleClose}></div>
            <div className="fixed bg-white dark:bg-gray-800 shadow-lg p-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg max-h-[720px] min-w-96 w-[600px] h-[600px] overflow-y-auto">
                <button className="cursor-pointer absolute top-2 right-2" onClick={handleClose}>
                    <svg className="w-6 h-6 text-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                </button>
                <div className="flex flex-col items-center">
                    <input type="file" accept="image/*" onChange={onFileChange} ref={inputRef} className="hidden" />
                    <button onClick={() => inputRef.current?.click()} className="cursor-pointer py-2 px-4 rounded bg-teal-500 hover:bg-teal-600 transition ease-in-out duration-100 text-white font-medium uppercase">Selecionar imagem</button>
                    {
                        imageSrc ?
                        <div className="relative w-[400px] h-[400px] m-[20px]">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                restrictPosition={false}
                            />
                        </div>
                        :
                        <img src={props.fotoAtual} alt="" className=" w-2/3 mt-6" />
                    }
                    {
                        imageSrc &&
                        <div>
                            <button onClick={handleSaveImage} disabled={salvando} className="cursor-pointer py-2 px-4 rounded bg-teal-500 hover:bg-teal-600 transtion ease-in-out duration-100 text-white font-medium uppercase">
                                {
                                    salvando ?
                                    <div role="status" className="flex justify-center">
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    :
                                    'Salvar'
                                }
                            </button>
                        </div>
                    }
                    {
                        croppedImage &&
                        <div className="w-[200px] h-[200px] rounded-full overflow-hidden m-[20px]">
                            <img src={croppedImage} alt="Cropped" className="w-full h-full object-cover" />
                        </div>
                    }
                </div>
            </div>
        </div>
        </>
    );
}