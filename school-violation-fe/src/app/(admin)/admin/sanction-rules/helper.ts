export type SanctionRuleItem = {
  id: string;
  min_point: number;
  max_point: number;
  name: string;
  description: string;
};

export type CreateSanctionRulePayload = {
  min_point: number;
  max_point: number;
  name: string;
  description: string;
};
