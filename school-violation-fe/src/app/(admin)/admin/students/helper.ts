export type StudentItem = {
  id: string;
  nis: string;
  name: string;
  gender: string;
  total_point?: number;
  is_active?: boolean;
  class_id?: string;
  class_name?: string;
  created_at?: string;
};

export type ClassOption = {
  id: string;
  name: string;
  year?: string;
  homeroom?: string;
};

export type CreateStudentPayload = {
  nis: string;
  name: string;
  gender: string;
  class_id: string;
};
