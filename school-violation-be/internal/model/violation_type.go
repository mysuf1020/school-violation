package model

import (
	"time"

	"github.com/google/uuid"
)

type ViolationCategory string

const (
	ViolationHeavy  ViolationCategory = "BERAT"
	ViolationMedium ViolationCategory = "SEDANG"
	ViolationLight  ViolationCategory = "RINGAN"
)

type ViolationType struct {
	ID          uuid.UUID         `gorm:"type:uuid;primaryKey"`
	Code        string            `gorm:"uniqueIndex;not null"` // ex: "B01"
	Category    ViolationCategory `gorm:"type:varchar(10);not null"`
	Description string            `gorm:"not null"`
	Point       int               `gorm:"not null"`
	IsActive    bool              `gorm:"default:true"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
