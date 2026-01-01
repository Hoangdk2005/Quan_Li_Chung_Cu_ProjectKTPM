-- ============================================================
-- DATABASE: Quan ly Chung cu BlueSky
-- File 2: Du lieu mau
-- ============================================================

-- Roles
INSERT INTO roles(code, name, description) VALUES
('ADMIN', 'Quan tri vien', 'Toan quyen quan ly he thong'),
('TO_TRUONG', 'To truong/To pho', 'Quan ly nhan khau, ho dan'),
('KE_TOAN', 'Ke toan', 'Quan ly thu phi, bao cao tai chinh'),
('RESIDENT', 'Cu dan', 'Xem thong tin ho, thanh toan phi');

-- Default Admin (password: admin123) - BCrypt hash
INSERT INTO users(username, password_hash, full_name, phone, email, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKfBbmvl0nTXaL4i5uV.cNv0dNdq', 'Quan tri vien', '0901234567', 'admin@bluesky.vn', 'ACTIVE'),
-- To truong (password: totruong123)
('totruong', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyen Van To Truong', '0912345678', 'totruong@bluesky.vn', 'ACTIVE'),
-- Ke toan (password: ketoan123)
('ketoan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tran Thi Ke Toan', '0923456789', 'ketoan@bluesky.vn', 'ACTIVE');

-- Assign roles to users
INSERT INTO user_roles(user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.code = 'ADMIN';
INSERT INTO user_roles(user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'totruong' AND r.code = 'TO_TRUONG';
INSERT INTO user_roles(user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'ketoan' AND r.code = 'KE_TOAN';

-- Sample Apartments
INSERT INTO apartments(block, floor, unit, area, status) VALUES
('A', '02', '05', 75.00, 'OCCUPIED'),
('A', '03', '01', 100.00, 'OCCUPIED'),
('A', '05', '02', 85.00, 'OCCUPIED'),
('A', '07', '08', 120.00, 'OCCUPIED'),
('A', '10', '03', 90.00, 'OCCUPIED'),
('B', '05', '10', 60.00, 'EMPTY'),
('B', '08', '04', 80.00, 'OCCUPIED'),
('B', '12', '06', 95.00, 'OCCUPIED'),
('C', '03', '02', 70.00, 'EMPTY'),
('C', '06', '07', 110.00, 'OCCUPIED');

-- Sample Fee Items
INSERT INTO fee_items(name, type, unit, cost, status, description) VALUES
('Phí dịch vụ chung cư', 'SERVICE', 'M2', 7000, 'ACTIVE', 'Phí dịch vụ hàng tháng theo m2'),
('Phí quản lý', 'SERVICE', 'FIXED', 200000, 'ACTIVE', 'Phí quản lý cố định hàng tháng'),
('Phí gửi xe máy', 'VEHICLE', 'SLOT', 100000, 'ACTIVE', 'Phí gửi xe máy/tháng'),
('Phí gửi ô tô', 'VEHICLE', 'SLOT', 1500000, 'ACTIVE', 'Phí gửi ô tô/tháng'),
('Phí gửi xe đạp điện', 'VEHICLE', 'SLOT', 70000, 'ACTIVE', 'Phí gửi xe đạp điện/tháng'),
('Tiền điện', 'UTILITY', 'KWH', 3500, 'ACTIVE', 'Tiền điện theo số kWh'),
('Tiền nước', 'UTILITY', 'M3', 15000, 'ACTIVE', 'Tiền nước theo m3');

-- Sample Fee Periods
INSERT INTO fee_periods(name, start_date, end_date, status) VALUES
('T10/2025', '2025-10-01', '2025-10-31', 'CLOSED'),
('T11/2025', '2025-11-01', '2025-11-30', 'CLOSED'),
('T12/2025', '2025-12-01', '2025-12-31', 'OPEN'),
('T01/2026', '2026-01-01', '2026-01-31', 'DRAFT');

-- ============================================================
-- Sample Households (liên kết với apartments)
-- ============================================================
INSERT INTO households(household_id, apartment_id, owner_name, phone, address, move_in_date, status) VALUES
('HD-A0205', 1, 'Nguyễn Văn An', '0901111111', 'Căn A02-05', '2023-01-15', 'ACTIVE'),
('HD-A0301', 2, 'Trần Thị Bình', '0902222222', 'Căn A03-01', '2022-06-20', 'ACTIVE'),
('HD-A0502', 3, 'Lê Hoàng Cường', '0903333333', 'Căn A05-02', '2023-03-10', 'ACTIVE'),
('HD-A0708', 4, 'Phạm Minh Đức', '0904444444', 'Căn A07-08', '2021-11-05', 'ACTIVE'),
('HD-A1003', 5, 'Hoàng Thị Em', '0905555555', 'Căn A10-03', '2024-02-01', 'ACTIVE'),
('HD-B0804', 7, 'Võ Văn Phúc', '0906666666', 'Căn B08-04', '2023-08-15', 'ACTIVE'),
('HD-B1206', 8, 'Đỗ Thị Giang', '0907777777', 'Căn B12-06', '2022-12-01', 'ACTIVE'),
('HD-C0607', 10, 'Bùi Văn Hùng', '0908888888', 'Căn C06-07', '2024-05-20', 'ACTIVE');

-- ============================================================
-- Sample Residents (cư dân trong mỗi hộ)
-- ============================================================
-- Hộ 1: Nguyễn Văn An (3 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(1, 'Nguyễn Văn An', '1980-05-15', 'Nam', '001080012345', 'Chủ hộ', '0901111111', 1, 'Present'),
(1, 'Nguyễn Thị Lan', '1985-08-20', 'Nữ', '001085012346', 'Vợ', '0901111112', 0, 'Present'),
(1, 'Nguyễn Văn Bảo', '2010-03-10', 'Nam', '001210012347', 'Con', NULL, 0, 'Present');

-- Hộ 2: Trần Thị Bình (2 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(2, 'Trần Thị Bình', '1975-12-01', 'Nữ', '001075012348', 'Chủ hộ', '0902222222', 1, 'Present'),
(2, 'Trần Văn Cường', '1973-06-15', 'Nam', '001073012349', 'Chồng', '0902222223', 0, 'Present');

-- Hộ 3: Lê Hoàng Cường (4 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(3, 'Lê Hoàng Cường', '1990-09-25', 'Nam', '001090012350', 'Chủ hộ', '0903333333', 1, 'Present'),
(3, 'Lê Thị Dung', '1992-04-18', 'Nữ', '001092012351', 'Vợ', '0903333334', 0, 'Present'),
(3, 'Lê Minh Khôi', '2018-07-22', 'Nam', NULL, 'Con', NULL, 0, 'Present'),
(3, 'Lê Ngọc Mai', '2021-11-05', 'Nữ', NULL, 'Con', NULL, 0, 'Present');

-- Hộ 4: Phạm Minh Đức (3 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(4, 'Phạm Minh Đức', '1988-04-18', 'Nam', '001088012352', 'Chủ hộ', '0904444444', 1, 'Present'),
(4, 'Phạm Thị Hoa', '1992-07-22', 'Nữ', '001092012353', 'Vợ', '0904444445', 0, 'Present'),
(4, 'Phạm Gia Huy', '2015-02-14', 'Nam', NULL, 'Con', NULL, 0, 'Present');

-- Hộ 5: Hoàng Thị Em (1 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(5, 'Hoàng Thị Em', '1995-11-30', 'Nữ', '001095012354', 'Chủ hộ', '0905555555', 1, 'Present');

-- Hộ 6: Võ Văn Phúc (2 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(6, 'Võ Văn Phúc', '1982-02-14', 'Nam', '001082012355', 'Chủ hộ', '0906666666', 1, 'Present'),
(6, 'Võ Thị Quyên', '1986-09-08', 'Nữ', '001086012356', 'Vợ', '0906666667', 0, 'Present');

-- Hộ 7: Đỗ Thị Giang (3 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(7, 'Đỗ Thị Giang', '1987-01-20', 'Nữ', '001087012357', 'Chủ hộ', '0907777777', 1, 'Present'),
(7, 'Đỗ Văn Hưng', '2015-05-10', 'Nam', NULL, 'Con', NULL, 0, 'Present'),
(7, 'Nguyễn Thị Hồng', '1955-03-25', 'Nữ', '001055012358', 'Mẹ', '0907777778', 0, 'Present');

-- Hộ 8: Bùi Văn Hùng (4 người)
INSERT INTO residents(household_id, full_name, dob, gender, id_number, relationship_to_head, phone, is_head, status) VALUES
(8, 'Bùi Văn Hùng', '1979-08-08', 'Nam', '001079012359', 'Chủ hộ', '0908888888', 1, 'Present'),
(8, 'Bùi Thị Linh', '1983-12-25', 'Nữ', '001083012360', 'Vợ', '0908888889', 0, 'Present'),
(8, 'Bùi Minh Tuấn', '2008-06-15', 'Nam', '001208012361', 'Con', NULL, 0, 'Present'),
(8, 'Bùi Ngọc Anh', '2012-09-20', 'Nữ', NULL, 'Con', NULL, 0, 'Present');

-- ============================================================
-- Sample Vehicles (phương tiện của các hộ)
-- ============================================================
INSERT INTO vehicles(household_id, type, plate, brand, color, status) VALUES
-- Hộ 1: 1 ô tô, 1 xe máy
(1, 'Car', '30A-12345', 'Toyota Camry', 'Trắng', 'ACTIVE'),
(1, 'Motorbike', '29B1-11111', 'Honda SH 150i', 'Đen', 'ACTIVE'),
-- Hộ 2: 2 xe máy
(2, 'Motorbike', '29B1-22222', 'Yamaha Exciter', 'Đỏ', 'ACTIVE'),
(2, 'Motorbike', '29B1-22223', 'Honda Vision', 'Xanh', 'ACTIVE'),
-- Hộ 3: 1 ô tô, 1 xe máy
(3, 'Car', '30A-67890', 'Mazda CX5', 'Xanh', 'ACTIVE'),
(3, 'Motorbike', '29B1-33333', 'Honda Lead', 'Trắng', 'ACTIVE'),
-- Hộ 4: 1 ô tô
(4, 'Car', '30A-11122', 'Hyundai Tucson', 'Đen', 'ACTIVE'),
-- Hộ 5: 1 xe máy, 1 xe đạp điện
(5, 'Motorbike', '29B1-44444', 'Vespa Primavera', 'Hồng', 'ACTIVE'),
(5, 'Electric Bike', '29X-55555', 'VinFast', 'Trắng', 'ACTIVE'),
-- Hộ 6: 1 ô tô, 2 xe máy
(6, 'Car', '30A-33344', 'Kia Seltos', 'Bạc', 'ACTIVE'),
(6, 'Motorbike', '29B1-66666', 'Honda Air Blade', 'Đen', 'ACTIVE'),
(6, 'Motorbike', '29B1-66667', 'Yamaha NVX', 'Đỏ', 'ACTIVE'),
-- Hộ 7: 1 xe máy
(7, 'Motorbike', '29B1-77777', 'Honda Wave', 'Xanh', 'ACTIVE'),
-- Hộ 8: 1 ô tô, 1 xe máy
(8, 'Car', '30A-88888', 'VinFast VF8', 'Xanh', 'ACTIVE'),
(8, 'Motorbike', '29B1-88889', 'Honda SH Mode', 'Trắng', 'ACTIVE');

-- ============================================================
-- Fee Obligations (Công nợ phí các kỳ)
-- ============================================================
-- Kỳ T10/2025 (fee_period_id = 1) - ĐÃ ĐÓNG HẾT
-- Hộ 1: 75m2 -> Phí DV: 75*7000=525000, Phí QL: 200000, Xe máy: 100000, Ô tô: 1500000
INSERT INTO fee_obligations(household_id, fee_item_id, fee_period_id, fee_item_name, period_ym, expected_amount, paid_amount, due_date, status, payer_name, paid_at, payment_method) VALUES
(1, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 525000, 525000, '2025-10-15', 'PAID', 'Nguyễn Văn An', '2025-10-10 09:30:00', 'TRANSFER'),
(1, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Nguyễn Văn An', '2025-10-10 09:30:00', 'TRANSFER'),
(1, 3, 1, 'Phí gửi xe máy', 'T10/2025', 100000, 100000, '2025-10-15', 'PAID', 'Nguyễn Văn An', '2025-10-10 09:30:00', 'TRANSFER'),
(1, 4, 1, 'Phí gửi ô tô', 'T10/2025', 1500000, 1500000, '2025-10-15', 'PAID', 'Nguyễn Văn An', '2025-10-10 09:30:00', 'TRANSFER'),
-- Hộ 2: 100m2 -> Phí DV: 700000, Phí QL: 200000, 2 Xe máy: 200000
(2, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 700000, 700000, '2025-10-15', 'PAID', 'Trần Thị Bình', '2025-10-12 14:00:00', 'CASH'),
(2, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Trần Thị Bình', '2025-10-12 14:00:00', 'CASH'),
(2, 3, 1, 'Phí gửi xe máy', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Trần Thị Bình', '2025-10-12 14:00:00', 'CASH'),
-- Hộ 3: 85m2 -> Phí DV: 595000, Phí QL: 200000, Xe máy: 100000, Ô tô: 1500000
(3, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 595000, 595000, '2025-10-15', 'PAID', 'Lê Hoàng Cường', '2025-10-08 16:20:00', 'TRANSFER'),
(3, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Lê Hoàng Cường', '2025-10-08 16:20:00', 'TRANSFER'),
(3, 3, 1, 'Phí gửi xe máy', 'T10/2025', 100000, 100000, '2025-10-15', 'PAID', 'Lê Hoàng Cường', '2025-10-08 16:20:00', 'TRANSFER'),
(3, 4, 1, 'Phí gửi ô tô', 'T10/2025', 1500000, 1500000, '2025-10-15', 'PAID', 'Lê Hoàng Cường', '2025-10-08 16:20:00', 'TRANSFER'),
-- Hộ 4: 120m2 -> Phí DV: 840000, Phí QL: 200000, Ô tô: 1500000
(4, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 840000, 840000, '2025-10-15', 'PAID', 'Phạm Minh Đức', '2025-10-14 10:00:00', 'TRANSFER'),
(4, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Phạm Minh Đức', '2025-10-14 10:00:00', 'TRANSFER'),
(4, 4, 1, 'Phí gửi ô tô', 'T10/2025', 1500000, 1500000, '2025-10-15', 'PAID', 'Phạm Minh Đức', '2025-10-14 10:00:00', 'TRANSFER'),
-- Hộ 5: 90m2 -> Phí DV: 630000, Phí QL: 200000, Xe máy: 100000, Xe điện: 70000
(5, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 630000, 630000, '2025-10-15', 'PAID', 'Hoàng Thị Em', '2025-10-13 11:30:00', 'TRANSFER'),
(5, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Hoàng Thị Em', '2025-10-13 11:30:00', 'TRANSFER'),
(5, 3, 1, 'Phí gửi xe máy', 'T10/2025', 100000, 100000, '2025-10-15', 'PAID', 'Hoàng Thị Em', '2025-10-13 11:30:00', 'TRANSFER'),
(5, 5, 1, 'Phí gửi xe đạp điện', 'T10/2025', 70000, 70000, '2025-10-15', 'PAID', 'Hoàng Thị Em', '2025-10-13 11:30:00', 'TRANSFER'),
-- Hộ 6: 80m2 -> Phí DV: 560000, Phí QL: 200000, Ô tô: 1500000, 2 xe máy: 200000
(6, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 560000, 560000, '2025-10-15', 'PAID', 'Võ Văn Phúc', '2025-10-11 08:45:00', 'CASH'),
(6, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Võ Văn Phúc', '2025-10-11 08:45:00', 'CASH'),
(6, 3, 1, 'Phí gửi xe máy', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Võ Văn Phúc', '2025-10-11 08:45:00', 'CASH'),
(6, 4, 1, 'Phí gửi ô tô', 'T10/2025', 1500000, 1500000, '2025-10-15', 'PAID', 'Võ Văn Phúc', '2025-10-11 08:45:00', 'CASH'),
-- Hộ 7: 95m2 -> Phí DV: 665000, Phí QL: 200000, Xe máy: 100000
(7, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 665000, 665000, '2025-10-15', 'PAID', 'Đỗ Thị Giang', '2025-10-09 15:00:00', 'TRANSFER'),
(7, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Đỗ Thị Giang', '2025-10-09 15:00:00', 'TRANSFER'),
(7, 3, 1, 'Phí gửi xe máy', 'T10/2025', 100000, 100000, '2025-10-15', 'PAID', 'Đỗ Thị Giang', '2025-10-09 15:00:00', 'TRANSFER'),
-- Hộ 8: 110m2 -> Phí DV: 770000, Phí QL: 200000, Ô tô: 1500000, Xe máy: 100000
(8, 1, 1, 'Phí dịch vụ chung cư', 'T10/2025', 770000, 770000, '2025-10-15', 'PAID', 'Bùi Văn Hùng', '2025-10-10 17:30:00', 'TRANSFER'),
(8, 2, 1, 'Phí quản lý', 'T10/2025', 200000, 200000, '2025-10-15', 'PAID', 'Bùi Văn Hùng', '2025-10-10 17:30:00', 'TRANSFER'),
(8, 3, 1, 'Phí gửi xe máy', 'T10/2025', 100000, 100000, '2025-10-15', 'PAID', 'Bùi Văn Hùng', '2025-10-10 17:30:00', 'TRANSFER'),
(8, 4, 1, 'Phí gửi ô tô', 'T10/2025', 1500000, 1500000, '2025-10-15', 'PAID', 'Bùi Văn Hùng', '2025-10-10 17:30:00', 'TRANSFER');

-- Kỳ T11/2025 (fee_period_id = 2) - ĐÃ ĐÓNG GẦN HẾT, 1 HỘ CÒN NỢ
INSERT INTO fee_obligations(household_id, fee_item_id, fee_period_id, fee_item_name, period_ym, expected_amount, paid_amount, due_date, status, payer_name, paid_at, payment_method) VALUES
(1, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 525000, 525000, '2025-11-15', 'PAID', 'Nguyễn Văn An', '2025-11-08 10:00:00', 'TRANSFER'),
(1, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Nguyễn Văn An', '2025-11-08 10:00:00', 'TRANSFER'),
(1, 3, 2, 'Phí gửi xe máy', 'T11/2025', 100000, 100000, '2025-11-15', 'PAID', 'Nguyễn Văn An', '2025-11-08 10:00:00', 'TRANSFER'),
(1, 4, 2, 'Phí gửi ô tô', 'T11/2025', 1500000, 1500000, '2025-11-15', 'PAID', 'Nguyễn Văn An', '2025-11-08 10:00:00', 'TRANSFER'),
(2, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 700000, 700000, '2025-11-15', 'PAID', 'Trần Thị Bình', '2025-11-14 09:00:00', 'TRANSFER'),
(2, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Trần Thị Bình', '2025-11-14 09:00:00', 'TRANSFER'),
(2, 3, 2, 'Phí gửi xe máy', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Trần Thị Bình', '2025-11-14 09:00:00', 'TRANSFER'),
(3, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 595000, 595000, '2025-11-15', 'PAID', 'Lê Hoàng Cường', '2025-11-10 14:20:00', 'TRANSFER'),
(3, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Lê Hoàng Cường', '2025-11-10 14:20:00', 'TRANSFER'),
(3, 3, 2, 'Phí gửi xe máy', 'T11/2025', 100000, 100000, '2025-11-15', 'PAID', 'Lê Hoàng Cường', '2025-11-10 14:20:00', 'TRANSFER'),
(3, 4, 2, 'Phí gửi ô tô', 'T11/2025', 1500000, 1500000, '2025-11-15', 'PAID', 'Lê Hoàng Cường', '2025-11-10 14:20:00', 'TRANSFER'),
-- Hộ 4: CÒN NỢ T11 (chưa đóng)
(4, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 840000, 0, '2025-11-15', 'OVERDUE', NULL, NULL, NULL),
(4, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 0, '2025-11-15', 'OVERDUE', NULL, NULL, NULL),
(4, 4, 2, 'Phí gửi ô tô', 'T11/2025', 1500000, 0, '2025-11-15', 'OVERDUE', NULL, NULL, NULL),
(5, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 630000, 630000, '2025-11-15', 'PAID', 'Hoàng Thị Em', '2025-11-12 16:00:00', 'TRANSFER'),
(5, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Hoàng Thị Em', '2025-11-12 16:00:00', 'TRANSFER'),
(5, 3, 2, 'Phí gửi xe máy', 'T11/2025', 100000, 100000, '2025-11-15', 'PAID', 'Hoàng Thị Em', '2025-11-12 16:00:00', 'TRANSFER'),
(5, 5, 2, 'Phí gửi xe đạp điện', 'T11/2025', 70000, 70000, '2025-11-15', 'PAID', 'Hoàng Thị Em', '2025-11-12 16:00:00', 'TRANSFER'),
(6, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 560000, 560000, '2025-11-15', 'PAID', 'Võ Văn Phúc', '2025-11-13 08:30:00', 'CASH'),
(6, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Võ Văn Phúc', '2025-11-13 08:30:00', 'CASH'),
(6, 3, 2, 'Phí gửi xe máy', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Võ Văn Phúc', '2025-11-13 08:30:00', 'CASH'),
(6, 4, 2, 'Phí gửi ô tô', 'T11/2025', 1500000, 1500000, '2025-11-15', 'PAID', 'Võ Văn Phúc', '2025-11-13 08:30:00', 'CASH'),
(7, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 665000, 665000, '2025-11-15', 'PAID', 'Đỗ Thị Giang', '2025-11-11 10:45:00', 'TRANSFER'),
(7, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Đỗ Thị Giang', '2025-11-11 10:45:00', 'TRANSFER'),
(7, 3, 2, 'Phí gửi xe máy', 'T11/2025', 100000, 100000, '2025-11-15', 'PAID', 'Đỗ Thị Giang', '2025-11-11 10:45:00', 'TRANSFER'),
(8, 1, 2, 'Phí dịch vụ chung cư', 'T11/2025', 770000, 770000, '2025-11-15', 'PAID', 'Bùi Văn Hùng', '2025-11-09 15:20:00', 'TRANSFER'),
(8, 2, 2, 'Phí quản lý', 'T11/2025', 200000, 200000, '2025-11-15', 'PAID', 'Bùi Văn Hùng', '2025-11-09 15:20:00', 'TRANSFER'),
(8, 3, 2, 'Phí gửi xe máy', 'T11/2025', 100000, 100000, '2025-11-15', 'PAID', 'Bùi Văn Hùng', '2025-11-09 15:20:00', 'TRANSFER'),
(8, 4, 2, 'Phí gửi ô tô', 'T11/2025', 1500000, 1500000, '2025-11-15', 'PAID', 'Bùi Văn Hùng', '2025-11-09 15:20:00', 'TRANSFER');

-- Kỳ T12/2025 (fee_period_id = 3) - KỲ HIỆN TẠI, MỘT SỐ ĐÃ ĐÓNG, MỘT SỐ CHƯA
INSERT INTO fee_obligations(household_id, fee_item_id, fee_period_id, fee_item_name, period_ym, expected_amount, paid_amount, due_date, status, payer_name, paid_at, payment_method) VALUES
-- Hộ 1: Đã đóng
(1, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 525000, 525000, '2025-12-15', 'PAID', 'Nguyễn Văn An', '2025-12-05 09:00:00', 'TRANSFER'),
(1, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 200000, '2025-12-15', 'PAID', 'Nguyễn Văn An', '2025-12-05 09:00:00', 'TRANSFER'),
(1, 3, 3, 'Phí gửi xe máy', 'T12/2025', 100000, 100000, '2025-12-15', 'PAID', 'Nguyễn Văn An', '2025-12-05 09:00:00', 'TRANSFER'),
(1, 4, 3, 'Phí gửi ô tô', 'T12/2025', 1500000, 1500000, '2025-12-15', 'PAID', 'Nguyễn Văn An', '2025-12-05 09:00:00', 'TRANSFER'),
-- Hộ 2: Chưa đóng
(2, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 700000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(2, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(2, 3, 3, 'Phí gửi xe máy', 'T12/2025', 200000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
-- Hộ 3: Đã đóng
(3, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 595000, 595000, '2025-12-15', 'PAID', 'Lê Hoàng Cường', '2025-12-08 11:30:00', 'TRANSFER'),
(3, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 200000, '2025-12-15', 'PAID', 'Lê Hoàng Cường', '2025-12-08 11:30:00', 'TRANSFER'),
(3, 3, 3, 'Phí gửi xe máy', 'T12/2025', 100000, 100000, '2025-12-15', 'PAID', 'Lê Hoàng Cường', '2025-12-08 11:30:00', 'TRANSFER'),
(3, 4, 3, 'Phí gửi ô tô', 'T12/2025', 1500000, 1500000, '2025-12-15', 'PAID', 'Lê Hoàng Cường', '2025-12-08 11:30:00', 'TRANSFER'),
-- Hộ 4: Chưa đóng (còn nợ T11)
(4, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 840000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(4, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(4, 4, 3, 'Phí gửi ô tô', 'T12/2025', 1500000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
-- Hộ 5: Đóng một phần
(5, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 630000, 630000, '2025-12-15', 'PAID', 'Hoàng Thị Em', '2025-12-10 14:00:00', 'TRANSFER'),
(5, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(5, 3, 3, 'Phí gửi xe máy', 'T12/2025', 100000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(5, 5, 3, 'Phí gửi xe đạp điện', 'T12/2025', 70000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
-- Hộ 6: Đã đóng
(6, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 560000, 560000, '2025-12-15', 'PAID', 'Võ Văn Phúc', '2025-12-07 10:15:00', 'CASH'),
(6, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 200000, '2025-12-15', 'PAID', 'Võ Văn Phúc', '2025-12-07 10:15:00', 'CASH'),
(6, 3, 3, 'Phí gửi xe máy', 'T12/2025', 200000, 200000, '2025-12-15', 'PAID', 'Võ Văn Phúc', '2025-12-07 10:15:00', 'CASH'),
(6, 4, 3, 'Phí gửi ô tô', 'T12/2025', 1500000, 1500000, '2025-12-15', 'PAID', 'Võ Văn Phúc', '2025-12-07 10:15:00', 'CASH'),
-- Hộ 7: Chưa đóng
(7, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 665000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(7, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
(7, 3, 3, 'Phí gửi xe máy', 'T12/2025', 100000, 0, '2025-12-15', 'UNPAID', NULL, NULL, NULL),
-- Hộ 8: Đã đóng
(8, 1, 3, 'Phí dịch vụ chung cư', 'T12/2025', 770000, 770000, '2025-12-15', 'PAID', 'Bùi Văn Hùng', '2025-12-06 16:45:00', 'TRANSFER'),
(8, 2, 3, 'Phí quản lý', 'T12/2025', 200000, 200000, '2025-12-15', 'PAID', 'Bùi Văn Hùng', '2025-12-06 16:45:00', 'TRANSFER'),
(8, 3, 3, 'Phí gửi xe máy', 'T12/2025', 100000, 100000, '2025-12-15', 'PAID', 'Bùi Văn Hùng', '2025-12-06 16:45:00', 'TRANSFER'),
(8, 4, 3, 'Phí gửi ô tô', 'T12/2025', 1500000, 1500000, '2025-12-15', 'PAID', 'Bùi Văn Hùng', '2025-12-06 16:45:00', 'TRANSFER');

-- ============================================================
-- Sample Notifications
-- ============================================================
INSERT INTO notifications(title, content, type, status, created_by) VALUES
('Thông báo thu phí tháng 12/2025', 'Kính gửi Quý cư dân,\n\nBan quản lý xin thông báo đợt thu phí dịch vụ tháng 12/2025 đã bắt đầu. Hạn nộp phí: 15/12/2025.\n\nXin cảm ơn!', 'GENERAL', 'PUBLISHED', 1),
('Lịch bảo trì thang máy', 'Ban quản lý xin thông báo lịch bảo trì định kỳ thang máy:\n- Block A: 20/12/2025 (8h-12h)\n- Block B: 21/12/2025 (8h-12h)\n- Block C: 22/12/2025 (8h-12h)\n\nTrong thời gian này, cư dân vui lòng sử dụng thang bộ.', 'MAINTENANCE', 'PUBLISHED', 1),
('Chúc mừng năm mới 2026', 'Ban quản lý Chung cư BlueSky kính chúc Quý cư dân một năm mới An Khang Thịnh Vượng!\n\nChương trình đón năm mới sẽ được tổ chức tại sảnh tầng 1 Block A vào tối 31/12/2025.', 'GENERAL', 'DRAFT', 1),
('Nhắc nhở nộp phí', 'Một số hộ dân chưa hoàn thành nghĩa vụ phí tháng 11/2025. Vui lòng thanh toán sớm để tránh phát sinh phí phạt.', 'PAYMENT', 'PUBLISHED', 1);