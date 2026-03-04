package handler

import (
	"net/http"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type ViolationHandler interface {
	CreateViolation(c *gin.Context)
	ListViolations(c *gin.Context)
	ListPublicViolations(c *gin.Context)
}

type violationHandler struct {
	violationService service.ViolationService
}

func NewViolationHandler(violationService service.ViolationService) ViolationHandler {
	return &violationHandler{violationService: violationService}
}

func (h *violationHandler) CreateViolation(c *gin.Context) {
	var req dto.CreateViolationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "invalid payload"))
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

	resp, err := h.violationService.CreateViolation(c.Request.Context(), req, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("create_violation_failed", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(resp))
}

func (h *violationHandler) ListViolations(c *gin.Context) {
	var q dto.ViolationListQuery
	_ = c.ShouldBindQuery(&q)

	resp, err := h.violationService.ListViolations(c.Request.Context(), q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_violation_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(resp))
}

func (h *violationHandler) ListPublicViolations(c *gin.Context) {
	var q dto.ViolationListQuery
	_ = c.ShouldBindQuery(&q)

	resp, err := h.violationService.ListViolations(c.Request.Context(), q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_violation_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(resp))
}
