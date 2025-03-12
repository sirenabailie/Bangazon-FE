"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firebase } from "@/utils/client"; // ✅ Use firebase from client.js
import { useRouter } from "next/navigation";

const AuthContext = createContext();

AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const router = useRouter(); // ✅ Import Next.js router for redirection

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);

        // Check if user exists in backend
        const response = await fetch(`http://localhost:5283/api/users/${fbUser.uid}`);

        if (response.status === 404) {
          console.log("User not found, redirecting to /register");
          router.push("/register"); // ✅ Redirect new users to register
        } else {
          console.log("User exists, redirecting to home page");
          router.push("/"); // ✅ Redirect existing users to home
        }
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      userLoading: user === null,
    }),
    [user],
  );

  return <AuthContext.Provider value={value} {...props} />;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
