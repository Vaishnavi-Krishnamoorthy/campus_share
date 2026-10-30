export interface Student {
  student_id: number;
  name: string;
  email: string;
  password_hash?: string;
  student_number: string;
  department: string;
  year: number;
  phone?: string;
  profile_image?: string;
  role: 'STUDENT' | 'ADMIN';
  created_at?: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  description?: string;
  icon?: string;
}

export interface Resource {
  resource_id: number;
  owner_id: number;
  category_id: number;
  resource_name: string;
  description: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  availability_status: 'AVAILABLE' | 'PENDING' | 'BORROWED' | 'UNAVAILABLE';
  image_url?: string;
  location: string;
  created_at?: string;
  updated_at?: string;
  // Joined fields
  category_name?: string;
  owner_name?: string;
  owner_email?: string;
  owner_department?: string;
  owner_year?: number;
  avg_rating?: number;
  total_reviews?: number;
}

export interface BorrowRequest {
  request_id: number;
  resource_id: number;
  borrower_id: number;
  request_date?: string;
  requested_from: string;
  requested_until: string;
  purpose: string;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  // Joined fields
  resource_name?: string;
  resource_image?: string;
  resource_condition?: string;
  borrower_name?: string;
  borrower_email?: string;
  borrower_department?: string;
  owner_id?: number;
  owner_name?: string;
  owner_email?: string;
}

export interface Borrowing {
  borrowing_id: number;
  request_id: number;
  resource_id: number;
  borrower_id: number;
  owner_id: number;
  borrow_date: string;
  due_date: string;
  return_date?: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  // Joined fields
  resource_name?: string;
  resource_image?: string;
  borrower_name?: string;
  borrower_email?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  days_remaining?: number;
  is_reviewed?: boolean;
}

export interface Review {
  review_id: number;
  resource_id: number;
  reviewer_id: number;
  borrowing_id: number;
  rating: number;
  comment?: string;
  created_at?: string;
  reviewer_name?: string;
  reviewer_dept?: string;
  resource_name?: string;
}

export interface Notification {
  notification_id: number;
  student_id: number;
  title: string;
  message: string;
  type: 'REQUEST_RECEIVED' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'RESOURCE_RETURNED' | 'DUE_SOON' | 'OVERDUE' | 'SYSTEM';
  is_read: boolean;
  created_at: string;
}

export interface AuthPayload {
  student_id: number;
  email: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
  student_number: string;
  department: string;
}
