import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 7 Standard Campus Categories matching DBMS schema
export const INITIAL_CATEGORIES = [
  { category_id: 1, category_name: 'Electronics', description: 'Calculators, tablets, microcontrollers, measurement tools, and tech peripherals.', icon: 'Cpu' },
  { category_id: 2, category_name: 'Books', description: 'Course textbooks, reference handbooks, standard guides, and lecture solutions.', icon: 'BookOpen' },
  { category_id: 3, category_name: 'Stationery', description: 'Scientific notebooks, drafting tools, markers, binders, and calculators.', icon: 'PenTool' },
  { category_id: 4, category_name: 'Lab Equipment', description: 'Lab coats, safety goggles, dissecting kits, and molecular model kits.', icon: 'FlaskConical' },
  { category_id: 5, category_name: 'Engineering Tools', description: 'Mini drafters, vernier calipers, micrometer screws, and toolboxes.', icon: 'Wrench' },
  { category_id: 6, category_name: 'Accessories', description: 'Laptop chargers, HDMI adapters, cables, power banks, and flash drives.', icon: 'Plug' },
  { category_id: 7, category_name: 'Other', description: 'Campus sporting gear, dorm essentials, and multi-purpose study supplies.', icon: 'Package' }
];

export const DEFAULT_ADMIN = {
  student_id: 1,
  name: 'Administrator',
  email: 'admin@campusshare.edu',
  student_number: 'ADM-001',
  department: 'Administration',
  role: 'ADMIN',
  year: 4,
  phone: '+1-555-0100'
};

