package service

import (
	"context"
	"errors"
	"time"

	"school-violation-backend/internal/config"
	"school-violation-backend/internal/dto"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredential = errors.New("invalid_credential")
)

type AuthService interface {
	Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error)
	ParseToken(tokenString string) (*model.User, error)
}

type authService struct {
	env      *config.Env
	userRepo repository.UserRepository
}

func NewAuthService(env *config.Env, userRepo repository.UserRepository) AuthService {
	return &authService{
		env:      env,
		userRepo: userRepo,
	}
}

func (s *authService) Login(ctx context.Context, req dto.LoginRequest) (*dto.LoginResponse, error) {
	user, err := s.userRepo.FindByUsername(ctx, req.Username)
	if err != nil {
		return nil, ErrInvalidCredential
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredential
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.String(),
		"role":    string(user.Role),
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(s.env.JWTSecret))
	if err != nil {
		return nil, err
	}

	return &dto.LoginResponse{
		Token: tokenString,
		Role:  string(user.Role),
	}, nil
}

func (s *authService) ParseToken(tokenString string) (*model.User, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected_signing_method")
		}
		return []byte(s.env.JWTSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid_token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid_token_claims")
	}

	rawID, ok := claims["user_id"].(string)
	if !ok {
		return nil, errors.New("invalid_token_claims")
	}

	userID, err := uuid.Parse(rawID)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByID(context.Background(), userID)
	if err != nil {
		return nil, err
	}

	return user, nil
}
