package handler

import (
	"net/http"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type StudentHandler interface {
	CreateStudent(c *gin.Context)
	ListStudents(c *gin.Context)
}

type studentHandler struct {
	studentService service.StudentService
}

func NewStudentHandler(studentService service.StudentService) StudentHandler {
	return &studentHandler{studentService: studentService}
}

func (h *studentHandler) CreateStudent(c *gin.Context) {
	var req dto.CreateStudentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "payload tidak valid"))
		return
	}

	resp, err := h.studentService.CreateStudent(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("create_student_failed", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(resp))
}

func (h *studentHandler) ListStudents(c *gin.Context) {
	res, err := h.studentService.ListStudents(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_student_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(res))
}