const INITIAL_RESOURCES = [
  {
    resource_id: 101,
    owner_id: 1,
    category_id: 1,
    resource_name: 'Casio FX-991EX ClassWiz Scientific Calculator',
    description: 'High-resolution natural textbook display with 552 functions, solar + battery dual power. Perfect for engineering, calculus, and linear algebra exams.',
    condition: 'Like New',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1757256137041-0aab889db199?w=600&auto=format&fit=crop&q=80',
    location: 'Engineering Library, 2nd Floor',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category_name: 'Electronics',
    owner_name: 'Campus Admin',
    owner_department: 'Computer Science',
    avg_rating: 4.9,
    total_reviews: 6
  },
  {
    resource_id: 102,
    owner_id: 1,
    category_id: 2,
    resource_name: 'Introduction to Algorithms (CLRS 3rd Edition)',
    description: 'Comprehensive college reference for Algorithms and Data Structures. Clean pages, no tears, includes complete chapter problem sets.',
    condition: 'Good',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    location: 'Central Library Lounge',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    category_name: 'Books',
    owner_name: 'Campus Admin',
    owner_department: 'Computer Science',
    avg_rating: 5.0,
    total_reviews: 4
  },
  {
    resource_id: 103,
    owner_id: 1,
    category_id: 4,
    resource_name: 'Chemistry Lab Safety Coat & Anti-Fog Goggles',
    description: '100% white cotton lab coat (Size M), knee length with button closure. Comes with ANSI Z87.1 approved anti-fog chemical splash safety goggles.',
    condition: 'Like New',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1562789233-775b82d35c16?w=600&auto=format&fit=crop&q=80',
    location: 'Science Complex - Lab 402',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    category_name: 'Lab Equipment',
    owner_name: 'Campus Admin',
    owner_department: 'Chemistry',
    avg_rating: 4.8,
    total_reviews: 3
  },
  {
    resource_id: 104,
    owner_id: 1,
    category_id: 5,
    resource_name: 'Mini Drafter & Technical Drawing Board Kit',
    description: 'Precision engineering mini drafter with steel clamps, 360-degree protractor head, and compass set for Engineering Graphics courses.',
    condition: 'Like New',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    location: 'Mechanical Engineering Workshop',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    category_name: 'Engineering Tools',
    owner_name: 'Campus Admin',
    owner_department: 'Mechanical Engineering',
    avg_rating: 4.7,
    total_reviews: 2
  },
  {
    resource_id: 105,
    owner_id: 1,
    category_id: 6,
    resource_name: '65W USB-C Fast Charger & Braided Cable',
    description: 'Universal 65W GaN high-speed charger with 2m reinforced braided cable. Fully compatible with MacBook, Dell, HP, ThinkPad, and mobile phones.',
    condition: 'Like New',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    location: 'Student Center, Tech Help Desk',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    category_name: 'Accessories',
    owner_name: 'Campus Admin',
    owner_department: 'Electrical Engineering',
    avg_rating: 4.9,
    total_reviews: 5
  },
  {
    resource_id: 106,
    owner_id: 1,
    category_id: 1,
    resource_name: 'Arduino Uno R3 Microcontroller Board',
    description: 'Original Arduino Uno development board with ATmega328P chip, USB interface cable, and breadboard jumper leads for IoT and robotics labs.',
    condition: 'Like New',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
    location: 'Robotics & Hardware Lab, Room 210',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    category_name: 'Electronics',
    owner_name: 'Campus Admin',
    owner_department: 'Computer Science',
    avg_rating: 5.0,
    total_reviews: 3
  },
  {
    resource_id: 107,
    owner_id: 1,
    category_id: 6,
    resource_name: 'SanDisk 64GB Ultra High-Speed USB 3.0 Flash Drive',
    description: 'High-speed data transfer up to 130MB/s with retractable connector. Ideal for OS installation, project files, and large dataset exchange.',
    condition: 'Like New',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1551818014-7c8ace9c1b5c?w=600&auto=format&fit=crop&q=80',
    location: 'IT Help Center, Ground Floor',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    category_name: 'Accessories',
    owner_name: 'Campus Admin',
    owner_department: 'Information Technology',
    avg_rating: 4.6,
    total_reviews: 2
  },
  {
    resource_id: 108,
    owner_id: 1,
    category_id: 7,
    resource_name: 'Active Noise-Cancelling Over-Ear Study Headphones',
    description: 'Comfortable memory foam ear cushions, hybrid active noise cancellation for distraction-free library study, and 30h battery life.',
    condition: 'Good',
    availability_status: 'AVAILABLE',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    location: 'Central Library Silent Zone',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category_name: 'Other',
    owner_name: 'Campus Admin',
    owner_department: 'Computer Science',
    avg_rating: 4.8,
    total_reviews: 7
  }
];

// Helper to get / set from localStorage with automatic migration for updated catalog
function getResourcesStorage(): any[] {
  const CURRENT_CATALOG_VER = '4.0';
  let resources = [];
  try {
    const raw = localStorage.getItem('cs_cloud_resources');
    if (raw) {
      resources = JSON.parse(raw);
    }
  } catch {
    resources = [];
  }

  // Check if existing stored items contain legacy mismatched images
  const hasLegacyOrBrokenImages = !resources.length || resources.some(
    (r: any) =>
      !r.image_url ||
      r.image_url.includes('photo-1582719508461') || // legacy beach resort
      r.image_url.includes('photo-1532012164546') || // legacy broken book
      r.image_url.includes('photo-1594980596870') || // legacy coins/phone
      r.image_url.includes('photo-1624823183492')    // legacy 404 usb
  );

  const savedVer = localStorage.getItem('cs_cloud_catalog_ver');

  if (hasLegacyOrBrokenImages || savedVer !== CURRENT_CATALOG_VER) {
    // Retain any custom resources created by the user (IDs > 1000)
    const userCreated = resources.filter((r: any) => r.resource_id > 1000);
    // Fix legacy URLs on user created items if any had them selected
    const fixedUserCreated = userCreated.map((r: any) => {
      let img = r.image_url;
      if (img?.includes('photo-1582719508461')) img = 'https://images.unsplash.com/photo-1562789233-775b82d35c16?w=600&auto=format&fit=crop&q=80';
      if (img?.includes('photo-1594980596870')) img = 'https://images.unsplash.com/photo-1757256137041-0aab889db199?w=600&auto=format&fit=crop&q=80';
      if (img?.includes('photo-1532012164546')) img = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
      if (img?.includes('photo-1624823183492')) img = 'https://images.unsplash.com/photo-1551818014-7c8ace9c1b5c?w=600&auto=format&fit=crop&q=80';
      return { ...r, image_url: img };
    });

    resources = [...INITIAL_RESOURCES, ...fixedUserCreated];
    setStorage('cs_cloud_resources', resources);
    try {
      localStorage.setItem('cs_cloud_catalog_ver', CURRENT_CATALOG_VER);
    } catch {}
  }

  return resources;
}

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    if (key === 'cs_cloud_resources') {
      return getResourcesStorage() as unknown as T;
    }
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage quota errors
  }
}

