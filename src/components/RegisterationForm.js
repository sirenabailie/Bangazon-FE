'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/context/authContext"; // ✅ Import AuthContext
import { registerUser } from "@/api/users"; // ✅ Import API function

export default function Register() {
  const router = useRouter();
  const { updateUser } = useAuth(); // ✅ Only import `updateUser` since `user` is unused

  // ✅ Load Firebase user details from localStorage
  const firebaseUser = JSON.parse(localStorage.getItem("firebaseUser")) || {};

  // ✅ State for form values
  const [formData, setFormData] = useState({
    uid: firebaseUser.uid || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    isSeller: false,
    email: firebaseUser.email || "", 
    image: firebaseUser.photoURL || "", 
  });

  const [errorMessage, setErrorMessage] = useState(null);

  // ✅ Handle input changes
  const handleInputChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // ✅ Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zip) {
      setErrorMessage("All fields are required.");
      return;
    }

    // ✅ Convert `zip` to an integer
    const userPayload = { ...formData, zip: parseInt(formData.zip, 10) };

    console.log("📡 Sending Registration Data:", userPayload);

    try {
      await registerUser(userPayload); // ✅ Register user in backend
      console.log("✅ User registered successfully!");

      // ✅ Update user in AuthContext
      updateUser(userPayload.uid);

      // ✅ Redirect to home page after a slight delay
      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" required onChange={handleInputChange} />

        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" required onChange={handleInputChange} />

        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" required onChange={handleInputChange} />

        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" required onChange={handleInputChange} />

        <label htmlFor="zip">Zip Code</label>
        <input type="number" id="zip" name="zip" required onChange={handleInputChange} />

        {/* ✅ Email is now auto-filled from Google Auth */}
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} readOnly disabled />

        {/* ✅ Profile Image Preview */}
        <div className="profile-preview">
          <img
            src={formData.image || "https://via.placeholder.com/150"}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>

        <label htmlFor="isSeller">
          <input type="checkbox" id="isSeller" name="isSeller" checked={formData.isSeller} onChange={handleInputChange} />
          Registering as a seller?
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
