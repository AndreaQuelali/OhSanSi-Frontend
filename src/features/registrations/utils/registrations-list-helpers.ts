import {
  RegistrationData,
  Registration,
  EnrollmentApiResponse,
} from '../interfaces/registrations-list';
import {
  DEFAULT_VALUES,
  ERROR_MESSAGES,
} from '../constants/registrations-list';

type ListItem = EnrollmentApiResponse['lists'][0];
type Level = {
  level_id?: number;
  name_level?: string;
  name_area?: string;
};

export const registrationsListUtils = {
  formatResponsableName: (responsible?: {
    names?: string;
    surnames?: string;
  }): string => {
    if (!responsible) return '';
    return `${responsible.names || ''} ${responsible.surnames || ''}`.trim();
  },

  formatOlimpistaName: (olympist?: {
    names?: string;
    surnames?: string;
  }): string => {
    if (!olympist) return '';
    return `${olympist.names || ''} ${olympist.surnames || ''}`.trim();
  },
  mapIndividualRegistration: (
    item: ListItem,
    responsableName: string,
    responsableCI: string,
  ): RegistrationData => {
    const olympist = item.detail.olympist;
    const levels = item.detail.levels || [];

    const registrations: Registration[] = levels.map((level: Level) => ({
      nombre: registrationsListUtils.formatOlimpistaName(olympist),
      ci: olympist?.olympist_ci?.toString() || DEFAULT_VALUES.noCI,
      area: level.name_area || DEFAULT_VALUES.noArea,
      categoria: level.name_level || DEFAULT_VALUES.noCategory,
    }));
    return {
      list: {
        cantidad: registrations.length,
        cantidadOlimpistas: registrations.length,
        responsable: responsableName,
        ci: responsableCI,
        estado: item.status || DEFAULT_VALUES.pendingStatus,
        id_lista: item.list_id,
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
        cantidad: item.detail.number_of_enrollments || 0,
        cantidadOlimpistas: item.detail.number_of_students || 0,
        responsable: responsableName,
        ci: responsableCI,
        estado: item.status || DEFAULT_VALUES.pendingStatus,
        id_lista: item.list_id,
        tipo: 'grupal',
      },
      registrations: [],
    };
  },

  mapEnrollmentResponse: (
    response: EnrollmentApiResponse,
  ): RegistrationData[] => {
    const { responsible, lists } = response;

    if (!Array.isArray(lists)) {
      throw new Error(ERROR_MESSAGES.invalidListsFormat);
    }

    const responsableName =
      registrationsListUtils.formatResponsableName(responsible);
    const responsableCI = responsible?.ci?.toString() || DEFAULT_VALUES.noCI;
    return lists
      .map((item: ListItem) => {
        if (item.detail?.kind === 'individual') {
          return registrationsListUtils.mapIndividualRegistration(
            item,
            responsableName,
            responsableCI,
          );
        }

        if (item.detail?.kind === 'grupal') {
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
