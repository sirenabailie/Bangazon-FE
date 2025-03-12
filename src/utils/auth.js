import { firebase } from "@/utils/client"; // ✅ Ensure firebase is from client.js
import "firebase/auth";

const signIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const {user} = result;

    // Store user details in localStorage
    localStorage.setItem(
      "firebaseUser",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    );

    console.log("User signed in:", user);

    // 🔹 Check if user exists in the backend
    const response = await fetch(`http://localhost:5283/api/users/${user.uid}`);

    if (response.status === 404) {
      console.log("User not found, redirecting to /register");
      window.location.href = "/register"; // Redirect to registration
    } else {
      console.log("User exists, redirecting to home page");
      window.location.href = "/"; // Redirect to home (page.js)
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

const signOutUser = async () => {
  try {
    await firebase.auth().signOut();
    localStorage.removeItem("firebaseUser"); // Clear stored user data
    window.location.href = "/"; // Redirect to home page
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
};

export { signIn, signOutUser };
