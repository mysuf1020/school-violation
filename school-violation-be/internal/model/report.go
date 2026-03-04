package model

import (
	"time"

	"github.com/google/uuid"
)

type ReportStatus string

const (
	ReportPending  ReportStatus = "PENDING"
	ReportApproved ReportStatus = "APPROVED"
	ReportRejected ReportStatus = "REJECTED"
)

type Report struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey"`
	Code          string    `gorm:"uniqueIndex;not null"` // ex: "REP-2025-0001"
	ReportedName  string    // nama siswa yang dilaporkan (raw string)
	ReportedClass string    // kelas yang dilaporkan (raw)

	ViolationTypeID *uuid.UUID
	ViolationType   *ViolationType `gorm:"foreignKey:ViolationTypeID"`

	OccurredAt   *time.Time
	Location     string
	Description  string `gorm:"type:text"`
	EvidencePath string
	ReporterName string

	Status ReportStatus `gorm:"type:varchar(10);not null;default:'PENDING'"`

	HandledByID   *uuid.UUID `gorm:"type:uuid"`
	HandledByUser *User      `gorm:"foreignKey:HandledByID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
