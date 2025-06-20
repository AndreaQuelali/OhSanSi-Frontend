import { useState, useEffect, useRef } from 'react';
import { API_URL } from '@/config/api-config';
import { REPORT_OLIMPIST_MESSAGES } from '../constants/report-olimpist-constants';
import {
  FormData,
  Participant,
  FilterState,
} from '../interfaces/report-olimpist';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function useReportOlimpist(selectedOlympiadId: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [originalParticipants, setOriginalParticipants] = useState<
    Participant[]
  >([]);
  const [filters, setFilters] = useState<FilterState>({
    selectedAreas: [],
    selectedLevels: [],
    selectedGrades: [],
    selectedDepartamentos: [],
    selectedProvincias: [],
    selectedColegios: [],
  });
  const [formatSelected, setFormatSelected] = useState<'pdf' | 'excel'>('pdf');
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!selectedOlympiadId) return;
      try {
        const response = await fetch(
          `${API_URL}/enrollments/participants/${selectedOlympiadId}`,
        );
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const formattedData = result.data.map((item: any) => ({
            Apellido: item.surnames,
            Nombre: item.names,
            Departamento: item.department,
            Provincia: item.province,
            UnidadEducativa: item.school,
            Grado: item.grade,
            Area: item.area,
            NivelCategoria: item.level,
          }));
          setOriginalParticipants(formattedData);
          setParticipants(formattedData);
        } else {
          setOriginalParticipants([]);
          setParticipants([]);
        }
      } catch (error) {
        setOriginalParticipants([]);
        setParticipants([]);
      }
    };
    fetchParticipants();
  }, [selectedOlympiadId]);

  useEffect(() => {
    let filtered = [...originalParticipants];
    if (filters.selectedDepartamentos.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedDepartamentos.includes(p.Departamento),
      );
    }
    if (filters.selectedAreas.length > 0) {
      filtered = filtered.filter((p) => filters.selectedAreas.includes(p.Area));
    }
    if (filters.selectedLevels.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedLevels.includes(p.NivelCategoria),
      );
    }
    if (filters.selectedGrades.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedGrades.includes(p.Grado),
      );
    }
    if (filters.selectedProvincias.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedProvincias.includes(p.Provincia),
      );
    }
    if (filters.selectedColegios.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedColegios.includes(p.UnidadEducativa),
      );
    }
    setParticipants(filtered);
  }, [filters, originalParticipants]);

  const handlePrint = (olympiadTitle: string) => {
    if (!participants.length) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(REPORT_OLIMPIST_MESSAGES.UNIVERSITY, 15, 12);
    doc.text(REPORT_OLIMPIST_MESSAGES.EVENT, 195, 12, { align: 'right' });
    doc.setFontSize(16);
    doc.text(REPORT_OLIMPIST_MESSAGES.REPORT_TITLE, 105, 20, {
      align: 'center',
    });
    doc.setFontSize(12);
    doc.text(olympiadTitle, 105, 28, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Fecha: ${currentDate}`, 105, 36, { align: 'center' });
    const filtersSummary: string[] = [];
    if (filters.selectedAreas.length > 0)
      filtersSummary.push(`Área(s): ${filters.selectedAreas.join(' - ')}`);
    if (filters.selectedLevels.length > 0)
      filtersSummary.push(`Nivel(es): ${filters.selectedLevels.join(' - ')}`);
    if (filters.selectedGrades.length > 0)
      filtersSummary.push(`Grado(s): ${filters.selectedGrades.join(' - ')}`);
    if (filters.selectedDepartamentos.length > 0)
      filtersSummary.push(
        `Departamento(s): ${filters.selectedDepartamentos.join(' - ')}`,
      );
    if (filters.selectedProvincias.length > 0)
      filtersSummary.push(
        `Provincia(s): ${filters.selectedProvincias.join(' - ')}`,
      );
    if (filters.selectedColegios.length > 0)
      filtersSummary.push(
        `Unidad(es) Educativa(s): ${filters.selectedColegios.join(' - ')}`,
      );
    let currentY = 44;
    filtersSummary.forEach((line) => {
      doc.text(line, 15, currentY);
      currentY += 6;
    });
    const columns = [
      'Apellido(s)',
      'Nombre(s)',
      'Departamento',
      'Provincia',
      'Unidad Educativa',
      'Grado',
      'Área',
      'Nivel',
    ];
    const rows = participants.map((row) => [
      row.Apellido,
      row.Nombre,
      row.Departamento,
      row.Provincia,
      row.UnidadEducativa,
      row.Grado,
      row.Area,
      row.NivelCategoria,
    ]);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: currentY + 2,
      styles: {
        fontSize: 8,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [38, 50, 108],
        textColor: [255, 255, 255],
        halign: 'center',
        valign: 'middle',
      },
    });
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleDownload = (olympiadTitle: string) => {
    const getFiltersSummary = () => {
      const summary = [];
      if (filters.selectedAreas.length > 0)
        summary.push(`Área(s): ${filters.selectedAreas.join(' - ')}`);
      if (filters.selectedLevels.length > 0)
        summary.push(`Nivel(es): ${filters.selectedLevels.join(' - ')}`);
      if (filters.selectedGrades.length > 0)
        summary.push(`Grado(s): ${filters.selectedGrades.join(' - ')}`);
      if (filters.selectedDepartamentos.length > 0)
        summary.push(
          `Departamento(s): ${filters.selectedDepartamentos.join(' - ')}`,
        );
      if (filters.selectedProvincias.length > 0)
        summary.push(`Provincia(s): ${filters.selectedProvincias.join(' - ')}`);
      if (filters.selectedColegios.length > 0)
        summary.push(
          `Unidad(es) Educativa(s): ${filters.selectedColegios.join(' - ')}`,
        );
      return summary;
    };
    const filtersSummary = getFiltersSummary();
    if (formatSelected === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(REPORT_OLIMPIST_MESSAGES.UNIVERSITY, 15, 12);
      doc.text(REPORT_OLIMPIST_MESSAGES.EVENT, 195, 12, { align: 'right' });
      doc.setFontSize(16);
      doc.text(REPORT_OLIMPIST_MESSAGES.REPORT_TITLE, 105, 20, {
        align: 'center',
      });
      doc.setFontSize(12);
      doc.text(olympiadTitle, 105, 28, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Fecha: ${currentDate}`, 105, 36, { align: 'center' });
      let y = 44;
      filtersSummary.forEach((line) => {
        doc.text(line, 15, y);
        y += 6;
      });
      const columns = [
        'Apellido(s)',
        'Nombre(s)',
        'Departamento',
        'Provincia',
        'Unidad Educativa',
        'Grado',
        'Área',
        'Nivel',
      ];
      const rows = participants.map((row) => [
        row.Apellido,
        row.Nombre,
        row.Departamento,
        row.Provincia,
        row.UnidadEducativa,
        row.Grado,
        row.Area,
        row.NivelCategoria,
      ]);
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: y + 2,
        styles: {
          fontSize: 8,
          textColor: [0, 0, 0],
          fillColor: [255, 255, 255],
        },
        headStyles: {
          fillColor: [38, 50, 108],
          textColor: [255, 255, 255],
          halign: 'center',
          valign: 'middle',
        },
      });
      doc.save('reporte_olimpistas_inscritos.pdf');
    } else if (formatSelected === 'excel') {
      const headerRows = [
        [REPORT_OLIMPIST_MESSAGES.UNIVERSITY],
        [REPORT_OLIMPIST_MESSAGES.REPORT_TITLE],
        [olympiadTitle],
        [`Fecha: ${currentDate}`],
      ];
      filtersSummary.forEach((line) => {
        headerRows.push([line]);
      });
      headerRows.push([]);
      const columnTitles = [
        'Apellido(s)',
        'Nombre(s)',
        'Departamento',
        'Provincia',
        'Unidad Educativa',
        'Grado',
        'Área',
        'Nivel',
      ];
      headerRows.push(columnTitles);
      const dataRows = participants.map((row) => [
        row.Apellido,
        row.Nombre,
        row.Departamento,
        row.Provincia,
        row.UnidadEducativa,
        row.Grado,
        row.Area,
        row.NivelCategoria,
      ]);
      const allRows = [...headerRows, ...dataRows];
      const worksheet = XLSX.utils.aoa_to_sheet(allRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true,
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      saveAs(blob, 'reporte_olimpistas_inscritos.xlsx');
    }
    setShowModal(false);
  };

  return {
    participants,
    originalParticipants,
    filters,
    setFilters,
    formatSelected,
    setFormatSelected,
    showModal,
    setShowModal,
    tableRef,
    currentDate,
    handlePrint,
    handleDownload,
  };
}
