package handler

import (
	"net/http"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type ClassHandler interface {
	CreateClass(c *gin.Context)
	ListClasses(c *gin.Context)
}

type classHandler struct {
	classService service.ClassService
}

func NewClassHandler(classService service.ClassService) ClassHandler {
	return &classHandler{classService: classService}
}

func (h *classHandler) CreateClass(c *gin.Context) {
	var req dto.CreateClassRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "invalid payload"))
		return
	}

	resp, err := h.classService.CreateClass(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("create_class_failed", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(resp))
}

func (h *classHandler) ListClasses(c *gin.Context) {
	res, err := h.classService.ListClasses(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_class_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(res))
}
