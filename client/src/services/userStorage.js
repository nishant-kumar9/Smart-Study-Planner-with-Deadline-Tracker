export const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return {
      name: "Student User",
      email: "No email available",
    };
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return {
      name: "Student User",
      email: "No email available",
    };
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};
