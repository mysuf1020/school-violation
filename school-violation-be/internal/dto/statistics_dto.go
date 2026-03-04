package dto

type PublicClassStatisticsResponse struct {
	ClassID         string `json:"class_id"`
	ClassName       string `json:"class_name"`
	TotalStudents   int64  `json:"total_students"`
	TotalViolations int64  `json:"total_violations"`
	HighestPoint    int    `json:"highest_point"`
	TopStudentName  string `json:"top_student_name"`
}

type StatisticsOverviewResponse struct {
	TotalStudents       int64 `json:"total_students"`
	TotalViolations     int64 `json:"total_violations"`
	TotalPendingReports int64 `json:"total_pending_reports"`
	TotalClasses        int64 `json:"total_classes"`
}
