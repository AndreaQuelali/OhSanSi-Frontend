import { Button, InputText } from '../../../components';
import { useForm } from "react-hook-form";
import { useState } from "react";
import CardUploadImage from './card-upload-image';

type FormData = {
  inputArea: string;
};

const FormAreas = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormData>({
    mode: "onChange", 
  });

  const [image, setImage] = useState<File | null>(null); // Estado para la imagen

  const onSubmit = (data: FormData) => {
    if (!image) {
      return; // Evita el envío si no hay imagen
    }
    console.log("Formulario enviado con éxito:", { ...data, image });
  };

  return (
    <div className='my-16 mx-64'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col'>
                <h1 className='text-center headline-lg text-primary'>
                    Registro de Áreas de Competencia de Olimpiada
                </h1>
                <h1 className='text-center headline-md text-primary'>
                    Gestión 2025
                </h1>
                <div className='flex flex-row justify-between my-7 gap-9'>
                    <div>      
                        <InputText
                            label="Nombre del Área"
                            name="inputArea"
                            placeholder="Ingrese nombre del área"
                            type="text"
                            className="w-[400px]"
                            labelPadding='py-5'
                            register={register}
                            errors={errors}
                            validationRules={{
                                required: "Debe ingresar el nombre del área",
                                pattern: {
                                    value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s-]+$/,
                                    message: "Solo se permiten letras, espacios, acentos y guion",
                                },
                            }}
                        />
                    </div>
                    <div className='w-[400px]'>
                        <CardUploadImage onChange={setImage} /> {/* Pasamos la función que actualiza el estado */}
                    </div>
                </div>
                <Button
                    type="submit" 
                    label='Agregar'
                    disabled={!isValid || !image} // Deshabilita si no es válido o no hay imagen
                    variantColor={!isValid || !image ? "variantDesactivate" : "variant1"} 
                />
                <h1 className='subtitle-md text-primary my-5'>
                    Áreas agregadas
                </h1>
                <div className='flex flex-row justify-end space-x-5'>
                    <Button label='Cancelar' variantColor='variant2' />
                    <Button label="Registrar"/>
                </div>
            </div>
        </form>
    </div>
  )
}

export default FormAreas;
