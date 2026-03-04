package model

import (
	"time"

	"github.com/google/uuid"
)

type ViolationSource string

const (
	SourceDirect ViolationSource = "DIRECT"
	SourceReport ViolationSource = "REPORT"
)

type Violation struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey"`
	StudentID       uuid.UUID `gorm:"type:uuid;not null"`
	Student         Student
	ViolationTypeID uuid.UUID `gorm:"type:uuid;not null"`
	ViolationType   ViolationType

	OccurredAt  time.Time
	Location    string
	Description string `gorm:"type:text"`

	Source   ViolationSource `gorm:"type:varchar(10);not null"`
	ReportID *uuid.UUID      `gorm:"type:uuid"`
	Report   *Report

	TotalPointBefore  int
	ViolationPoint    int
	TotalPointAfter   int
	SanctionNameAfter string
	SanctionRuleID    *uuid.UUID `gorm:"type:uuid"`
	SanctionRule      *SanctionRule

	CreatedByUserID uuid.UUID `gorm:"type:uuid;not null"`
	CreatedByUser   User

	CreatedAt time.Time
	UpdatedAt time.Time
}
