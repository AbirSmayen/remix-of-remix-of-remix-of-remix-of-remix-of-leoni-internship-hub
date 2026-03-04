import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "rh" | "encadrant" | "director" | "admin";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

const mockUsers: Record<string, MockUser> = {
  "rh@leoni.com": { id: "u1", name: "Admin RH", email: "rh@leoni.com", role: "rh" },
  "encadrant@leoni.com": { id: "u2", name: "Mohamed Amine Ben Nasr", email: "encadrant@leoni.com", role: "encadrant", department: "IT / Digital" },
  "director@leoni.com": { id: "u4", name: "Director LEONI", email: "director@leoni.com", role: "director" },
  "admin@leoni.com": { id: "u5", name: "Direction Générale", email: "admin@leoni.com", role: "admin" },
};

interface AuthContextType {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    const stored = sessionStorage.getItem("leoni_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    const found = mockUsers[email.toLowerCase()];
    if (!found) return { success: false, error: "Invalid credentials. Use rh@leoni.com, encadrant@leoni.com, director@leoni.com, or admin@leoni.com" };
    setUser(found);
    sessionStorage.setItem("leoni_user", JSON.stringify(found));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("leoni_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
