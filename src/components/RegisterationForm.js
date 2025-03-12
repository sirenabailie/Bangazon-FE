import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import Next.js router

export default function Register() {
  const router = useRouter(); // ✅ Create router instance

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    image: "",
    isSeller: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value, type, checked } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.firstName && values.lastName && values.email) {
      setValid(true);
    }
    setSubmitted(true);

    // ✅ Get Firebase UID from local storage
    const firebaseUser = JSON.parse(localStorage.getItem("firebaseUser"));
    if (!firebaseUser) {
      console.error("No Firebase user found!");
      return;
    }

    // ✅ Send user data to backend
    const response = await fetch("http://localhost:5283/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...values, 
        uid: firebaseUser.uid,  // ✅ Attach Firebase UID
        email: firebaseUser.email, 
      }),
    });

    if (response.ok) {
      console.log("User registered successfully!");

      // ✅ Redirect user to home page (`/`)
      router.push("/");
    } else {
      console.error("Registration failed");
    }
  };

  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        {submitted && valid && (
          <div className="success-message">
            <h3>Welcome {values.firstName} {values.lastName}</h3>
            <div>Your registration was successful!</div>
          </div>
        )}

        {!valid && (
          <>
            <input
              className="form-field"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={values.firstName}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.firstName && <span>Please enter a first name</span>}

            <input
              className="form-field"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={values.lastName}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.lastName && <span>Please enter a last name</span>}

            {/* <input
              className="form-field"
              type="email"
              placeholder="Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              required
              disabled // Email is auto-filled from Firebase
            />
            {submitted && !values.email && <span>Please enter an email address</span>} */}

            <input
              className="form-field"
              type="text"
              placeholder="Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.address && <span>Please enter an address</span>}

            <input
              className="form-field"
              type="text"
              placeholder="City"
              name="city"
              value={values.city}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.city && <span>Please enter a city</span>}

            <input
              className="form-field"
              type="number"
              placeholder="Zip Code"
              name="zip"
              value={values.zip}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.zip && <span>Please enter a zip code</span>}

            <input
              className="form-field"
              type="text"
              placeholder="Profile Image URL"
              name="image"
              value={values.image}
              onChange={handleInputChange}
              required
            />
            {submitted && !values.image && <span>Please enter an image URL</span>}

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
          </>
        )}
      </form>
    </div>
  );
}
