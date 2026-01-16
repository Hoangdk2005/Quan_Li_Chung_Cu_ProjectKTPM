-- Fix password for admin, totruong, ketoan (password: 123456)
UPDATE users SET password_hash = '$2a$10$JCF4lauo3nY9YrdUBFAo7eosz.Xcwq1YGsUMgNMSPI5uCXvZLvb0q' WHERE username = 'admin';
UPDATE users SET password_hash = '$2a$10$JCF4lauo3nY9YrdUBFAo7eosz.Xcwq1YGsUMgNMSPI5uCXvZLvb0q' WHERE username = 'totruong';
UPDATE users SET password_hash = '$2a$10$JCF4lauo3nY9YrdUBFAo7eosz.Xcwq1YGsUMgNMSPI5uCXvZLvb0q' WHERE username = 'ketoan';
