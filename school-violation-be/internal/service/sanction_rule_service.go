package service

import (
	"context"
	"errors"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"

	"github.com/google/uuid"
)

var ErrInvalidPointRange = errors.New("invalid_point_range")

type SanctionRuleService interface {
	Create(ctx context.Context, req dto.CreateSanctionRuleRequest) (dto.SanctionRuleResponse, error)
	List(ctx context.Context) ([]dto.SanctionRuleResponse, error)
}

type sanctionRuleService struct {
	repo repository.SanctionRuleRepository
}

func NewSanctionRuleService(repo repository.SanctionRuleRepository) SanctionRuleService {
	return &sanctionRuleService{repo: repo}
}

func (s *sanctionRuleService) Create(ctx context.Context, req dto.CreateSanctionRuleRequest) (dto.SanctionRuleResponse, error) {
	if req.MinPoint > req.MaxPoint {
		return dto.SanctionRuleResponse{}, ErrInvalidPointRange
	}

	rule := &model.SanctionRule{
		ID:          uuid.New(),
		MinPoint:    req.MinPoint,
		MaxPoint:    req.MaxPoint,
		Name:        req.Name,
		Description: req.Description,
	}

	if err := s.repo.Create(ctx, rule); err != nil {
		return dto.SanctionRuleResponse{}, err
	}

	return dto.SanctionRuleResponse{
		ID:          rule.ID.String(),
		MinPoint:    rule.MinPoint,
		MaxPoint:    rule.MaxPoint,
		Name:        rule.Name,
		Description: rule.Description,
	}, nil
}

func (s *sanctionRuleService) List(ctx context.Context) ([]dto.SanctionRuleResponse, error) {
	items, err := s.repo.List(ctx)
	if err != nil {
		return nil, err
	}

	res := make([]dto.SanctionRuleResponse, 0, len(items))
	for _, r := range items {
		res = append(res, dto.SanctionRuleResponse{
			ID:          r.ID.String(),
			MinPoint:    r.MinPoint,
			MaxPoint:    r.MaxPoint,
			Name:        r.Name,
			Description: r.Description,
		})
	}
	return res, nil
}
