package dto

import "time"

type CreateViolationRequest struct {
	StudentID       string `json:"student_id" binding:"required"`
	ViolationTypeID string `json:"violation_type_id" binding:"required"`
	OccurredAt      string `json:"occurred_at"` // RFC3339, optional
	Location        string `json:"location"`
	Description     string `json:"description"`
	Source          string `json:"source"` // DIRECT / REPORT / OTHER
}

type ViolationResponse struct {
	ID                   string    `json:"id"`
	StudentID            string    `json:"student_id"`
	StudentName          string    `json:"student_name"`
	ClassID              string    `json:"class_id"`
	ClassName            string    `json:"class_name"`
	ViolationTypeID      string    `json:"violation_type_id"`
	ViolationCode        string    `json:"violation_code"`
	ViolationCategory    string    `json:"violation_category"`
	ViolationDescription string    `json:"violation_description"`
	ViolationPoint       int       `json:"violation_point"`
	TotalPointBefore     int       `json:"total_point_before"`
	TotalPointAfter      int       `json:"total_point_after"`
	SanctionNameAfter    string    `json:"sanction_name_after"`
	Source               string    `json:"source"`
	OccurredAt           time.Time `json:"occurred_at"`
	CreatedAt            time.Time `json:"created_at"`
}

// query untuk /admin/violations dan /public/violations
type ViolationListQuery struct {
	Page      int    `form:"page"`
	Limit     int    `form:"limit"`
	ClassName string `form:"class_name"` // filter by class name (contains)
	Category  string `form:"category"`   // RINGAN / SEDANG / BERAT
	Source    string `form:"source"`     // DIRECT / REPORT / OTHER
	StartDate string `form:"start_date"` // YYYY-MM-DD (by occurred_at)
	EndDate   string `form:"end_date"`   // YYYY-MM-DD
}

type PaginatedViolationsResponse struct {
	Items []ViolationResponse `json:"items"`
	Page  int                 `json:"page"`
	Limit int                 `json:"limit"`
	Total int                 `json:"total"`
}
