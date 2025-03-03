import React, { createContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { login, register } from "../api/authApi";
import { User } from "../types";

export interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      if (data.session) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email!,
          role: "customer",
        });
        localStorage.setItem("token", data.session.access_token);
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: "customer",
        });
        localStorage.setItem("token", session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    });
  }, []);

  const loginUser = async (email: string, password: string) => {
    const token = await login(email, password);
    const { data } = await supabase.auth.getUser(token);
    setUser({ id: data.user!.id, email: data.user!.email!, role: "customer" });
    localStorage.setItem("token", token);
  };

  const registerUser = async (email: string, password: string) => {
    const userData = await register(email, password);
    setUser({ id: userData.id, email, role: "customer" });
    localStorage.setItem("token", userData.token);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
