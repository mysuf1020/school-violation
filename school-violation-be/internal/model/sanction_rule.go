package model

import (
	"time"

	"github.com/google/uuid"
)

type SanctionRule struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	MinPoint    int       `gorm:"not null"`
	MaxPoint    int       `gorm:"not null"`
	Name        string    `gorm:"not null"` // ex: "SP1", "SP2", "SP3", "Pembinaan"
	Description string    `gorm:"type:text"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
