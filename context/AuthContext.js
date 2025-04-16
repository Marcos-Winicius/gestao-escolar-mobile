import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      const user = await AsyncStorage.getItem('usuario');
      if (user) {
        setUsuarioLogado(JSON.parse(user));
      }
      setLoading(false);
    };
    carregarUsuario();
  }, []);

  const login = async (usuario) => {
    await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuarioLogado(usuario);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('usuario');
    setUsuarioLogado(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioLogado, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
