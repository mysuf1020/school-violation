package config

import (
	"log"
	"os"
)

type Env struct {
	AppPort   string
	AppEnv    string
	JWTSecret string

	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	UploadDir string
}

func LoadEnv() *Env {
	env := &Env{
		AppPort:   getEnv("APP_PORT", "8080"),
		AppEnv:    getEnv("APP_ENV", "development"),
		JWTSecret: getEnv("JWT_SECRET", "supersecret"),

		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "123"),
		DBName:     getEnv("DB_NAME", "school_violation"),
		DBSSLMode:  getEnv("DB_SSLMODE", "disable"),

		UploadDir: getEnv("UPLOAD_DIR", "./uploads"),
	}

	// create upload folder kalau belum ada
	if err := os.MkdirAll(env.UploadDir, 0755); err != nil {
		log.Fatalf("failed to create upload dir: %v", err)
	}

	return env
}

func getEnv(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}
