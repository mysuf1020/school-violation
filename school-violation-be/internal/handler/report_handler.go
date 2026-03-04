package handler

import (
	"net/http"
	"os"
	"path/filepath"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ReportHandler interface {
	CreatePublicReport(c *gin.Context)
	GetReportStatus(c *gin.Context)

	ListAdminReports(c *gin.Context)
	ApproveReport(c *gin.Context)
	RejectReport(c *gin.Context)
}

type reportHandler struct {
	reportService service.ReportService
	uploadDir     string
}

func NewReportHandler(reportService service.ReportService, uploadDir string) ReportHandler {
	return &reportHandler{
		reportService: reportService,
		uploadDir:     uploadDir,
	}
}

func (h *reportHandler) CreatePublicReport(c *gin.Context) {
	var req dto.CreateReportRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "invalid payload"))
		return
	}

	var evidencePath string

	file, err := c.FormFile("evidence")
	if err == nil {
		reportDir := filepath.Join(h.uploadDir, "reports")
		if err := os.MkdirAll(reportDir, 0755); err != nil {
			c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("upload_failed", "cannot create upload directory"))
			return
		}

		ext := filepath.Ext(file.Filename)
		newName := uuid.New().String() + ext
		fullPath := filepath.Join(reportDir, newName)

		if err := c.SaveUploadedFile(file, fullPath); err != nil {
			c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("upload_failed", "cannot save file"))
			return
		}

		evidencePath = filepath.ToSlash(filepath.Join("reports", newName))
	}

	resp, err := h.reportService.CreatePublicReport(c.Request.Context(), req, evidencePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("create_report_failed", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(resp))
}

func (h *reportHandler) GetReportStatus(c *gin.Context) {
	code := c.Param("code")

	ctx := c.Request.Context()
	report, err := h.reportService.GetByCode(ctx, code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "report_not_found",
				"message": "Laporan tidak ditemukan",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    report,
	})
}

// Admin list
func (h *reportHandler) ListAdminReports(c *gin.Context) {
	var q dto.ReportListQuery
	_ = c.ShouldBindQuery(&q)

	resp, err := h.reportService.ListAdmin(c.Request.Context(), q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_report_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(resp))
}

// Approve report
func (h *reportHandler) ApproveReport(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "invalid id"))
		return
	}

	userVal, ok := c.Get("currentUser")
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "unauthorized"))
		return
	}
	user, ok := userVal.(*model.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "unauthorized"))
		return
	}

	if err := h.reportService.UpdateStatus(c.Request.Context(), id, model.ReportApproved, user); err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("approve_report_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(gin.H{"status": "APPROVED"}))
}

// Reject report
func (h *reportHandler) RejectReport(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "invalid id"))
		return
	}

	userVal, ok := c.Get("currentUser")
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "unauthorized"))
		return
	}
	user, ok := userVal.(*model.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "unauthorized"))
		return
	}

	if err := h.reportService.UpdateStatus(c.Request.Context(), id, model.ReportRejected, user); err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("reject_report_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(gin.H{"status": "REJECTED"}))
}
