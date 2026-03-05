package repository

import (
	"context"

	"school-violation-backend/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ViolationRepository interface {
	Create(ctx context.Context, v *model.Violation) error
	FindByID(ctx context.Context, id uuid.UUID) (*model.Violation, error)
	List(ctx context.Context) ([]model.Violation, error)

	CountByClass(ctx context.Context, classID uuid.UUID) (int64, error)
}

type violationRepository struct {
	db *gorm.DB
}

func NewViolationRepository(db *gorm.DB) ViolationRepository {
	return &violationRepository{db: db}
}

func (r *violationRepository) Create(ctx context.Context, v *model.Violation) error {
	return r.db.WithContext(ctx).Create(v).Error
}

func (r *violationRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.Violation, error) {
	var v model.Violation
	if err := r.db.WithContext(ctx).
		Preload("Student").
		Preload("Student.Class").
		Preload("ViolationType").
		First(&v, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *violationRepository) List(ctx context.Context) ([]model.Violation, error) {
	var items []model.Violation
	if err := r.db.WithContext(ctx).
		Preload("Student").
		Preload("Student.Class").
		Preload("ViolationType").
		Preload("SanctionRule").
		Preload("CreatedByUser").
		Order("occurred_at DESC, created_at DESC").
		Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *violationRepository) CountByClass(ctx context.Context, classID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&model.Violation{}).
		Joins("JOIN students ON students.id = violations.student_id").
		Where("students.class_id = ?", classID).
		Count(&count).Error
	if err != nil {
		return 0, err
	}
	return count, nil
}
