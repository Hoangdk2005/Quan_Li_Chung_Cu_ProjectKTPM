# 🏢 Phần Mềm Quản Lý Chung Cư

Hệ thống quản lý chung cư toàn diện được xây dựng với kiến trúc Frontend - Backend hiện đại, hỗ trợ quản lý cư dân, căn hộ, dịch vụ và các hoạt động vận hành chung cư. 

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Đóng Góp](#-đóng-góp)
- [Giấy Phép](#-giấy-phép)

## 🎯 Giới Thiệu

Phần mềm Quản Lý Chung Cư là giải pháp số hóa toàn diện giúp ban quản lý chung cư và cư dân có thể: 
- Quản lý thông tin căn hộ và cư dân
- Theo dõi và thanh toán các khoản phí
- Quản lý dịch vụ tiện ích
- Gửi thông báo và phản hồi
- Thống kê báo cáo

## ✨ Tính Năng

### 👥 Quản Lý Cư Dân
- Đăng ký và quản lý thông tin cư dân
- Quản lý hộ khẩu, thành viên gia đình
- Theo dõi lịch sử cư trú

### 🏠 Quản Lý Căn Hộ
- Quản lý thông tin căn hộ (diện tích, tầng, block)
- Trạng thái căn hộ (đang ở, trống, cho thuê)
- Lịch sử giao dịch

### 💰 Quản Lý Phí
- Phí quản lý hàng tháng
- Phí dịch vụ (điện, nước, internet...)
- Phí gửi xe
- Theo dõi công nợ và thanh toán

### 📢 Thông Báo
- Gửi thông báo đến cư dân
- Thông báo sự kiện, bảo trì
- Phản hồi và khiếu nại

### 📊 Báo Cáo & Thống Kê
- Thống kê thu chi
- Báo cáo tình trạng căn hộ
- Dashboard tổng quan

## 🛠 Công Nghệ Sử Dụng

### Backend (BE)
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| Java | 21 | Ngôn ngữ lập trình |
| Spring Boot | 3.5.9 | Framework chính |
| Spring Security | - | Bảo mật và xác thực |
| Spring Data JPA | - | ORM và truy vấn database |
| MySQL | - | Cơ sở dữ liệu |
| Lombok | - | Giảm boilerplate code |
| Docker | - | Container hóa ứng dụng |

### Frontend (FE)
| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 19.2.0 | Thư viện UI |
| TypeScript | 5.9.3 | Ngôn ngữ lập trình |
| Vite | 7.2.4 | Build tool |
| Ant Design | 6.1.1 | UI Component Library |
| TailwindCSS | 4.1.18 | CSS Framework |
| React Router | 7.11.0 | Routing |
| Axios | 1.13.2 | HTTP Client |
| Chart.js | 4.5.1 | Biểu đồ thống kê |

## 📁 Cấu Trúc Dự Án

```
Quan_Li_Chung_Cu_ProjectKTPM/
├── BE/                          # Backend (Spring Boot)
│   ├── src/                     # Source code
│   ├── init-db/                 # Database initialization scripts
│   ├── pom.xml                  # Maven dependencies
│   ├── docker-compose.yml       # Docker configuration
│   └── mvnw                     # Maven wrapper
│
├── FE/                          # Frontend (React + TypeScript)
│   ├── src/                     # Source code
│   ├── public/                  # Static assets
│   ├── package.json             # NPM dependencies
│   ├── vite.config.ts           # Vite configuration
│   └── tsconfig.json            # TypeScript configuration
│
└── README.md                    # Project documentation
```

## 💻 Yêu Cầu Hệ Thống

### Backend
- Java JDK 21+
- Maven 3.8+
- MySQL 8.0+
- Docker & Docker Compose (tùy chọn)

### Frontend
- Node.js 18+
- npm hoặc yarn

## 🚀 Hướng Dẫn Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/Hoangdk2005/Quan_Li_Chung_Cu_ProjectKTPM.git
cd Quan_Li_Chung_Cu_ProjectKTPM
```

### 2. Cài Đặt Backend

#### Sử dụng Docker (Khuyến nghị)

```bash
cd BE
docker-compose up -d
```

#### Cài đặt thủ công

```bash
cd BE

# Cấu hình database trong application.properties

# Build và chạy
./mvnw clean install
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### 3. Cài Đặt Frontend

```bash
cd FE

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### 4. Build Production

#### Backend
```bash
cd BE
./mvnw clean package
java -jar target/quanlichungcu-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd FE
npm run build
npm run preview
```

## ⚙️ Cấu Hình

### Backend (application.properties)

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/quanlichungcu
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📝 API Documentation

API endpoints có thể được truy cập tại: `http://localhost:8080/swagger-ui.html` (nếu đã cấu hình Swagger)

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

## 📄 Giấy Phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<p align="center">
  Made with ❤️ for Apartment Management
</p>
