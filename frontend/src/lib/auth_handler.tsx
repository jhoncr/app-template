// import firebase from 'firebase/app';
"use client";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  connectAuthEmulator,
  User,
} from "firebase/auth";
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  CustomProvider,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import devConfig from "./config.dev.json";
import prodConfig from "./config.json";

const config = process.env.NODE_ENV === "development" ? devConfig : prodConfig;

const firebaseConfig = config.firebaseConfig;

export const app = initializeApp(firebaseConfig);

// export const functions = getFunctions(app);

if (process.env.NODE_ENV === "development") {
  console.log(
    `node_env: ${process.env.NODE_ENV} -- hitting local auth and firestore emulators`
  );
  console.log("testing locally -- hitting local auth and firestore emulators");
  connectAuthEmulator(getAuth(), "http://localhost:9099", {
    disableWarnings: true,
  });

  connectFunctionsEmulator(getFunctions(app), "localhost", 5001);
}

if (typeof window !== "undefined") {
  window.onload = () => {
    console.log("window loaded");

    if (process.env.NODE_ENV === "development") {
      initializeAppCheck(app, {
        provider: new CustomProvider({
          getToken: () => {
            return Promise.resolve({
              token: "fake-token",
              expireTimeMillis: Date.now() + 1000 * 60 * 60 * 24, // 1 day
            });
          },
        }),

        isTokenAutoRefreshEnabled: true,
      });
    } else {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(config.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  };
}

export const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const clear = () => {
    setAuthUser(null);
    setLoading(false);
    // redirect to home /
    window.location.href = "/";
  };

  const signOut = () => auth.signOut().then(clear);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleAuthStateChanged = (user: User | null) => {
    setLoading(true);
    if (user) {
      setAuthUser(user);
    } else {
      setAuthUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signOut,
    signInWithGoogle,
  };
};

const authUserContext = createContext({
  authUser: null as User | null,
  loading: false,
  signOut: () => {},
  signInWithGoogle: () => {},
});

// create and export a provider
export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();

  return (
    <authUserContext.Provider value={auth}>
      {children}
    </authUserContext.Provider>
  );
}

// create and export a hook to use the authUserContext
export const useAuth = () => useContext(authUserContext);
