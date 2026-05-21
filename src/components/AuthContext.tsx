import React, { createContext, useContext, useEffect, useState } from 'react';
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

interface AuthContextType {
  user: User | null;
  role: 'owner' | 'worker' | null;
  authLoading: boolean;
  roleLoading: boolean;
  isFirstUser: boolean;
  login: (email: string, pass: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  register: (email: string, pass: string, inviteCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'owner' | 'worker' | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const [isFirstUser, setIsFirstUser] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      setRoleLoading(true);

      try {
        const statusDoc = await getDoc(doc(db, 'site_content', 'status'));
        setIsFirstUser(!statusDoc.exists());
      } catch (e) {
        console.error("Error fetching initialization status:", e);
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        try {
          let userDoc = await getDoc(userDocRef);

          if (!userDoc.exists() && firebaseUser.email === 'jessescaledyou@gmail.com') {
            const initialOwnerData = {
              email: firebaseUser.email,
              role: 'owner',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialOwnerData);
            setRole('owner');

            // Also guarantee site_content/status exists
            const statusDocRef = doc(db, 'site_content', 'status');
            const statusDoc = await getDoc(statusDocRef);
            if (!statusDoc.exists()) {
              await setDoc(statusDocRef, {
                ownerInitialized: true,
                ownerEmail: firebaseUser.email,
                initializedAt: new Date().toISOString()
              });
              setIsFirstUser(false);
            }
          } else if (userDoc.exists()) {
            setRole(userDoc.data()?.role);
          } else {
            setRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setUser(null);
        setRole(null);
        setRoleLoading(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const googleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const register = async (email: string, pass: string, inviteCode?: string) => {
    const isOwnerEmail = email === "jessescaledyou@gmail.com";
    
    // Check if there is an owner initialized
    const statusDocRef = doc(db, 'site_content', 'status');
    const statusDoc = await getDoc(statusDocRef);
    const hasAlreadyOwner = statusDoc.exists();

    const shouldBeOwner = isOwnerEmail || !hasAlreadyOwner;

    if (!shouldBeOwner) {
      if (!inviteCode || inviteCode.length !== 5) throw new Error("Invite code required");
      const inviteDoc = await getDoc(doc(db, 'invites', inviteCode));
      if (!inviteDoc.exists() || inviteDoc.data()?.used) {
        throw new Error("Invalid or already used invite code");
      }
    }
    
    // Create the user first
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const u = userCred.user;

    // Create the user doc
    const userRole = shouldBeOwner ? 'owner' : 'worker';
    await setDoc(doc(db, 'users', u.uid), {
      email,
      role: userRole,
      createdAt: new Date().toISOString()
    });

    // Lock site ownership with status document if it was the first user
    if (shouldBeOwner && !hasAlreadyOwner) {
      await setDoc(statusDocRef, {
        ownerInitialized: true,
        ownerEmail: email,
        initializedAt: new Date().toISOString()
      });
      setIsFirstUser(false);
    }

    // Mark invite as used
    if (!shouldBeOwner && inviteCode) {
      await updateDoc(doc(db, 'invites', inviteCode), { used: true, usedBy: u.uid });
    }

    setRole(userRole);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, authLoading, roleLoading, isFirstUser, login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
