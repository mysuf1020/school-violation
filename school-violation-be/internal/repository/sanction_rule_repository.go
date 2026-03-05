package repository

import (
	"context"

	"school-violation-backend/internal/model"

	"gorm.io/gorm"
)

type SanctionRuleRepository interface {
	FindForPoint(ctx context.Context, totalPoint int) (*model.SanctionRule, error)
	Create(ctx context.Context, s *model.SanctionRule) error
	List(ctx context.Context) ([]model.SanctionRule, error)
}

type sanctionRuleRepository struct {
	db *gorm.DB
}

func NewSanctionRuleRepository(db *gorm.DB) SanctionRuleRepository {
	return &sanctionRuleRepository{db: db}
}

func (r *sanctionRuleRepository) FindForPoint(ctx context.Context, totalPoint int) (*model.SanctionRule, error) {
	var rule model.SanctionRule
	err := r.db.WithContext(ctx).
		Where("min_point <= ?", totalPoint).
		Order("min_point DESC").
		First(&rule).Error

	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &rule, nil
}

func (r *sanctionRuleRepository) Create(ctx context.Context, s *model.SanctionRule) error {
	return r.db.WithContext(ctx).Create(s).Error
}

func (r *sanctionRuleRepository) List(ctx context.Context) ([]model.SanctionRule, error) {
	var items []model.SanctionRule
	if err := r.db.WithContext(ctx).Order("min_point ASC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}
