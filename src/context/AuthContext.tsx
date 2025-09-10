
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, Auth } from 'firebase/auth';
import { doc, setDoc, getDoc, DocumentData, Firestore } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { PersonalizedStreamRecommendationOutput } from '@/ai/flows/personalized-stream-recommendation-from-quiz';

interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  grade?: string;
  stream?: string;
  recommendation?: PersonalizedStreamRecommendationOutput | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  recommendation: PersonalizedStreamRecommendationOutput | null;
  setRecommendation: React.Dispatch<React.SetStateAction<PersonalizedStreamRecommendationOutput | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<PersonalizedStreamRecommendationOutput | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userDoc = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const profileData = userSnap.data() as UserProfile;
          setUserProfile(profileData);
          if (profileData.recommendation) {
            setRecommendation(profileData.recommendation);
          } else {
            setRecommendation(null);
          }
        } else {
           // Create a default profile if it doesn't exist
           const newUserProfile: UserProfile = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'New User',
          };
          await setDoc(userDoc, newUserProfile);
          setUserProfile(newUserProfile);
          setRecommendation(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setRecommendation(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      name: name,
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
    setUserProfile(userProfile);
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };
  
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, profileData, { merge: true });
    setUserProfile(prev => ({...prev, ...profileData} as UserProfile));
    if (profileData.recommendation) {
        setRecommendation(profileData.recommendation);
    }
  };


  const value = {
    user,
    userProfile,
    loading,
    login,
    signup,
    logout,
    updateUserProfile,
    recommendation,
    setRecommendation,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
