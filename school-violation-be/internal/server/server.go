package server

import (
	"context"
	"errors"
	"fmt"
	"log"

	"school-violation-backend/internal/config"
	"school-violation-backend/internal/handler"
	"school-violation-backend/internal/infrastructure"
	"school-violation-backend/internal/middleware"
	"school-violation-backend/internal/model"
	"school-violation-backend/internal/repository"
	"school-violation-backend/internal/router"
	"school-violation-backend/internal/service"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Server struct {
	Env    *config.Env
	Router *router.RouterManager
}

func NewServer() *Server {
	env := config.LoadEnv()
	db := infrastructure.NewDatabase(env)

	// Repositories
	userRepo := repository.NewUserRepository(db)
	reportRepo := repository.NewReportRepository(db)
	studentRepo := repository.NewStudentRepository(db)
	violationTypeRepo := repository.NewViolationTypeRepository(db)
	sanctionRuleRepo := repository.NewSanctionRuleRepository(db)
	violationRepo := repository.NewViolationRepository(db)
	classRepo := repository.NewClassRepository(db)

	// Services
	authService := service.NewAuthService(env, userRepo)
	reportService := service.NewReportService(reportRepo)
	studentService := service.NewStudentService(studentRepo)
	violationTypeService := service.NewViolationTypeService(violationTypeRepo)
	sanctionRuleService := service.NewSanctionRuleService(sanctionRuleRepo)
	violationService := service.NewViolationService(
		studentRepo,
		violationTypeRepo,
		sanctionRuleRepo,
		violationRepo,
		reportRepo,
	)
	statisticsService := service.NewStatisticsService(classRepo, studentRepo, violationRepo)

	classService := service.NewClassService(classRepo)

	// Seed default admin if missing
	ensureDefaultAdmin(userRepo)
	// Seed violation types from official rulebook if missing
	ensureDefaultViolationTypes(db)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	reportHandler := handler.NewReportHandler(reportService, env.UploadDir)
	studentHandler := handler.NewStudentHandler(studentService)
	violationTypeHandler := handler.NewViolationTypeHandler(violationTypeService)
	sanctionRuleHandler := handler.NewSanctionRuleHandler(sanctionRuleService)
	violationHandler := handler.NewViolationHandler(violationService)
	statisticsHandler := handler.NewStatisticsHandler(statisticsService)

	classHandler := handler.NewClassHandler(classService)

	// Middleware
	authMiddleware := middleware.AuthMiddleware(authService)

	// Router
	routerManager := router.NewRouterManager(
		authHandler,
		reportHandler,
		studentHandler,
		violationHandler,
		classHandler,
		violationTypeHandler,
		sanctionRuleHandler,
		statisticsHandler,
		authMiddleware,
	)

	return &Server{
		Env:    env,
		Router: routerManager,
	}
}

func (s *Server) Run() error {
	return s.Router.Engine.Run(fmt.Sprintf(":%s", s.Env.AppPort))
}

func ensureDefaultAdmin(userRepo repository.UserRepository) {
	const username = "admin"
	const password = "admin123"

	ctx := context.Background()
	_, err := userRepo.FindByUsername(ctx, username)
	if err == nil {
		return
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Printf("failed to check default admin existence: %v", err)
		return
	}

	hash, hashErr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if hashErr != nil {
		log.Printf("failed to hash default admin password: %v", hashErr)
		return
	}

	user := &model.User{
		ID:       uuid.New(),
		Username: username,
		Password: string(hash),
		Role:     model.RoleAdmin,
	}

	if createErr := userRepo.Create(ctx, user); createErr != nil {
		log.Printf("failed to create default admin user: %v", createErr)
		return
	}

	log.Printf("default admin user ensured (username: %s, password: %s)", username, password)
}

func ensureDefaultViolationTypes(db *gorm.DB) {
	type seedItem struct {
		Code        string
		Category    model.ViolationCategory
		Description string
		Point       int
	}

	items := []seedItem{
		// A: Pelanggaran Berat
		{"A01", model.ViolationHeavy, "Membawa atau mengkonsumsi miras, ganja, narkoba, penyalahgunaan obat-obatan dan sejenisnya yang memabukan di sekolah.", 100},
		{"A02", model.ViolationHeavy, "Membawa, menonton, membuat, dan atau/ mengedarkan barang porno (buku, film, gambar, vcd dll) di sekolah.", 100},
		{"A03", model.ViolationHeavy, "Melakukan tindak pidana atau terlibat tindak pidana (pencopetan, pemerasan, tawuran dan lain-lain).", 100},
		{"A04", model.ViolationHeavy, "Menganiaya atau mengintimidasi Kepala Sekolah, Guru, Tenaga Kependidikan, dan Peserta Didik.", 100},
		{"A05", model.ViolationHeavy, "Melakukan tindakan/kegiatan/perbuatan asusila.", 100},
		{"A06", model.ViolationHeavy, "Membawa atau menggunakan senjata tajam tanpa izin Guru atau senjata api.", 100},
		{"A07", model.ViolationHeavy, "Memalsukan stempel sekolah.", 100},
		{"A08", model.ViolationHeavy, "Menikah, hamil di luar nikah atau menghamili.", 100},
		{"A09", model.ViolationHeavy, "Bertatto/bertindik/piercing dan sejenisnya.", 100},
		{"A10", model.ViolationHeavy, "Mengikuti atau menjadi anggota organisasi terlarang, gengster, atau berandal motor.", 95},
		{"A11", model.ViolationHeavy, "Merencanakan atau melihat serta berada di tempat perkelahian (tawuran) dengan peserta didik dari sekolah lain.", 95},
		{"A12", model.ViolationHeavy, "Memalsukan tandatangan Orang Tua, Kepala sekolah, Guru, atau Tenaga Kependidikan.", 90},
		{"A13", model.ViolationHeavy, "Mencemarkan nama baik Sekolah, Guru, Kepala Sekolah atau Tenaga Kependidikan.", 90},
		// B: Pelanggaran Sedang
		{"B01", model.ViolationMedium, "Berjudi, taruhan atau sejenisnya (dengan media apapun) di lingkungan sekolah.", 75},
		{"B02", model.ViolationMedium, "Berkelahi dan atau/ terlibat perkelahian dengan Peserta Didik di lingkungan sekolah.", 75},
		{"B03", model.ViolationMedium, "Mengancam warga sekolah.", 55},
		{"B04", model.ViolationMedium, "Menerobos atau melompat pagar (bolos).", 55},
		{"B05", model.ViolationMedium, "Berbicara/bertingkah laku tidak sopan terhadap Kepala Sekolah, Guru, atau Tenaga Kependidikan.", 55},
		{"B06", model.ViolationMedium, "Merusak sarana prasarana milik sekolah dan atau/ warga sekolah dengan sengaja.", 55},
		{"B07", model.ViolationMedium, "Merokok atau membawa rokok di lingkungan sekolah maupun di luar lingkungan sekolah dengan masih mengenakan seragam sekolah.", 55},
		{"B08", model.ViolationMedium, "Melakukan tindakan sexual bullying terhadap teman atau siapapun.", 55},
		// C: Pelanggaran Ringan
		{"C01", model.ViolationLight, "Mencorat coret sarana prasarana sekolah.", 25},
		{"C02", model.ViolationLight, "Membuat pernyataan bohong, dusta atau palsu.", 25},
		{"C03", model.ViolationLight, "Melakukan tindakan bullying verbal terhadap teman atau siapapun.", 25},
		{"C04", model.ViolationLight, "Melakukan tindakan cyber bullying atau sosial bullying terhadap teman atau siapapun.", 25},
		{"C05", model.ViolationLight, "Memarkir kendaraan di sekolah di saat KBM.", 25},
		{"C06", model.ViolationLight, "Meninggalkan kelas/pembelajaran tanpa izin guru.", 10},
		{"C07", model.ViolationLight, "Mengabaikan surat panggilan dari sekolah.", 10},
		{"C08", model.ViolationLight, "Mengabaikan panggilan Kepala Sekolah, Guru, atau Tenaga Kependidikan.", 10},
		{"C09", model.ViolationLight, "Membuat gaduh atau mengganggu kegiatan pembelajaran.", 10},
		{"C10", model.ViolationLight, "Membuang sampah sembarangan atau merusak taman.", 10},
		{"C11", model.ViolationLight, "Mencontek atau kerjasama pada saat ujian.", 10},
		{"C12", model.ViolationLight, "Berada di kelas/tidak mengikuti upacara, apel pagi, atau pembiasaan di lapangan tanpa izin.", 10},
		{"C13", model.ViolationLight, "Tidak masuk sekolah tanpa keterangan.", 10},
		{"C14", model.ViolationLight, "Model rambut tidak sesuai ketentuan atau mewarnai selain hitam.", 5},
		{"C15", model.ViolationLight, "Terlambat masuk sekolah/terlambat mengikuti kegiatan pembelajaran.", 5},
		{"C16", model.ViolationLight, "Tidak membawa tempat makan atau tempat minum.", 5},
		{"C17", model.ViolationLight, "Tidak membawa Al-Quran setiap Selasa dan Jumat, tidak melaksanakan ibadah, atau tidak mengisi buku agenda sholat.", 5},
		{"C18", model.ViolationLight, "Memakai pakaian/atribut sekolah tidak sesuai ketentuan (atribut tidak lengkap, memakai jaket/sweater di dalam sekolah).", 5},
		{"C19", model.ViolationLight, "Memakai ikat pinggang/kaos kaki/sepatu tidak sesuai ketentuan.", 5},
		{"C20", model.ViolationLight, "Peserta didik putra memakai perhiasan (gelang, kalung, dll).", 5},
		{"C21", model.ViolationLight, "Peserta didik putri memakai perhiasan atau make-up berlebihan, tidak memakai ciput dan leging.", 5},
	}

	for _, item := range items {
		var count int64
		if err := db.Model(&model.ViolationType{}).Where("code = ?", item.Code).Count(&count).Error; err != nil {
			log.Printf("failed to check violation type %s: %v", item.Code, err)
			continue
		}
		if count > 0 {
			continue
		}
		rec := model.ViolationType{
			ID:          uuid.New(),
			Code:        item.Code,
			Category:    item.Category,
			Description: item.Description,
			Point:       item.Point,
			IsActive:    true,
		}
		if err := db.Create(&rec).Error; err != nil {
			log.Printf("failed to seed violation type %s: %v", item.Code, err)
		}
	}
}
