import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true, error: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setError(null);
        setUser(u);
        if (u) {
          console.log("User is signed in:", u.uid);
          let userDoc;
          try {
            userDoc = await getDoc(doc(db, 'users', u.uid));
          } catch (e: any) {
            console.error("Failed to fetch user doc:", e);
            setError(`Permission denied accessing your profile: ${e.message}`);
            setUserData(null);
            return;
          }

          const isOwnerEmail = u.email === "jessescaledyou@gmail.com";
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (isOwnerEmail && data.role !== 'owner') {
              console.log("Upgrading existing account to owner...");
              await updateDoc(doc(db, 'users', u.uid), { role: 'owner' });
              setUserData({ ...data, role: 'owner' });
            } else {
              setUserData(data);
            }
          } else if (isOwnerEmail) {
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
      } catch (error: any) {
        console.error("Auth State Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
