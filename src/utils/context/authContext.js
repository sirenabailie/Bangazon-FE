import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { checkUser } from '../auth';
import { firebase } from '../client';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [oAuthUser, setOAuthUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // ✅ Add explicit loading state

  const updateUser = async (uid) => {
    try {
      setUserLoading(true); // ✅ Start loading while updating user
      const gamerInfo = await checkUser(uid);
      setUser({ fbUser: oAuthUser, ...gamerInfo });
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setUserLoading(false); // ✅ Ensure loading state is set to false
    }
  };

  useEffect(() => {
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
      setUserLoading(false); // ✅ Ensure loading state is updated
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateUser,
      userLoading, // ✅ Ensure this is exposed correctly
    }),
    [user, userLoading],
  );

  return <AuthContext.Provider value={value} {...props} />;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
