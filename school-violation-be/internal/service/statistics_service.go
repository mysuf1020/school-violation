package service

import (
	"context"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/repository"
)

type StatisticsService interface {
	PublicClassStatistics(ctx context.Context) ([]dto.PublicClassStatisticsResponse, error)
	Overview(ctx context.Context) (*dto.StatisticsOverviewResponse, error)
}

type statisticsService struct {
	classRepo     repository.ClassRepository
	studentRepo   repository.StudentRepository
	violationRepo repository.ViolationRepository
}

func NewStatisticsService(
	classRepo repository.ClassRepository,
	studentRepo repository.StudentRepository,
	violationRepo repository.ViolationRepository,
) StatisticsService {
	return &statisticsService{
		classRepo:     classRepo,
		studentRepo:   studentRepo,
		violationRepo: violationRepo,
	}
}

func (s *statisticsService) PublicClassStatistics(ctx context.Context) ([]dto.PublicClassStatisticsResponse, error) {
	classes, err := s.classRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	res := make([]dto.PublicClassStatisticsResponse, 0, len(classes))

	for _, cls := range classes {
		totalStudents, err := s.studentRepo.CountByClass(ctx, cls.ID)
		if err != nil {
			return nil, err
		}

		totalViolations, err := s.violationRepo.CountByClass(ctx, cls.ID)
		if err != nil {
			return nil, err
		}

		topStudent, err := s.studentRepo.FindTopByTotalPoint(ctx, cls.ID)
		if err != nil {
			return nil, err
		}

		highestPoint := 0
		topName := ""
		if topStudent != nil {
			highestPoint = topStudent.TotalPoint
			topName = topStudent.Name
		}

		res = append(res, dto.PublicClassStatisticsResponse{
			ClassID:         cls.ID.String(),
			ClassName:       cls.Name,
			TotalStudents:   totalStudents,
			TotalViolations: totalViolations,
			HighestPoint:    highestPoint,
			TopStudentName:  topName,
		})
	}

	return res, nil
}

func (s *statisticsService) Overview(ctx context.Context) (*dto.StatisticsOverviewResponse, error) {
	// total siswa
	students, err := s.studentRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	// total pelanggaran
	violations, err := s.violationRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	// total kelas
	classes, err := s.classRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	// untuk sekarang: pending report belum dihitung dari DB, default 0 dulu
	resp := &dto.StatisticsOverviewResponse{
		TotalStudents:       int64(len(students)),
		TotalViolations:     int64(len(violations)),
		TotalClasses:        int64(len(classes)),
		TotalPendingReports: 0,
	}

	return resp, nil
}
