package dto

type CreateSanctionRuleRequest struct {
	MinPoint    int    `json:"min_point"`                    // boleh 0
	MaxPoint    int    `json:"max_point" binding:"required"` // wajib non-zero
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

type SanctionRuleResponse struct {
	ID          string `json:"id"`
	MinPoint    int    `json:"min_point"`
	MaxPoint    int    `json:"max_point"`
	Name        string `json:"name"`
	Description string `json:"description"`
}
