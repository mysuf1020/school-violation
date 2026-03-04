package middleware

import (
	"net/http"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"

	"github.com/gin-gonic/gin"
)

// RequireRoles memastikan currentUser punya salah satu role yang diizinkan.
func RequireRoles(roles ...model.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		val, ok := c.Get("currentUser")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "unauthorized"))
			return
		}

		user, ok := val.(*model.User)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "unauthorized"))
			return
		}

		for _, r := range roles {
			if user.Role == r {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, dto.NewErrorResponse("forbidden", "insufficient_role"))
	}
}
