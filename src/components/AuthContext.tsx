import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);
        if (u) {
          console.log("User is signed in:", u.uid);
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else if (u.email === "jessescaledyou@gmail.com") {
            // Auto-provision owner for the specific email if it doesn't exist yet
            console.log("Auto-provisioning owner account...");
            const ownerData = { email: u.email, role: 'owner', createdAt: new Date().toISOString() };
            await setDoc(doc(db, 'users', u.uid), ownerData);
            setUserData(ownerData);
          } else {
            console.warn("User authenticated but no document found in 'users' collection.");
            setUserData(null);
          }
        } else {
          console.log("User is signed out");
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth State Error:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
