package service

import (
	"context"
	"fmt"
	"time"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"

	"github.com/google/uuid"
)

type ReportService interface {
	CreatePublicReport(ctx context.Context, req dto.CreateReportRequest, evidencePath string) (*dto.ReportResponse, error)
	GetByCode(ctx context.Context, code string) (*dto.ReportResponse, error)

	// sudah pakai pagination
	ListAdmin(ctx context.Context, query dto.ReportListQuery) (*dto.PaginatedReportsResponse, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status model.ReportStatus, handler *model.User) error
}

type reportService struct {
	reportRepo repository.ReportRepository
}

func NewReportService(reportRepo repository.ReportRepository) ReportService {
	return &reportService{reportRepo: reportRepo}
}

func (s *reportService) generateCode() string {
	now := time.Now().UTC()
	return fmt.Sprintf("REP-%s-%d", now.Format("20060102150405"), now.UnixNano()%100000)
}

func (s *reportService) CreatePublicReport(ctx context.Context, req dto.CreateReportRequest, evidencePath string) (*dto.ReportResponse, error) {
	var occurredAtPtr *time.Time
	if req.OccurredAt != "" {
		if t, err := time.Parse(time.RFC3339, req.OccurredAt); err == nil {
			occurredAtPtr = &t
		}
	}
	var violationTypeID *uuid.UUID
	if req.ViolationTypeID != "" {
		if id, err := uuid.Parse(req.ViolationTypeID); err == nil {
			violationTypeID = &id
		}
	}

	code := s.generateCode()

	rep := &model.Report{
		ID:              uuid.New(),
		Code:            code,
		ReportedName:    req.ReportedName,
		ReportedClass:   req.ReportedClass,
		Location:        req.Location,
		Description:     req.Description,
		ReporterName:    req.ReporterName,
		EvidencePath:    evidencePath,
		Status:          model.ReportPending,
		ViolationTypeID: violationTypeID,
		OccurredAt:      occurredAtPtr,
	}

	if err := s.reportRepo.Create(ctx, rep); err != nil {
		return nil, err
	}

	return &dto.ReportResponse{
		Code:          rep.Code,
		ReportedName:  rep.ReportedName,
		ReportedClass: rep.ReportedClass,
		Status:        string(rep.Status),
	}, nil
}

func (s *reportService) GetByCode(ctx context.Context, code string) (*dto.ReportResponse, error) {
	r, err := s.reportRepo.FindByCode(ctx, code)
	if err != nil {
		return nil, err
	}

	resp := &dto.ReportResponse{
		Code:          r.Code,
		ReportedName:  r.ReportedName,
		ReportedClass: r.ReportedClass,
		Status:        string(r.Status),
		Location:      r.Location,
		Description:   r.Description,
	}

	// isi jenis pelanggaran kalau ada
	if r.ViolationType != nil {
		resp.ViolationType = &dto.PublicViolationTypeDTO{
			Code:        r.ViolationType.Code,
			Category:    string(r.ViolationType.Category),
			Description: r.ViolationType.Description,
			Point:       r.ViolationType.Point,
		}
	}

	// isi tanggal kejadian kalau ada
	if r.OccurredAt != nil {
		resp.OccurredAt = r.OccurredAt
	}

	// kalau nanti mau kirim evidence:
	// if r.EvidencePath != "" {
	// 	 resp.EvidenceURL = s.buildPublicEvidenceURL(r.EvidencePath)
	// }

	return resp, nil
}

func (s *reportService) ListAdmin(ctx context.Context, query dto.ReportListQuery) (*dto.PaginatedReportsResponse, error) {
	query.Page, query.Limit = dto.NormalizePagination(query.Page, query.Limit)

	var statusPtr *model.ReportStatus
	switch query.Status {
	case string(model.ReportPending):
		status := model.ReportPending
		statusPtr = &status
	case string(model.ReportApproved):
		status := model.ReportApproved
		statusPtr = &status
	case string(model.ReportRejected):
		status := model.ReportRejected
		statusPtr = &status
	}

	filter := repository.ReportFilter{
		Search: query.Search,
		Sort:   query.Sort,
		Status: statusPtr,
	}

	items, err := s.reportRepo.List(ctx, filter)
	if err != nil {
		return nil, err
	}

	total := len(items)
	start := (query.Page - 1) * query.Limit
	if start >= total {
		return &dto.PaginatedReportsResponse{
			Items: []dto.ReportAdminResponse{},
			Page:  query.Page,
			Limit: query.Limit,
			Total: total,
		}, nil
	}

	end := start + query.Limit
	if end > total {
		end = total
	}
	itemsPage := items[start:end]

	res := make([]dto.ReportAdminResponse, 0, len(itemsPage))
	for _, r := range itemsPage {
		var vtID *string
		if r.ViolationTypeID != nil {
			idStr := r.ViolationTypeID.String()
			vtID = &idStr
		}

		var handledByName *string
		if r.HandledByUser != nil {
			name := r.HandledByUser.Username
			handledByName = &name
		}

		res = append(res, dto.ReportAdminResponse{
			ID:              r.ID.String(),
			Code:            r.Code,
			ReportedName:    r.ReportedName,
			ReportedClass:   r.ReportedClass,
			ViolationTypeID: vtID,
			Location:        r.Location,
			Description:     r.Description,
			EvidencePath:    r.EvidencePath,
			ReporterName:    r.ReporterName,
			Status:          string(r.Status),
			HandledByName:   handledByName,
			CreatedAt:       r.CreatedAt,
		})
	}

	return &dto.PaginatedReportsResponse{
		Items: res,
		Page:  query.Page,
		Limit: query.Limit,
		Total: total,
	}, nil
}

func (s *reportService) UpdateStatus(ctx context.Context, id uuid.UUID, status model.ReportStatus, handler *model.User) error {
	rep, err := s.reportRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	rep.Status = status
	if handler != nil {
		rep.HandledByID = &handler.ID
	}

	return s.reportRepo.Update(ctx, rep)
}
