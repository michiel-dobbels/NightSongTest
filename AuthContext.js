import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // 🧠 includes username
  const [loading, setLoading] = useState(true);

  // 🔁 Refresh session on mount
  useEffect(() => {
    const getSession = async () => {
      // supabase-js v1 exposes `session()` to fetch the current session
      const currentSession = supabase.auth.session();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Sign up
  const signUp = async (email, password, username) => {
    if (!username) {
      return { error: { message: 'Username is required' } };
    }

    // supabase-js v1 uses a different signature than v2
    const { user: newUser, session: newSession, error } = await supabase.auth.signUp(
      { email, password },
      { data: { username, display_name: username } }
    );

    if (error) {
      console.error('❌ Sign up error:', error);
      return { error };
    }

    const userId = newUser?.id;
    if (userId) {
      await supabase.from('profiles').insert({
        id: userId,
        username,
        display_name: username,
      });
      setSession(newSession);
      setUser(newUser);
      await fetchProfile(userId);
    }

    return { error: null };
  };

  // 🔐 Sign in
  const signIn = async (email, password) => {
    const { user, session: signInSession, error } = await supabase.auth.signIn({
      email,
      password,
    });


    
    if (user) {
      setSession(signInSession);
      await fetchProfile(user.id);
    }

    return { error };
  };

  // 🔓 Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  // 🔍 Fetch profile by ID
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data); // ✅ includes username
    }
  };

  const value = {
    session,
    user,
    profile,      // ⬅
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
