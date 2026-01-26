export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("session");
  window.location.href = "/login";
};

// Session Management
export const isSessionOpen = () => {
  const session = localStorage.getItem("session");
  return session ? JSON.parse(session).is_open : false;
};

export const getSessionData = () => {
  const session = localStorage.getItem("session");
  return session ? JSON.parse(session) : null;
};

export const setSessionData = (sessionData) => {
  localStorage.setItem("session", JSON.stringify(sessionData));
};

export const getUserData = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUserData = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const clearSessionData = () => {
  localStorage.removeItem("session");
};
