export const signOut = () => {
  localStorage.removeItem('currentUser');
};

export const logout = signOut;

export const getCurrentUser = () => {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return typeof window !== 'undefined' && !!localStorage.getItem('currentUser');
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.email && user.email.includes('admin');
};
