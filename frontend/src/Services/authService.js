// Base URL for API calls
// Make sure this URL is correct and the server is running at this address
const API_BASE_URL = "http://localhost:8070/api/users";

// Helper function to handle API responses
const handleResponse = async (response) => {
  // First check if the response is ok
  if (!response.ok) {
    // Try to parse as JSON first
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed: ${response.status} ${response.statusText}`);
    } catch (jsonError) {
      // If JSON parsing fails, use text response instead
      const errorText = await response.text();
      throw new Error(errorText || `Request failed: ${response.status} ${response.statusText}`);
    }
  }

  // For successful responses, check content type
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    // Handle non-JSON responses
    const text = await response.text();
    try {
      // Try to parse it anyway in case content-type is wrong
      return JSON.parse(text);
    } catch (e) {
      // Return as text if it's not JSON
      return { message: text };
    }
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    console.log("Registering new user:", userData);

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include", // Include cookies if your API uses sessions
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const data = await handleResponse(response);

    // Store token in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your server connection.");
    }
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log("Logging in user with email:", credentials.email);

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include", // Include cookies if your API uses sessions
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const data = await handleResponse(response);

    // Store token in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your server connection.");
    }
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/profile?userId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    return await handleResponse(response);
  } catch (error) {
    console.error("Error getting user profile:", error);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your server connection.");
    }
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/profile?userId=${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profileData),
      credentials: "include",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const data = await handleResponse(response);

    // Update user in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your server connection.");
    }
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/change-password?userId=${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(passwordData),
      credentials: "include",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    return await handleResponse(response);
  } catch (error) {
    console.error("Error changing password:", error);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your server connection.");
    }
    throw error;
  }
};
