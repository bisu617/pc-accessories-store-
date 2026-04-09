'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { IUser } from '@/types';
import { authAPI } from '@/services/api';

interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: IUser; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: IUser };

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return { ...state, user: null, token: null, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
          // Verify token is still valid
          const res = await authAPI.getProfile();
          dispatch({
            type: 'UPDATE_USER',
            payload: res.data.user,
          });
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    loadStoredUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await authAPI.login({ email, password });
      const { user, token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw new Error(message);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await authAPI.register(data);
      // Don't auto-login after registration
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const loadUser = async () => {
    try {
      const res = await authAPI.getProfile();
      dispatch({ type: 'UPDATE_USER', payload: res.data.user });
    } catch {
      // Token invalid
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, clearError, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
