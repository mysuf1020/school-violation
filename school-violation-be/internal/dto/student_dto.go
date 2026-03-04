package dto

type CreateStudentRequest struct {
	NIS     string `json:"nis" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Gender  string `json:"gender" binding:"required"`   // "L" / "P"
	ClassID string `json:"class_id" binding:"required"` // uuid
}

type UpdateStudentRequest struct {
	Name     *string `json:"name,omitempty"`
	Gender   *string `json:"gender,omitempty"`
	ClassID  *string `json:"class_id,omitempty"`
	IsActive *bool   `json:"is_active,omitempty"`
}

type StudentResponse struct {
	ID         string `json:"id"`
	NIS        string `json:"nis"`
	Name       string `json:"name"`
	Gender     string `json:"gender"`
	ClassID    string `json:"class_id"`
	ClassName  string `json:"class_name"`
	TotalPoint int    `json:"total_point"`
}
