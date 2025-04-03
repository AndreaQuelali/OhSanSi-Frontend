import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { NumberCircle } from '../components/number';
import FormDataPart from '../components/form-data-participant';
import FormTutor from '../components/form-tutor';
import { Button, ButtonIcon } from '@/components';
import FormAreaPart from '../components/form-areas-participant';
import IconClose from '@/components/icons/icon-close';

export default function RegisterParticipant() {
  const [step, setStep] = useState(0);
  const savedData = localStorage.getItem('participantData');
  const defaultValues = savedData
    ? JSON.parse(savedData)
    : {
        olimpista: {
          name: '',
          lastname: '',
          ci: '',
          email: '',
          phone: '',
          birthday: '',
          school: '',
          grade: '',
          depa: '',
          prov: '',
        },
        tutor: {
          name: '',
          lastname: '',
          ci: '',
          email: '',
          phone: '',
          rol: '',
        },
        areas: { selectedAreas: [] },
      };

  const methods = useForm({
    mode: 'onChange',
    defaultValues,
  });

  const {
    trigger,
    formState: { isValid },
  } = methods;

  const tabs = [
    { key: 'olimpista', label: 'Olimpista' },
    { key: 'tutor', label: 'Tutor' },
    { key: 'areas', label: 'Áreas' },
  ];

  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      const formData = methods.getValues();
      localStorage.setItem('participantData', JSON.stringify(formData));

      setStep((prev) => Math.min(prev + 1, tabs.length - 1));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col min-h-screen mb-28">
        <main className="flex-grow">
          <div className="w-full mx-auto mt-2 p-6">
            <div className="flex flex-row justify-end mx-10">
              <ButtonIcon icon={IconClose} />
            </div>
            <h1 className="text-center text-primary headline-lg">
              Registro de Olimpista
            </h1>
            <Tabs value={tabs[step].key}>
              <TabsList className="flex justify-center w-full max-w-6xl mx-auto border-b-[1px] border-neutral2">
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

            <div
              className={`flex flex-col-reverse md:flex-row px-4 md:px-10 gap-4 
              ${step === 0 ? 'justify-end' : 'justify-between'}`}
            >
              {' '}
              {step > 0 && (
                <Button
                  onClick={prevStep}
                  variantColor="variant2"
                  label="Anterior"
                />
              )}
              {step === tabs.length - 1 ? null : (
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
      </div>
    </FormProvider>
  );
}
