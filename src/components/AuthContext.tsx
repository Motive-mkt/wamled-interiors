import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return JSON.stringify(errInfo);
}

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  register: (email: string, pass: string, inviteCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userData: null, 
  loading: true, 
  error: null,
  login: async () => {},
  googleLogin: async () => {},
  register: async () => {},
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      setError(null);
      setUser(u);
      
      if (u) {
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          const isOwnerEmail = u.email === "jessescaledyou@gmail.com";
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (isOwnerEmail && data.role !== 'owner') {
              await updateDoc(doc(db, 'users', u.uid), { role: 'owner' });
              setUserData({ ...data, role: 'owner' });
            } else {
              setUserData(data);
            }
          } else if (isOwnerEmail) {
            const ownerData = { email: u.email, role: 'owner', createdAt: new Date().toISOString() };
            await setDoc(doc(db, 'users', u.uid), ownerData);
            setUserData(ownerData);
          } else {
            // New user signed in but no doc yet (must go through registration or be added)
            setUserData(null);
          }
        } catch (e: any) {
          setError(handleFirestoreError(e, OperationType.GET, `users/${u.uid}`));
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const googleLogin = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const register = async (email: string, pass: string, inviteCode?: string) => {
    setError(null);
    const isOwnerEmail = email === "jessescaledyou@gmail.com";
    
    try {
      // 1. Check invite code if not owner
      if (!isOwnerEmail) {
        if (!inviteCode) throw new Error("Invite code required");
        const inviteDoc = await getDoc(doc(db, 'invites', inviteCode));
        if (!inviteDoc.exists() || inviteDoc.data().used) {
          throw new Error("Invalid or already used invite code");
        }
      }

      // 2. Create user
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const u = userCred.user;

      // 3. Create user doc
      const role = isOwnerEmail ? 'owner' : 'worker';
      await setDoc(doc(db, 'users', u.uid), {
        email,
        role,
        createdAt: new Date().toISOString()
      });

      // 4. Mark invite as used
      if (!isOwnerEmail && inviteCode) {
        await updateDoc(doc(db, 'invites', inviteCode), { used: true, usedBy: u.uid });
      }
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, error, login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
