import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
  googleProvider,
} from "../firebase";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  /*
  =========================================
  RESTORE FIREBASE SESSION
  =========================================
  */

  useEffect(() => {
    console.log(
      "🔥 Initializing VivaAI authentication..."
    );

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          try {
            if (firebaseUser) {
              console.log(
                "✅ Firebase user:",
                firebaseUser.email
              );

              setUser(firebaseUser);

              /*
              Save user profile
              */

              await setDoc(
                doc(
                  db,
                  "users",
                  firebaseUser.uid
                ),
                {
                  uid:
                    firebaseUser.uid,

                  name:
                    firebaseUser.displayName ||
                    "Google User",

                  email:
                    firebaseUser.email ||
                    "",

                  photoURL:
                    firebaseUser.photoURL ||
                    "",

                  updatedAt:
                    serverTimestamp(),
                },
                {
                  merge: true,
                }
              );
            } else {
              console.log(
                "ℹ️ No Firebase user."
              );

              setUser(null);
            }
          } catch (error) {
            console.error(
              "❌ Authentication error:",
              error
            );

            setUser(null);
          } finally {
            setLoading(false);
          }
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);


  /*
  =========================================
  GOOGLE LOGIN
  =========================================
  */

  const loginWithGoogle =
    async () => {
      try {
        console.log(
          "🔐 Opening Google login..."
        );

        googleProvider.setCustomParameters(
          {
            prompt:
              "select_account",
          }
        );

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        console.log(
          "✅ Google login successful:",
          result.user.email
        );

        return result.user;
      } catch (error) {
        console.error(
          "❌ Google login failed:",
          error
        );

        throw error;
      }
    };


  /*
  =========================================
  LOGOUT
  =========================================
  */

  const logout =
    async () => {
      try {
        await signOut(auth);

        setUser(null);

        console.log(
          "👋 User logged out."
        );
      } catch (error) {
        console.error(
          "❌ Logout failed:",
          error
        );

        throw error;
      }
    };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


/*
=========================================
useAuth HOOK
=========================================
*/

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}


export default useAuth;