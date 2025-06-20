// src/hooks/use-excel-upload.ts
import { useRef, useState } from 'react';
import { ERROR_MESSAGES } from '../constants/participant-constants';
import { OlympianRow } from '../interfaces/form-data-excel';
import { ParticipantApiService } from '../services/participant-api';

export const useExcelUpload = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [olimpistas, setOlimpistas] = useState<OlympianRow[]>([]);
  const [rawDataToSend, setRawDataToSend] = useState<any[][]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    setFileName(null);
    setOlimpistas([]);
    setRawDataToSend([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFileChange = async (file: File) => {
    setFileName(file.name);
    setIsLoading(true);
    try {
      const { data } = await ParticipantApiService.uploadExcelFile(file);
      const rawData: any[][] = data.data;
      setRawDataToSend(rawData);
      const parsed = rawData
        .filter((row) => row.some((cell) => cell !== null && cell !== ''))
        .map((row) => ({
          Name: row[0] ?? '',
          Lastname: row[1] ?? '',
          CIOlympian: row[2]?.toString() ?? '',
          Birthdate: row[3]?.toString() ?? '',
          Email: row[4] ?? '',
          Department: row[5] ?? '',
          Province: row[6] ?? '',
          School: row[7] ?? '',
          Grade: row[8] ?? '',
          NamesTutorLegal: row[9] ?? '',
          LastnamesTutorLegal: row[10] ?? '',
          CITutorLegal: row[11]?.toString() ?? '',
          PhoneTutorLegal: row[12]?.toString() ?? '',
          EmailTutorLegal: row[13] ?? '',
          Area: row[14] ?? '',
          Level: row[15] ?? '',
          NamesTeacher: row[16] ?? '',
          LastNamesTeacher: row[17] ?? '',
          CITeacher: row[18]?.toString() ?? '',
          PhoneTeacher: row[19]?.toString() ?? '',
          EmailTeacher: row[20] ?? '',
        }));
      setOlimpistas(parsed);
    } catch (error: any) {
      const errores = error.response?.data?.errors;
      let mensaje = '';
      if (errores) {
        mensaje = 'Errores al procesar el archivo Excel:\n';
        if (errores.archivo?.length)
          mensaje += `\n• ${errores.archivo.join('\n• ')}`;
        if (errores.formato?.length)
          mensaje += `\n• ${errores.formato.join('\n• ')}`;
      } else {
        mensaje = ERROR_MESSAGES.INCORRECT_FORMAT;
      }
      setErrorMessage(mensaje);
      setShowErrorModal(true);
      clearFile();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fileName,
    setFileName,
    olimpistas,
    rawDataToSend,
    inputRef,
    errorMessage,
    showErrorModal,
    setErrorMessage,
    setShowErrorModal,
    handleFileChange,
    clearFile,
    isLoading,
  };
};
