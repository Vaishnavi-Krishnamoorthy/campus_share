-- ============================================================================
-- DBMS PROJECT: CampusShare - Student Resource Sharing and Borrowing System
-- Demonstration SQL Queries for DBMS Lab Presentation and Viva
-- ============================================================================

USE campus_share;

-- ----------------------------------------------------------------------------
-- 1. BASIC CRUD DEMONSTRATIONS
-- ----------------------------------------------------------------------------

-- [SELECT] Retrieve all available resources in 'Electronics' category
SELECT 
    r.resource_id, 
    r.resource_name, 
    r.condition, 
    r.location, 
    s.name AS owner_name
FROM resources r
JOIN students s ON r.owner_id = s.student_id
JOIN categories c ON r.category_id = c.category_id
WHERE c.category_name = 'Electronics' 
  AND r.availability_status = 'AVAILABLE';

-- [INSERT] Student lists a new resource
-- INSERT INTO resources (owner_id, category_id, resource_name, description, `condition`, availability_status, location)
-- VALUES (2, 1, 'Texas Instruments TI-84 Plus CE', 'Graphing calculator for advanced engineering calculus.', 'New', 'AVAILABLE', 'CSE Lab 4');

-- [UPDATE] Mark an existing resource as temporarily unavailable
-- UPDATE resources 
-- SET availability_status = 'UNAVAILABLE' 
-- WHERE resource_id = 14;

-- [DELETE] Remove a student resource safely (subject to foreign key rules)
-- DELETE FROM resources WHERE resource_id = 99;


-- ----------------------------------------------------------------------------
-- 2. ADVANCED RELATIONAL JOINS
-- ----------------------------------------------------------------------------

-- 4-Table JOIN: Connect Borrowings -> Resources -> Borrowers -> Owners
SELECT 
    b.borrowing_id,
    r.resource_name,
    borrower.name AS borrower_name,
    borrower.department AS borrower_dept,
    owner.name AS owner_name,
    owner.phone AS owner_contact,
    b.borrow_date,
    b.due_date,
    b.status
FROM borrowings b
JOIN resources r ON b.resource_id = r.resource_id
JOIN students borrower ON b.borrower_id = borrower.student_id
JOIN students owner ON b.owner_id = owner.student_id
ORDER BY b.due_date ASC;


-- ----------------------------------------------------------------------------
-- 3. AGGREGATE FUNCTIONS & GROUP BY
-- ----------------------------------------------------------------------------

-- [COUNT & GROUP BY] Resource count and average rating per category
SELECT 
    c.category_name,
    COUNT(DISTINCT r.resource_id) AS total_items_listed,
    COUNT(DISTINCT b.borrowing_id) AS total_times_borrowed,
    COALESCE(ROUND(AVG(rev.rating), 2), 0) AS average_rating
FROM categories c
LEFT JOIN resources r ON c.category_id = r.category_id
LEFT JOIN borrowings b ON r.resource_id = b.resource_id
LEFT JOIN reviews rev ON r.resource_id = rev.resource_id
GROUP BY c.category_id, c.category_name
ORDER BY total_times_borrowed DESC;

-- [AGGREGATE] Maximum, Minimum, and Average borrowing duration (days)
SELECT 
    MIN(DATEDIFF(due_date, borrow_date)) AS min_loan_days,
    MAX(DATEDIFF(due_date, borrow_date)) AS max_loan_days,
    ROUND(AVG(DATEDIFF(due_date, borrow_date)), 1) AS avg_loan_days
FROM borrowings;


-- ----------------------------------------------------------------------------
-- 4. SEARCH & PATTERN MATCHING (LIKE)
-- ----------------------------------------------------------------------------

-- Search resources by keyword across name, description, and department
SELECT 
    r.resource_id,
    r.resource_name,
    r.description,
    c.category_name,
    s.name AS owner_name,
    s.department AS owner_dept,
    r.availability_status
FROM resources r
JOIN categories c ON r.category_id = c.category_id
JOIN students s ON r.owner_id = s.student_id
WHERE (r.resource_name LIKE '%calculator%' OR r.description LIKE '%calculator%')
  AND r.availability_status = 'AVAILABLE';


-- ----------------------------------------------------------------------------
-- 5. OVERDUE MANAGEMENT QUERY
-- ----------------------------------------------------------------------------

-- Detect and list all active borrowings where due_date has expired
SELECT 
    b.borrowing_id,
    r.resource_name,
    s.name AS borrower_name,
    s.email AS borrower_email,
    b.due_date,
    DATEDIFF(CURDATE(), b.due_date) AS days_overdue
FROM borrowings b
JOIN resources r ON b.resource_id = r.resource_id
JOIN students s ON b.borrower_id = s.student_id
WHERE b.status = 'OVERDUE' OR (b.status = 'ACTIVE' AND b.due_date < CURDATE());


-- ----------------------------------------------------------------------------
-- 6. ADMIN DBMS REPORTS
-- ----------------------------------------------------------------------------

-- Report 1: Most Borrowed Resources (Leaderboard)
SELECT 
    r.resource_id,
    r.resource_name,
    c.category_name,
    s.name AS owner_name,
    COUNT(b.borrowing_id) AS borrow_count
FROM resources r
JOIN categories c ON r.category_id = c.category_id
JOIN students s ON r.owner_id = s.student_id
JOIN borrowings b ON r.resource_id = b.resource_id
GROUP BY r.resource_id, r.resource_name, c.category_name, s.name
ORDER BY borrow_count DESC
LIMIT 10;

-- Report 2: Student Activity Leaderboard (Top contributors)
SELECT 
    s.student_id,
    s.name,
    s.department,
    COUNT(DISTINCT r.resource_id) AS resources_shared,
    COUNT(DISTINCT b_lent.borrowing_id) AS times_lent,
    COUNT(DISTINCT b_borrowed.borrowing_id) AS times_borrowed
FROM students s
LEFT JOIN resources r ON s.student_id = r.owner_id
LEFT JOIN borrowings b_lent ON s.student_id = b_lent.owner_id
LEFT JOIN borrowings b_borrowed ON s.student_id = b_borrowed.borrower_id
WHERE s.role != 'ADMIN'
GROUP BY s.student_id, s.name, s.department
ORDER BY resources_shared DESC, times_lent DESC;


-- ----------------------------------------------------------------------------
-- 7. ACID TRANSACTION SCRIPT (APPROVAL WORKFLOW)
-- ----------------------------------------------------------------------------

/*
START TRANSACTION;

-- Step 1: Ensure request is pending
SELECT status FROM borrow_requests WHERE request_id = 5 FOR UPDATE;

-- Step 2: Ensure target resource is available
SELECT availability_status FROM resources WHERE resource_id = 1 FOR UPDATE;

-- Step 3: Approve request
UPDATE borrow_requests SET status = 'APPROVED' WHERE request_id = 5;

-- Step 4: Change resource availability to BORROWED
UPDATE resources SET availability_status = 'BORROWED' WHERE resource_id = 1;

-- Step 5: Create a new borrowing record
INSERT INTO borrowings (request_id, resource_id, borrower_id, owner_id, borrow_date, due_date, status)
VALUES (5, 1, 6, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'ACTIVE');

-- Step 6: Trigger student notification
INSERT INTO notifications (student_id, title, message, type)
VALUES (6, 'Request Approved', 'Your borrow request for Casio fx-991EX ClassWiz Calculator has been approved.', 'REQUEST_APPROVED');

-- If all steps succeed:
COMMIT;
-- If any error occurs:
-- ROLLBACK;
*/
