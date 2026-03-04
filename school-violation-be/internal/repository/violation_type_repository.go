package repository

import (
	"context"

	"school-violation-backend/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ViolationTypeRepository interface {
	FindByID(ctx context.Context, id uuid.UUID) (*model.ViolationType, error)
	Create(ctx context.Context, vt *model.ViolationType) error
	List(ctx context.Context) ([]model.ViolationType, error)
}

type violationTypeRepository struct {
	db *gorm.DB
}

func NewViolationTypeRepository(db *gorm.DB) ViolationTypeRepository {
	return &violationTypeRepository{db: db}
}

func (r *violationTypeRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.ViolationType, error) {
	var vt model.ViolationType
	if err := r.db.WithContext(ctx).First(&vt, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &vt, nil
}

func (r *violationTypeRepository) Create(ctx context.Context, vt *model.ViolationType) error {
	return r.db.WithContext(ctx).Create(vt).Error
}

func (r *violationTypeRepository) List(ctx context.Context) ([]model.ViolationType, error) {
	var items []model.ViolationType
	if err := r.db.WithContext(ctx).Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}
