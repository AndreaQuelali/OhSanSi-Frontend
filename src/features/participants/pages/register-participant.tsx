import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { NumberCircle } from '../components/number';
import FormDataPart from '../components/form-data-participant';
import FormTutor from '../components/form-tutor';
import { Button } from '@/components';
import FormAreaPart from '../components/form-areas-participant';
import FooterDesign from '@/components/ui/footer-design';

export default function RegisterParticipant() {
  const [step, setStep] = useState(0);
  const tabs = [
    { key: 'olimpista', label: 'Olimpista' },
    { key: 'tutor', label: 'Tutor' },
    { key: 'areas', label: 'Áreas' },
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, tabs.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="w-full mx-auto mt-2 p-6">
          <h1 className="text-center text-primary headline-lg">
            Registro de Olimpista
          </h1>
          <Tabs value={tabs[step].key}>
            <TabsList className="flex justify-center w-full max-w-6xl mx-auto border-b-[1px] border-neutral2">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className={`flex-1 flex items-center justify-center px-4 py-2 subtitle-md text-neutral2 ${
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
          <div className="flex flex-col-reverse md:flex-row justify-center md:justify-between px-4 md:px-10 gap-4">
            <Button
              onClick={prevStep}
              disabled={step === 0}
              variantColor="variant2"
              label="Anterior"
            />
            <Button
              onClick={nextStep}
              label={step === tabs.length - 1 ? 'Registrar' : 'Siguiente'}
            />
          </div>
        </div>
      </main>
      {/* <FooterDesign /> */}
    </div>
  );
}
