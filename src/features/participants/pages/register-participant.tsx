import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { NumberCircle } from '../components/number';
import FormDataPart from '../components/form-data-participant';
import FormTutor from '../components/form-tutor';
import { Button } from '@/components';
import FormAreaPart from '../components/form-areas-participant';
import FooterDesign from '@/components/ui/footer-design';

type FormData = {
  olimpista: {
    name: string;
    lastname: string;
    ci: string;
    email: string;
    phone: string;
    birthday: string;
    school: string;
    grade: string;
    depa: string;
    prov: string;
  };
  tutor: {
    name: string;
    lastname: string;
    ci: string;
    email: string;
    phone: string;
    rol: string;
  };
  areas: {
    selectedAreas: string[];
  };
};

export default function RegisterParticipant() {
  const [step, setStep] = useState(0);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      olimpista: { name: "", lastname: "", ci: "", email: "", phone: "", birthday: "", school: "", grade: "", depa: "", prov: "" },
      tutor: { name: "", lastname: "", ci: "", email: "", phone: "", rol: "" },
      areas: { selectedAreas: [] },
    },
  });

  const { handleSubmit, trigger, formState: { isValid }, watch } = methods;
  const selectedAreas = watch("areas.selectedAreas", []);

  const tabs = [
    { key: 'olimpista', label: 'Olimpista' },
    { key: 'tutor', label: 'Tutor' },
    { key: 'areas', label: 'Áreas' },
  ];

  const nextStep = async () => {
    const isStepValid = await trigger(); // Valida el formulario actual
    if (isStepValid) setStep((prev) => Math.min(prev + 1, tabs.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = (data: FormData) => {
    console.log("Formulario enviado con éxito:", data);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-screen z-10">
        <main className="flex-grow">
          <div className="w-full mx-auto mt-2 p-6">
            <h1 className="text-center text-primary headline-lg">
              Registro de Olimpista
            </h1>
            <Tabs value={tabs[step].key}>
              <TabsList className="flex mx-20">
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className={`flex items-center px-4 py-2 subtitle-md text-neutral2 w-1/3 justify-center ${
                      step === index
                        ? 'border-b-[5px] border-primary text-primary'
                        : 'border-b-[3px] border-neutral2 '
                    }`}
                  >
                    <NumberCircle number={index + 1} active={step === index} />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="olimpista">
                <FormDataPart />
              </TabsContent>

              <TabsContent value="tutor">
                <FormTutor />
              </TabsContent>

              <TabsContent value="areas">
                <FormAreaPart />
              </TabsContent>
            </Tabs>


            <div className="flex justify-between mx-20">
              <Button
                onClick={prevStep}
                disabled={step === 0}
                variantColor="variant2"
                label="Anterior"
              />
              {step === tabs.length - 1 ? (
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  label="Registrar"
                  disabled={selectedAreas.length === 0 || !isValid} // Deshabilitar si no hay áreas seleccionadas
                  variantColor={selectedAreas.length === 0 || !isValid ? 'variantDesactivate' : 'variant1'}
                />
              ) : (
                <Button
                  onClick={nextStep}
                  label="Siguiente"
                  disabled={!isValid}
                  variantColor={!isValid ? 'variantDesactivate' : 'variant1'}
                />
              )}
            </div>
          </div>
        </main>
        <div className='z-0'>
          {/*<FooterDesign />*/}
        </div>
      </div>
    </FormProvider>
  );
}
