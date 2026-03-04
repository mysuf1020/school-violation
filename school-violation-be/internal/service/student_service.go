package service

import (
	"context"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"

	"github.com/google/uuid"
)

type StudentService interface {
	CreateStudent(ctx context.Context, req dto.CreateStudentRequest) (*dto.StudentResponse, error)
	ListStudents(ctx context.Context) ([]dto.StudentResponse, error)
}

type studentService struct {
	studentRepo repository.StudentRepository
}

func NewStudentService(studentRepo repository.StudentRepository) StudentService {
	return &studentService{studentRepo: studentRepo}
}

func (s *studentService) CreateStudent(ctx context.Context, req dto.CreateStudentRequest) (*dto.StudentResponse, error) {
	classID, err := uuid.Parse(req.ClassID)
	if err != nil {
		return nil, err
	}

	st := &model.Student{
		ID:        uuid.New(),
		NIS:       req.NIS,
		Name:      req.Name,
		Gender:    req.Gender,
		ClassID:   classID,
		IsActive:  true,
		TotalPoint: 0,
	}

	if err := s.studentRepo.Create(ctx, st); err != nil {
		return nil, err
	}

	// reload dengan preload class
	st, err = s.studentRepo.FindByID(ctx, st.ID)
	if err != nil {
		return nil, err
	}

	return &dto.StudentResponse{
		ID:         st.ID.String(),
		NIS:        st.NIS,
		Name:       st.Name,
		Gender:     st.Gender,
		ClassID:    st.ClassID.String(),
		ClassName:  st.Class.Name,
		TotalPoint: st.TotalPoint,
	}, nil
}

func (s *studentService) ListStudents(ctx context.Context) ([]dto.StudentResponse, error) {
	students, err := s.studentRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	res := make([]dto.StudentResponse, 0, len(students))
	for _, st := range students {
		res = append(res, dto.StudentResponse{
			ID:         st.ID.String(),
			NIS:        st.NIS,
			Name:       st.Name,
			Gender:     st.Gender,
			ClassID:    st.ClassID.String(),
			ClassName:  st.Class.Name,
			TotalPoint: st.TotalPoint,
		})
	}

	return res, nil
}
