import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
}

interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAdmin = (email: string) => {
    const adminEmails = ['abheek.pathirana@gmail.com', 'abheek.pathirana@springfield.lk'];
    return adminEmails.includes(email);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const { user } = await api.get('/auth/me');
          setUser(user);
          setSession({ access_token: token, user });
          setIsAdmin(checkAdmin(user.email));
        } catch (error) {
          console.error('Auth check failed', error);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: any) => {
    const response = await api.post('/auth/login', data);
    const { session, user } = response;
    localStorage.setItem('access_token', session.access_token);
    setSession(session);
    setUser(user);
    setIsAdmin(checkAdmin(user.email));
  };

  const signup = async (data: any) => {
    const response = await api.post('/auth/signup', data);
    const { session, user } = response;
    localStorage.setItem('access_token', session.access_token);
    setSession(session);
    setUser(user);
    setIsAdmin(checkAdmin(user.email));
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, login, signup, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};