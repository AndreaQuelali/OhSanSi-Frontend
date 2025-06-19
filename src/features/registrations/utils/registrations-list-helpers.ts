import {
  RegistrationData,
  Registration,
  EnrollmentApiResponse,
} from '../interfaces/registrations-list';
import { DEFAULT_VALUES } from '../constants/registrations-list';

type ListItem = EnrollmentApiResponse['listas'][0];
type Nivel = { area?: string; nombre?: string };

export const registrationsListUtils = {
  formatResponsableName: (responsable?: {
    nombres?: string;
    apellidos?: string;
  }): string => {
    if (!responsable) return '';
    return `${responsable.nombres || ''} ${responsable.apellidos || ''}`.trim();
  },

  formatOlimpistaName: (olimpista?: {
    nombres?: string;
    apellidos?: string;
  }): string => {
    if (!olimpista) return '';
    return `${olimpista.nombres || ''} ${olimpista.apellidos || ''}`.trim();
  },

  mapIndividualRegistration: (
    item: ListItem,
    responsableName: string,
    responsableCI: string,
  ): RegistrationData => {
    const olimpista = item.detalle.olimpista;
    const niveles = item.detalle.niveles || [];

    const registrations: Registration[] = niveles.map((nivel: Nivel) => ({
      nombre: registrationsListUtils.formatOlimpistaName(olimpista),
      ci: olimpista?.ci || DEFAULT_VALUES.noCI,
      area: nivel.area || DEFAULT_VALUES.noArea,
      categoria: nivel.nombre || DEFAULT_VALUES.noCategory,
    }));
    return {
      list: {
        cantidad: registrations.length,
        cantidadOlimpistas: registrations.length,
        responsable: responsableName,
        ci: responsableCI,
        estado: item.estado || DEFAULT_VALUES.pendingStatus,
        id_lista: item.id_lista,
        tipo: 'individual',
      },
      registrations,
    };
  },

  mapGroupRegistration: (
    item: ListItem,
    responsableName: string,
    responsableCI: string,
  ): RegistrationData => {
    return {
      list: {
        cantidad: item.detalle.cantidad_inscripciones || 0,
        cantidadOlimpistas: item.detalle.cantidad_estudiantes || 0,
        responsable: responsableName,
        ci: responsableCI,
        estado: item.estado || DEFAULT_VALUES.pendingStatus,
        id_lista: item.id_lista,
        tipo: 'grupal',
      },
      registrations: [],
    };
  },

  mapEnrollmentResponse: (
    response: EnrollmentApiResponse,
  ): RegistrationData[] => {
    const { responsable, listas } = response;

    if (!Array.isArray(listas)) {
      throw new Error("El campo 'listas' no es un arreglo.");
    }

    const responsableName =
      registrationsListUtils.formatResponsableName(responsable);
    const responsableCI = responsable?.ci || DEFAULT_VALUES.noCI;

    return listas
      .map((item: ListItem) => {
        if (item.detalle?.tipo === 'individual') {
          return registrationsListUtils.mapIndividualRegistration(
            item,
            responsableName,
            responsableCI,
          );
        }

        if (item.detalle?.tipo === 'grupal') {
          return registrationsListUtils.mapGroupRegistration(
            item,
            responsableName,
            responsableCI,
          );
        }

        return null;
      })
      .filter(Boolean) as RegistrationData[];
  },

  getEndpointType: (
    showUploadButton: boolean,
    title: string,
    showGenerateButton: boolean,
  ): 'pending' | 'upload' | 'all' => {
    if (showUploadButton || title.includes('Subir comprobante de pago')) {
      return 'upload';
    }

    if (title === 'Registros de Inscripciones' && !showGenerateButton) {
      return 'all';
    }

    return 'pending';
  },
};
