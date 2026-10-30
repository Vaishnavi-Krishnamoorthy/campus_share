-- ============================================================================
-- CampusShare - Student Resource Sharing and Borrowing System
-- Initial Setup: 7 Standard Categories + 1 Default Admin Account
-- ============================================================================

USE campus_share;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE reviews;
TRUNCATE TABLE borrowings;
TRUNCATE TABLE borrow_requests;
TRUNCATE TABLE resources;
TRUNCATE TABLE categories;
TRUNCATE TABLE students;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. DEFAULT ADMINISTRATOR ACCOUNT
-- Default Password: Password123!
-- ----------------------------------------------------------------------------
INSERT INTO students (student_id, name, email, password_hash, student_number, department, year, phone, profile_image, role) VALUES
(1, 'Administrator', 'admin@campusshare.edu', '$2a$10$4Y5eryuHrjPwBmC41U0EUuBfbcMuOx0/u6B0yAORxvDfpC5me.64.', 'ADM-001', 'Administration', 4, '+1-555-0100', NULL, 'ADMIN');

-- ----------------------------------------------------------------------------
-- 2. STANDARD CAMPUS CATEGORIES
-- ----------------------------------------------------------------------------
INSERT INTO categories (category_id, category_name, description, icon) VALUES
(1, 'Electronics', 'Calculators, tablets, microcontrollers, measurement tools, and tech peripherals.', 'Cpu'),
(2, 'Books', 'Course textbooks, reference handbooks, standard guides, and lecture solutions.', 'BookOpen'),
(3, 'Stationery', 'Scientific notebooks, drafting tools, markers, binders, and calculators.', 'PenTool'),
(4, 'Lab Equipment', 'Lab coats, safety goggles, dissecting kits, and molecular model kits.', 'FlaskConical'),
(5, 'Engineering Tools', 'Mini drafters, vernier calipers, micrometer screws, and toolboxes.', 'Wrench'),
(6, 'Accessories', 'Laptop chargers, HDMI adapters, cables, power banks, and flash drives.', 'Plug'),
(7, 'Other', 'Campus sporting gear, dorm essentials, and multi-purpose study supplies.', 'Package');

