import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Supabase auth is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
      return undefined;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      setError('');
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // AFK Session Timeout Logic (10 minutes)
  useEffect(() => {
    let timeoutId;
    const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (session) {
        timeoutId = setTimeout(() => {
          console.log('User has been AFK for 10 minutes. Signing out...');
          signOut().then(() => {
            alert('Your session has expired due to inactivity.');
            window.location.href = '/login';
          });
        }, INACTIVITY_TIMEOUT);
      }
    };

    if (session) {
      resetTimer();
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
      events.forEach((event) => window.addEventListener(event, resetTimer));

      return () => {
        clearTimeout(timeoutId);
        events.forEach((event) => window.removeEventListener(event, resetTimer));
      };
    }
  }, [session]);

  const signIn = async ({ email, password }) => {
    if (!supabase) {
      throw new Error('Supabase auth is not configured.');
    }

    setError('');
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      throw signInError;
    }

    setSession(data.session ?? null);
    return data;
  };

  const signUp = async ({ email, password, name }) => {
    if (!supabase) {
      throw new Error('Supabase auth is not configured.');
    }

    setError('');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    setSession(data.session ?? null);
    return data;
  };

  const signOut = async () => {
    if (!supabase) {
      setSession(null);
      return { error: null };
    }

    setError('');
    let signOutError = null;

    try {
      const { error } = await supabase.auth.signOut();
      signOutError = error || null;
    } catch (unexpectedError) {
      signOutError = unexpectedError;
    } finally {
      setSession(null);
    }

    if (signOutError) {
      setError(signOutError.message || 'Unable to sign out.');
    }

    return { error: signOutError };
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      accessToken: session?.access_token ?? '',
      loading,
      error,
      supabaseConfigured,
      signIn,
      signUp,
      signOut
    }),
    [session, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
};
