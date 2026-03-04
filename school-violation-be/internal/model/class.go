package model

import (
	"time"

	"github.com/google/uuid"
)

type Class struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name      string    `gorm:"not null"` // ex: "X TKJ 1"
	Year      string    // ex: "2025/2026"
	Homeroom  string    // wali kelas (nama)
	CreatedAt time.Time
	UpdatedAt time.Time

	Students []Student
}
