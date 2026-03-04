package repository

import (
	"context"

	"school-violation-backend/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StudentRepository interface {
	Create(ctx context.Context, s *model.Student) error
	List(ctx context.Context) ([]model.Student, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Student, error)
	FindByNIS(ctx context.Context, nis string) (*model.Student, error)
	Update(ctx context.Context, s *model.Student) error

	CountByClass(ctx context.Context, classID uuid.UUID) (int64, error)
	FindTopByTotalPoint(ctx context.Context, classID uuid.UUID) (*model.Student, error)
}

type studentRepository struct {
	db *gorm.DB
}

func NewStudentRepository(db *gorm.DB) StudentRepository {
	return &studentRepository{db: db}
}

func (r *studentRepository) Create(ctx context.Context, s *model.Student) error {
	return r.db.WithContext(ctx).Create(s).Error
}

func (r *studentRepository) List(ctx context.Context) ([]model.Student, error) {
	var items []model.Student
	if err := r.db.WithContext(ctx).Preload("Class").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *studentRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.Student, error) {
	var s model.Student
	if err := r.db.WithContext(ctx).Preload("Class").First(&s, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *studentRepository) FindByNIS(ctx context.Context, nis string) (*model.Student, error) {
	var s model.Student
	if err := r.db.WithContext(ctx).Preload("Class").First(&s, "nis = ?", nis).Error; err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *studentRepository) Update(ctx context.Context, s *model.Student) error {
	return r.db.WithContext(ctx).Save(s).Error
}

func (r *studentRepository) CountByClass(ctx context.Context, classID uuid.UUID) (int64, error) {
	var count int64
	if err := r.db.WithContext(ctx).Model(&model.Student{}).
		Where("class_id = ?", classID).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *studentRepository) FindTopByTotalPoint(ctx context.Context, classID uuid.UUID) (*model.Student, error) {
	var s model.Student
	err := r.db.WithContext(ctx).Where("class_id = ?", classID).
		Order("total_point DESC").
		Limit(1).
		First(&s).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &s, nil
}
