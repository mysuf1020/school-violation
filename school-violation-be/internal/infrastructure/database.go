package infrastructure

import (
	"fmt"
	"log"
	"school-violation-backend/internal/config"
	"school-violation-backend/internal/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDatabase(env *config.Env) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		env.DBHost, env.DBPort, env.DBUser, env.DBPassword, env.DBName, env.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Auto migrate dasar
	if err := db.AutoMigrate(
		&model.User{},
		&model.Class{},
		&model.Student{},
		&model.ViolationType{},
		&model.SanctionRule{},
		&model.Violation{},
		&model.Report{},
	); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	return db
}
