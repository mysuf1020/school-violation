export type ReportStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export type ReportAdminItem = {
  id: string;
  code: string;
  reported_name: string;
  reported_class: string;
  violation_type_id?: string | null;
  location: string;
  description: string;
  evidence_path: string;
  reporter_name: string;
  status: ReportStatus;
  handled_by_name?: string | null;
  created_at: string;
};

export type PaginatedReports = {
  items: ReportAdminItem[];
  page: number;
  limit: number;
  total: number;
};

export type ReportListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReportStatus | "ALL";
  sort?: "asc" | "desc";
};
