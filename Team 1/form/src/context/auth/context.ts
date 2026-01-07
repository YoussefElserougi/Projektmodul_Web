import React, { createContext } from "react";

interface AuthContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
