package service

import (
	"context"
	"strings"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"

	"github.com/google/uuid"
)

type ViolationTypeService interface {
	Create(ctx context.Context, req dto.CreateViolationTypeRequest) (dto.ViolationTypeResponse, error)
	List(ctx context.Context) ([]dto.ViolationTypeResponse, error)
}

type violationTypeService struct {
	repo repository.ViolationTypeRepository
}

func NewViolationTypeService(repo repository.ViolationTypeRepository) ViolationTypeService {
	return &violationTypeService{repo: repo}
}

func (s *violationTypeService) Create(ctx context.Context, req dto.CreateViolationTypeRequest) (dto.ViolationTypeResponse, error) {
	category := model.ViolationCategory(strings.ToUpper(req.Category))

	vt := &model.ViolationType{
		ID:          uuid.New(),
		Code:        req.Code,
		Category:    category,
		Description: req.Description,
		Point:       req.Point,
		IsActive:    true,
	}

	if err := s.repo.Create(ctx, vt); err != nil {
		return dto.ViolationTypeResponse{}, err
	}

	return dto.ViolationTypeResponse{
		ID:          vt.ID.String(),
		Code:        vt.Code,
		Category:    string(vt.Category),
		Description: vt.Description,
		Point:       vt.Point,
		IsActive:    vt.IsActive,
	}, nil
}

func (s *violationTypeService) List(ctx context.Context) ([]dto.ViolationTypeResponse, error) {
	items, err := s.repo.List(ctx)
	if err != nil {
		return nil, err
	}

	res := make([]dto.ViolationTypeResponse, 0, len(items))
	for _, vt := range items {
		res = append(res, dto.ViolationTypeResponse{
			ID:          vt.ID.String(),
			Code:        vt.Code,
			Category:    string(vt.Category),
			Description: vt.Description,
			Point:       vt.Point,
			IsActive:    vt.IsActive,
		})
	}

	return res, nil
}
