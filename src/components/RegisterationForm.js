'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/api/users"; // ✅ Fixed import path

export default function Register() {
  const router = useRouter();

  // ✅ Load Firebase user details from localStorage
  const firebaseUser = JSON.parse(localStorage.getItem("firebaseUser")) || {};

  // ✅ State for form values
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    isSeller: false,
    email: firebaseUser.email || "", // ✅ Auto-filled from Google Auth
    image: firebaseUser.photoURL || "", // ✅ Auto-filled profile picture
    uid: firebaseUser.uid || "", // ✅ Auto-filled Firebase UID
  });

  const [errorMessage, setErrorMessage] = useState(null); // ✅ Renamed to avoid shadowing

  // ✅ Handle input changes
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value, type, checked } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // ✅ Clear previous errors
  
    // ✅ Validate required fields
    if (!values.firstName || !values.lastName || !values.address || !values.city || !values.zip) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    // ✅ Convert `zip` to an integer
    const userPayload = {
      ...values,
      zip: parseInt(values.zip, 10),
    };
  
    console.log("📡 Sending Registration Data:", userPayload);
  
    try {
      const result = await registerUser(userPayload);
      console.log("✅ User registered successfully!", result);
  
      // ✅ Ensure state updates before redirect
      setTimeout(() => {
        router.push("/");
      }, 500); // ✅ Adding slight delay for safety
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setErrorMessage("Registration failed. Please try again.");
    }
  };
  
  

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* ✅ Fixed variable */}

        <input
          className="form-field"
          type="text"
          placeholder="First Name"
          name="firstName"
          value={values.firstName}
          onChange={handleInputChange}
          required
        />

        <input
          className="form-field"
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={values.lastName}
          onChange={handleInputChange}
          required
        />

        <input
          className="form-field"
          type="text"
          placeholder="Address"
          name="address"
          value={values.address}
          onChange={handleInputChange}
          required
        />

        <input
          className="form-field"
          type="text"
          placeholder="City"
          name="city"
          value={values.city}
          onChange={handleInputChange}
          required
        />

        <input
          className="form-field"
          type="number"
          placeholder="Zip Code"
          name="zip"
          value={values.zip}
          onChange={handleInputChange}
          required
        />

        {/* ✅ Email is now auto-filled from Google Auth */}
        <input
          className="form-field"
          type="email"
          name="email"
          value={values.email}
          readOnly
          disabled
        />

        {/* ✅ Profile Image Preview */}
        <div className="profile-preview">
          <img
            src={values.image || "https://via.placeholder.com/150"}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>

        <label>
          <input
            type="checkbox"
            name="isSeller"
            checked={values.isSeller}
            onChange={handleInputChange}
          />
          Are you registering as a seller?
        </label>

        <button className="form-field" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
