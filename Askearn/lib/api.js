// Use relative path for API calls (works in both dev and production)
const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  signup: (data) => fetchAPI('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  getMe: () => fetchAPI('/auth/me'),

  // Questions
  getQuestions: () => fetchAPI('/questions'),
  getQuestion: (id) => fetchAPI(`/questions/${id}`),
  createQuestion: (data) => fetchAPI('/questions', { method: 'POST', body: JSON.stringify(data) }),

  // Answers
  createAnswer: (questionId, data) =>
    fetchAPI(`/questions/${questionId}/answers`, { method: 'POST', body: JSON.stringify(data) }),
  upvoteAnswer: (answerId) =>
    fetchAPI(`/answers/${answerId}/upvote`, { method: 'POST' }),

  // Session
  ping: () => fetchAPI('/session/ping', { method: 'POST' }),
  resetSession: () => fetchAPI('/session/reset', { method: 'POST' }),

  // Leaderboard
  getLeaderboard: () => fetchAPI('/leaderboard'),

  // Wallet
  getWalletHistory: () => fetchAPI('/wallet/history'),

  // Payments
  getPackages: () => fetchAPI('/payments/packages'),
  createPayment: (data) => fetchAPI('/payments/create', { method: 'POST', body: JSON.stringify(data) }),
  getMyPayments: () => fetchAPI('/payments/my-payments'),

  // Admin
  getAdminStats: () => fetchAPI('/admin/stats'),
  getAllUsers: () => fetchAPI('/admin/users'),
  banUser: (userId, banned) => fetchAPI(`/admin/users/${userId}/ban`, { method: 'POST', body: JSON.stringify({ banned }) }),
  deleteUser: (userId) => fetchAPI(`/admin/users/${userId}`, { method: 'DELETE' }),
  getAllQuestions: () => fetchAPI('/admin/questions'),
  deleteQuestion: (questionId) => fetchAPI(`/admin/questions/${questionId}`, { method: 'DELETE' }),
  getAllAnswers: () => fetchAPI('/admin/answers'),
  deleteAnswer: (answerId) => fetchAPI(`/admin/answers/${answerId}`, { method: 'DELETE' }),
  getAllPayments: () => fetchAPI('/admin/payments'),
  approvePayment: (paymentId) => fetchAPI(`/admin/payments/${paymentId}/approve`, { method: 'POST' }),
  rejectPayment: (paymentId) => fetchAPI(`/admin/payments/${paymentId}/reject`, { method: 'POST' }),

  // Tasks
  getTasks: () => fetchAPI('/tasks'),
  getActiveTask: () => fetchAPI('/tasks/active'),
  startTask: (taskId) => fetchAPI(`/tasks/${taskId}/start`, { method: 'POST' }),
  getTaskQuestions: (userTaskId) => fetchAPI(`/tasks/${userTaskId}/questions`),
  submitTaskAnswer: (userTaskId, data) => fetchAPI(`/tasks/${userTaskId}/answer`, { method: 'POST', body: JSON.stringify(data) }),
  getTaskHistory: () => fetchAPI('/tasks/history'),

  // Profile
  saveProfile: (data) => fetchAPI('/profile/assessment', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetchAPI('/profile'),
};
