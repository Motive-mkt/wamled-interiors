import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface CMSContent {
  heroHeadline: string;
  heroImage: string;
  galleryImages: { url: string; label: string; span?: string }[];
  location: string;
  hours: string;
  phone: string;
  socialLinks: { platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin'; url: string }[];
  reviews: { text: string; author: string; rating: number }[];
}

const defaultContent: CMSContent = {
  heroHeadline: "Interiors crafted around the way you live.",
  heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1920&h=1080",
  galleryImages: [],
  location: "Moi Avenue, Mombasa",
  hours: "Open until 8:00 PM",
  phone: "0723 758 595",
  socialLinks: [
    { platform: 'instagram', url: '#' },
    { platform: 'facebook', url: '#' }
  ],
  reviews: [
    {
      text: "Great service and quality work. The team listened, planned thoroughly, and delivered a finish that exceeded what we imagined.",
      author: "Verified Client",
      rating: 5
    },
    {
      text: "Wamled transformed our living space into something we're proud to come home to. Professional from first meeting to final styling.",
      author: "Mombasa Homeowner",
      rating: 5
    },
    {
      text: "Structured process, beautiful result. Our office now reflects who we are — and our clients notice.",
      author: "Commercial Client",
      rating: 5
    }
  ]
};

interface CMSContextType {
  content: CMSContent;
  updateContent: (newContent: CMSContent) => Promise<void>;
  loading: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<CMSContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_content', 'homepage'), (doc) => {
      if (doc.exists()) {
        setContent({ ...defaultContent, ...doc.data() } as CMSContent);
      }
      setLoading(false);
    }, (error) => {
      console.error("CMS Load Error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateContent = async (newContent: CMSContent) => {
    try {
      await setDoc(doc(db, 'site_content', 'homepage'), newContent);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_content/homepage');
    }
  };

  return (
    <CMSContext.Provider value={{ content, updateContent, loading }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within a CMSProvider');
  return context;
};
