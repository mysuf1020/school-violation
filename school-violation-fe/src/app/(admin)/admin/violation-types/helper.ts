export type ViolationTypeItem = {
  id: string;
  code: string;
  category: string; // "RINGAN" | "SEDANG" | "BERAT"
  description: string;
  point: number;
  is_active: boolean;
};

export type CreateViolationTypePayload = {
  code: string;
  category: string;
  description: string;
  point: number;
};

export const VIOLATION_CATEGORIES = [
  { value: "RINGAN", label: "Ringan" },
  { value: "SEDANG", label: "Sedang" },
  { value: "BERAT", label: "Berat" },
];
