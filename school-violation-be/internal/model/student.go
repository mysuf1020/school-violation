package model

import (
	"time"

	"github.com/google/uuid"
)

type Student struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	NIS       string    `gorm:"uniqueIndex;not null"`
	Name      string    `gorm:"not null"`
	Gender    string    `gorm:"type:varchar(10)"` // "L" / "P"
	ClassID   uuid.UUID `gorm:"type:uuid;not null"`
	Class     Class
	IsActive  bool `gorm:"default:true"`

	TotalPoint int `gorm:"default:0"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
