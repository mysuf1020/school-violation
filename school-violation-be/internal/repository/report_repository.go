package repository

import (
	"context"
	"strings"

	"school-violation-backend/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ReportRepository interface {
	Create(ctx context.Context, report *model.Report) error
	FindByCode(ctx context.Context, code string) (*model.Report, error)
	FindByID(ctx context.Context, id uuid.UUID) (*model.Report, error)
	List(ctx context.Context, filter ReportFilter) ([]model.Report, error)
	Update(ctx context.Context, report *model.Report) error
}

type ReportFilter struct {
	Search string
	Status *model.ReportStatus
	Sort   string
}

type reportRepository struct {
	db *gorm.DB
}

func NewReportRepository(db *gorm.DB) ReportRepository {
	return &reportRepository{db: db}
}

func (r *reportRepository) Create(ctx context.Context, report *model.Report) error {
	return r.db.WithContext(ctx).Create(report).Error
}

func (r *reportRepository) FindByCode(ctx context.Context, code string) (*model.Report, error) {
	var rep model.Report
	if err := r.db.WithContext(ctx).
		Preload("ViolationType").
		Preload("HandledByUser").
		Where("code = ?", code).
		First(&rep).Error; err != nil {
		return nil, err
	}
	return &rep, nil
}

func (r *reportRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.Report, error) {
	var rep model.Report
	if err := r.db.WithContext(ctx).
		Preload("ViolationType").
		Preload("HandledByUser").
		First(&rep, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &rep, nil
}

func (r *reportRepository) List(ctx context.Context, filter ReportFilter) ([]model.Report, error) {
	db := r.db.WithContext(ctx).
		Preload("ViolationType").
		Preload("HandledByUser")

	if filter.Search != "" {
		term := "%" + strings.ToLower(filter.Search) + "%"
		db = db.Where(
			"LOWER(reported_name) LIKE ? OR LOWER(code) LIKE ?",
			term, term,
		)
	}

	if filter.Status != nil {
		db = db.Where("status = ?", *filter.Status)
	}

	order := "created_at DESC"
	if strings.ToLower(filter.Sort) == "asc" {
		order = "created_at ASC"
	}

	var items []model.Report
	if err := db.Order(order).Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}

func (r *reportRepository) Update(ctx context.Context, report *model.Report) error {
	return r.db.WithContext(ctx).Save(report).Error
}
