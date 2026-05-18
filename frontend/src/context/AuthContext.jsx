import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getLoginUserdata, loginUser, logoutUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const user = await getLoginUserdata();
      console.log("Provider:", user);
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const userData = await loginUser(credentials);
      console.log("Provider:", userData);
      setUser(userData);
      return userData;
    } catch (e) {
      setUser(null);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
    console.log("UseEffect Auth Context ran WTF");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        role: user?.role,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
