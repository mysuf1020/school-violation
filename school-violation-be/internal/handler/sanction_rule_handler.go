package handler

import (
	"net/http"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type SanctionRuleHandler interface {
	Create(c *gin.Context)
	List(c *gin.Context)
}

type sanctionRuleHandler struct {
	service service.SanctionRuleService
}

func NewSanctionRuleHandler(service service.SanctionRuleService) SanctionRuleHandler {
	return &sanctionRuleHandler{service: service}
}

func (h *sanctionRuleHandler) Create(c *gin.Context) {
	var req dto.CreateSanctionRuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_request", "invalid payload"))
		return
	}

	resp, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		if err == service.ErrInvalidPointRange {
			c.JSON(http.StatusBadRequest, dto.NewErrorResponse("invalid_point_range", "min_point tidak boleh lebih besar dari max_point"))
			return
		}
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("create_sanction_rule_failed", err.Error()))
		return
	}

	c.JSON(http.StatusCreated, dto.NewSuccessResponse(resp))
}

func (h *sanctionRuleHandler) List(c *gin.Context) {
	res, err := h.service.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("list_sanction_rule_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(res))
}
