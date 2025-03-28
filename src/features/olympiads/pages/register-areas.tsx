import FooterDesign from '../../../components/footer-design';
import FormAreas from '../components/form-areas';

export const RegisterAreas = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="flex flex-col">
          <div className="z-10">
            <FormAreas />
          </div>
        </div>
      </main>
      {/* El footer se mantiene al final con flexbox */}
      <div className="z-0">
        <FooterDesign />
      </div>
    </div>
  );
};
