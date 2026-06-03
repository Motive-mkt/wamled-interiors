import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface CMSContent {
  heroHeadline: string;
  heroImage: string;
  galleryImages: { url: string; label: string; span?: string }[];
  location: string;
  hours: string;
  phone: string;
  socialLinks: { platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin'; url: string }[];
  reviews: { text: string; author: string; rating?: number; role?: string; location?: string }[];
  announcementActive?: boolean;
  announcementText?: string;
  announcementLink?: string;
}

const defaultContent: CMSContent = {
  heroHeadline: "Interiors crafted around the way you live.",
  heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1920&h=1080",
  galleryImages: [],
  location: "Nairobi and Nakuru, Kenya",
  hours: "Open until 8:00 PM",
  phone: "0723 758 595",
  socialLinks: [
    { platform: 'instagram', url: '#' },
    { platform: 'facebook', url: '#' }
  ],
  reviews: [
    {
      text: "The structural layout Wamled designed for our Diani villa has completely changed our family dynamic. The flow of daylight and continuous coastal breeze feels like a living hotel gallery.",
      author: "Almasi M. G.",
      location: "Oceanfront Villa Owner, Diani",
      rating: 5
    },
    {
      text: "Wamled brought a tier of structural precision to our hotel lounge that we simply had not found elsewhere in East Africa. Every stone seam, timber column, and light level is perfect.",
      author: "Zuri Resorts Ltd.",
      location: "Managing Director, Nyali Marina",
      rating: 5
    },
    {
      text: "Their monochrome concept and raw textures provide an immediate calm. Customers enter our boutique lobby and are instantly captivated by the quiet luxury of the custom marble slab desk.",
      author: "Elena Mwangi",
      location: "Founder, Luxe Living Hub",
      rating: 5
    }
  ],
  announcementActive: true,
  announcementText: "Now accepting premium residential atelier project consultations for coastal developments in Diani & Mombasa.",
  announcementLink: "/#consultation"
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
  const { user } = useAuth();

  useEffect(() => {
    // We can fetch public content without auth, or with auth
    const unsub = onSnapshot(doc(db, 'site_content', 'homepage'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as CMSContent);
      }
      setLoading(false);
    }, (error) => {
      console.error("CMS Fetch Error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateContent = async (newContent: CMSContent) => {
    try {
      await setDoc(doc(db, 'site_content', 'homepage'), newContent);
      setContent(newContent);
    } catch (e) {
      console.error("CMS Update Error:", e);
      throw e;
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
