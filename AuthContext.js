import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session(); // <-- FIXED for v1

    setUser(session?.user ?? null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, username) => {
    const { data: signUpData, error } = await supabase.auth.signUp(
      { email, password },
      { data: { username } }
    );

    if (error) {
      console.error('❌ Sign up error:', error);
      return;
    }

  const userId = signUpData.user?.id;
  if (userId) {
    await supabase.from('profiles').insert({
      id: userId,
      username
    });
  }
};


  const signIn = (email, password) =>
    supabase.auth.signIn({ email, password });

  const value = {
    user,
    loading,
    signUp,
    signIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
