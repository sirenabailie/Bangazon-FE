const BASE_URL = "http://localhost:5283/api/users"; // Backend API URL

// ✅ Register a New User
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("User registration failed:", error);
    throw error;
  }
};

// ✅ Get User by UID
export const getUserByUid = async (uid) => {
  try {
    const response = await fetch(`${BASE_URL}/${uid}`);

    if (!response.ok) {
      return null; // Return null if user not found (404)
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
