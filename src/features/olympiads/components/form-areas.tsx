import { Button, InputText } from '../../../components';
import { useState } from 'react';
import CardUploadImage from './card-upload-image';

const FormAreas = () => {
    const [inputValue, setInputValue] = useState("");

  return (
    <div className='my-16 max-w-4xl mx-auto px-4'>
        <form>
            <div className='flex flex-col'>
                <h1 className='text-center text-2xl sm:text-3xl font-bold text-primary'>
                    Registro de Áreas de Competencia de Olimpiada
                </h1>
                <h1 className='text-center text-xl sm:text-2xl font-semibold text-primary'>
                    Gestión 2025
                </h1>
                <div className='flex flex-col sm:flex-row justify-between items-center my-7 gap-5'>
                    <div className='w-full sm:max-w-[540px]'>      
                    <InputText
                    label="Nombre del Área"
                    name="inputArea"
                    placeholder="Ingrese nombre del área"
                    type="text"
                    className="w-[540px]"
                    labelPadding='py-5'
                    register={() => {}}
                    errors={{}}
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    validationRules={{}}
                    />
                    </div>
                    <div className='w-full sm:max-w-[400px]'>
                        <CardUploadImage/>
                    </div>
                </div>
                <Button
                    label='Agregar'
                />
                <h1 className='subtitle-md text-primary my-5'>
                    Áreas agregadas
                </h1>
                <div className='flex flex-row justify-end space-x-5'>
                    <Button
                        label='Cancelar'
                        variantColor='variant2'
                    />
                    <Button
                        label='Registrar'
                    />
                </div>
            </div>
        </form>
    </div>
  )
}

export default FormAreas