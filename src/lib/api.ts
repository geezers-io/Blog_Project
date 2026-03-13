const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Posts
  getPosts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/posts${query}`);
  },
  getPost: (id: string) => request<any>(`/posts/${id}`),
  createPost: (data: any) => request<any>('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id: string, data: any) => request<any>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id: string) => request<any>(`/posts/${id}`, { method: 'DELETE' }),

  // Comments
  getComments: (postId: string) => request<any>(`/posts/${postId}/comments`),
  createComment: (postId: string, data: any) =>
    request<any>(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(data) }),

  // Likes
  toggleLike: (postId: string) => request<any>(`/posts/${postId}/likes`, { method: 'POST' }),
  getLikes: (postId: string) => request<any>(`/posts/${postId}/likes`),

  // Categories
  getCategories: () => request<any>('/categories'),

  // Users
  getMe: () => request<any>('/users/me'),
  updateMe: (data: any) => request<any>('/users/me', { method: 'PUT', body: JSON.stringify(data) }),

  // Search
  search: (query: string) => request<any>(`/search?q=${encodeURIComponent(query)}`),

  // Blog
  getBlog: (username: string) => request<any>(`/blog/${encodeURIComponent(username)}`),
  getBlogSettings: () => request<any>('/blog/settings'),
  updateBlogSettings: (data: any) => request<any>('/blog/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // File upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};
