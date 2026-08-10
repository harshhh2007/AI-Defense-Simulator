import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


export default function ProtectedRoute({
  children,
}) {

  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();


  /* =======================================================
     WAIT FOR FIREBASE
  ======================================================= */

  if (loading) {

    return (
      <div className="auth-loading-screen">

        <div className="auth-loading-card">

          <div className="auth-loading-spinner" />

          <p>
            Preparing your workspace...
          </p>

        </div>

      </div>
    );

  }


  /* =======================================================
     NOT LOGGED IN
  ======================================================= */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );

  }


  return children;
}