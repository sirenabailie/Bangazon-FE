import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import Loading from '@/components/Loading';
import SignIn from '@/components/SignIn';
import NavBar from '../../components/NavBar';
import Register from '../../components/RegisterationForm';
import { checkUser } from '../auth';

function ViewDirectorBasedOnUserAuthStatus({ children }) {
  const [userExists, setUserExists] = useState(null); // ✅ Track if user exists in DB
  const { user, userLoading, updateUser } = useAuth();

  useEffect(() => {
    const verifyUser = async () => {
      if (user && user.uid) {
        console.log("🔍 Checking backend for user:", user.uid);
        try {
          const existingUser = await checkUser(user.uid);
          console.log("✅ User exists check result:", existingUser);

          // ✅ If user exists, set to true; otherwise, set to false
          setUserExists(existingUser.exists);
        } catch (error) {
          console.error("❌ Error checking user existence:", error);
          setUserExists(false);
        }
      }
    };

    verifyUser();
  }, [user]);

  // ✅ Show loading screen while checking authentication
  if (userLoading || userExists === null) {
    return <Loading />;
  }

  // ✅ If no user is logged in, show sign-in page
  if (!user) {
    return <SignIn />;
  }

  // ✅ If user is authenticated but NOT in DB, show registration form
  if (user && !userExists) {
    console.log("🚨 New user detected. Showing registration form.");
    return <Register user={user} updateUser={updateUser} />;
  }

  // ✅ If user is authenticated AND in DB, show home page
  console.log("✅ Existing user. Loading home page.");
  return (
    <>
      <NavBar />
      {children} {/* ✅ Ensure pages render below the navbar */}
    </>
  );
}

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
