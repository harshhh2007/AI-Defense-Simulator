import {
  Chrome,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


export default function Login() {

  const navigate =
    useNavigate();

  const {
    user,
    loading,
    loginWithGoogle,
  } = useAuth();

  const [
    signingIn,
    setSigningIn,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     ALREADY LOGGED IN
  ======================================================= */

  if (user && !loading) {

    navigate("/", {
      replace: true,
    });

    return null;
  }


  /* =======================================================
     GOOGLE LOGIN
  ======================================================= */

  const handleGoogleLogin =
    async () => {

      if (signingIn) {
        return;
      }

      setError("");
      setSigningIn(true);

      const result =
        await loginWithGoogle();


      if (!result.success) {

        const code =
          result.error?.code;

        if (
          code ===
          "auth/popup-closed-by-user"
        ) {

          setError(
            "Google sign-in was cancelled."
          );

        } else if (
          code ===
          "auth/popup-blocked"
        ) {

          setError(
            "Your browser blocked the Google popup. Please allow popups for localhost."
          );

        } else {

          setError(
            "Google sign-in failed. Please try again."
          );

        }

      }

      setSigningIn(false);
    };


  return (
    <div className="login-page">

      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />


      <main className="login-card">

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-logo">
            <Sparkles size={25} />
          </div>

          <div>

            <h1>
              VivaAI
            </h1>

            <p>
              Defense Simulator
            </p>

          </div>

        </div>


        {/* HEADER */}

        <div className="login-header">

          <p className="login-eyebrow">
            ACADEMIC DEFENSE PLATFORM
          </p>

          <h2>
            Prepare smarter.
            <br />

            <span>
              Defend confidently.
            </span>
          </h2>

          <p>
            Sign in with your Google account
            to access your VivaAI workspace.
          </p>

        </div>


        {/* GOOGLE BUTTON */}

        <button
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={
            signingIn || loading
          }
        >

          <div className="google-icon">
            <Chrome size={20} />
          </div>

          <span>
            {signingIn
              ? "Signing in..."
              : "Continue with Google"}
          </span>

        </button>


        {/* ERROR */}

        {error && (

          <div className="login-error">
            {error}
          </div>

        )}


        {/* FEATURES */}

        <div className="login-features">

          <div>
            <ShieldCheck size={16} />
            <span>
              Secure Firebase authentication
            </span>
          </div>

          <div>
            <BrainCircuit size={16} />
            <span>
              Your AI workspace is protected
            </span>
          </div>

        </div>


        <p className="login-footer">
          By continuing, you agree to use
          VivaAI responsibly for academic
          preparation.
        </p>

      </main>

    </div>
  );
}