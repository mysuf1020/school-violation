package dto

type PaginationQuery struct {
	Page  int `form:"page"`
	Limit int `form:"limit"`
}

type ReportListQuery struct {
	PaginationQuery
	Search string `form:"search"`
	Status string `form:"status"`
	Sort   string `form:"sort"`
}

func NormalizePagination(page, limit int) (int, int) {
	if page < 1 {
		page = 1
	}
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	return page, limit
}

type PaginatedReportsResponse struct {
	Items []ReportAdminResponse `json:"items"`
	Page  int                   `json:"page"`
	Limit int                   `json:"limit"`
	Total int                   `json:"total"`
}
