import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { checkUser } from '../auth';
import { firebase } from '../client';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [oAuthUser, setOAuthUser] = useState(null);

  // ✅ Properly handles updating user data
  const updateUser = async (uid) => {
    try {
      const gamerInfo = await checkUser(uid);
      setUser({ fbUser: oAuthUser, ...gamerInfo });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    // ✅ Firebase Auth Listener (with cleanup)
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        setOAuthUser(fbUser);
        try {
          const gamerInfo = await checkUser(fbUser.uid);
          setUser(gamerInfo ? { fbUser, uid: fbUser.uid, ...gamerInfo } : { fbUser, uid: fbUser.uid });
        } catch (error) {
          console.error('Error checking user:', error);
          setUser({ fbUser, uid: fbUser.uid });
        }
      } else {
        setOAuthUser(false);
        setUser(false);
      }
    });

    return () => unsubscribe(); // ✅ Cleanup function for the listener
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateUser,
      userLoading: user === null || oAuthUser === null,
    }),
    [user, oAuthUser],
  );

  return <AuthContext.Provider value={value} {...props} />;
}

const AuthConsumer = AuthContext.Consumer;

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthConsumer };
