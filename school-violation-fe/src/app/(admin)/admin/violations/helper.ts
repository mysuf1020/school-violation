export type ViolationSource = "DIRECT" | "REPORT" | "OTHER";

export type ViolationItem = {
  id: string;
  student_id: string;
  student_name: string;
  class_id: string;
  class_name: string;
  violation_type_id: string;
  violation_code: string;
  violation_category: string; // RINGAN / SEDANG / BERAT
  violation_description: string;
  violation_point: number;
  total_point_before: number;
  total_point_after: number;
  sanction_name_after: string;
  source: ViolationSource | string;
  occurred_at: string;
  created_at: string;
};

export type PaginatedViolations = {
  items: ViolationItem[];
  page: number;
  limit: number;
  total: number;
};

export type CreateViolationPayload = {
  student_id: string;
  violation_type_id: string;
  location?: string;
  description?: string;
  source?: ViolationSource | string; // boleh kosong -> BE default DIRECT
};

export type ViolationListParams = {
  page?: number;
  limit?: number;
  className?: string;
  category?: string;
  source?: ViolationSource | string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
};
