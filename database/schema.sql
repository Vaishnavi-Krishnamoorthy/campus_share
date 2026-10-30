-- ============================================================================
-- DBMS PROJECT: CampusShare - Student Resource Sharing and Borrowing System
-- Database Schema Definition (MySQL 3NF Normalized)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS campus_share;
USE campus_share;

-- Disable foreign key checks during schema re-creation if needed
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS borrowings;
DROP TABLE IF EXISTS borrow_requests;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS students;

DROP VIEW IF EXISTS view_available_resources;
DROP VIEW IF EXISTS view_active_borrowings;
DROP VIEW IF EXISTS view_category_stats;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. STUDENTS TABLE
-- Stores student profile, department, year, role, and authentication hash
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    student_number VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 1 AND 5),
    phone VARCHAR(20),
    profile_image VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- Master table for resource categorization (Electronics, Books, Tools, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Package'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. RESOURCES TABLE
-- Stores physical items listed by students for sharing
-- Relationships:
--   owner_id -> students(student_id) [ON DELETE CASCADE]
--   category_id -> categories(category_id) [ON DELETE RESTRICT]
-- ----------------------------------------------------------------------------
CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    category_id INT NOT NULL,
    resource_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    `condition` ENUM('New', 'Like New', 'Good', 'Fair') NOT NULL DEFAULT 'Good',
    availability_status ENUM('AVAILABLE', 'PENDING', 'BORROWED', 'UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    image_url VARCHAR(255),
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_resources_owner
        FOREIGN KEY (owner_id) REFERENCES students(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_resources_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. BORROW_REQUESTS TABLE
-- Tracks borrow applications made by borrowers to resource owners
-- Relationships:
--   resource_id -> resources(resource_id) [ON DELETE CASCADE]
--   borrower_id -> students(student_id) [ON DELETE CASCADE]
-- ----------------------------------------------------------------------------
CREATE TABLE borrow_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,
    borrower_id INT NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    requested_from DATE NOT NULL,
    requested_until DATE NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    message TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    
    CONSTRAINT fk_requests_resource
        FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_requests_borrower
        FOREIGN KEY (borrower_id) REFERENCES students(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. BORROWINGS TABLE
-- Represents active, returned, or overdue borrowing transactions
-- Triggered atomically when a request is APPROVED via ACID transaction
-- Relationships:
--   request_id -> borrow_requests(request_id) [1:1 UNIQUE]
--   resource_id -> resources(resource_id)
--   borrower_id -> students(student_id)
--   owner_id -> students(student_id)
-- ----------------------------------------------------------------------------
CREATE TABLE borrowings (
    borrowing_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL UNIQUE,
    resource_id INT NOT NULL,
    borrower_id INT NOT NULL,
    owner_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('ACTIVE', 'RETURNED', 'OVERDUE') NOT NULL DEFAULT 'ACTIVE',
    
    CONSTRAINT fk_borrowings_request
        FOREIGN KEY (request_id) REFERENCES borrow_requests(request_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_borrowings_resource
        FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_borrowings_borrower
        FOREIGN KEY (borrower_id) REFERENCES students(student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_borrowings_owner
        FOREIGN KEY (owner_id) REFERENCES students(student_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. REVIEWS TABLE
-- Stores ratings and feedback from borrower after resource is returned
-- Prevent duplicate reviews on the same borrowing transaction using UNIQUE(borrowing_id)
-- ----------------------------------------------------------------------------
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    resource_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    borrowing_id INT NOT NULL UNIQUE,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_reviews_resource
        FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_reviews_reviewer
        FOREIGN KEY (reviewer_id) REFERENCES students(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_reviews_borrowing
        FOREIGN KEY (borrowing_id) REFERENCES borrowings(borrowing_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. NOTIFICATIONS TABLE
-- Stores system alerts for request status, returns, and overdue reminders
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('REQUEST_RECEIVED', 'REQUEST_APPROVED', 'REQUEST_REJECTED', 'RESOURCE_RETURNED', 'DUE_SOON', 'OVERDUE', 'SYSTEM') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notifications_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INDEXES FOR PERFORMANCE & QUERY OPTIMIZATION
-- ============================================================================
CREATE INDEX idx_resources_name ON resources(resource_name);
CREATE INDEX idx_resources_category ON resources(category_id);
CREATE INDEX idx_resources_status ON resources(availability_status);
CREATE INDEX idx_requests_resource ON borrow_requests(resource_id);
CREATE INDEX idx_requests_borrower ON borrow_requests(borrower_id);
CREATE INDEX idx_requests_status ON borrow_requests(status);
CREATE INDEX idx_borrowings_status ON borrowings(status);
CREATE INDEX idx_borrowings_due_date ON borrowings(due_date);
CREATE INDEX idx_notifications_student_read ON notifications(student_id, is_read);

-- ============================================================================
-- DBMS VIEWS FOR REPORTING & ABSTRACTION
-- ============================================================================

-- View 1: Available resources with owner details, category name, and average rating
CREATE OR REPLACE VIEW view_available_resources AS
SELECT 
    r.resource_id,
    r.resource_name,
    r.description,
    r.`condition`,
    r.availability_status,
    r.image_url,
    r.location,
    r.created_at,
    c.category_id,
    c.category_name,
    s.student_id AS owner_id,
    s.name AS owner_name,
    s.email AS owner_email,
    s.department AS owner_department,
    s.year AS owner_year,
    COALESCE(ROUND(AVG(rev.rating), 1), 5.0) AS avg_rating,
    COUNT(rev.review_id) AS total_reviews
FROM resources r
JOIN students s ON r.owner_id = s.student_id
JOIN categories c ON r.category_id = c.category_id
LEFT JOIN reviews rev ON r.resource_id = rev.resource_id
GROUP BY r.resource_id, s.student_id, c.category_id;

-- View 2: Active and Overdue borrowings with calculated days remaining
CREATE OR REPLACE VIEW view_active_borrowings AS
SELECT 
    b.borrowing_id,
    b.request_id,
    b.borrow_date,
    b.due_date,
    b.return_date,
    b.status,
    DATEDIFF(b.due_date, CURDATE()) AS days_remaining,
    r.resource_id,
    r.resource_name,
    r.image_url,
    borrower.student_id AS borrower_id,
    borrower.name AS borrower_name,
    borrower.email AS borrower_email,
    borrower.department AS borrower_department,
    owner.student_id AS owner_id,
    owner.name AS owner_name,
    owner.email AS owner_email,
    owner.phone AS owner_phone
FROM borrowings b
JOIN resources r ON b.resource_id = r.resource_id
JOIN students borrower ON b.borrower_id = borrower.student_id
JOIN students owner ON b.owner_id = owner.student_id;

-- View 3: Category statistics (Resources count & total times borrowed)
CREATE OR REPLACE VIEW view_category_stats AS
SELECT 
    c.category_id,
    c.category_name,
    COUNT(DISTINCT r.resource_id) AS total_resources,
    COUNT(DISTINCT b.borrowing_id) AS total_borrows
FROM categories c
LEFT JOIN resources r ON c.category_id = r.category_id
LEFT JOIN borrowings b ON r.resource_id = b.resource_id
GROUP BY c.category_id, c.category_name;
