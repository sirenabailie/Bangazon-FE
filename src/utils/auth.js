import firebase from 'firebase/app';
import 'firebase/auth';
import { clientCredentials } from './client';

const endpoint = clientCredentials.databaseURL;

const checkUser = async (uid) => {
  try {
    const response = await fetch(`${endpoint}/api/checkuser/${uid}`, {  
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {}; // return empty object instead of null
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking user:', error);
    return {}; // return valid return type
  }
};


const registerUser = async (userInfo) => {
  try {
    console.log("📡 Sending Registration Request:", JSON.stringify(userInfo, null, 2));

    const response = await fetch(`${endpoint}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read error message
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    console.log("✅ Registration Successful");
    return await response.json();
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    throw error;
  }
};



const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};


const signOut = () => {
  firebase.auth().signOut();
};

export {
  signIn, //
  signOut,
  checkUser,
  registerUser,
};
