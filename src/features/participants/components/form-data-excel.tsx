import { Button, InputText, Modal } from "@/components";
import CardUploadFile from "./card-upload-file";
import { useNavigate } from "react-router";
import { useState, useRef } from "react";
import IconDownload from "@/components/icons/icon-download";
import axios from "axios";
import { API_URL } from "@/config/api-config";
import { TablaOlimpistas } from "./table-data-excel";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";

interface OlimpistaRow {
  Nombre: string;
  Apellido: string;
  CIOlimpista: string;
  FechadeNacimiento: string;
  Correoelectronico: string;
  Departamento: string;
  Provincia: string;
  UnidadEducativa: string;
  Grado: string;
  NombresTutorLegal: string;
  ApellidosTutorLegal: string;
  CITutorLegal: string;
  CelularTutorLegal: string;
  CorreoelectronicoTutorLegal: string;
  Area: string;
  NivelCategoria: string;
  NombresProfesor: string;
  ApellidosProfesor: string;
  CIProfesor: string;
  CelularProfesor: string;
  CorreoelectronicoProfesor: string;
}

interface FormFields {
  ci_responsable: string;
}

export default function FormDataExcel() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: formFieldsValid },
    watch,
  } = useForm<FormFields>({
    mode: 'all',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState<string | null>(null);
  const [olimpistas, setOlimpistas] = useState<OlimpistaRow[]>([]);
  const [rawDataToSend, setRawDataToSend] = useState<any[][]>([]); 
  const inputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleClearFile = () => {
    setFileName(null);
    setOlimpistas([]);
    setRawDataToSend([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleConfirmRegister = async () => {
    setShowModal(false);
    await handleRegister();
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    setFileName(file.name);
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`${API_URL}/olimpistas/excel`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const rawData: any[][] = response.data.data;
      setRawDataToSend(rawData);
  
      const parsedData: OlimpistaRow[] = rawData.map((row) => ({
        Nombre: row[0] ?? "",
        Apellido: row[1] ?? "",
        CIOlimpista: row[2]?.toString() ?? "",
        FechadeNacimiento: row[3]?.toString() ?? "",
        Correoelectronico: row[4] ?? "",
        Departamento: row[5] ?? "",
        Provincia: row[6] ?? "",
        UnidadEducativa: row[7] ?? "",
        Grado: row[8] ?? "",
        NombresTutorLegal: row[9] ?? "",
        ApellidosTutorLegal: row[10] ?? "",
        CITutorLegal: row[11]?.toString() ?? "",
        CelularTutorLegal: row[12]?.toString() ?? "",
        CorreoelectronicoTutorLegal: row[13] ?? "",
        Area: row[14] ?? "",
        NivelCategoria: row[15] ?? "",
        NombresProfesor: row[16] ?? "",
        ApellidosProfesor: row[17] ?? "",
        CIProfesor: row[18]?.toString() ?? "",
        CelularProfesor: row[19]?.toString() ?? "",
        CorreoelectronicoProfesor: row[20] ?? "",
      }));
  
      setOlimpistas(parsedData);
    } catch (error) {
      console.error("Error al procesar el archivo Excel", error);
      alert("No se pudo procesar el archivo. Asegúrate de que el formato es correcto.");
      handleClearFile();
    } finally {
      setIsLoading(false); 
    }
  };  

  const handleRegister = async () => {
    if (rawDataToSend.length === 0) return alert("No hay datos para registrar.");
  
    const ciResponsable = watch("ci_responsable");
    if (!ciResponsable) return alert("Debe ingresar el CI del responsable.");
  
    try {
      const response2 = await axios.post(`${API_URL}/registro/excel`, {
        ci_responsable_inscripcion: ciResponsable,
        data: rawDataToSend,
      });
  
      const resultado = response2.data.resultado;

      const erroresProfesoresFiltrados = (resultado?.profesores_errores || []).filter(
        (item: { ci: number | null | undefined }) => item.ci !== null && item.ci !== undefined
      );
  
      const errores = [
        ...(resultado?.tutores_errores || []),
        ...(resultado?.olimpistas_errores || []),
        ...erroresProfesoresFiltrados, 
      ];
  
      const omitidos = [
        ...(resultado?.tutores_omitidos || []),
        ...(resultado?.profesores_omitidos || []),
      ];
  
      if (errores.length > 0 || omitidos.length > 0) {
        let mensaje = "Algunos datos no fueron registrados correctamente:\n\n";
  
        if (omitidos.length > 0) {
          mensaje += "Omitidos:\n";
          omitidos.forEach((item) => {
            mensaje += `• CI: ${item.ci} - ${item.message}\n`;
          });
          mensaje += "\n";
        }
  
        if (errores.length > 0) {
          mensaje += "Errores:\n";
          errores.forEach((item) => {
            const errorData = JSON.parse(item.error || "{}");
            mensaje += `• CI: ${item.ci ?? "No se colocó el CI"} - ${errorData.message || "El olimpista no tiene tutor legal"}\n`;
          });
        }
  
        alert(mensaje);
      } else {
        alert("Datos registrados correctamente.");
      }
  
      console.log("Res:", rawDataToSend);
      console.log("Respuesta del backend:", response2.data);
  
    } catch (error) {
      console.error("Error al registrar los datos:", error);
      alert("Hubo un error al registrar los datos. Verifique el formato del excel y que no haya campos vacíos.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form className="mx-5 mt-10 mb-32 w-11/12 md:w-9/12 lg:w-9/12" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-center text-primary mb-8 headline-lg">
          Registrar datos de olimpistas a través de archivo Excel
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 mb-5">
          <div className="flex">
            <InputText
              label="Cédula de identidad del responsable de la lista (Deberá haber sido registrado previamente)"
              name="ci_responsable"
              placeholder="Ingresar ci del responsable"
              className="w-full"
              register={register}
              validationRules={{
                required: 'Debe ingresar la cédula del responsable.',
                pattern: {
                  value: /^(?! )[0-9]+(?<! )$/,
                  message: 'Solo se permiten números y no puede haber espacios.',
                },
              }}
              errors={errors}
            />
          </div>
          <div className="flex flex-col">
            <CardUploadFile
              fileName={fileName}
              setFileName={setFileName}
              ref={inputRef}
              onFileChange={handleFileChange}
            />
            <div className="flex flex-row items-center justify-start mt-2">
              <button
                type="button"
                onClick={() => window.open("/templates/template-excel.xlsx", "_blank")}
                className="flex items-center text-primary underline body-md hover:text-secondary2 transition cursor-pointer"
              >
                <IconDownload classname="h-5 w-5 mr-0.5" />
                Descargar plantilla Excel
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto">
            {fileName ? (
              <Button
                label="Borrar archivo"
                variantColor={isLoading ? "variantDesactivate" : "variant2"}
                className="mt-5 md:mt-0"
                onClick={handleClearFile}
                disabled={isLoading}
              />
            ) : (
              <Button
                label="Subir archivo"
                variantColor="variant1"
                className="mt-5 md:mt-0"
                onClick={handleUploadClick}
              />
            )}
          </div>
        </div>

        <p className="subtitle-md text-primary mb-5">Datos cargados:</p>
        {isLoading && (
          <div className="flex justify-center my-4">
            <CircularProgress />
          </div>
        )}
        {!isLoading && (
          <div className="w-full">
            <TablaOlimpistas data={olimpistas} />
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row md:justify-end gap-5 md:gap-0 md:space-x-5 mt-5">
          <Button label="Cancelar" variantColor="variant2" onClick={() => navigate("/")} />
          <Button
            type="button"
            label="Registrar"
            variantColor={rawDataToSend.length === 0 ? 'variantDesactivate' : 'variant1'}
            onClick={() => setShowModal(true)}
            disabled={rawDataToSend.length === 0}
          />
        </div>
      </form>

      {showModal && (
        <Modal
          text="¿Estás seguro de que deseas registrar los datos?"
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmRegister}
        />
      )}
    </div>
  );
}