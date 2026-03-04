package dto

import "time"

type CreateReportRequest struct {
	ReportedName    string `form:"reported_name" json:"reported_name" binding:"required"`
	ReportedClass   string `form:"reported_class" json:"reported_class" binding:"required"`
	ViolationTypeID string `form:"violation_type_id" json:"violation_type_id"`
	OccurredAt      string `form:"occurred_at" json:"occurred_at"`
	Location        string `form:"location" json:"location"`
	Description     string `form:"description" json:"description"`
	ReporterName    string `form:"reporter_name" json:"reporter_name"`
}

// Admin view
type ReportAdminResponse struct {
	ID              string    `json:"id"`
	Code            string    `json:"code"`
	ReportedName    string    `json:"reported_name"`
	ReportedClass   string    `json:"reported_class"`
	ViolationTypeID *string   `json:"violation_type_id,omitempty"`
	Location        string    `json:"location"`
	Description     string    `json:"description"`
	EvidencePath    string    `json:"evidence_path"`
	ReporterName    string    `json:"reporter_name"`
	Status          string    `json:"status"`
	HandledByName   *string   `json:"handled_by_name,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
}

type PublicViolationTypeDTO struct {
	Code        string `json:"code"`
	Category    string `json:"category"`
	Description string `json:"description"`
	Point       int    `json:"point"`
}

type ReportResponse struct {
	Code          string                 `json:"code"`
	ReportedName  string                 `json:"reported_name"`
	ReportedClass string                 `json:"reported_class"`
	Status        string                 `json:"status"`
	ViolationType *PublicViolationTypeDTO `json:"violation_type,omitempty"`
	OccurredAt    *time.Time             `json:"occurred_at,omitempty"`
	Location      string                 `json:"location"`
	Description   string                 `json:"description"`
	// kalau nanti mau pakai bukti:
	// EvidenceURL string `json:"evidence_url,omitempty"`
}