import React, { createContext, useState, useEffect, ReactNode } from "react";
import { login, register } from "../api/authApi";
import { User } from "../types";
import axiosInstance from "../api/axiosInstance"; // Para buscar o role do usuário

export interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Função para buscar o role do usuário autenticado
  const fetchUserRole = async (token: string): Promise<string> => {
    try {
      const response = await axiosInstance.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.role; // Assumindo que o backend retorna { data: { role: "..." } }
    } catch (err) {
      console.error("Failed to fetch user role:", err);
      return "customer"; // Fallback para "customer" se falhar
    }
  };

  // Verificar sessão existente ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const initializeUser = async () => {
        try {
          const response = await axiosInstance.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = response.data.data;
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            token,
          });
        } catch (err) {
          console.error("Failed to initialize user:", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      };
      initializeUser();
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const token = await login(email, password);
    const role = await fetchUserRole(token);
    const userData: User = {
      id: "",
      email,
      role: role as User["role"],
      token,
    };
    // Buscar o ID do usuário (se não retornado diretamente pelo login)
    const response = await axiosInstance.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    userData.id = response.data.data.id;
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const registerUser = async (email: string, password: string) => {
    const userData = await register(email, password);
    const role = await fetchUserRole(userData.token);
    const newUser: User = {
      id: userData.id,
      email,
      role: role as User["role"],
      token: userData.token,
    };
    setUser(newUser);
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
