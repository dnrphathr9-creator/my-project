SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS simpledb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE simpledb;

-- ตารางผู้ใช้ (ผู้ใช้ทดสอบถูกสร้างโดย server.js)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL
);

-- ตารางรายการแจ้งซ่อม
CREATE TABLE requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  reporter VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'รอดำเนินการ',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ข้อมูลตัวอย่าง
INSERT INTO requests (title, category, reporter, status) VALUES
('คอมพิวเตอร์เปิดไม่ติด', 'คอมพิวเตอร์', 'สมชาย ใจดี', 'รอดำเนินการ'),
('อินเทอร์เน็ตห้อง 302 ใช้ไม่ได้', 'เครือข่าย', 'สมชาย ใจดี', 'กำลังซ่อม'),
('ปลั๊กไฟชำรุด', 'ไฟฟ้า', 'สมชาย ใจดี', 'ซ่อมเสร็จ');
