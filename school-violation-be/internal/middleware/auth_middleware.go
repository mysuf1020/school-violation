package middleware

import (
	"net/http"
	"strings"

	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/service"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "missing bearer token"))
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		user, err := authService.ParseToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, dto.NewErrorResponse("unauthorized", "invalid token"))
			return
		}

		c.Set("currentUser", user)
		c.Set("currentUserID", user.ID.String())
		c.Set("currentUserRole", string(user.Role))

		c.Next()
	}
}
