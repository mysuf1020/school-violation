package handler

import (
	"net/http"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type StatisticsHandler interface {
	GetPublicClassStatistics(c *gin.Context)
	GetOverview(c *gin.Context)
}

type statisticsHandler struct {
	service           service.StatisticsService
	statisticsService service.StatisticsService
}

func NewStatisticsHandler(service service.StatisticsService) StatisticsHandler {
	return &statisticsHandler{service: service}
}

func (h *statisticsHandler) GetPublicClassStatistics(c *gin.Context) {
	res, err := h.service.PublicClassStatistics(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("get_statistics_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(res))
}

func (h *statisticsHandler) GetOverview(c *gin.Context) {
	res, err := h.service.Overview(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.NewErrorResponse("get_statistics_overview_failed", err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.NewSuccessResponse(res))
}
