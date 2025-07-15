import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName || email
        }
      }
    });

    // Check if user already exists
    if (error && error.message.includes('User already registered')) {
      return { 
        error: { 
          message: 'Este email ya está registrado. Intenta iniciar sesión o usar un email diferente.'
        }
      };
    }

    // Check for other signup errors
    if (error) {
      let errorMessage = error.message;
      
      // Translate common errors to Spanish
      if (error.message.includes('Invalid email')) {
        errorMessage = 'El formato del email no es válido';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Debes confirmar tu email antes de poder iniciar sesión';
      }
      
      return { error: { message: errorMessage } };
    }

    return { error: null, data };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Translate common login errors to Spanish
    if (error) {
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Debes confirmar tu email antes de poder iniciar sesión. Revisa tu bandeja de entrada.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos de inicio de sesión. Intenta nuevamente en unos minutos.';
      }
      
      return { error: { message: errorMessage } };
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    if (error) {
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid email')) {
        errorMessage = 'El formato del email no es válido';
      } else if (error.message.includes('Email not found')) {
        errorMessage = 'No existe una cuenta con este email';
      }
      
      return { error: { message: errorMessage } };
    }

    return { error: null };
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};