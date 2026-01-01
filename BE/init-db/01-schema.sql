-- ============================================================
-- DATABASE: Quản lý Chung cư BlueSky
-- File 1: Tạo cấu trúc bảng
-- ============================================================

-- =========================
-- 1) Users & Roles
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(120) NULL,
  avatar_url VARCHAR(255) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_roles_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 2) Apartments
-- =========================
CREATE TABLE IF NOT EXISTS apartments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  block VARCHAR(10) NOT NULL,
  floor VARCHAR(10) NOT NULL,
  unit VARCHAR(10) NOT NULL,
  area DECIMAL(10,2) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'EMPTY',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_apartments_unit (block, floor, unit)
) ENGINE=InnoDB;

-- =========================
-- 3) Households
-- =========================
CREATE TABLE IF NOT EXISTS households (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  household_id VARCHAR(20) NOT NULL,
  apartment_id BIGINT UNSIGNED NOT NULL,
  owner_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NULL,
  address VARCHAR(255) NULL,
  move_in_date DATE NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_households_code (household_id),
  KEY idx_households_apartment (apartment_id),
  CONSTRAINT fk_households_apartment FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 4) Residents
-- =========================
CREATE TABLE IF NOT EXISTS residents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  household_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  dob DATE NULL,
  gender VARCHAR(10) NULL,
  id_number VARCHAR(30) NULL,
  relationship_to_head VARCHAR(50) NULL,
  phone VARCHAR(20) NULL,
  is_head TINYINT(1) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Present',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_residents_household (household_id),
  UNIQUE KEY uk_residents_id_number (id_number),
  CONSTRAINT fk_residents_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 5) Vehicles
-- =========================
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  household_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(30) NOT NULL,
  plate VARCHAR(20) NOT NULL,
  brand VARCHAR(50) NULL,
  color VARCHAR(30) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_vehicles_plate (plate),
  KEY idx_vehicles_household (household_id),
  CONSTRAINT fk_vehicles_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 6) Population Events
-- =========================
CREATE TABLE IF NOT EXISTS population_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  resident_id BIGINT UNSIGNED NOT NULL,
  event_type VARCHAR(20) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NULL,
  note VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pop_events_resident (resident_id),
  KEY idx_pop_events_type_date (event_type, from_date),
  CONSTRAINT fk_pop_events_resident FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 7) Fee Items
-- =========================
CREATE TABLE IF NOT EXISTS fee_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'SERVICE',
  unit VARCHAR(30) NOT NULL DEFAULT 'FIXED',
  cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  description VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_fee_items_name (name)
) ENGINE=InnoDB;

-- =========================
-- 8) Fee Periods
-- =========================
CREATE TABLE IF NOT EXISTS fee_periods (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_fee_periods_name (name)
) ENGINE=InnoDB;

-- =========================
-- 9) Fee Obligations
-- =========================
CREATE TABLE IF NOT EXISTS fee_obligations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  household_id BIGINT UNSIGNED NOT NULL,
  fee_item_id BIGINT UNSIGNED NOT NULL,
  fee_period_id BIGINT UNSIGNED NOT NULL,
  fee_item_name VARCHAR(120) NOT NULL,
  period_ym VARCHAR(20) NOT NULL,
  expected_amount DECIMAL(12,2) NOT NULL,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  due_date DATE NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
  payer_name VARCHAR(120) NULL,
  paid_at DATETIME NULL,
  payment_method VARCHAR(30) NULL,
  note VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_obligation_household_period_item (household_id, fee_period_id, fee_item_id),
  KEY idx_obligation_period (fee_period_id),
  KEY idx_obligation_household (household_id),
  KEY idx_obligation_status (status),
  CONSTRAINT fk_obligation_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_obligation_fee_item FOREIGN KEY (fee_item_id) REFERENCES fee_items(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_obligation_fee_period FOREIGN KEY (fee_period_id) REFERENCES fee_periods(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 10) Notifications
-- =========================
CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'INFO',
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  target_type VARCHAR(20) NOT NULL DEFAULT 'ALL',
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME NULL,
  created_by BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_notifications_type (type),
  KEY idx_notifications_status (status),
  CONSTRAINT fk_notifications_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification_targets (
  notification_id BIGINT UNSIGNED NOT NULL,
  household_id BIGINT UNSIGNED NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  read_at DATETIME NULL,
  PRIMARY KEY (notification_id, household_id),
  CONSTRAINT fk_noti_targets_notification FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_noti_targets_household FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;