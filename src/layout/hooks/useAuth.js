import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        getDoc(doc(getFirestore(), "admin", user.uid)).then((doc) => {
          if (doc.exists()) {
            console.log("exist");
            setUser({ ...doc.data(), ...user });
            setLoading(false);
          } else {
            console.log("dont");
            setLoading(false);
            signOut(getAuth());
          }
        });
      } else {
        console.log("not");
        setLoading(false);
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
