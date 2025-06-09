import { Button, ButtonIcon, InputText } from "@/components";
import CloseIcon from "@/components/icons/close";
import { useForm } from "react-hook-form";


export const ResponsibleModal = ({ onClose, text, onConfirm, children }: ModalProps) => {

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors, isValid },
      } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {},
      });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <form>
                <div
                    className="absolute inset-0 bg-neutral2 opacity-40"
                    onClick={onClose}
                />
                <div className="w-[600px] h-auto bg-white rounded-xl p-6 relative z-50">
                    <div className="w-full flex justify-end">
                        <ButtonIcon
                            icon={CloseIcon}
                            onClick={onClose}
                            variantColor="variant2"
                        />
                    </div>
                    <h2 className="subtitle-md text-primary mb-4">{text}</h2>
                    <div className="mb-4">{children}</div>
                    <div className="flex flex-col w-full">
                            <InputText
                            label="Cédula de identidad del responsable"
                            name="ci"
                            placeholder="Ingresar cédula de identidad del responsable"
                            className="w-full"
                            register={register}

                            errors={errors}
                            />
                    </div>
                    <div className="flex flex-row justify-end space-x-4 mb-2">
                        <Button onClick={onClose} label="Cancelar" variantColor="variant2" />
                        <Button onClick={onConfirm} label="Aceptar" />
                    </div>
                </div>
            </form>
        </div>
    );
};
