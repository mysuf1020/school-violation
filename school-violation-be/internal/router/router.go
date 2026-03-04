package router

import (
	"school-violation-backend/internal/handler"
	"school-violation-backend/internal/middleware"
	"school-violation-backend/internal/model"

	"github.com/gin-gonic/gin"
)

type RouterManager struct {
	Engine               *gin.Engine
	AuthHandler          handler.AuthHandler
	ReportHandler        handler.ReportHandler
	StudentHandler       handler.StudentHandler
	ViolationHandler     handler.ViolationHandler
	ClassHandler         handler.ClassHandler
	ViolationTypeHandler handler.ViolationTypeHandler
	SanctionRuleHandler  handler.SanctionRuleHandler
	StatisticsHandler    handler.StatisticsHandler
	AuthMiddleware       gin.HandlerFunc
}

func NewRouterManager(
	authHandler handler.AuthHandler,
	reportHandler handler.ReportHandler,
	studentHandler handler.StudentHandler,
	violationHandler handler.ViolationHandler,
	classHandler handler.ClassHandler,
	violationTypeHandler handler.ViolationTypeHandler,
	sanctionRuleHandler handler.SanctionRuleHandler,
	statisticsHandler handler.StatisticsHandler,
	authMiddleware gin.HandlerFunc,
) *RouterManager {
	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	m := &RouterManager{
		Engine:               r,
		AuthHandler:          authHandler,
		ReportHandler:        reportHandler,
		StudentHandler:       studentHandler,
		ViolationHandler:     violationHandler,
		ClassHandler:         classHandler,
		ViolationTypeHandler: violationTypeHandler,
		SanctionRuleHandler:  sanctionRuleHandler,
		StatisticsHandler:    statisticsHandler,
		AuthMiddleware:       authMiddleware,
	}

	m.registerPublicRoutes()
	m.registerAdminRoutes()

	return m
}

func (m *RouterManager) registerPublicRoutes() {
	public := m.Engine.Group("/public")
	{
		public.POST("/reports", m.ReportHandler.CreatePublicReport)
		public.GET("/reports/:code", m.ReportHandler.GetReportStatus)

		public.GET("/violations", m.ViolationHandler.ListPublicViolations)
		public.GET("/violation-types", m.ViolationTypeHandler.ListPublic)
		public.GET("/statistics/classes", m.StatisticsHandler.GetPublicClassStatistics)
	}
}

func (m *RouterManager) registerAdminRoutes() {
	admin := m.Engine.Group("/admin")
	{
		// login tanpa auth
		admin.POST("/auth/login", m.AuthHandler.Login)

		// semua endpoint di bawah ini butuh JWT
		protected := admin.Group("")
		protected.Use(m.AuthMiddleware)

		// ADMIN ONLY (master data)
		adminOnly := protected.Group("")
		adminOnly.Use(middleware.RequireRoles(model.RoleAdmin))

		adminOnly.POST("/classes", m.ClassHandler.CreateClass)
		adminOnly.GET("/classes", m.ClassHandler.ListClasses)

		adminOnly.POST("/violation-types", m.ViolationTypeHandler.Create)
		adminOnly.GET("/violation-types", m.ViolationTypeHandler.List)

		adminOnly.POST("/sanction-rules", m.SanctionRuleHandler.Create)
		adminOnly.GET("/sanction-rules", m.SanctionRuleHandler.List)

		// ADMIN + BK + GURU (operasional harian)
		staff := protected.Group("")
		staff.Use(middleware.RequireRoles(
			model.RoleAdmin,
			model.RoleBK,
			model.RoleGuru,
		))

		// students
		staff.POST("/students", m.StudentHandler.CreateStudent)
		staff.GET("/students", m.StudentHandler.ListStudents)

		// violations
		staff.POST("/violations", m.ViolationHandler.CreateViolation)
		staff.GET("/violations", m.ViolationHandler.ListViolations)

		// reports (list + approval akan kita tambahkan di langkah 2)
		staff.GET("/reports", m.ReportHandler.ListAdminReports)
		staff.PATCH("/reports/:id/approve", m.ReportHandler.ApproveReport)
		staff.PATCH("/reports/:id/reject", m.ReportHandler.RejectReport)

		// statistics
		staff.GET("/statistics/overview", m.StatisticsHandler.GetOverview)

	}
}
