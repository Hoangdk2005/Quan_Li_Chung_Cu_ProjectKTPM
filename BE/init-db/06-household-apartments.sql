-- ============================================================
-- Migration: Hỗ trợ nhiều căn hộ cho một hộ dân
-- ============================================================

-- 1) Tạo bảng trung gian household_apartments
CREATE TABLE IF NOT EXISTS household_apartments (
  household_id BIGINT UNSIGNED NOT NULL,
  apartment_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (household_id, apartment_id),
  CONSTRAINT fk_household_apartments_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_household_apartments_apartment FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 2) Migrate dữ liệu từ cột apartment_id cũ sang bảng mới
INSERT INTO household_apartments (household_id, apartment_id)
SELECT id, apartment_id FROM households WHERE apartment_id IS NOT NULL
ON DUPLICATE KEY UPDATE apartment_id = VALUES(apartment_id);

-- 3) Xóa foreign key và cột apartment_id cũ (tùy chọn - chạy sau khi đã kiểm tra dữ liệu)
-- ALTER TABLE households DROP FOREIGN KEY fk_households_apartment;
-- ALTER TABLE households DROP COLUMN apartment_id;
