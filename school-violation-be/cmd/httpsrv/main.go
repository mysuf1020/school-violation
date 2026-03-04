package main

import (
	"log"

	_ "github.com/joho/godotenv/autoload"
	"school-violation-backend/internal/server"
)

func main() {
	s := server.NewServer()
	if err := s.Run(); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
