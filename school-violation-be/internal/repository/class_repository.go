package repository

import (
	"context"

	"school-violation-backend/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ClassRepository interface {
	Create(ctx context.Context, c *model.Class) error
	List(ctx context.Context) ([]model.Class, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Class, error)
}

type classRepository struct {
	db *gorm.DB
}

func NewClassRepository(db *gorm.DB) ClassRepository {
	return &classRepository{db: db}
}

func (r *classRepository) Create(ctx context.Context, c *model.Class) error {
	return r.db.WithContext(ctx).Create(c).Error
}

func (r *classRepository) List(ctx context.Context) ([]model.Class, error) {
	var items []model.Class
	if err := r.db.WithContext(ctx).Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *classRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.Class, error) {
	var c model.Class
	if err := r.db.WithContext(ctx).First(&c, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &c, nil
}
