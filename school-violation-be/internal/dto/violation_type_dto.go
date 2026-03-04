package dto

type CreateViolationTypeRequest struct {
	Code        string `json:"code" binding:"required"`         // ex: B01
	Category    string `json:"category" binding:"required"`     // BERAT / SEDANG / RINGAN
	Description string `json:"description" binding:"required"`  // ex: Merokok di lingkungan sekolah
	Point       int    `json:"point" binding:"required"`        // ex: 25
}

type ViolationTypeResponse struct {
	ID          string `json:"id"`
	Code        string `json:"code"`
	Category    string `json:"category"`
	Description string `json:"description"`
	Point       int    `json:"point"`
	IsActive    bool   `json:"is_active"`
}
