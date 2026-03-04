package handler

import (
	"net/http"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type ViolationTypeHandler interface {
	Create(c *gin.Context)
	List(c *gin.Context)
	ListPublic(c *gin.Context)
}

type violationTypeHandler struct {
	service service.ViolationTypeService
}

func NewViolationTypeHandler(service service.ViolationTypeService) ViolationTypeHandler {
	return &violationTypeHandler{service: service}
}

func (h *violationTypeHandler) Create(c *gin.Context) {
	var req dto.CreateViolationTypeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "invalid payload"))
		return
	}

	resp, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("create_violation_type_failed", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(resp))
}

func (h *violationTypeHandler) List(c *gin.Context) {
	res, err := h.service.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_violation_type_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(res))
}

// ListPublic uses the same data but can be exposed without auth.
func (h *violationTypeHandler) ListPublic(c *gin.Context) {
	res, err := h.service.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_violation_type_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(res))
}
