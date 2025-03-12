import PropTypes from "prop-types";
import { useAuth } from "@/utils/context/authContext";
import Loading from "@/components/Loading";
import SignIn from "@/components/SignIn";

function ViewDirectorBasedOnUserAuthStatus({ children }) {
  const { user, userLoading } = useAuth();

  // If still loading, show a loading screen
  if (userLoading) {
    return <Loading />;
  }

  // Redirect unauthenticated users to the sign-in page
  if (!user) {
    return <SignIn />;
  }

  // ✅ No Fragment needed since there's only one child
  return children;
}

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
