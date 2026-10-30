export interface User {
  student_id: number;
  name: string;
  email: string;
  student_number: string;
  department: string;
  year?: number;
  phone?: string;
  profile_image?: string;
  role: 'STUDENT' | 'ADMIN';
  created_at?: string;
  total_listed_resources?: number;
  currently_borrowed_count?: number;
  items_lent_count?: number;
}

export interface Category {
  category_id: number;
  category_name: string;
  description?: string;
  icon?: string;
  total_resources?: number;
  available_count?: number;
}

export interface Resource {
  resource_id: number;
  owner_id: number;
  category_id: number;
  resource_name: string;
  description: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  availability_status: 'AVAILABLE' | 'PENDING' | 'BORROWED' | 'UNAVAILABLE';
  image_url: string;
  location: string;
  created_at: string;
  category_name: string;
  owner_name: string;
  owner_email?: string;
  owner_department?: string;
  owner_year?: number;
  owner_phone?: string;
  owner_avatar?: string;
  avg_rating: number;
  total_reviews: number;
  reviews?: Review[];
}

export interface BorrowRequest {
  request_id: number;
  resource_id: number;
  borrower_id?: number;
  request_date: string;
  requested_from: string;
  requested_until: string;
  purpose: string;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  resource_name: string;
  resource_image?: string;
  resource_location?: string;
  current_resource_status?: string;
  owner_id?: number;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  borrower_name?: string;
  borrower_email?: string;
  borrower_department?: string;
  borrower_year?: number;
  borrower_phone?: string;
  borrower_avatar?: string;
}

export interface Borrowing {
  borrowing_id: number;
  request_id: number;
  resource_id: number;
  borrow_date: string;
  due_date: string;
  return_date?: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  days_remaining: number;
  resource_name: string;
  resource_image?: string;
  resource_location?: string;
  owner_id?: number;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  borrower_id?: number;
  borrower_name?: string;
  borrower_email?: string;
  borrower_department?: string;
  borrower_phone?: string;
  borrower_avatar?: string;
  is_reviewed?: boolean;
  user_rating?: number;
}

export interface Review {
  review_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer_id?: number;
  reviewer_name: string;
  reviewer_department?: string;
  reviewer_avatar?: string;
}

export interface Notification {
  notification_id: number;
  title: string;
  message: string;
  type: 'REQUEST_RECEIVED' | 'REQUEST_APPROVED' | 'REQUEST_REJECTED' | 'RESOURCE_RETURNED' | 'DUE_SOON' | 'OVERDUE' | 'SYSTEM';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalResources: number;
  currentlyBorrowed: number;
  pendingRequests: number;
  pendingSentCount?: number;
  pendingReceivedCount?: number;
  itemsLent: number;
  overdueItems: number;
  myListings: number;
}

export interface RecentActivityItem {
  activity_type: 'REQUEST' | 'BORROWING';
  activity_date: string;
  description: string;
  status_badge: string;
}
