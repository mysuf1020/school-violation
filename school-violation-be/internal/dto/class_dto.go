package dto

type CreateClassRequest struct {
	Name     string `json:"name" binding:"required"`
	Year     string `json:"year"`
	Homeroom string `json:"homeroom"`
}

type ClassResponse struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Year     string `json:"year"`
	Homeroom string `json:"homeroom"`
}
