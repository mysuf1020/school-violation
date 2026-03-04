package service

import (
	"context"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"

	"github.com/google/uuid"
)

type ClassService interface {
	CreateClass(ctx context.Context, req dto.CreateClassRequest) (dto.ClassResponse, error)
	ListClasses(ctx context.Context) ([]dto.ClassResponse, error)
}

type classService struct {
	classRepo repository.ClassRepository
}

func NewClassService(classRepo repository.ClassRepository) ClassService {
	return &classService{classRepo: classRepo}
}

func (s *classService) CreateClass(ctx context.Context, req dto.CreateClassRequest) (dto.ClassResponse, error) {
	c := &model.Class{
		ID:       uuid.New(),
		Name:     req.Name,
		Year:     req.Year,
		Homeroom: req.Homeroom,
	}

	if err := s.classRepo.Create(ctx, c); err != nil {
		return dto.ClassResponse{}, err
	}

	return dto.ClassResponse{
		ID:       c.ID.String(),
		Name:     c.Name,
		Year:     c.Year,
		Homeroom: c.Homeroom,
	}, nil
}

func (s *classService) ListClasses(ctx context.Context) ([]dto.ClassResponse, error) {
	items, err := s.classRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]dto.ClassResponse, 0, len(items))
	for _, c := range items {
		result = append(result, dto.ClassResponse{
			ID:       c.ID.String(),
			Name:     c.Name,
			Year:     c.Year,
			Homeroom: c.Homeroom,
		})
	}

	return result, nil
}
