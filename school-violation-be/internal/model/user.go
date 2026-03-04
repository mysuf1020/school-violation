package model

import (
	"time"

	"github.com/google/uuid"
)

type UserRole string

const (
	RoleAdmin UserRole = "ADMIN"
	RoleBK    UserRole = "BK"
	RoleGuru  UserRole = "GURU"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Username  string    `gorm:"uniqueIndex;not null"`
	Password  string    `gorm:"not null"` // bcrypt hash
	Role      UserRole  `gorm:"type:varchar(10);not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
