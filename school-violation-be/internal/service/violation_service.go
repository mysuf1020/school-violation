package service

import (
	"context"
	"strings"
	"time"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"

	"github.com/google/uuid"
)

type ViolationService interface {
	CreateViolation(ctx context.Context, req dto.CreateViolationRequest, createdBy *model.User) (*dto.ViolationResponse, error)
	ListViolations(ctx context.Context, q dto.ViolationListQuery) (*dto.PaginatedViolationsResponse, error)
}

type violationService struct {
	studentRepo       repository.StudentRepository
	violationTypeRepo repository.ViolationTypeRepository
	sanctionRuleRepo  repository.SanctionRuleRepository
	violationRepo     repository.ViolationRepository
	reportRepo        repository.ReportRepository
}

func NewViolationService(
	studentRepo repository.StudentRepository,
	violationTypeRepo repository.ViolationTypeRepository,
	sanctionRuleRepo repository.SanctionRuleRepository,
	violationRepo repository.ViolationRepository,
	reportRepo repository.ReportRepository,
) ViolationService {
	return &violationService{
		studentRepo:       studentRepo,
		violationTypeRepo: violationTypeRepo,
		sanctionRuleRepo:  sanctionRuleRepo,
		violationRepo:     violationRepo,
		reportRepo:        reportRepo,
	}
}

func (s *violationService) CreateViolation(ctx context.Context, req dto.CreateViolationRequest, createdBy *model.User) (*dto.ViolationResponse, error) {
	studentID, err := uuid.Parse(req.StudentID)
	if err != nil {
		return nil, err
	}
	vtID, err := uuid.Parse(req.ViolationTypeID)
	if err != nil {
		return nil, err
	}

	student, err := s.studentRepo.FindByID(ctx, studentID)
	if err != nil {
		return nil, err
	}

	vt, err := s.violationTypeRepo.FindByID(ctx, vtID)
	if err != nil {
		return nil, err
	}

	occurredAt := time.Now()
	if req.OccurredAt != "" {
		if t, err := time.Parse(time.RFC3339, req.OccurredAt); err == nil {
			occurredAt = t
		}
	}

	totalBefore := student.TotalPoint
	violationPoint := vt.Point
	totalAfter := totalBefore + violationPoint

	var sanctionName string
	rule, err := s.sanctionRuleRepo.FindForPoint(ctx, totalAfter)
	if err != nil {
		return nil, err
	}
	if rule != nil {
		sanctionName = rule.Name
	}

	source := req.Source
	if strings.TrimSpace(source) == "" {
		source = "DIRECT"
	}

	v := &model.Violation{
		ID:                uuid.New(),
		StudentID:         student.ID,
		Student:           *student,
		ViolationTypeID:   vt.ID,
		ViolationType:     *vt,
		OccurredAt:        occurredAt,
		Location:          req.Location,
		Description:       req.Description,
		Source:            model.ViolationSource(source),
		TotalPointBefore:  totalBefore,
		ViolationPoint:    violationPoint,
		TotalPointAfter:   totalAfter,
		SanctionNameAfter: sanctionName,
		CreatedByUserID:   createdBy.ID,
		CreatedByUser:     *createdBy,
	}

	if err := s.violationRepo.Create(ctx, v); err != nil {
		return nil, err
	}

	student.TotalPoint = totalAfter
	if err := s.studentRepo.Update(ctx, student); err != nil {
		return nil, err
	}

	resp := toViolationResponse(v)
	return &resp, nil
}

func (s *violationService) ListViolations(ctx context.Context, q dto.ViolationListQuery) (*dto.PaginatedViolationsResponse, error) {
	page, limit := dto.NormalizePagination(q.Page, q.Limit)

	items, err := s.violationRepo.List(ctx)
	if err != nil {
		return nil, err
	}

	// normalisasi filter
	className := strings.TrimSpace(strings.ToLower(q.ClassName))
	category := strings.TrimSpace(strings.ToUpper(q.Category))
	source := strings.TrimSpace(strings.ToUpper(q.Source))

	var startDate, endDate *time.Time
	if q.StartDate != "" {
		if t, err := time.Parse("2006-01-02", q.StartDate); err == nil {
			start := t
			startDate = &start
		}
	}
	if q.EndDate != "" {
		if t, err := time.Parse("2006-01-02", q.EndDate); err == nil {
			// end date inclusive, set ke akhir hari
			end := t.Add(24 * time.Hour)
			endDate = &end
		}
	}

	filtered := make([]*model.Violation, 0, len(items))
	for i := range items {
		v := &items[i]

		// class filter
		if className != "" {
			if v.Student.Class.Name == "" {
				continue
			}
			if !strings.Contains(strings.ToLower(v.Student.Class.Name), className) {
				continue
			}
		}

		// category filter
		if category != "" {
			if strings.ToUpper(string(v.ViolationType.Category)) != category {
				continue
			}
		}

		// source filter
		if source != "" {
			if strings.ToUpper(string(v.Source)) != source {
				continue
			}
		}

		// date filter (by occurred_at)
		if startDate != nil {
			if v.OccurredAt.Before(*startDate) {
				continue
			}
		}
		if endDate != nil {
			if !v.OccurredAt.Before(*endDate) {
				continue
			}
		}

		filtered = append(filtered, v)
	}

	total := len(filtered)
	start := (page - 1) * limit
	if start >= total {
		return &dto.PaginatedViolationsResponse{
			Items: []dto.ViolationResponse{},
			Page:  page,
			Limit: limit,
			Total: total,
		}, nil
	}

	end := start + limit
	if end > total {
		end = total
	}

	resItems := make([]dto.ViolationResponse, 0, end-start)
	for _, v := range filtered[start:end] {
		res := toViolationResponse(v)
		resItems = append(resItems, res)
	}

	return &dto.PaginatedViolationsResponse{
		Items: resItems,
		Page:  page,
		Limit: limit,
		Total: total,
	}, nil
}

func toViolationResponse(v *model.Violation) dto.ViolationResponse {
	var classID, className string
	if v.Student.Class.ID != uuid.Nil {
		classID = v.Student.Class.ID.String()
		className = v.Student.Class.Name
	}

	return dto.ViolationResponse{
		ID:                   v.ID.String(),
		StudentID:            v.StudentID.String(),
		StudentName:          v.Student.Name,
		ClassID:              classID,
		ClassName:            className,
		ViolationTypeID:      v.ViolationTypeID.String(),
		ViolationCode:        v.ViolationType.Code,
		ViolationCategory:    string(v.ViolationType.Category),
		ViolationDescription: v.ViolationType.Description,
		ViolationPoint:       v.ViolationPoint,
		TotalPointBefore:     v.TotalPointBefore,
		TotalPointAfter:      v.TotalPointAfter,
		SanctionNameAfter:    v.SanctionNameAfter,
		Source:               string(v.Source),
		OccurredAt:           v.OccurredAt,
		CreatedAt:            v.CreatedAt,
	}
}