function getCurrentUser(): any {
  return getStorage('campus_share_user', null);
}

// Build standard AxiosResponse
function makeResponse<T>(data: T, status = 200, statusText = 'OK'): AxiosResponse<T> {
  return {
    data,
    status,
    statusText,
    headers: {},
    config: {} as any
  };
}

export function handleMockRequest(config: InternalAxiosRequestConfig): AxiosResponse<any> | null {
  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();
  const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

  // 1. AUTH
  if (url.includes('/auth/login') && method === 'POST') {
    const { email } = body;
    const students = getStorage<any[]>('cs_cloud_students', [DEFAULT_ADMIN]);
    
    // Check if matching student or admin
    let user = students.find((s) => s.email?.toLowerCase() === email?.toLowerCase());
    
    if (!user) {
      if (email?.toLowerCase().includes('admin')) {
        user = DEFAULT_ADMIN;
      } else {
        // Auto-create for demo so reviewer can log in without barriers
        user = {
          student_id: Date.now(),
          name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Student User',
          email,
          student_number: `STU-${Math.floor(100 + Math.random() * 900)}`,
          department: 'Computer Science',
          role: 'STUDENT',
          year: 3,
          phone: '+1-555-0199'
        };
        students.push(user);
        setStorage('cs_cloud_students', students);
      }
    }

    const token = `cloud_token_${Date.now()}`;
    return makeResponse({
      success: true,
      message: 'Login successful (Cloud Demo Mode)',
      token,
      user
    });
  }

  if (url.includes('/auth/register') && method === 'POST') {
    const { name, email, student_number, department, year, phone } = body;
    const students = getStorage<any[]>('cs_cloud_students', [DEFAULT_ADMIN]);

    const newStudent = {
      student_id: Date.now(),
      name: name || 'Student',
      email: email || 'student@campusshare.edu',
      student_number: student_number || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: department || 'General Engineering',
      role: 'STUDENT',
      year: parseInt(year, 10) || 1,
      phone: phone || ''
    };

    students.push(newStudent);
    setStorage('cs_cloud_students', students);

    // Initial welcome notification
    const notifications = getStorage<any[]>('cs_cloud_notifications', []);
    notifications.unshift({
      notification_id: Date.now(),
      student_id: newStudent.student_id,
      title: 'Welcome to CampusShare!',
      message: 'Your account is ready. Explore available resources or list something for your peers.',
      type: 'SYSTEM',
      is_read: 0,
      created_at: new Date().toISOString()
    });
    setStorage('cs_cloud_notifications', notifications);

    return makeResponse({
      success: true,
      message: 'Registration successful (Cloud Demo Mode)',
      token: `cloud_token_${Date.now()}`,
      user: newStudent
    }, 201);
  }

  if (url.includes('/auth/me') && method === 'GET') {
    const user = getCurrentUser() || DEFAULT_ADMIN;
    return makeResponse({ success: true, user });
  }

  if (url.includes('/auth/profile') && method === 'PUT') {
    const currentUser = getCurrentUser() || DEFAULT_ADMIN;
    const updated = { ...currentUser, ...body };
    setStorage('campus_share_user', updated);

    // Sync student profile in student list
    const students = getStorage<any[]>('cs_cloud_students', [DEFAULT_ADMIN]);
    const sIdx = students.findIndex((s) => s.student_id === updated.student_id);
    if (sIdx !== -1) {
      students[sIdx] = { ...students[sIdx], ...updated };
      setStorage('cs_cloud_students', students);
    }

    // Also update resources owned by this student with their new name and cute avatar
    try {
      let resources = getStorage<any[]>('cs_cloud_resources', []);
      let changed = false;
      resources = resources.map((r) => {
        if (r.owner_id === updated.student_id) {
          changed = true;
          return {
            ...r,
            owner_name: updated.name || r.owner_name,
            owner_department: updated.department || r.owner_department,
            owner_avatar: updated.profile_image || r.owner_avatar
          };
        }
        return r;
      });
      if (changed) {
        setStorage('cs_cloud_resources', resources);
      }
    } catch {}

    return makeResponse({ success: true, user: updated });
  }

  // 2. CATEGORIES - Return BOTH categories and data keys
  if (url.includes('/categories') && method === 'GET') {
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const categoriesWithCounts = INITIAL_CATEGORIES.map((cat) => ({
      ...cat,
      total_resources: resources.filter((r) => r.category_id === cat.category_id).length,
      available_count: resources.filter((r) => r.category_id === cat.category_id && r.availability_status === 'AVAILABLE').length
    }));
    return makeResponse({
      success: true,
      count: categoriesWithCounts.length,
      categories: categoriesWithCounts,
      data: categoriesWithCounts
    });
  }

  // 3. RESOURCES - Return BOTH resources and data keys
  if (url.includes('/resources/my') && method === 'GET') {
    const currentUser = getCurrentUser();
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const myResources = currentUser ? resources.filter((r) => r.owner_id === currentUser.student_id) : [];
    return makeResponse({
      success: true,
      count: myResources.length,
      resources: myResources,
      data: myResources
    });
  }

  if (url.includes('/resources/search') && method === 'GET') {
    const q = (config.params?.q || '').toLowerCase();
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const filtered = resources.filter(
      (r) => r.resource_name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
    );
    return makeResponse({
      success: true,
      count: filtered.length,
      resources: filtered,
      data: filtered
    });
  }

  // Single resource GET /resources/:id
  const singleResourceMatch = url.match(/\/resources\/(\d+)$/);
  if (singleResourceMatch && method === 'GET') {
    const id = parseInt(singleResourceMatch[1], 10);
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const res = resources.find((r) => r.resource_id === id) || resources[0];
    const reviews = getStorage<any[]>('cs_cloud_reviews', []).filter((rv) => rv.resource_id === id);
    const resourceData = { ...res, reviews, avg_rating: res.avg_rating || 5.0, total_reviews: reviews.length };
    return makeResponse({
      success: true,
      resource: resourceData,
      data: resourceData
    });
  }

  // Single resource DELETE /resources/:id
  if (singleResourceMatch && method === 'DELETE') {
    const id = parseInt(singleResourceMatch[1], 10);
    let resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    resources = resources.filter((r) => r.resource_id !== id);
    setStorage('cs_cloud_resources', resources);
    return makeResponse({ success: true, message: 'Resource deleted' });
  }

  // All resources GET /resources
  if (url.endsWith('/resources') && method === 'GET') {
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    let filtered = [...resources];
    if (config.params?.category_id || config.params?.category) {
      const catParam = config.params.category_id || config.params.category;
      filtered = filtered.filter((r) => r.category_id === parseInt(catParam, 10) || r.category_name === catParam);
    }
    if (config.params?.availability) {
      filtered = filtered.filter((r) => r.availability_status === config.params.availability);
    }
    return makeResponse({
      success: true,
      count: filtered.length,
      resources: filtered,
      data: filtered
    });
  }

  // Create resource POST /resources
  if (url.endsWith('/resources') && method === 'POST') {
    const currentUser = getCurrentUser() || DEFAULT_ADMIN;
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const category = INITIAL_CATEGORIES.find((c) => c.category_id === parseInt(body.category_id, 10)) || INITIAL_CATEGORIES[0];

    const newResource = {
      resource_id: Date.now(),
      owner_id: currentUser.student_id,
      category_id: category.category_id,
      resource_name: body.resource_name,
      description: body.description || '',
      condition: body.condition || 'Good',
      availability_status: 'AVAILABLE',
      image_url: body.image_url || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600',
      location: body.location || 'Campus Center',
      created_at: new Date().toISOString(),
      category_name: category.category_name,
      owner_name: currentUser.name,
      owner_department: currentUser.department,
      avg_rating: 5.0,
      total_reviews: 0
    };

    resources.unshift(newResource);
    setStorage('cs_cloud_resources', resources);
    return makeResponse({
      success: true,
      message: 'Resource listed successfully',
      resource_id: newResource.resource_id,
      resource: newResource,
      data: newResource
    }, 201);
  }

  // 4. REQUESTS - Return BOTH requests and data keys
  if (url.includes('/requests/my') && method === 'GET') {
    const currentUser = getCurrentUser();
    const requests = getStorage<any[]>('cs_cloud_requests', []);
    const myRequests = currentUser ? requests.filter((r) => r.borrower_id === currentUser.student_id) : [];
    return makeResponse({
      success: true,
      count: myRequests.length,
      requests: myRequests,
      data: myRequests
    });
  }

  if (url.includes('/requests/received') && method === 'GET') {
    const currentUser = getCurrentUser();
    const requests = getStorage<any[]>('cs_cloud_requests', []);
    const received = currentUser ? requests.filter((r) => r.owner_id === currentUser.student_id) : [];
    return makeResponse({
      success: true,
      count: received.length,
      requests: received,
      data: received
    });
  }

  if (url.endsWith('/requests') && method === 'POST') {
    const currentUser = getCurrentUser() || DEFAULT_ADMIN;
    const requests = getStorage<any[]>('cs_cloud_requests', []);
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const target = resources.find((r) => r.resource_id === parseInt(body.resource_id, 10));

    const newReq = {
      request_id: Date.now(),
      resource_id: body.resource_id,
      borrower_id: currentUser.student_id,
      borrower_name: currentUser.name,
      borrower_email: currentUser.email,
      owner_id: target?.owner_id || 1,
      resource_name: target?.resource_name || 'Campus Item',
      resource_image: target?.image_url,
      requested_from: body.requested_from || new Date().toISOString().split('T')[0],
      requested_until: body.requested_until || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      purpose: body.purpose || 'Course project study',
      message: body.message || '',
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    requests.unshift(newReq);
    setStorage('cs_cloud_requests', requests);
    return makeResponse({
      success: true,
      message: 'Borrow request submitted successfully',
      request_id: newReq.request_id,
      data: newReq
    }, 201);
  }

  const approveMatch = url.match(/\/requests\/(\d+)\/approve$/);
  if (approveMatch && method === 'PUT') {
    const reqId = parseInt(approveMatch[1], 10);
    const requests = getStorage<any[]>('cs_cloud_requests', []);
    const req = requests.find((r) => r.request_id === reqId);
    if (req) {
      req.status = 'APPROVED';
      setStorage('cs_cloud_requests', requests);

      // Create borrowing
      const borrowings = getStorage<any[]>('cs_cloud_borrowings', []);
      borrowings.unshift({
        borrowing_id: Date.now(),
        request_id: req.request_id,
        resource_id: req.resource_id,
        resource_name: req.resource_name,
        resource_image: req.resource_image,
        borrower_id: req.borrower_id,
        borrower_name: req.borrower_name,
        owner_id: req.owner_id,
        borrow_date: new Date().toISOString().split('T')[0],
        due_date: req.requested_until,
        status: 'ACTIVE'
      });
      setStorage('cs_cloud_borrowings', borrowings);

      // Update resource status
      const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
      const res = resources.find((r) => r.resource_id === req.resource_id);
      if (res) {
        res.availability_status = 'BORROWED';
        setStorage('cs_cloud_resources', resources);
      }
    }
    return makeResponse({ success: true, message: 'Request approved' });
  }

  const rejectMatch = url.match(/\/requests\/(\d+)\/reject$/);
  if (rejectMatch && method === 'PUT') {
    const reqId = parseInt(rejectMatch[1], 10);
    const requests = getStorage<any[]>('cs_cloud_requests', []);
    const req = requests.find((r) => r.request_id === reqId);
    if (req) {
      req.status = 'REJECTED';
      setStorage('cs_cloud_requests', requests);
    }
    return makeResponse({ success: true, message: 'Request rejected' });
  }

  // 5. BORROWINGS - Return BOTH borrowings and data keys
  if (url.includes('/borrowings/borrowed') && method === 'GET') {
    const currentUser = getCurrentUser();
    const borrowings = getStorage<any[]>('cs_cloud_borrowings', []);
    const list = currentUser ? borrowings.filter((b) => b.borrower_id === currentUser.student_id && b.status === 'ACTIVE') : [];
    return makeResponse({
      success: true,
      count: list.length,
      borrowings: list,
      data: list
    });
  }

  if (url.includes('/borrowings/lent') && method === 'GET') {
    const currentUser = getCurrentUser();
    const borrowings = getStorage<any[]>('cs_cloud_borrowings', []);
    const list = currentUser ? borrowings.filter((b) => b.owner_id === currentUser.student_id) : [];
    return makeResponse({
      success: true,
      count: list.length,
      borrowings: list,
      data: list
    });
  }

  const returnMatch = url.match(/\/borrowings\/(\d+)\/return$/);
  if (returnMatch && method === 'PUT') {
    const bId = parseInt(returnMatch[1], 10);
    const borrowings = getStorage<any[]>('cs_cloud_borrowings', []);
    const b = borrowings.find((x) => x.borrowing_id === bId);
    if (b) {
      b.status = 'RETURNED';
      b.return_date = new Date().toISOString().split('T')[0];
      setStorage('cs_cloud_borrowings', borrowings);

      // Make resource available again
      const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
      const res = resources.find((r) => r.resource_id === b.resource_id);
      if (res) {
        res.availability_status = 'AVAILABLE';
        setStorage('cs_cloud_resources', resources);
      }
    }
    return makeResponse({ success: true, message: 'Resource returned successfully' });
  }

  // 6. REVIEWS
  if (url.endsWith('/reviews') && method === 'POST') {
    const reviews = getStorage<any[]>('cs_cloud_reviews', []);
    const newRev = {
      review_id: Date.now(),
      borrowing_id: body.borrowing_id,
      rating: body.rating,
      comment: body.comment || '',
      created_at: new Date().toISOString()
    };
    reviews.unshift(newRev);
    setStorage('cs_cloud_reviews', reviews);
    return makeResponse({ success: true, message: 'Review recorded', data: newRev }, 201);
  }

  // 7. NOTIFICATIONS - Return BOTH notifications and data keys
  if (url.includes('/notifications') && method === 'GET') {
    const currentUser = getCurrentUser();
    const notifications = getStorage<any[]>('cs_cloud_notifications', []);
    const list = currentUser ? notifications.filter((n) => n.student_id === currentUser.student_id) : notifications;
    const unread_count = list.filter((n) => !n.is_read).length;
    return makeResponse({
      success: true,
      unread_count,
      notifications: list,
      data: list
    });
  }

  if (url.includes('/notifications/read-all') && method === 'PUT') {
    const notifications = getStorage<any[]>('cs_cloud_notifications', []);
    notifications.forEach((n) => { n.is_read = 1; });
    setStorage('cs_cloud_notifications', notifications);
    return makeResponse({ success: true });
  }

  // 8. DASHBOARD - Return stats and recentActivity
  if (url.includes('/dashboard') && method === 'GET') {
    const currentUser = getCurrentUser();
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const borrowings = getStorage<any[]>('cs_cloud_borrowings', []);
    const requests = getStorage<any[]>('cs_cloud_requests', []);

    const dashboardStats = {
      totalResources: resources.length,
      currentlyBorrowed: borrowings.filter((b) => b.status === 'ACTIVE').length,
      pendingRequests: requests.filter((r) => r.status === 'PENDING').length,
      pendingSentCount: requests.filter((r) => r.borrower_id === currentUser?.student_id && r.status === 'PENDING').length,
      pendingReceivedCount: requests.filter((r) => r.owner_id === currentUser?.student_id && r.status === 'PENDING').length,
      itemsLent: borrowings.filter((b) => b.owner_id === currentUser?.student_id).length,
      overdueItems: borrowings.filter((b) => b.status === 'OVERDUE').length,
      myListings: resources.filter((r) => r.owner_id === currentUser?.student_id).length
    };

    return makeResponse({
      success: true,
      stats: dashboardStats,
      recentActivity: requests.slice(0, 5),
      data: dashboardStats
    });
  }

  // 9. ADMIN
  if (url.includes('/admin/stats')) {
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const students = getStorage<any[]>('cs_cloud_students', [DEFAULT_ADMIN]);
    const borrowings = getStorage<any[]>('cs_cloud_borrowings', []);
    const adminStats = {
      total_students: students.length,
      total_resources: resources.length,
      active_borrowings: borrowings.filter((b) => b.status === 'ACTIVE').length,
      total_borrowings: borrowings.length,
      avg_rating: 4.8
    };
    return makeResponse({
      success: true,
      stats: adminStats,
      data: adminStats
    });
  }

  if (url.includes('/admin/reports/category-summary')) {
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    const summary = INITIAL_CATEGORIES.map((c) => ({
      category_name: c.category_name,
      total_count: resources.filter((r) => r.category_id === c.category_id).length
    }));
    return makeResponse({ success: true, data: summary });
  }

  if (url.includes('/admin/reports/most-borrowed')) {
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    return makeResponse({ success: true, data: resources.slice(0, 5) });
  }

  if (url.includes('/admin/reports/overdue')) {
    return makeResponse({ success: true, data: [] });
  }

  if (url.includes('/admin/students')) {
    const students = getStorage<any[]>('cs_cloud_students', [DEFAULT_ADMIN]);
    return makeResponse({
      success: true,
      count: students.length,
      students,
      data: students
    });
  }

  if (url.includes('/admin/borrowings')) {
    const borrowings = getStorage<any[]>('cs_cloud_borrowings', []);
    return makeResponse({ success: true, count: borrowings.length, borrowings, data: borrowings });
  }

  if (url.includes('/admin/requests')) {
    const requests = getStorage<any[]>('cs_cloud_requests', []);
    return makeResponse({ success: true, count: requests.length, requests, data: requests });
  }

  if (url.includes('/admin/demo-query') && method === 'POST') {
    const resources = getStorage<any[]>('cs_cloud_resources', INITIAL_RESOURCES);
    return makeResponse({
      success: true,
      query_name: body.query_type || 'Platform Audit Query',
      results: resources.slice(0, 5).map((r) => ({
        resource_id: r.resource_id,
        resource_name: r.resource_name,
        category: r.category_name,
        owner: r.owner_name,
        status: r.availability_status
      }))
    });
  }

  return null;
}
