export interface OlympianRow {
  Name: string;
  Lastname: string;
  CIOlympian: string;
  Birthdate: string;
  Email: string;
  Department: string;
  Province: string;
  School: string;
  Grade: string;
  NamesTutorLegal: string;
  LastnamesTutorLegal: string;
  CITutorLegal: string;
  PhoneTutorLegal: string;
  EmailTutorLegal: string;
  Area: string;
  Level: string;
  NamesTeacher: string;
  LastNamesTeacher: string;
  CITeacher: string;
  PhoneTeacher: string;
  EmailTeacher: string;
}

export type TableProps = {
  data: OlympianRow[];
};

export interface FormFields {
  ci_responsable: string;
}