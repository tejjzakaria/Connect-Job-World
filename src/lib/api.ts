// API utility functions for MongoDB backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  register: async (name: string, email: string, password: string, role: string) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  getCurrentUser: async () => {
    return await apiCall('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Clients API
export const clientsAPI = {
  getAll: async (params?: {
    search?: string;
    service?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.service) queryParams.append('service', params.service);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return await apiCall(`/clients?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return await apiCall(`/clients/${id}`);
  },

  create: async (clientData: {
    name: string;
    email?: string;
    phone: string;
    service: string;
    status?: string;
    message: string;
  }) => {
    return await apiCall('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  },

  update: async (id: string, clientData: Partial<{
    name: string;
    email: string;
    phone: string;
    service: string;
    status: string;
    message: string;
    assignedTo: string;
  }>) => {
    return await apiCall(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  },

  delete: async (id: string) => {
    return await apiCall(`/clients/${id}`, {
      method: 'DELETE',
    });
  },

  addNote: async (id: string, content: string) => {
    return await apiCall(`/clients/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  getStats: async () => {
    return await apiCall('/clients/stats/overview');
  },
};

// Submissions API
export const submissionsAPI = {
  create: async (submissionData: {
    name: string;
    email?: string;
    phone: string;
    service: string;
    message: string;
    source?: string;
  }) => {
    return await apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  getAll: async (params?: {
    search?: string;
    service?: string;
    status?: string;
    source?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.service) queryParams.append('service', params.service);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.source) queryParams.append('source', params.source);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return await apiCall(`/submissions?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return await apiCall(`/submissions/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return await apiCall(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: string) => {
    return await apiCall(`/submissions/${id}`, {
      method: 'DELETE',
    });
  },

  validate: async (id: string) => {
    return await apiCall(`/submissions/${id}/validate`, {
      method: 'POST',
    });
  },

  confirmCall: async (id: string, callNotes?: string) => {
    return await apiCall(`/submissions/${id}/confirm-call`, {
      method: 'POST',
      body: JSON.stringify({ callNotes }),
    });
  },

  convertToClient: async (id: string) => {
    return await apiCall(`/submissions/${id}/convert`, {
      method: 'POST',
    });
  },

  getStats: async () => {
    return await apiCall('/submissions/stats/overview');
  },
};

// Documents API
export const documentsAPI = {
  // Generate upload link (Admin)
  generateLink: async (data: {
    submissionId: string;
    expiresInDays?: number;
    maxUploads?: number;
    notes?: string;
  }) => {
    return await apiCall('/documents/generate-link', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all links for a submission (Admin)
  getLinks: async (submissionId: string) => {
    return await apiCall(`/documents/links/${submissionId}`);
  },

  // Validate upload link (Public)
  validateLink: async (token: string) => {
    const response = await fetch(`${API_URL}/documents/validate-link/${token}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid link');
    }

    return data;
  },

  // Upload documents (Public)
  uploadDocuments: async (token: string, files: File[], documentTypes: string[]) => {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('documents', file);
    });

    formData.append('documentTypes', JSON.stringify(documentTypes));

    const response = await fetch(`${API_URL}/documents/upload/${token}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  },

  // Get documents for a submission (Admin)
  getBySubmission: async (submissionId: string) => {
    return await apiCall(`/documents/submission/${submissionId}`);
  },

  // Get single document (Admin)
  getById: async (id: string) => {
    return await apiCall(`/documents/${id}`);
  },

  // Download document (Admin)
  download: async (id: string) => {
    const token = getAuthToken();

    try {
      const response = await fetch(`${API_URL}/documents/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'document.pdf';

      console.log('Content-Disposition header:', contentDisposition);

      if (contentDisposition) {
        // Extract filename from: attachment; filename="filename.ext"
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
          // Decode if it's URL encoded
          try {
            filename = decodeURIComponent(filename);
          } catch (e) {
            // If decode fails, use as is
          }
        }
      }

      console.log('Extracted filename:', filename);

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // Verify or reject document (Admin)
  verify: async (id: string, data: {
    status: 'verified' | 'rejected' | 'needs_replacement';
    rejectionReason?: string;
    notes?: string;
  }) => {
    return await apiCall(`/documents/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete document (Admin)
  delete: async (id: string) => {
    return await apiCall(`/documents/${id}`, {
      method: 'DELETE',
    });
  },

  // Deactivate link (Admin)
  deactivateLink: async (id: string) => {
    return await apiCall(`/documents/links/${id}/deactivate`, {
      method: 'PATCH',
    });
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', 'true');

    return await apiCall(`/notifications?${queryParams.toString()}`);
  },

  getUnreadCount: async () => {
    return await apiCall('/notifications/unread/count');
  },

  markAsRead: async (id: string) => {
    return await apiCall(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return await apiCall('/notifications/read-all', {
      method: 'PUT',
    });
  },

  delete: async (id: string) => {
    return await apiCall(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },

  clearRead: async () => {
    return await apiCall('/notifications/clear-read', {
      method: 'DELETE',
    });
  },
};

// Payments API
export const paymentsAPI = {
  // Generate payment link (Admin)
  generateLink: async (data: {
    submissionId: string;
    amount: number;
    currency?: string;
    expiresInDays?: number;
    notes?: string;
    bankDetails?: {
      bankName?: string;
      accountName?: string;
      accountNumber?: string;
      rib?: string;
      swift?: string;
    };
  }) => {
    return await apiCall('/payments/generate-link', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all payment links for a submission (Admin)
  getLinks: async (submissionId: string) => {
    return await apiCall(`/payments/links/${submissionId}`);
  },

  // Validate payment link (Public)
  validateLink: async (token: string) => {
    const response = await fetch(`${API_URL}/payments/validate-link/${token}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid link');
    }

    return data;
  },

  // Upload payment receipt (Public)
  uploadReceipt: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await fetch(`${API_URL}/payments/upload-receipt/${token}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  },

  // Preview receipt (Admin)
  previewReceipt: async (id: string) => {
    return await apiCall(`/payments/${id}/preview-receipt`);
  },

  // Verify or reject payment (Admin)
  verify: async (id: string, data: {
    status: 'confirmed' | 'rejected';
    rejectionReason?: string;
  }) => {
    return await apiCall(`/payments/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Deactivate payment link (Admin)
  deactivateLink: async (id: string) => {
    return await apiCall(`/payments/links/${id}/deactivate`, {
      method: 'PATCH',
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async (params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return await apiCall(`/users?${queryParams.toString()}`);
  },

  getById: async (id: string) => {
    return await apiCall(`/users/${id}`);
  },

  create: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    return await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: Partial<{
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  }>) => {
    return await apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deactivate: async (id: string) => {
    return await apiCall(`/users/${id}/deactivate`, {
      method: 'PATCH',
    });
  },

  activate: async (id: string) => {
    return await apiCall(`/users/${id}/activate`, {
      method: 'PATCH',
    });
  },

  delete: async (id: string) => {
    return await apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  getMyProfile: async () => {
    return await apiCall('/users/me/profile');
  },

  updateMyProfile: async (userData: {
    name?: string;
    email?: string;
  }) => {
    return await apiCall('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return await apiCall('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return await apiCall('/users/stats/overview');
  },
};

export default {
  auth: authAPI,
  clients: clientsAPI,
  submissions: submissionsAPI,
  documents: documentsAPI,
  payments: paymentsAPI,
  notifications: notificationsAPI,
  users: usersAPI,
};
