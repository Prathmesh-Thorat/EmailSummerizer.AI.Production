import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://localhost:8000/me", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {

        if (data.email) {
          setUser(data);
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}